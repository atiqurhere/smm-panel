import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('services')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        ),
        providers (
          id,
          name
        )
      `)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (category) {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single()
      
      if (categoryData) {
        query = query.eq('category_id', categoryData.id)
      }
    }

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    const { data: services, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      services: services || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const {
      provider_id,
      category_id,
      provider_service_id,
      name,
      description,
      price_per_1000,
      min_quantity,
      max_quantity,
      average_time,
      has_refill,
      has_cancel,
      tags,
      examples,
      restrictions,
    } = body

    // Validate required fields
    if (!provider_id || !category_id || !provider_service_id || !name || !price_per_1000) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: service, error } = await supabase
      .from('services')
      .insert({
        provider_id,
        category_id,
        provider_service_id,
        name,
        description,
        price_per_1000: parseFloat(price_per_1000),
        min_quantity: parseInt(min_quantity) || 1,
        max_quantity: parseInt(max_quantity) || 100000,
        average_time,
        has_refill: Boolean(has_refill),
        has_cancel: Boolean(has_cancel),
        tags: tags || [],
        examples: examples || [],
        restrictions,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ service }, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}