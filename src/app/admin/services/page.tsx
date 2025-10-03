'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
  Plus, 
  Search, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Package
} from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'

interface Service {
  id: string
  name: string
  description: string
  category: string
  platform: string
  price_per_1000: number
  min_order: number
  max_order: number
  status: 'active' | 'inactive'
  created_at: string
  total_orders: number
}

interface Category {
  id: string
  name: string
}

const platforms = [
  'Instagram', 'Facebook', 'Twitter', 'YouTube', 'TikTok', 
  'LinkedIn', 'Telegram', 'WhatsApp', 'Snapchat', 'Pinterest'
]

export default function ServicesManagement() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newService, setNewService] = useState<Partial<Service>>({
    name: '',
    description: '',
    category: '',
    platform: '',
    price_per_1000: 0,
    min_order: 100,
    max_order: 100000,
    status: 'active'
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin?redirect=/admin/services')
      return
    }

    if (user) {
      loadServices()
      loadCategories()
    }
  }, [user, loading, router])

  const loadServices = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockServices: Service[] = [
        {
          id: '1',
          name: 'Instagram Followers',
          description: 'High quality Instagram followers from real accounts',
          category: 'Followers',
          platform: 'Instagram',
          price_per_1000: 2.50,
          min_order: 100,
          max_order: 50000,
          status: 'active',
          created_at: '2024-01-15T10:00:00Z',
          total_orders: 1247
        },
        {
          id: '2',
          name: 'Instagram Likes',
          description: 'Instant Instagram likes for posts',
          category: 'Likes',
          platform: 'Instagram',
          price_per_1000: 1.20,
          min_order: 50,
          max_order: 10000,
          status: 'active',
          created_at: '2024-01-20T14:22:00Z',
          total_orders: 3682
        },
        {
          id: '3',
          name: 'YouTube Views',
          description: 'Real YouTube views from targeted audience',
          category: 'Views',
          platform: 'YouTube',
          price_per_1000: 3.75,
          min_order: 1000,
          max_order: 1000000,
          status: 'active',
          created_at: '2024-02-01T09:30:00Z',
          total_orders: 892
        },
        {
          id: '4',
          name: 'Facebook Page Likes',
          description: 'Facebook page likes from real profiles',
          category: 'Likes',
          platform: 'Facebook',
          price_per_1000: 4.25,
          min_order: 100,
          max_order: 25000,
          status: 'inactive',
          created_at: '2024-01-25T16:45:00Z',
          total_orders: 156
        },
        {
          id: '5',
          name: 'TikTok Followers',
          description: 'Premium TikTok followers for account growth',
          category: 'Followers',
          platform: 'TikTok',
          price_per_1000: 5.50,
          min_order: 100,
          max_order: 20000,
          status: 'active',
          created_at: '2024-02-10T11:15:00Z',
          total_orders: 428
        }
      ]
      
      setServices(mockServices)
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setLoadingServices(false)
    }
  }

  const loadCategories = async () => {
    try {
      // Mock categories
      const mockCategories: Category[] = [
        { id: '1', name: 'Followers' },
        { id: '2', name: 'Likes' },
        { id: '3', name: 'Views' },
        { id: '4', name: 'Comments' },
        { id: '5', name: 'Shares' }
      ]
      
      setCategories(mockCategories)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory
    const matchesPlatform = selectedPlatform === 'all' || service.platform === selectedPlatform
    const matchesStatus = selectedStatus === 'all' || service.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesPlatform && matchesStatus
  })

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setIsEditDialogOpen(true)
  }

  const handleSaveService = async () => {
    if (!editingService) return

    try {
      // TODO: Implement actual API call to update service
      console.log('Updating service:', editingService)
      
      // Update local state
      setServices(services.map(s => s.id === editingService.id ? editingService : s))
      
      setIsEditDialogOpen(false)
      setEditingService(null)
    } catch (error) {
      console.error('Error updating service:', error)
    }
  }

  const handleAddService = async () => {
    try {
      // TODO: Implement actual API call to create service
      const service: Service = {
        ...newService as Service,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        total_orders: 0
      }
      
      console.log('Creating service:', service)
      
      setServices([service, ...services])
      setIsAddDialogOpen(false)
      setNewService({
        name: '',
        description: '',
        category: '',
        platform: '',
        price_per_1000: 0,
        min_order: 100,
        max_order: 100000,
        status: 'active'
      })
    } catch (error) {
      console.error('Error creating service:', error)
    }
  }

  const handleToggleStatus = async (serviceId: string) => {
    try {
      const service = services.find(s => s.id === serviceId)
      if (!service) return

      const newStatus = service.status === 'active' ? 'inactive' : 'active'
      
      // TODO: Implement actual API call
      console.log('Toggling service status:', serviceId, 'to:', newStatus)
      
      setServices(services.map(s => 
        s.id === serviceId ? { ...s, status: newStatus } : s
      ))
    } catch (error) {
      console.error('Error toggling service status:', error)
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      // TODO: Implement actual API call
      console.log('Deleting service:', serviceId)
      
      setServices(services.filter(s => s.id !== serviceId))
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800'
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
              <h1 className="text-2xl font-bold text-gray-900">Service Management</h1>
              <p className="text-gray-600">Manage SMM services, pricing, and availability</p>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search services..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger>
                      <SelectValue placeholder="Platform" />
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
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Services Table */}
            <Card>
              <CardHeader>
                <CardTitle>Services ({filteredServices.length})</CardTitle>
                <CardDescription>
                  Manage your SMM services and their settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingServices ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Min/Max</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredServices.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{service.name}</div>
                              <div className="text-sm text-gray-500 max-w-xs truncate">
                                {service.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{service.category}</Badge>
                          </TableCell>
                          <TableCell>{service.platform}</TableCell>
                          <TableCell>${service.price_per_1000}/1K</TableCell>
                          <TableCell>
                            {service.min_order.toLocaleString()} - {service.max_order.toLocaleString()}
                          </TableCell>
                          <TableCell>{service.total_orders}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(service.status)}>
                              {service.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditService(service)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleStatus(service.id)}>
                                  {service.status === 'active' ? (
                                    <>
                                      <ToggleLeft className="mr-2 h-4 w-4" />
                                      Disable
                                    </>
                                  ) : (
                                    <>
                                      <ToggleRight className="mr-2 h-4 w-4" />
                                      Enable
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteService(service.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
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

      {/* Add Service Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>
              Create a new SMM service for your panel.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={newService.name}
                onChange={(e) => setNewService({...newService, name: e.target.value})}
                className="col-span-3"
                placeholder="Service name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea
                id="description"
                value={newService.description}
                onChange={(e) => setNewService({...newService, description: e.target.value})}
                className="col-span-3"
                placeholder="Service description"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Select 
                value={newService.category} 
                onValueChange={(value) => setNewService({...newService, category: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="platform" className="text-right">Platform</Label>
              <Select 
                value={newService.platform} 
                onValueChange={(value) => setNewService({...newService, platform: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map(platform => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Price/1K</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={newService.price_per_1000}
                onChange={(e) => setNewService({...newService, price_per_1000: parseFloat(e.target.value) || 0})}
                className="col-span-3"
                placeholder="0.00"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="min_order" className="text-right">Min Order</Label>
              <Input
                id="min_order"
                type="number"
                value={newService.min_order}
                onChange={(e) => setNewService({...newService, min_order: parseInt(e.target.value) || 0})}
                className="col-span-3"
                placeholder="100"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="max_order" className="text-right">Max Order</Label>
              <Input
                id="max_order"
                type="number"
                value={newService.max_order}
                onChange={(e) => setNewService({...newService, max_order: parseInt(e.target.value) || 0})}
                className="col-span-3"
                placeholder="100000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddService}>Add Service</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Make changes to the service settings.
            </DialogDescription>
          </DialogHeader>
          {editingService && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_name" className="text-right">Name</Label>
                <Input
                  id="edit_name"
                  value={editingService.name}
                  onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_description" className="text-right">Description</Label>
                <Textarea
                  id="edit_description"
                  value={editingService.description}
                  onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_price" className="text-right">Price/1K</Label>
                <Input
                  id="edit_price"
                  type="number"
                  step="0.01"
                  value={editingService.price_per_1000}
                  onChange={(e) => setEditingService({...editingService, price_per_1000: parseFloat(e.target.value) || 0})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_min_order" className="text-right">Min Order</Label>
                <Input
                  id="edit_min_order"
                  type="number"
                  value={editingService.min_order}
                  onChange={(e) => setEditingService({...editingService, min_order: parseInt(e.target.value) || 0})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_max_order" className="text-right">Max Order</Label>
                <Input
                  id="edit_max_order"
                  type="number"
                  value={editingService.max_order}
                  onChange={(e) => setEditingService({...editingService, max_order: parseInt(e.target.value) || 0})}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveService}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}