'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Search, 
  MoreHorizontal,
  Eye,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  PlayCircle,
  Loader2,
  ShoppingCart,
  Filter
} from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Textarea } from '@/components/ui/textarea'

interface Order {
  id: string
  order_id: string
  user_email: string
  user_name: string
  service_name: string
  service_platform: string
  quantity: number
  charge: number
  start_count: number
  remains: number
  status: 'pending' | 'in_progress' | 'completed' | 'partial' | 'canceled'
  link: string
  created_at: string
  updated_at: string
}

export default function OrdersManagement() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [statusUpdateOrder, setStatusUpdateOrder] = useState<Order | null>(null)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<Order['status']>('pending')
  const [adminNote, setAdminNote] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin?redirect=/admin/orders')
      return
    }

    if (user) {
      loadOrders()
    }
  }, [user, loading, router])

  const loadOrders = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockOrders: Order[] = [
        {
          id: '1',
          order_id: 'ORD-001',
          user_email: 'john.doe@example.com',
          user_name: 'John Doe',
          service_name: 'Instagram Followers',
          service_platform: 'Instagram',
          quantity: 1000,
          charge: 2.50,
          start_count: 5420,
          remains: 0,
          status: 'completed',
          link: 'https://instagram.com/johndoe',
          created_at: '2024-10-03T08:30:00Z',
          updated_at: '2024-10-03T10:15:00Z'
        },
        {
          id: '2',
          order_id: 'ORD-002',
          user_email: 'jane.smith@example.com',
          user_name: 'Jane Smith',
          service_name: 'Instagram Likes',
          service_platform: 'Instagram',
          quantity: 500,
          charge: 0.60,
          start_count: 1250,
          remains: 200,
          status: 'in_progress',
          link: 'https://instagram.com/p/ABC123',
          created_at: '2024-10-03T09:15:00Z',
          updated_at: '2024-10-03T09:30:00Z'
        },
        {
          id: '3',
          order_id: 'ORD-003',
          user_email: 'mike.johnson@example.com',
          user_name: 'Mike Johnson',
          service_name: 'YouTube Views',
          service_platform: 'YouTube',
          quantity: 10000,
          charge: 37.50,
          start_count: 15680,
          remains: 10000,
          status: 'pending',
          link: 'https://youtube.com/watch?v=xyz789',
          created_at: '2024-10-03T10:45:00Z',
          updated_at: '2024-10-03T10:45:00Z'
        },
        {
          id: '4',
          order_id: 'ORD-004',
          user_email: 'sarah.wilson@example.com',
          user_name: 'Sarah Wilson',
          service_name: 'Facebook Page Likes',
          service_platform: 'Facebook',
          quantity: 2000,
          charge: 8.50,
          start_count: 890,
          remains: 500,
          status: 'partial',
          link: 'https://facebook.com/sarahwilsonpage',
          created_at: '2024-10-03T07:20:00Z',
          updated_at: '2024-10-03T11:00:00Z'
        },
        {
          id: '5',
          order_id: 'ORD-005',
          user_email: 'alex.brown@example.com',
          user_name: 'Alex Brown',
          service_name: 'TikTok Followers',
          service_platform: 'TikTok',
          quantity: 1500,
          charge: 8.25,
          start_count: 320,
          remains: 1500,
          status: 'canceled',
          link: 'https://tiktok.com/@alexbrown',
          created_at: '2024-10-02T16:30:00Z',
          updated_at: '2024-10-03T09:00:00Z'
        }
      ]
      
      setOrders(mockOrders)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoadingOrders(false)
    }
  }

  const platforms = [...new Set(orders.map(order => order.service_platform))]

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.service_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
    const matchesPlatform = selectedPlatform === 'all' || order.service_platform === selectedPlatform
    
    return matchesSearch && matchesStatus && matchesPlatform
  })

  const handleViewOrder = (order: Order) => {
    setViewingOrder(order)
    setIsViewDialogOpen(true)
  }

  const handleStatusUpdate = (order: Order) => {
    setStatusUpdateOrder(order)
    setNewStatus(order.status)
    setAdminNote('')
    setIsStatusDialogOpen(true)
  }

  const handleSaveStatus = async () => {
    if (!statusUpdateOrder) return

    try {
      // TODO: Implement actual API call to update order status
      console.log('Updating order status:', statusUpdateOrder.id, 'to:', newStatus, 'note:', adminNote)
      
      // Update local state
      setOrders(orders.map(o => 
        o.id === statusUpdateOrder.id 
          ? { ...o, status: newStatus, updated_at: new Date().toISOString() }
          : o
      ))
      
      setIsStatusDialogOpen(false)
      setStatusUpdateOrder(null)
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'in_progress': return <PlayCircle className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'partial': return <RefreshCw className="h-4 w-4" />
      case 'canceled': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'partial': return 'bg-orange-100 text-orange-800'
      case 'canceled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProgress = (order: Order) => {
    if (order.status === 'completed') return 100
    if (order.status === 'canceled') return 0
    const delivered = order.quantity - order.remains
    return Math.round((delivered / order.quantity) * 100)
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
              <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
              <p className="text-gray-600">Monitor and manage customer orders</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={loadOrders}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {(['all', 'pending', 'in_progress', 'completed', 'canceled'] as const).map(status => {
                const count = status === 'all' ? orders.length : orders.filter(o => o.status === status).length
                const label = status === 'all' ? 'Total Orders' : status.replace('_', ' ').toUpperCase()
                
                return (
                  <Card key={status} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        {status !== 'all' && getStatusIcon(status)}
                        <div>
                          <p className="text-2xl font-bold">{count}</p>
                          <p className="text-sm text-gray-600">{label}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      {platforms.map(platform => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Orders ({filteredOrders.length})</span>
                </CardTitle>
                <CardDescription>
                  Track and manage customer orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingOrders ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Charge</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.order_id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.user_name}</div>
                              <div className="text-sm text-gray-500">{order.user_email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.service_name}</div>
                              <div className="text-sm text-gray-500">{order.service_platform}</div>
                            </div>
                          </TableCell>
                          <TableCell>{order.quantity.toLocaleString()}</TableCell>
                          <TableCell>${order.charge.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">{getProgress(order)}%</div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all"
                                  style={{ width: `${getProgress(order)}%` }}
                                ></div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>
                              <span className="flex items-center space-x-1">
                                {getStatusIcon(order.status)}
                                <span>{order.status.replace('_', ' ')}</span>
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusUpdate(order)}>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Update Status
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Complete information about this order
            </DialogDescription>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Order ID</Label>
                  <p className="text-sm text-gray-900">{viewingOrder.order_id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(viewingOrder.status)}>
                    {viewingOrder.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Customer</Label>
                <p className="text-sm text-gray-900">{viewingOrder.user_name}</p>
                <p className="text-sm text-gray-500">{viewingOrder.user_email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Service</Label>
                <p className="text-sm text-gray-900">{viewingOrder.service_name}</p>
                <p className="text-sm text-gray-500">{viewingOrder.service_platform}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Quantity</Label>
                  <p className="text-sm text-gray-900">{viewingOrder.quantity.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Charge</Label>
                  <p className="text-sm text-gray-900">${viewingOrder.charge.toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Remains</Label>
                  <p className="text-sm text-gray-900">{viewingOrder.remains.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Link</Label>
                <p className="text-sm text-gray-900 break-all">{viewingOrder.link}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p className="text-sm text-gray-900">
                    {new Date(viewingOrder.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Updated</Label>
                  <p className="text-sm text-gray-900">
                    {new Date(viewingOrder.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status of order {statusUpdateOrder?.order_id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">New Status</Label>
              <Select value={newStatus} onValueChange={(value: Order['status']) => setNewStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="note">Admin Note (Optional)</Label>
              <Textarea
                id="note"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add a note about this status change..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}