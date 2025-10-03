'use client'

import { useEffect, useState } from 'react'
import { createClientSupabase } from '@/lib/supabase-client'
import { useAuth } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CreditCard, 
  ShoppingCart, 
  TrendingUp, 
  Clock, 
  Plus,
  AlertCircle,
  CheckCircle,
  Eye,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'

export default function DashboardPage() {
  const { user } = useAuth()
  const [wallet, setWallet] = useState<any>(null)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [quickOrderLink, setQuickOrderLink] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClientSupabase()

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Fetch wallet data
      const { data: walletData } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      setWallet(walletData)

      // Fetch recent orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select(`
          *,
          services (name)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentOrders(ordersData || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const detectPlatform = (url: string) => {
    if (url.includes('instagram.com')) return 'Instagram'
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube'
    if (url.includes('facebook.com') || url.includes('fb.com')) return 'Facebook'
    if (url.includes('tiktok.com')) return 'TikTok'
    if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter'
    return 'Unknown'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'partial': return 'bg-orange-100 text-orange-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your account today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${wallet?.balance?.toFixed(2) || '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">
                +$0.00 from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                +0% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${wallet?.total_spent?.toFixed(2) || '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">
                +0% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4h</div>
              <p className="text-xs text-muted-foreground">
                -0.2h from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Balance and Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Add Funds Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Add Funds</span>
              </CardTitle>
              <CardDescription>
                Top up your account balance to place orders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-blue-600">
                ${wallet?.balance?.toFixed(2) || '0.00'}
              </div>
              <Button asChild className="w-full">
                <Link href="/dashboard/funds">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Funds
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Order */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Quick Order</span>
              </CardTitle>
              <CardDescription>
                Enter a link to quickly detect platform and suggest services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter Instagram/YouTube/Facebook link..."
                  value={quickOrderLink}
                  onChange={(e) => setQuickOrderLink(e.target.value)}
                />
                <Button variant="outline">
                  Detect
                </Button>
              </div>
              {quickOrderLink && (
                <div className="text-sm text-muted-foreground">
                  Platform detected: {detectPlatform(quickOrderLink)}
                </div>
              )}
              <Button asChild className="w-full" variant="outline">
                <Link href="/dashboard/new-order">
                  Browse All Services
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Announcements */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Welcome to SMM Panel!</strong> Your account has been successfully created. 
            Add funds to your wallet to start placing orders.{' '}
            <Link href="/dashboard/funds" className="underline font-medium">
              Add funds now
            </Link>
          </AlertDescription>
        </Alert>

        {/* Recent Orders and Service Health */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Recent Orders */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Your latest order history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by placing your first order.
                  </p>
                  <div className="mt-6">
                    <Button asChild>
                      <Link href="/dashboard/new-order">
                        <Plus className="mr-2 h-4 w-4" />
                        New Order
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between border-b pb-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{order.services?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/orders/${order.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/orders">
                      View all orders
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Health */}
          <Card>
            <CardHeader>
              <CardTitle>Service Health</CardTitle>
              <CardDescription>
                Current provider status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Instagram</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">YouTube</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Facebook</span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Clock className="w-3 h-3 mr-1" />
                    Slow
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">TikTok</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Operational
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/status">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Full Status Page
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}