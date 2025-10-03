import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { service_id, link, quantity } = body

    // Validate required fields
    if (!service_id || !link || !quantity || quantity <= 0) {
      return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 })
    }

    // Get service details
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select(`
        *,
        providers (
          id,
          name,
          api_url,
          api_key
        )
      `)
      .eq('id', service_id)
      .eq('is_active', true)
      .single()

    if (serviceError || !service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    // Validate quantity limits
    if (quantity < service.min_quantity || quantity > service.max_quantity) {
      return NextResponse.json({ 
        error: `Quantity must be between ${service.min_quantity} and ${service.max_quantity}` 
      }, { status: 400 })
    }

    // Calculate price
    const charge = (quantity / 1000) * service.price_per_1000

    // Get user's wallet
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (walletError || !wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    // Check if user has sufficient balance
    if (wallet.balance < charge) {
      return NextResponse.json({ 
        error: 'Insufficient balance. Please add funds to your account.',
        required: charge,
        available: wallet.balance
      }, { status: 400 })
    }

    // Start transaction
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        service_id: service.id,
        provider_id: service.provider_id,
        link,
        quantity,
        price: service.price_per_1000,
        charge,
        status: 'pending',
      })
      .select()
      .single()

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    // Deduct balance from wallet
    const { error: balanceError } = await supabase
      .from('wallets')
      .update({
        balance: wallet.balance - charge,
        frozen_balance: wallet.frozen_balance + charge,
      })
      .eq('id', wallet.id)

    if (balanceError) {
      // Rollback order if balance update fails
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 })
    }

    // Create transaction record
    await supabase.from('transactions').insert({
      user_id: user.id,
      wallet_id: wallet.id,
      type: 'order',
      amount: -charge,
      status: 'completed',
      description: `Order for ${service.name}`,
      reference_id: order.id,
      reference_type: 'order',
    })

    // TODO: Add to job queue for provider API call
    // This would be handled by BullMQ in a production environment

    return NextResponse.json({ 
      order,
      message: 'Order placed successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('orders')
      .select(`
        *,
        services (
          id,
          name,
          categories (
            name
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: orders, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      orders: orders || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}