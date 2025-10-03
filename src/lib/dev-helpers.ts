// Development utility to help with email confirmation
// This should only be used in development environment

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables for admin operations')
}

// Admin client with service role key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function confirmUserEmailDev(email: string) {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('Email confirmation helper should only be used in development')
    return { success: false, error: 'Not in development mode' }
  }

  try {
    // Get user by email
    const { data: users, error: getUserError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (getUserError) {
      return { success: false, error: getUserError.message }
    }

    const user = users.users.find(u => u.email === email)
    
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Update user to mark email as confirmed
    const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { 
        email_confirm: true,
      }
    )

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    console.log('✅ Email confirmed for user:', email)
    return { success: true, user: updatedUser }

  } catch (error: any) {
    console.error('Error confirming email:', error)
    return { success: false, error: error.message }
  }
}

export async function createConfirmedUserDev(email: string, password: string, fullName?: string) {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('Dev user creation helper should only be used in development')
    return { success: false, error: 'Not in development mode' }
  }

  try {
    // Create user with admin client (bypasses email confirmation)
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // This bypasses email confirmation
      user_metadata: {
        full_name: fullName
      }
    })

    if (error) {
      return { success: false, error: error.message }
    }

    // Create profile entry
    if (data.user) {
      await supabaseAdmin.from('profiles').insert({
        id: data.user.id,
        email: data.user.email!,
        full_name: fullName || '',
        role: 'customer'
      })
    }

    console.log('✅ Confirmed user created:', email)
    return { success: true, user: data.user }

  } catch (error: any) {
    console.error('Error creating confirmed user:', error)
    return { success: false, error: error.message }
  }
}