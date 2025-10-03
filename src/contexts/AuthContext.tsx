'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClientSupabase } from '@/lib/supabase-client'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName?: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<any>
  updatePassword: (password: string) => Promise<any>
  verifyOtp: (email: string, token: string, type: 'signup' | 'email' | 'recovery') => Promise<any>
  resendVerification: (email: string) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientSupabase()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // Update last login on sign in
        if (event === 'SIGNED_IN' && session?.user) {
          await supabase
            .from('profiles')
            .update({ last_login: new Date().toISOString() })
            .eq('id', session.user.id)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (!error && data.user) {
      // Create profile entry only if user is confirmed or confirmation not required
      if (data.user.email_confirmed_at || !data.user.confirmation_sent_at) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName,
        })
      }
    }

    // Provide better feedback for email confirmation
    if (!error && data.user && data.user.confirmation_sent_at && !data.user.email_confirmed_at) {
      return {
        data,
        error: null,
        needsConfirmation: true,
        message: 'Please check your email and click the confirmation link to activate your account.'
      }
    }

    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    // Handle unconfirmed email case
    if (error && error.message.includes('Email not confirmed')) {
      return { 
        data, 
        error: new Error('Please check your email and click the confirmation link to activate your account.')
      }
    }

    return { data, error }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (!error) {
        setUser(null)
        setSession(null)
      }
    } catch (error) {
      console.error('Error during sign out:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    return { data, error }
  }

  const updatePassword = async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password,
    })

    return { data, error }
  }

  const verifyOtp = async (email: string, token: string, type: 'signup' | 'email' | 'recovery') => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type,
    })

    return { data, error }
  }

  const resendVerification = async (email: string) => {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    })

    return { data, error }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    verifyOtp,
    resendVerification,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useUser() {
  const { user, loading } = useAuth()
  return { user, loading }
}

export function useSession() {
  const { session, loading } = useAuth()
  return { session, loading }
}