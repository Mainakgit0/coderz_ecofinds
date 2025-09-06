'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    title: string
    price: number
    imageUrl?: string
    category: string
    owner: {
      id: string
      username?: string
      email: string
    }
  }
}

interface CartContextType {
  items: CartItem[]
  total: number
  count: number
  itemCount: number
  loading: boolean
  addToCart: (productId: string, quantity?: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  checkout: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchCart = async () => {
    if (!user) {
      setItems([])
      setTotal(0)
      setCount(0)
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/cart', {
        credentials: 'include' // Include cookies for authentication
      })
      if (response.ok) {
        const data = await response.json()
        setItems(data.items)
        setTotal(data.total)
        setCount(data.count)
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!user) throw new Error('Please log in to add items to cart')

    // Check if item already exists in cart
    const existingItem = items.find(item => item.product.id === productId)
    if (existingItem) {
      throw new Error('Item already in cart')
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({ productId, quantity: 1 }), // Always add quantity 1
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to add to cart')
      }

      await fetchCart()
    } catch (error) {
      console.error('Failed to add to cart:', error)
      throw error
    }
  }

  const removeFromCart = async (itemId: string) => {
    const response = await fetch(`/api/cart/${itemId}`, {
      method: 'DELETE',
      credentials: 'include' // Include cookies for authentication
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to remove from cart')
    }

    await fetchCart()
  }

  const clearCart = async () => {
    // Remove all items one by one
    await Promise.all(items.map(item => removeFromCart(item.id)))
  }

  const checkout = async () => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      credentials: 'include' // Include cookies for authentication
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Checkout failed')
    }

    // Cart will be cleared automatically by the API
    await fetchCart()
  }

  const refreshCart = async () => {
    await fetchCart()
  }

  useEffect(() => {
    fetchCart()
  }, [user])

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        count,
        itemCount: count,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        checkout,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
