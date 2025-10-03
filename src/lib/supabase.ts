import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const createClientSupabase = () => 
  createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client
export const createServerSupabase = async () => {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // Handle cookie setting errors in server components
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: '', ...options })
        } catch (error) {
          // Handle cookie removal errors in server components
        }
      },
    },
  })
}

// Service role client for admin operations
export const createServiceSupabase = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Database types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          username: string | null
          phone: string | null
          country: string | null
          language: string | null
          currency: string | null
          avatar_url: string | null
          is_verified: boolean | null
          is_active: boolean | null
          role: string | null
          referral_code: string | null
          referred_by: string | null
          kyc_status: string | null
          two_fa_enabled: boolean | null
          two_fa_secret: string | null
          last_login: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          username?: string | null
          phone?: string | null
          country?: string | null
          language?: string | null
          currency?: string | null
          avatar_url?: string | null
          is_verified?: boolean | null
          is_active?: boolean | null
          role?: string | null
          referral_code?: string | null
          referred_by?: string | null
          kyc_status?: string | null
          two_fa_enabled?: boolean | null
          two_fa_secret?: string | null
          last_login?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          username?: string | null
          phone?: string | null
          country?: string | null
          language?: string | null
          currency?: string | null
          avatar_url?: string | null
          is_verified?: boolean | null
          is_active?: boolean | null
          role?: string | null
          referral_code?: string | null
          referred_by?: string | null
          kyc_status?: string | null
          two_fa_enabled?: boolean | null
          two_fa_secret?: string | null
          last_login?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      wallets: {
        Row: {
          id: string
          user_id: string
          currency: string | null
          balance: number | null
          frozen_balance: number | null
          total_deposited: number | null
          total_spent: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          currency?: string | null
          balance?: number | null
          frozen_balance?: number | null
          total_deposited?: number | null
          total_spent?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          currency?: string | null
          balance?: number | null
          frozen_balance?: number | null
          total_deposited?: number | null
          total_spent?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      // Add more table types as needed...
    }
  }
}