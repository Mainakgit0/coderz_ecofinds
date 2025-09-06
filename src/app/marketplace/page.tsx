'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import ProductCard from '@/components/ProductCard'

interface Product {
  id: string
  title: string
  description: string
  category: string
  price: number
  imageUrl?: string
  brand?: string
  condition: string
  size?: string
  color?: string
  material?: string
  yearPurchased?: number
  yearOfManufacture?: number
  location?: string
  weight?: string
  dimensions?: string
  quantity?: number
  originalPackaging?: boolean
  manualIncluded?: boolean
  workingCondition?: string
  status: string
  createdAt: string
  updatedAt: string
  ownerId: string
  owner: {
    id: string
    email: string
    username?: string
  }
}

export default function MarketplacePage() {
  const { user } = useAuth()
  const { refreshCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [searchLoading, setSearchLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  const categories = ['CLOTHING', 'ELECTRONICS', 'FURNITURE', 'BOOKS', 'ACCESSORIES', 'OTHER']

  // Mount effect
  useEffect(() => {
    setMounted(true)
  }, [])

  // Debounced search effect
  useEffect(() => {
    if (mounted) {
      const timeoutId = setTimeout(() => {
        fetchProducts()
      }, searchQuery ? 500 : 0) // 500ms debounce for search, immediate for other changes

      return () => clearTimeout(timeoutId)
    }
  }, [mounted, searchQuery, selectedCategory, sortBy])

  useEffect(() => {
    if (user && mounted) {
      refreshCart()
    }
  }, [user, refreshCart, mounted])

  const fetchProducts = async () => {
    try {
      if (searchQuery) {
        setSearchLoading(true)
      } else {
        setLoading(true)
      }
      
      const params = new URLSearchParams({
        ...(searchQuery.trim() && { search: searchQuery.trim() }),
        ...(selectedCategory && { category: selectedCategory }),
        sort: sortBy,
        limit: '20'
      })

      console.log('Fetching products with params:', params.toString())
      
      const response = await fetch(`/api/products?${params}`, {
        headers: {
          'Cache-Control': 'no-cache' // Disable cache during debugging
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('API Response:', data)
        setProducts(data.products || [])
      } else {
        console.error('API Error:', response.status, response.statusText)
        setProducts([])
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setProducts([])
    } finally {
      setLoading(false)
      setSearchLoading(false)
    }
  }

  const handleProductUpdate = () => {
    fetchProducts()
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#F5F0E6'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderColor: '#2E7D32'}}></div>
          <p style={{color: '#333333'}}>Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#F5F0E6'}}>
      {/* Hero Section */}
      <section className="text-white py-16 shadow-xl" style={{background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            EcoFinds Marketplace
          </h1>
          <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto text-white opacity-90">
            Discover amazing second-hand treasures while helping the planet. 
            Buy sustainable products at great prices in Indian Rupees.
          </p>
          {user && (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 inline-block border border-white/30">
              <p className="text-lg">
                Welcome back, <span className="font-semibold" style={{color: '#A5D6A7'}}>{user.username || user.email}</span>!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white backdrop-blur-md shadow-lg border-b" style={{borderColor: '#E0E0E0'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search products, brands, colors, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border bg-white rounded-xl focus:ring-2 focus:ring-green-600 focus:border-transparent text-lg shadow-sm"
                style={{borderColor: '#E0E0E0', color: '#333333'}}
              />
              {searchLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2" style={{borderColor: '#2E7D32'}}></div>
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border bg-white rounded-xl focus:ring-2 focus:border-transparent text-lg shadow-sm min-w-[150px]"
                style={{borderColor: '#E0E0E0', color: '#333333'}}
              >
                <option value="">All Categories</option>
                <option value="CLOTHING">Clothing</option>
                <option value="ELECTRONICS">Electronics</option>
                <option value="FURNITURE">Furniture</option>
                <option value="BOOKS">Books</option>
                <option value="ACCESSORIES">Accessories</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border bg-white rounded-xl focus:ring-2 focus:border-transparent text-lg shadow-sm min-w-[180px]"
                style={{borderColor: '#E0E0E0', color: '#333333'}}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-6" style={{color: '#666666'}}>
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium">
                <span className="font-bold" style={{color: '#2E7D32'}}>{products.length}</span> product{products.length !== 1 ? 's' : ''} found
                {searchQuery && <span style={{color: '#FF9800'}}> for "{searchQuery}"</span>}
                {selectedCategory && <span style={{color: '#A5D6A7'}}> in {selectedCategory.toLowerCase()}</span>}
              </p>
              {(searchQuery || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('')
                  }}
                  className="text-sm transition-colors hover:text-orange-500"
                  style={{color: '#666666'}}
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4" role="img" aria-label="Search">🔍</div>
              <h3 className="text-2xl font-semibold mb-2" style={{color: '#333333'}}>No products found</h3>
              <p className="text-lg mb-8" style={{color: '#666666'}}>
                Try adjusting your search criteria or browse all categories.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('')
                  setSortBy('newest')
                }}
                className="text-white px-6 py-3 rounded-lg font-semibold transition-colors hover:opacity-90"
                style={{backgroundColor: '#2E7D32'}}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onUpdate={handleProductUpdate}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-white py-16" style={{backgroundColor: '#2E7D32'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Turn your unused items into cash while helping create a more sustainable future.
          </p>
          <a
            href="/my/listings"
            className="px-8 py-4 rounded-lg font-semibold transition duration-200 inline-block text-lg hover:opacity-90"
            style={{backgroundColor: '#FF9800', color: 'white'}}
          >
            List Your Items
          </a>
        </div>
      </section>
    </div>
  )
}
