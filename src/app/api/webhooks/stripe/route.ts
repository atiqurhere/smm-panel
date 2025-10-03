import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabase } from '@/lib/supabase-server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServiceSupabase()

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Find the payment record
        const { data: payment, error: paymentError } = await supabase
          .from('payments')
          .select('*, transactions(*), wallets(*)')
          .eq('provider_payment_id', paymentIntent.id)
          .single()

        if (paymentError || !payment) {
          console.error('Payment not found:', paymentIntent.id)
          break
        }

        // Update payment status
        await supabase
          .from('payments')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
          })
          .eq('id', payment.id)

        // Update transaction status
        await supabase
          .from('transactions')
          .update({ status: 'completed' })
          .eq('id', payment.transaction_id)

        // Add funds to wallet
        const amount = paymentIntent.amount / 100 // Convert from cents
        await supabase
          .from('wallets')
          .update({
            balance: payment.wallets.balance + amount,
            total_deposited: payment.wallets.total_deposited + amount,
          })
          .eq('user_id', payment.user_id)

        console.log(`Payment completed: ${paymentIntent.id}, Amount: $${amount}`)
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        
        // Update payment and transaction status
        await supabase
          .from('payments')
          .update({ status: 'failed' })
          .eq('provider_payment_id', failedPayment.id)

        const { data: failedTransaction } = await supabase
          .from('payments')
          .select('transaction_id')
          .eq('provider_payment_id', failedPayment.id)
          .single()

        if (failedTransaction) {
          await supabase
            .from('transactions')
            .update({ status: 'failed' })
            .eq('id', failedTransaction.transaction_id)
        }

        console.log(`Payment failed: ${failedPayment.id}`)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}