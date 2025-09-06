'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import ProductCard from '@/components/ProductCard'
import ImageUpload from '@/components/ImageUpload'

interface Product {
  id: string
  title: string
  description: string
  category: string
  price: number
  imageUrl?: string
  status: string
  createdAt: string
  owner: {
    id: string
    username?: string
    email: string
  }
}

export default function MyListingsPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'CLOTHING',
    price: '',
    imageUrl: '',
    brand: '',
    condition: 'Good',
    size: '',
    color: '',
    material: '',
    yearPurchased: '',
    yearOfManufacture: '',
    location: '',
    weight: '',
    dimensions: '',
    quantity: '1',
    originalPackaging: false,
    manualIncluded: false,
    workingCondition: '',
  })

  useEffect(() => {
    fetchMyProducts()
  }, [user])

  const fetchMyProducts = async () => {
    if (!user) return

    try {
      const response = await fetch('/api/products?owner=me')
      if (response.ok) {
        const data = await response.json()
        // Filter to only show current user's products
        const myProducts = data.products.filter((p: Product) => p.owner.id === user.id)
        setProducts(myProducts)
      } else {
        setError('Failed to load your listings')
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setError('Failed to load your listings')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          imageUrl: formData.imageUrl || undefined,
          yearPurchased: formData.yearPurchased ? parseInt(formData.yearPurchased) : undefined,
          yearOfManufacture: formData.yearOfManufacture ? parseInt(formData.yearOfManufacture) : undefined,
          quantity: parseInt(formData.quantity) || 1,
        }),
      })

      if (response.ok) {
        setShowCreateForm(false)
        setFormData({
          title: '',
          description: '',
          category: 'CLOTHING',
          price: '',
          imageUrl: '',
        })
        await fetchMyProducts()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create product')
      }
    } catch (error) {
      setError('Failed to create product')
    }
  }

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    setError('')

    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          imageUrl: formData.imageUrl || undefined,
          yearPurchased: formData.yearPurchased ? parseInt(formData.yearPurchased) : undefined,
          yearOfManufacture: formData.yearOfManufacture ? parseInt(formData.yearOfManufacture) : undefined,
          quantity: parseInt(formData.quantity) || 1,
        }),
      })

      if (response.ok) {
        setEditingProduct(null)
        setFormData({
          title: '',
          description: '',
          category: 'CLOTHING',
          price: '',
          imageUrl: '',
        })
        await fetchMyProducts()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update product')
      }
    } catch (error) {
      setError('Failed to update product')
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchMyProducts()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to delete product')
      }
    } catch (error) {
      setError('Failed to delete product')
    }
  }

  const startEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      imageUrl: product.imageUrl || '',
      brand: product.brand || '',
      condition: product.condition || 'Good',
      size: product.size || '',
      color: product.color || '',
      material: product.material || '',
      yearPurchased: product.yearPurchased?.toString() || '',
      yearOfManufacture: product.yearOfManufacture?.toString() || '',
      location: product.location || '',
      weight: product.weight || '',
      dimensions: product.dimensions || '',
      quantity: product.quantity?.toString() || '1',
      originalPackaging: product.originalPackaging || false,
      manualIncluded: product.manualIncluded || false,
      workingCondition: product.workingCondition || '',
    })
  }

  const cancelEdit = () => {
    setEditingProduct(null)
    setShowCreateForm(false)
    setFormData({
      title: '',
      description: '',
      category: 'CLOTHING',
      price: '',
      imageUrl: '',
      brand: '',
      condition: 'Good',
      size: '',
      color: '',
      material: '',
      yearPurchased: '',
      yearOfManufacture: '',
      location: '',
      weight: '',
      dimensions: '',
      quantity: '1',
      originalPackaging: false,
      manualIncluded: false,
      workingCondition: '',
    })
    setError('')
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{color: '#333333'}}>
            Please log in to view your listings
          </h1>
          <Link
            href="/auth/login"
            className="transition-colors hover:opacity-80" style={{color: '#2E7D32'}}
          >
            Go to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="flex items-center mb-4 transition-colors hover:opacity-80" style={{color: '#2E7D32'}}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{color: '#333333'}}>My Listings</h1>
            <p className="mt-2" style={{color: '#666666'}}>Manage your products</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="text-white px-4 py-2 rounded-lg transition-colors hover:opacity-90" style={{backgroundColor: '#2E7D32'}}
          >
            Add New Product
          </button>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-md mb-6" style={{backgroundColor: '#FFEBEE', borderColor: '#FFCDD2', color: '#D32F2F', border: '1px solid'}}>
          {error}
        </div>
      )}

      {/* Create/Edit Form */}
      {(showCreateForm || editingProduct) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8" style={{borderColor: '#E0E0E0', border: '1px solid'}}>
          <h2 className="text-xl font-semibold mb-4" style={{color: '#333333'}}>
            {editingProduct ? 'Edit Product' : 'Create New Product'}
          </h2>
          <form onSubmit={editingProduct ? handleEditProduct : handleCreateProduct}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-colors" style={{borderColor: '#E0E0E0', color: '#333333', backgroundColor: 'white'}} onFocus={(e) => {e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 2px rgba(46, 125, 50, 0.2)'}} onBlur={(e) => {e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'}}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-colors" style={{borderColor: '#E0E0E0', color: '#333333', backgroundColor: 'white'}} onFocus={(e) => {e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 2px rgba(46, 125, 50, 0.2)'}} onBlur={(e) => {e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'}}
                >
                  <option value="CLOTHING">Clothing</option>
                  <option value="ELECTRONICS">Electronics</option>
                  <option value="FURNITURE">Furniture</option>
                  <option value="BOOKS">Books</option>
                  <option value="ACCESSORIES">Accessories</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-colors" style={{borderColor: '#E0E0E0', color: '#333333', backgroundColor: 'white'}} onFocus={(e) => {e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 2px rgba(46, 125, 50, 0.2)'}} onBlur={(e) => {e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'}}
                />
              </div>

              <div className="md:col-span-2">
                <ImageUpload
                  currentImageUrl={formData.imageUrl}
                  onImageUploaded={(imageUrl) => setFormData({ ...formData, imageUrl })}
                  onImageRemoved={() => setFormData({ ...formData, imageUrl: '' })}
                />
              </div>
            </div>

            {/* Additional Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-colors" style={{borderColor: '#E0E0E0', color: '#333333', backgroundColor: 'white'}} onFocus={(e) => {e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 2px rgba(46, 125, 50, 0.2)'}} onBlur={(e) => {e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'}}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-colors" style={{borderColor: '#E0E0E0', color: '#333333', backgroundColor: 'white'}} onFocus={(e) => {e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 2px rgba(46, 125, 50, 0.2)'}} onBlur={(e) => {e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'}}
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size
                </label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder="e.g., M, L, XL or dimensions"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-colors" style={{borderColor: '#E0E0E0', color: '#333333', backgroundColor: 'white'}} onFocus={(e) => {e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 2px rgba(46, 125, 50, 0.2)'}} onBlur={(e) => {e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'}}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-colors" style={{borderColor: '#E0E0E0', color: '#333333', backgroundColor: 'white'}} onFocus={(e) => {e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 2px rgba(46, 125, 50, 0.2)'}} onBlur={(e) => {e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'}}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Material
                </label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  placeholder="e.g., Cotton, Leather, Plastic"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-colors" style={{borderColor: '#E0E0E0', color: '#333333', backgroundColor: 'white'}} onFocus={(e) => {e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 2px rgba(46, 125, 50, 0.2)'}} onBlur={(e) => {e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'}}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year Purchased
                </label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={formData.yearPurchased}
                  onChange={(e) => setFormData({ ...formData, yearPurchased: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-colors" style={{borderColor: '#E0E0E0', color: '#333333', backgroundColor: 'white'}} onFocus={(e) => {e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 2px rgba(46, 125, 50, 0.2)'}} onBlur={(e) => {e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'}}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year of Manufacture
                </label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={formData.yearOfManufacture}
                  onChange={(e) => setFormData({ ...formData, yearOfManufacture: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-colors" style={{borderColor: '#E0E0E0', color: '#333333', backgroundColor: 'white'}} onFocus={(e) => {e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 2px rgba(46, 125, 50, 0.2)'}} onBlur={(e) => {e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'}}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City, State"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-colors" style={{borderColor: '#E0E0E0', color: '#333333', backgroundColor: 'white'}} onFocus={(e) => {e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 2px rgba(46, 125, 50, 0.2)'}} onBlur={(e) => {e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'}}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight
                </label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="e.g., 500g, 2kg"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-colors" style={{borderColor: '#E0E0E0', color: '#333333', backgroundColor: 'white'}} onFocus={(e) => {e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 2px rgba(46, 125, 50, 0.2)'}} onBlur={(e) => {e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'}}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dimensions
                </label>
                <input
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  placeholder="e.g., 30cm x 20cm x 10cm"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-colors" style={{borderColor: '#E0E0E0', color: '#333333', backgroundColor: 'white'}} onFocus={(e) => {e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 2px rgba(46, 125, 50, 0.2)'}} onBlur={(e) => {e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'}}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-colors" style={{borderColor: '#E0E0E0', color: '#333333', backgroundColor: 'white'}} onFocus={(e) => {e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 2px rgba(46, 125, 50, 0.2)'}} onBlur={(e) => {e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'}}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Working Condition (for electronics)
                </label>
                <input
                  type="text"
                  value={formData.workingCondition}
                  onChange={(e) => setFormData({ ...formData, workingCondition: e.target.value })}
                  placeholder="e.g., Fully functional, Minor issues"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-colors" style={{borderColor: '#E0E0E0', color: '#333333', backgroundColor: 'white'}} onFocus={(e) => {e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 2px rgba(46, 125, 50, 0.2)'}} onBlur={(e) => {e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'}}
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="originalPackaging"
                  checked={formData.originalPackaging}
                  onChange={(e) => setFormData({ ...formData, originalPackaging: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="originalPackaging" className="text-sm font-medium text-gray-700">
                  Original packaging included
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="manualIncluded"
                  checked={formData.manualIncluded}
                  onChange={(e) => setFormData({ ...formData, manualIncluded: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="manualIncluded" className="text-sm font-medium text-gray-700">
                  Manual/Instructions included
                </label>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                type="submit"
                className="text-white px-4 py-2 rounded-md transition-colors hover:opacity-90" style={{backgroundColor: '#2E7D32'}}
              >
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 rounded-md transition-colors hover:opacity-80" style={{backgroundColor: '#E0E0E0', color: '#333333'}}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse" style={{borderColor: '#E0E0E0', border: '1px solid'}}>
              <div className="w-full h-48 rounded mb-4" style={{backgroundColor: '#F5F5F5'}}></div>
              <div className="h-4 rounded mb-2" style={{backgroundColor: '#F5F5F5'}}></div>
              <div className="h-3 rounded mb-4" style={{backgroundColor: '#F5F5F5'}}></div>
              <div className="h-8 rounded" style={{backgroundColor: '#F5F5F5'}}></div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              showActions={true}
              onEdit={() => startEdit(product)}
              onDelete={() => handleDeleteProduct(product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg
            className="w-24 h-24 mx-auto mb-4"
            style={{color: '#999999'}}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h2 className="text-xl font-semibold mb-2" style={{color: '#333333'}}>No products listed yet</h2>
          <p className="mb-6" style={{color: '#666666'}}>Start selling by creating your first product listing</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-block text-white px-6 py-3 rounded-lg transition-colors hover:opacity-90" style={{backgroundColor: '#2E7D32'}}
          >
            Create Your First Listing
          </button>
        </div>
      )}
    </div>
  )
}
