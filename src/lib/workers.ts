import { Worker, Job } from 'bullmq'
import { connection, OrderProcessingJob, ProviderSyncJob, EmailJob } from '@/lib/queues'
import { createServiceSupabase } from '@/lib/supabase-server'
import axios from 'axios'
import nodemailer from 'nodemailer'

const supabase = createServiceSupabase()

// Email transporter
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Order Processing Worker
const orderProcessingWorker = new Worker(
  'orderProcessing',
  async (job: Job<OrderProcessingJob>) => {
    const { orderId, userId, serviceId, providerId, link, quantity } = job.data

    try {
      console.log(`Processing order ${orderId}`)

      // Get order and service details
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          services (*),
          providers (*)
        `)
        .eq('id', orderId)
        .single()

      if (orderError || !order) {
        throw new Error(`Order not found: ${orderId}`)
      }

      // Update order status to processing
      await supabase
        .from('orders')
        .update({ status: 'processing' })
        .eq('id', orderId)

      // Call provider API
      const providerResponse = await callProviderAPI(
        order.providers.api_url,
        order.providers.api_key,
        {
          service: order.services.provider_service_id,
          link: order.link,
          quantity: order.quantity,
        }
      )

      if (providerResponse.success) {
        // Update order with provider order ID
        await supabase
          .from('orders')
          .update({
            status: 'in_progress',
            provider_order_id: providerResponse.order_id,
          })
          .eq('id', orderId)

        // Create order update record
        await supabase.from('order_updates').insert({
          order_id: orderId,
          status: 'in_progress',
          provider_response: providerResponse,
          notes: 'Order submitted to provider successfully',
        })

        // Unfreeze balance
        const { data: wallet } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (wallet) {
          await supabase
            .from('wallets')
            .update({
              frozen_balance: wallet.frozen_balance - order.charge,
              total_spent: wallet.total_spent + order.charge,
            })
            .eq('id', wallet.id)
        }

        console.log(`Order ${orderId} submitted successfully`)
      } else {
        // Provider API failed - refund user
        await handleOrderFailure(orderId, userId, order.charge, providerResponse.error || 'Provider API error')
      }
    } catch (error: any) {
      console.error(`Error processing order ${orderId}:`, error.message)
      await handleOrderFailure(orderId, userId, 0, error.message)
      throw error
    }
  },
  { connection, concurrency: 5 }
)

// Provider Sync Worker
const providerSyncWorker = new Worker(
  'providerSync',
  async (job: Job<ProviderSyncJob>) => {
    const { providerId, action } = job.data

    try {
      const { data: provider } = await supabase
        .from('providers')
        .select('*')
        .eq('id', providerId)
        .single()

      if (!provider) {
        throw new Error(`Provider not found: ${providerId}`)
      }

      if (action === 'sync_services') {
        await syncProviderServices(provider)
      } else if (action === 'check_status') {
        await checkOrderStatuses(provider)
      }
    } catch (error: any) {
      console.error(`Error syncing provider ${providerId}:`, error.message)
      throw error
    }
  },
  { connection, concurrency: 2 }
)

// Email Worker
const emailWorker = new Worker(
  'email',
  async (job: Job<EmailJob>) => {
    const { to, subject, template, data } = job.data

    try {
      let html = await generateEmailHTML(template, data)

      await emailTransporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        html,
      })

      console.log(`Email sent to ${to}: ${subject}`)
    } catch (error: any) {
      console.error(`Error sending email to ${to}:`, error.message)
      throw error
    }
  },
  { connection, concurrency: 3 }
)

// Helper Functions
async function callProviderAPI(apiUrl: string, apiKey: string, orderData: any) {
  try {
    const response = await axios.post(apiUrl, {
      key: apiKey,
      action: 'add',
      service: orderData.service,
      link: orderData.link,
      quantity: orderData.quantity,
    }, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    if (response.data.error) {
      return {
        success: false,
        error: response.data.error,
      }
    }

    return {
      success: true,
      order_id: response.data.order,
      response: response.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
}

async function handleOrderFailure(orderId: string, userId: string, refundAmount: number, error: string) {
  try {
    // Update order status
    await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', orderId)

    // Create order update record
    await supabase.from('order_updates').insert({
      order_id: orderId,
      status: 'cancelled',
      notes: `Order failed: ${error}`,
    })

    if (refundAmount > 0) {
      // Refund balance
      const { data: wallet } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (wallet) {
        await supabase
          .from('wallets')
          .update({
            balance: wallet.balance + refundAmount,
            frozen_balance: wallet.frozen_balance - refundAmount,
          })
          .eq('id', wallet.id)

        // Create refund transaction
        await supabase.from('transactions').insert({
          user_id: userId,
          wallet_id: wallet.id,
          type: 'refund',
          amount: refundAmount,
          status: 'completed',
          description: `Refund for failed order ${orderId}`,
          reference_id: orderId,
          reference_type: 'order',
        })
      }
    }

    console.log(`Order ${orderId} cancelled and refunded: $${refundAmount}`)
  } catch (refundError: any) {
    console.error(`Error handling order failure for ${orderId}:`, refundError.message)
  }
}

async function syncProviderServices(provider: any) {
  try {
    const response = await axios.post(provider.api_url, {
      key: provider.api_key,
      action: 'services',
    })

    if (response.data && Array.isArray(response.data)) {
      console.log(`Syncing ${response.data.length} services for provider ${provider.name}`)
      
      // Update provider's last sync time
      await supabase
        .from('providers')
        .update({ last_sync: new Date().toISOString() })
        .eq('id', provider.id)

      // Here you would process and update services
      // This is a simplified version - in production, you'd want to:
      // 1. Compare with existing services
      // 2. Update prices, availability, etc.
      // 3. Add new services
      // 4. Disable removed services
    }
  } catch (error: any) {
    console.error(`Error syncing services for provider ${provider.id}:`, error.message)
  }
}

async function checkOrderStatuses(provider: any) {
  try {
    // Get pending/in-progress orders for this provider
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .eq('provider_id', provider.id)
      .in('status', ['in_progress', 'processing'])
      .not('provider_order_id', 'is', null)

    if (orders && orders.length > 0) {
      console.log(`Checking status for ${orders.length} orders from provider ${provider.name}`)

      for (const order of orders) {
        try {
          const response = await axios.post(provider.api_url, {
            key: provider.api_key,
            action: 'status',
            order: order.provider_order_id,
          })

          if (response.data && response.data.status) {
            const newStatus = mapProviderStatus(response.data.status)
            
            if (newStatus !== order.status) {
              await supabase
                .from('orders')
                .update({
                  status: newStatus,
                  start_count: response.data.start_count || order.start_count,
                  remains: response.data.remains || order.remains,
                })
                .eq('id', order.id)

              // Create order update record
              await supabase.from('order_updates').insert({
                order_id: order.id,
                status: newStatus,
                start_count: response.data.start_count,
                remains: response.data.remains,
                provider_response: response.data,
              })
            }
          }
        } catch (orderError: any) {
          console.error(`Error checking status for order ${order.id}:`, orderError.message)
        }
      }
    }
  } catch (error: any) {
    console.error(`Error checking order statuses for provider ${provider.id}:`, error.message)
  }
}

function mapProviderStatus(providerStatus: string): string {
  const statusMap: { [key: string]: string } = {
    'Pending': 'pending',
    'In progress': 'in_progress',
    'Processing': 'processing',
    'Completed': 'completed',
    'Partial': 'partial',
    'Canceled': 'cancelled',
    'Cancelled': 'cancelled',
  }

  return statusMap[providerStatus] || 'pending'
}

async function generateEmailHTML(template: string, data: Record<string, any>): Promise<string> {
  // Simple template system - in production, use a proper template engine
  const templates: { [key: string]: string } = {
    'order_completed': `
      <h2>Order Completed!</h2>
      <p>Your order #${data.orderId} has been completed successfully.</p>
      <p>Service: ${data.serviceName}</p>
      <p>Link: ${data.link}</p>
      <p>Quantity: ${data.quantity}</p>
      <p>Thank you for using our service!</p>
    `,
    'order_failed': `
      <h2>Order Failed</h2>
      <p>Unfortunately, your order #${data.orderId} could not be processed.</p>
      <p>Reason: ${data.reason}</p>
      <p>Your account has been refunded: $${data.refundAmount}</p>
      <p>Please contact support if you have any questions.</p>
    `,
    'welcome': `
      <h2>Welcome to SMM Panel!</h2>
      <p>Hi ${data.name},</p>
      <p>Thank you for creating an account with us.</p>
      <p>You can now add funds and start placing orders.</p>
      <p>If you need help, please don't hesitate to contact our support team.</p>
    `,
  }

  return templates[template] || `<p>${data.message || 'No template found'}</p>`
}

// Error handling for workers
orderProcessingWorker.on('failed', (job, err) => {
  console.error(`Order processing job ${job?.id} failed:`, err.message)
})

providerSyncWorker.on('failed', (job, err) => {
  console.error(`Provider sync job ${job?.id} failed:`, err.message)
})

emailWorker.on('failed', (job, err) => {
  console.error(`Email job ${job?.id} failed:`, err.message)
})

console.log('Workers started successfully')

export {
  orderProcessingWorker,
  providerSyncWorker,
  emailWorker,
}