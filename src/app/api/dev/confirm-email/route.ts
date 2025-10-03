import { NextResponse } from 'next/server'
import { confirmUserEmailDev } from '@/lib/dev-helpers'

export async function POST(request: Request) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    )
  }

  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const result = await confirmUserEmailDev(email)
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Email confirmed successfully' 
      })
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

  } catch (error: any) {
    console.error('Error in confirm-email API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}