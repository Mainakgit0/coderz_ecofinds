'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'

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
  owner: {
    id: string
    username?: string
    email: string
  }
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { addToCart } = useCart()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data.product)
        } else {
          setError('Product not found')
        }
      } catch (error) {
        console.error('Failed to fetch product:', error)
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const handleAddToCart = async () => {
    if (!user || !product) return
    
    try {
      setIsAddingToCart(true)
      await addToCart(product.id)
      alert('Product added to cart!')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to add to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="w-full h-96 bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Product not found'}
          </h1>
          <Link
            href="/"
            className="text-green-600 hover:text-green-500"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    )
  }

  const isOwner = user?.id === product.owner.id
  const canAddToCart = user && !isOwner && product.status === 'Available'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="text-green-600 hover:text-green-500 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-w-1 aspect-h-1">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg
                className="w-24 h-24 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                {product.category.charAt(0) + product.category.slice(1).toLowerCase()}
              </span>
              <span className={`px-3 py-1 text-sm rounded-full ${
                product.status === 'Available' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.status}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>
            <p className="text-3xl font-bold mb-4" style={{color: '#2E7D32'}}>
              ₹{product.price.toLocaleString('en-IN')}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2" style={{color: '#333333'}}>Description</h3>
            <p className="leading-relaxed" style={{color: '#666666'}}>
              {product.description}
            </p>
          </div>

          {/* Product Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{color: '#333333'}}>Product Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.brand && (
                <div className="flex justify-between">
                  <span className="font-medium" style={{color: '#333333'}}>Brand:</span>
                  <span style={{color: '#666666'}}>{product.brand}</span>
                </div>
              )}
              {product.condition && (
                <div className="flex justify-between">
                  <span className="font-medium" style={{color: '#333333'}}>Condition:</span>
                  <span style={{color: '#666666'}}>{product.condition}</span>
                </div>
              )}
              {product.color && (
                <div className="flex justify-between">
                  <span className="font-medium" style={{color: '#333333'}}>Color:</span>
                  <span style={{color: '#666666'}}>{product.color}</span>
                </div>
              )}
              {product.size && (
                <div className="flex justify-between">
                  <span className="font-medium" style={{color: '#333333'}}>Size:</span>
                  <span style={{color: '#666666'}}>{product.size}</span>
                </div>
              )}
              {product.material && (
                <div className="flex justify-between">
                  <span className="font-medium" style={{color: '#333333'}}>Material:</span>
                  <span style={{color: '#666666'}}>{product.material}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex justify-between">
                  <span className="font-medium" style={{color: '#333333'}}>Weight:</span>
                  <span style={{color: '#666666'}}>{product.weight}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex justify-between">
                  <span className="font-medium" style={{color: '#333333'}}>Dimensions:</span>
                  <span style={{color: '#666666'}}>{product.dimensions}</span>
                </div>
              )}
              {product.quantity && (
                <div className="flex justify-between">
                  <span className="font-medium" style={{color: '#333333'}}>Quantity:</span>
                  <span style={{color: '#666666'}}>{product.quantity}</span>
                </div>
              )}
              {product.yearOfManufacture && (
                <div className="flex justify-between">
                  <span className="font-medium" style={{color: '#333333'}}>Year of Manufacture:</span>
                  <span style={{color: '#666666'}}>{product.yearOfManufacture}</span>
                </div>
              )}
              {product.yearPurchased && (
                <div className="flex justify-between">
                  <span className="font-medium" style={{color: '#333333'}}>Year Purchased:</span>
                  <span style={{color: '#666666'}}>{product.yearPurchased}</span>
                </div>
              )}
              {product.originalPackaging !== undefined && (
                <div className="flex justify-between">
                  <span className="font-medium" style={{color: '#333333'}}>Original Packaging:</span>
                  <span style={{color: '#666666'}}>{product.originalPackaging ? 'Yes' : 'No'}</span>
                </div>
              )}
              {product.manualIncluded !== undefined && (
                <div className="flex justify-between">
                  <span className="font-medium" style={{color: '#333333'}}>Manual Included:</span>
                  <span style={{color: '#666666'}}>{product.manualIncluded ? 'Yes' : 'No'}</span>
                </div>
              )}
              {product.workingCondition && (
                <div className="flex justify-between">
                  <span className="font-medium" style={{color: '#333333'}}>Working Condition:</span>
                  <span style={{color: '#666666'}}>{product.workingCondition}</span>
                </div>
              )}
              {product.location && (
                <div className="flex justify-between">
                  <span className="font-medium" style={{color: '#333333'}}>Location:</span>
                  <span style={{color: '#666666'}}>{product.location}</span>
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-2" style={{color: '#333333'}}>Seller Information</h3>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#2E7D32'}}>
                <span className="text-white font-semibold">
                  {(product.owner.username || product.owner.email).charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium" style={{color: '#333333'}}>
                  {product.owner.username || product.owner.email}
                </p>
                <p className="text-sm" style={{color: '#666666'}}>
                  Listed on {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {canAddToCart ? (
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full text-white py-3 px-6 rounded-lg text-lg font-semibold transition-colors hover:opacity-90 disabled:bg-gray-400"
                style={{backgroundColor: '#FF9800'}}
              >
                {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
              </button>
            ) : !user ? (
              <Link
                href="/auth/login"
                className="block w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg text-lg font-semibold text-center transition-colors"
              >
                Login to Purchase
              </Link>
            ) : isOwner ? (
              <div className="text-center text-gray-500 py-3">
                This is your listing
              </div>
            ) : (
              <div className="text-center text-gray-500 py-3">
                This item is no longer available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
