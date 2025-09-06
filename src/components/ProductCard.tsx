'use client'

import Link from 'next/link'
import { useState } from 'react'
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
  owner: {
    id: string
    username?: string
    email: string
  }
}

interface ProductCardProps {
  product: Product
  showActions?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onUpdate?: () => void
}

export default function ProductCard({ 
  product, 
  showActions = false, 
  onEdit, 
  onDelete 
}: ProductCardProps) {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) return
    
    try {
      setIsAddingToCart(true)
      await addToCart(product.id)
    } catch (error) {
      console.error('Failed to add to cart:', error)
      alert(error instanceof Error ? error.message : 'Failed to add to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const isOwner = user?.id === product.owner.id
  const canAddToCart = user && !isOwner && product.status === 'Available'

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border" style={{borderColor: '#E0E0E0'}}>
      <Link href={`/product/${product.id}`}>
        <div className="aspect-w-16 aspect-h-12 bg-gray-200">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
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
      </Link>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2" style={{color: '#333333'}}>
          {product.title}
        </h3>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold" style={{color: '#2E7D32'}}>
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-medium" style={{
            backgroundColor: product.condition === 'Excellent' ? '#A5D6A7' :
                           product.condition === 'Good' ? '#81C784' :
                           product.condition === 'Fair' ? '#FFB74D' : '#FFAB91',
            color: '#333333'
          }}>
            {product.condition}
          </span>
        </div>

        <p className="text-sm mb-3 line-clamp-2" style={{color: '#666666'}}>
          {product.description}
        </p>

        {/* Basic Product Info - Only show essential details */}
        <div className="space-y-1 mb-3">
          {product.brand && (
            <div className="flex items-center text-xs" style={{color: '#666666'}}>
              <span className="font-medium">Brand:</span>
              <span className="ml-1">{product.brand}</span>
            </div>
          )}
          {product.location && (
            <div className="flex items-center text-xs" style={{color: '#666666'}}>
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {product.location}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-sm px-2 py-1 rounded" style={{color: '#666666', backgroundColor: '#F5F0E6'}}>
            {product.category}
          </span>
        </div>

        <div className="text-sm mb-3" style={{color: '#666666'}}>
          Seller: {product.owner.username || product.owner.email}
        </div>

        {showActions && isOwner ? (
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm transition-colors"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm transition-colors"
            >
              Delete
            </button>
          </div>
        ) : canAddToCart ? (
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="w-full text-white py-2 px-4 rounded-md text-sm transition-colors hover:opacity-90 disabled:opacity-50"
            style={{backgroundColor: '#FF9800'}}
          >
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        ) : !user ? (
          <Link
            href="/auth/login"
            className="block w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md text-sm text-center transition-colors"
          >
            Login to Buy
          </Link>
        ) : null}
      </div>
    </div>
  )
}
