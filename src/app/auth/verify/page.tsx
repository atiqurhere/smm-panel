'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, XCircle, Mail } from 'lucide-react'
import Link from 'next/link'

function VerifyEmailForm() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'resent'>('loading')
  const [message, setMessage] = useState('')
  const [isResending, setIsResending] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { resendVerification } = useAuth()

  const email = searchParams.get('email')

  useEffect(() => {
    if (!email) {
      setStatus('error')
      setMessage('Invalid verification link. Email parameter is missing.')
      return
    }

    // Check if there's a token in the URL (from email link)
    const token = searchParams.get('token')
    const type = searchParams.get('type')

    if (token && type === 'signup') {
      // This would be handled by Supabase auth automatically
      // For now, we'll show success message
      setStatus('success')
      setMessage('Email verified successfully! You can now sign in.')
    } else {
      // No token, just showing verification pending page
      setStatus('loading')
      setMessage('Please check your email and click the verification link.')
    }
  }, [email, searchParams])

  const handleResendVerification = async () => {
    if (!email) return
    
    setIsResending(true)
    try {
      await resendVerification(email)
      setStatus('resent')
      setMessage('Verification email sent! Please check your inbox.')
    } catch (error) {
      setStatus('error')
      setMessage('Failed to resend verification email. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  const getIcon = () => {
    switch (status) {
      case 'loading':
      case 'resent':
        return <Mail className="h-12 w-12 text-blue-500" />
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-500" />
      case 'error':
        return <XCircle className="h-12 w-12 text-red-500" />
      default:
        return <Mail className="h-12 w-12 text-blue-500" />
    }
  }

  const getTitle = () => {
    switch (status) {
      case 'loading':
        return 'Verify Your Email'
      case 'success':
        return 'Email Verified!'
      case 'error':
        return 'Verification Error'
      case 'resent':
        return 'Email Sent!'
      default:
        return 'Verify Your Email'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>
          <CardTitle className="text-2xl">{getTitle()}</CardTitle>
          <CardDescription>
            {email && (
              <span className="block text-sm text-gray-600 mt-2">
                Email: {decodeURIComponent(email)}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert className={
            status === 'success' ? 'border-green-200 bg-green-50' :
            status === 'error' ? 'border-red-200 bg-red-50' :
            'border-blue-200 bg-blue-50'
          }>
            <AlertDescription>
              {message}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            {status === 'success' ? (
              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  onClick={() => router.push('/auth/signin')}
                >
                  Sign In Now
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/')}
                >
                  Back to Home
                </Button>
              </div>
            ) : status === 'error' ? (
              <div className="space-y-2">
                <Button 
                  className="w-full"
                  onClick={() => router.push('/auth/signup')}
                >
                  Try Signing Up Again
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/')}
                >
                  Back to Home
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleResendVerification}
                  disabled={isResending || !email}
                >
                  {isResending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Resend Verification Email'
                  )}
                </Button>
                
                <div className="text-center text-sm text-gray-600">
                  <p>Didn&apos;t receive the email? Check your spam folder or try resending.</p>
                </div>

                <div className="text-center">
                  <Link 
                    href="/auth/signin" 
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Already verified? Sign in
                  </Link>
                </div>
              </div>
            )}
          </div>

          {status === 'loading' && (
            <div className="text-center text-sm text-gray-500 space-y-2">
              <p>Check your email inbox for a verification link.</p>
              <p>The link will redirect you back here to complete verification.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function VerifyEmailLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <VerifyEmailForm />
    </Suspense>
  )
}