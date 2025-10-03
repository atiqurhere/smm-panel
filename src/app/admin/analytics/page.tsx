'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Eye,
  Calendar,
  Download,
  Loader2
} from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'

interface AnalyticsData {
  revenue: {
    total: number
    change: number
    trend: 'up' | 'down'
    monthly: Array<{ month: string; amount: number }>
  }
  users: {
    total: number
    new_this_month: number
    change: number
    trend: 'up' | 'down'
  }
  orders: {
    total: number
    completed: number
    pending: number
    change: number
    trend: 'up' | 'down'
    daily: Array<{ date: string; count: number }>
  }
  topServices: Array<{
    name: string
    platform: string
    orders: number
    revenue: number
  }>
  topCustomers: Array<{
    name: string
    email: string
    orders: number
    total_spent: number
  }>
}

export default function AnalyticsDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loadingAnalytics, setLoadingAnalytics] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin?redirect=/admin/analytics')
      return
    }

    if (user) {
      loadAnalytics()
    }
  }, [user, loading, router, timeRange])

  const loadAnalytics = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockAnalytics: AnalyticsData = {
        revenue: {
          total: 45320.50,
          change: 12.5,
          trend: 'up',
          monthly: [
            { month: 'Jan', amount: 3200 },
            { month: 'Feb', amount: 3800 },
            { month: 'Mar', amount: 4200 },
            { month: 'Apr', amount: 3900 },
            { month: 'May', amount: 4500 },
            { month: 'Jun', amount: 5200 },
            { month: 'Jul', amount: 4800 },
            { month: 'Aug', amount: 5500 },
            { month: 'Sep', amount: 6100 },
            { month: 'Oct', amount: 4420 }
          ]
        },
        users: {
          total: 1247,
          new_this_month: 86,
          change: 8.2,
          trend: 'up'
        },
        orders: {
          total: 3682,
          completed: 3555,
          pending: 127,
          change: 15.3,
          trend: 'up',
          daily: [
            { date: '2024-09-24', count: 45 },
            { date: '2024-09-25', count: 52 },
            { date: '2024-09-26', count: 38 },
            { date: '2024-09-27', count: 61 },
            { date: '2024-09-28', count: 44 },
            { date: '2024-09-29', count: 55 },
            { date: '2024-09-30', count: 48 },
            { date: '2024-10-01', count: 67 },
            { date: '2024-10-02', count: 72 },
            { date: '2024-10-03', count: 58 }
          ]
        },
        topServices: [
          { name: 'Instagram Followers', platform: 'Instagram', orders: 1247, revenue: 3117.50 },
          { name: 'Instagram Likes', platform: 'Instagram', orders: 892, revenue: 1070.40 },
          { name: 'YouTube Views', platform: 'YouTube', orders: 634, revenue: 2377.50 },
          { name: 'TikTok Followers', platform: 'TikTok', orders: 428, revenue: 2354.00 },
          { name: 'Facebook Page Likes', platform: 'Facebook', orders: 156, revenue: 663.00 }
        ],
        topCustomers: [
          { name: 'John Doe', email: 'john.doe@example.com', orders: 28, total_spent: 245.50 },
          { name: 'Sarah Wilson', email: 'sarah.wilson@example.com', orders: 22, total_spent: 189.75 },
          { name: 'Mike Johnson', email: 'mike.johnson@example.com', orders: 19, total_spent: 156.25 },
          { name: 'Emma Davis', email: 'emma.davis@example.com', orders: 16, total_spent: 134.80 },
          { name: 'Alex Brown', email: 'alex.brown@example.com', orders: 14, total_spent: 112.40 }
        ]
      }
      
      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoadingAnalytics(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getChangeIcon = (trend: 'up' | 'down') => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const getChangeColor = (trend: 'up' | 'down') => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Detailed insights and performance metrics</p>
            </div>
            <div className="flex items-center space-x-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {loadingAnalytics ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : analytics && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(analytics.revenue.total)}</div>
                    <div className={`flex items-center text-xs ${getChangeColor(analytics.revenue.trend)}`}>
                      {getChangeIcon(analytics.revenue.trend)}
                      <span className="ml-1">+{analytics.revenue.change}% from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.users.total.toLocaleString()}</div>
                    <div className={`flex items-center text-xs ${getChangeColor(analytics.users.trend)}`}>
                      {getChangeIcon(analytics.users.trend)}
                      <span className="ml-1">+{analytics.users.new_this_month} new this month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.orders.total.toLocaleString()}</div>
                    <div className={`flex items-center text-xs ${getChangeColor(analytics.orders.trend)}`}>
                      {getChangeIcon(analytics.orders.trend)}
                      <span className="ml-1">+{analytics.orders.change}% from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round((analytics.orders.completed / analytics.orders.total) * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {analytics.orders.completed} completed orders
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Revenue</CardTitle>
                    <CardDescription>Revenue trend over the last 10 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.revenue.monthly.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 text-sm text-gray-600">{item.month}</div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ 
                                  width: `${(item.amount / Math.max(...analytics.revenue.monthly.map(m => m.amount))) * 100}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-sm font-medium w-16 text-right">
                            ${(item.amount / 1000).toFixed(1)}k
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Daily Orders Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Orders</CardTitle>
                    <CardDescription>Order volume for the last 10 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.orders.daily.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-12 text-sm text-gray-600">
                              {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full"
                                style={{ 
                                  width: `${(item.count / Math.max(...analytics.orders.daily.map(d => d.count))) * 100}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-sm font-medium w-8 text-right">
                            {item.count}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tables Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Services */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Services</CardTitle>
                    <CardDescription>Services with the highest order volume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.topServices.map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                            </div>
                            <div>
                              <div className="font-medium">{service.name}</div>
                              <div className="text-sm text-gray-500">{service.platform}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{service.orders} orders</div>
                            <div className="text-sm text-gray-500">{formatCurrency(service.revenue)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Customers */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Customers</CardTitle>
                    <CardDescription>Customers with the highest order volume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.topCustomers.map((customer, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-green-600">#{index + 1}</span>
                            </div>
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-sm text-gray-500">{customer.email}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{customer.orders} orders</div>
                            <div className="text-sm text-gray-500">{formatCurrency(customer.total_spent)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Insights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Average Order Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(analytics.revenue.total / analytics.orders.total)}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Based on {analytics.orders.total.toLocaleString()} total orders
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pending Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {analytics.orders.pending}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {((analytics.orders.pending / analytics.orders.total) * 100).toFixed(1)}% of total orders
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue per User</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(analytics.revenue.total / analytics.users.total)}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Average revenue per registered user
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}