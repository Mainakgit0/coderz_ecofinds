'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'

export default function CartPage() {
  const { user } = useAuth()
  const { items, total, removeFromCart, checkout, loading } = useCart()
  const router = useRouter()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to remove item')
    }
  }

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true)
      await checkout()
      alert('Order placed successfully!')
      router.push('/orders')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Checkout failed')
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{color: '#333333'}}>
            Please log in to view your cart
          </h1>
          <Link
            href="/auth/login"
            className="transition-colors hover:opacity-90"
            style={{color: '#2E7D32'}}
          >
            Go to login
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow">
                <div className="flex space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="flex items-center mb-4 transition-colors hover:opacity-90"
          style={{color: '#2E7D32'}}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Continue shopping
        </Link>
        <h1 className="text-3xl font-bold" style={{color: '#333333'}}>Shopping Cart</h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="w-24 h-24 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
            />
          </svg>
          <h2 className="text-xl font-semibold mb-2" style={{color: '#333333'}}>Your cart is empty</h2>
          <p className="mb-6" style={{color: '#666666'}}>Start shopping to add items to your cart</p>
          <Link
            href="/"
            className="inline-block text-white px-6 py-3 rounded-lg transition-colors hover:opacity-90"
            style={{backgroundColor: '#FF9800'}}
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4">
                  <Link href={`/product/${item.product.id}`}>
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-gray-400"
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
                  </Link>

                  <div className="flex-1">
                    <Link
                      href={`/product/${item.product.id}`}
                      className="text-lg font-semibold transition-colors hover:opacity-90"
                      style={{color: '#333333'}}
                    >
                      {item.product.title}
                    </Link>
                    <p className="text-sm mb-1" style={{color: '#666666'}}>
                      Category: {item.product.category.charAt(0) + item.product.category.slice(1).toLowerCase()}
                    </p>
                    <p className="text-sm" style={{color: '#666666'}}>
                      Seller: {item.product.owner.username || item.product.owner.email}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold mb-2" style={{color: '#333333'}}>
                      ₹{item.product.price.toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm mb-3" style={{color: '#666666'}}>
                      Qty: {item.quantity}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-sm font-medium transition-colors hover:opacity-90"
                      style={{color: '#FF9800'}}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4" style={{color: '#333333'}}>Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span style={{color: '#666666'}}>Items ({items.length})</span>
                  <span className="font-medium" style={{color: '#333333'}}>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{color: '#666666'}}>Shipping</span>
                  <span className="font-medium" style={{color: '#333333'}}>Free</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold" style={{color: '#333333'}}>Total</span>
                    <span className="text-lg font-semibold" style={{color: '#2E7D32'}}>
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || items.length === 0}
                className="w-full text-white py-3 px-4 rounded-lg font-semibold transition-colors hover:opacity-90 disabled:bg-gray-400"
                style={{backgroundColor: '#FF9800'}}
              >
                {isCheckingOut ? 'Processing...' : 'Checkout'}
              </button>

              <p className="text-xs text-gray-500 mt-3 text-center">
                By proceeding to checkout, you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
