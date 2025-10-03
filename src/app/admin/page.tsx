'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Plus,
  Eye,
  Settings,
  BarChart3
} from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Loader2 } from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  completedOrders: number
  activeServices: number
}

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    activeServices: 0
  })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin?redirect=/admin')
      return
    }

    // Load dashboard stats (mock data for now)
    const loadStats = async () => {
      try {
        // TODO: Replace with actual API calls
        setStats({
          totalUsers: 1247,
          totalOrders: 3682,
          totalRevenue: 45320,
          pendingOrders: 127,
          completedOrders: 3555,
          activeServices: 48
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoadingStats(false)
      }
    }

    if (user) {
      loadStats()
    }
  }, [user, loading, router])

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
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's what's happening with your SMM panel.</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Service
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {loadingStats ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      +12% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      +23% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      +8% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeServices}</div>
                    <p className="text-xs text-muted-foreground">
                      +3 new this week
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Common administrative tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/services')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Service
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/users')}>
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/orders')}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Orders
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin/analytics')}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                  </CardContent>
                </Card>

                {/* Order Status Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Status</CardTitle>
                    <CardDescription>
                      Current order distribution
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Pending</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{stats.pendingOrders}</span>
                        <Badge variant="secondary">
                          {((stats.pendingOrders / stats.totalOrders) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Completed</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{stats.completedOrders}</span>
                        <Badge variant="secondary">
                          {((stats.completedOrders / stats.totalOrders) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button className="w-full" onClick={() => router.push('/admin/orders')}>
                        View All Orders
                      </Button>
                    </div>
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