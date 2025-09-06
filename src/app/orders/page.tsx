'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

interface OrderItem {
  id: string
  price: number
  quantity: number
  product: {
    id: string
    title: string
    category: string
    imageUrl?: string
    owner: {
      id: string
      username?: string
      email: string
    }
  }
}

interface Order {
  id: string
  total: number
  createdAt: string
  items: OrderItem[]
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return

      try {
        const response = await fetch('/api/orders/me')
        if (response.ok) {
          const data = await response.json()
          setOrders(data.orders)
        } else {
          setError('Failed to load orders')
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error)
        setError('Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{color: '#333333'}}>
            Please log in to view your orders
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
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
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
          Back to home
        </Link>
        <h1 className="text-3xl font-bold" style={{color: '#333333'}}>Order History</h1>
        <p className="mt-2" style={{color: '#666666'}}>View your previous purchases</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
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
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h2 className="text-xl font-semibold mb-2" style={{color: '#333333'}}>No orders yet</h2>
          <p className="mb-6" style={{color: '#666666'}}>Start shopping to see your order history</p>
          <Link
            href="/"
            className="inline-block text-white px-6 py-3 rounded-lg transition-colors hover:opacity-90"
            style={{backgroundColor: '#FF9800'}}
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold" style={{color: '#333333'}}>
                    Order #{order.id.slice(-8)}
                  </h3>
                  <p className="text-sm" style={{color: '#666666'}}>
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold" style={{color: '#2E7D32'}}>
                    ₹{order.total.toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm" style={{color: '#666666'}}>
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <Link href={`/product/${item.product.id}`}>
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-gray-400"
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
                          className="text-lg font-medium transition-colors hover:opacity-90"
                          style={{color: '#333333'}}
                        >
                          {item.product.title}
                        </Link>
                        <p className="text-sm" style={{color: '#666666'}}>
                          Category: {item.product.category.charAt(0) + item.product.category.slice(1).toLowerCase()}
                        </p>
                        <p className="text-sm" style={{color: '#666666'}}>
                          Seller: {item.product.owner.username || item.product.owner.email}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-medium" style={{color: '#333333'}}>
                          ₹{item.price.toLocaleString('en-IN')}
                        </p>
                        <p className="text-sm" style={{color: '#666666'}}>
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
