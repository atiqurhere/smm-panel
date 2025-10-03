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
  FolderOpen,
  Package,
  Loader2
} from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'

interface Category {
  id: string
  name: string
  description: string
  service_count: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export default function CategoriesManagement() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    description: '',
    status: 'active'
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin?redirect=/admin/categories')
      return
    }

    if (user) {
      loadCategories()
    }
  }, [user, loading, router])

  const loadCategories = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'Followers',
          description: 'Social media followers for various platforms',
          service_count: 12,
          status: 'active',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Likes',
          description: 'Post and content likes for social media',
          service_count: 18,
          status: 'active',
          created_at: '2024-01-16T14:22:00Z',
          updated_at: '2024-02-10T09:15:00Z'
        },
        {
          id: '3',
          name: 'Views',
          description: 'Video and content views for platforms like YouTube, TikTok',
          service_count: 8,
          status: 'active',
          created_at: '2024-01-20T09:30:00Z',
          updated_at: '2024-01-20T09:30:00Z'
        },
        {
          id: '4',
          name: 'Comments',
          description: 'Custom comments for posts and videos',
          service_count: 5,
          status: 'active',
          created_at: '2024-01-25T16:45:00Z',
          updated_at: '2024-02-05T11:20:00Z'
        },
        {
          id: '5',
          name: 'Shares',
          description: 'Social media shares and reposts',
          service_count: 3,
          status: 'inactive',
          created_at: '2024-02-01T11:15:00Z',
          updated_at: '2024-02-15T14:30:00Z'
        },
        {
          id: '6',
          name: 'Subscribers',
          description: 'Channel and page subscribers',
          service_count: 6,
          status: 'active',
          created_at: '2024-02-10T08:00:00Z',
          updated_at: '2024-02-20T10:45:00Z'
        }
      ]
      
      setCategories(mockCategories)
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoadingCategories(false)
    }
  }

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setIsEditDialogOpen(true)
  }

  const handleSaveCategory = async () => {
    if (!editingCategory) return

    try {
      // TODO: Implement actual API call to update category
      console.log('Updating category:', editingCategory)
      
      // Update local state
      setCategories(categories.map(c => 
        c.id === editingCategory.id 
          ? { ...editingCategory, updated_at: new Date().toISOString() }
          : c
      ))
      
      setIsEditDialogOpen(false)
      setEditingCategory(null)
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  const handleAddCategory = async () => {
    try {
      // TODO: Implement actual API call to create category
      const category: Category = {
        ...newCategory as Category,
        id: Date.now().toString(),
        service_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      console.log('Creating category:', category)
      
      setCategories([category, ...categories])
      setIsAddDialogOpen(false)
      setNewCategory({
        name: '',
        description: '',
        status: 'active'
      })
    } catch (error) {
      console.error('Error creating category:', error)
    }
  }

  const handleToggleStatus = async (categoryId: string) => {
    try {
      const category = categories.find(c => c.id === categoryId)
      if (!category) return

      const newStatus = category.status === 'active' ? 'inactive' : 'active'
      
      // TODO: Implement actual API call
      console.log('Toggling category status:', categoryId, 'to:', newStatus)
      
      setCategories(categories.map(c => 
        c.id === categoryId 
          ? { ...c, status: newStatus, updated_at: new Date().toISOString() }
          : c
      ))
    } catch (error) {
      console.error('Error toggling category status:', error)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    
    if (category && category.service_count > 0) {
      alert('Cannot delete category with existing services. Please move or delete services first.')
      return
    }

    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      // TODO: Implement actual API call
      console.log('Deleting category:', categoryId)
      
      setCategories(categories.filter(c => c.id !== categoryId))
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800'
  }

  const getTotalServices = () => categories.reduce((sum, cat) => sum + cat.service_count, 0)

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
              <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
              <p className="text-gray-600">Organize and manage service categories</p>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{categories.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {categories.filter(c => c.status === 'active').length} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getTotalServices()}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all categories
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Services/Category</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {categories.length > 0 ? Math.round(getTotalServices() / categories.length) : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Average distribution
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle>Search Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categories Table */}
            <Card>
              <CardHeader>
                <CardTitle>Categories ({filteredCategories.length})</CardTitle>
                <CardDescription>
                  Manage service categories and their organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingCategories ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Services</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCategories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <FolderOpen className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">{category.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate text-gray-600">
                              {category.description}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {category.service_count} services
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(category.status)}>
                              {category.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(category.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {new Date(category.updated_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleStatus(category.id)}>
                                  <Package className="mr-2 h-4 w-4" />
                                  {category.status === 'active' ? 'Deactivate' : 'Activate'}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="text-red-600"
                                  disabled={category.service_count > 0}
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

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category to organize your services.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                className="col-span-3"
                placeholder="Category name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea
                id="description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                className="col-span-3"
                placeholder="Category description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory} disabled={!newCategory.name?.trim()}>
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Make changes to the category settings.
            </DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_name" className="text-right">Name</Label>
                <Input
                  id="edit_name"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit_description" className="text-right">Description</Label>
                <Textarea
                  id="edit_description"
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Services</Label>
                <div className="col-span-3 text-sm text-gray-600">
                  {editingCategory.service_count} services in this category
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCategory}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}