'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
export default function Navbar() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b" style={{borderColor: '#E0E0E0'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold" style={{color: '#2E7D32'}}>
                EcoFinds
              </span>
            </Link>
          </div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link
                  href="/marketplace"
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-green-700"
                  style={{color: '#333333'}}
                >
                  Browse
                </Link>
                <Link
                  href="/my/listings"
                  className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:opacity-90"
                  style={{backgroundColor: '#FF9800'}}
                >
                  List Product
                </Link>
                <Link
                  href="/orders"
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-green-700"
                  style={{color: '#333333'}}
                >
                  Orders
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/marketplace"
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-green-700"
                  style={{color: '#333333'}}
                >
                  Browse
                </Link>
                <Link
                  href="/auth/login"
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-green-700"
                  style={{color: '#333333'}}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:opacity-90"
                  style={{backgroundColor: '#FF9800'}}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Right side - Cart, Profile */}
          <div className="flex items-center space-x-3">

            {/* Cart */}
            {user && (
              <Link
                href="/cart"
                className="relative p-2 transition-colors"
                style={{color: '#333333'}}
                onMouseEnter={(e) => e.currentTarget.style.color = '#2E7D32'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#333333'}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold" style={{backgroundColor: '#FF9800'}}>
                    {itemCount}
                  </span>
                )}
              </Link>
            )}

            {/* Profile/Logout */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/dashboard"
                  className="p-2 rounded-lg transition-colors"
                  style={{color: '#333333'}}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#2E7D32'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#333333'}
                  title="Profile"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
                  style={{backgroundColor: '#FF9800'}}
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>


          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus:outline-none transition-colors"
              style={{color: '#333333'}}
              onMouseEnter={(e) => e.currentTarget.style.color = '#2E7D32'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#333333'}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/90 backdrop-blur-md border-t" style={{borderColor: '#E0E0E0'}}>
              {user ? (
                <>
                  <Link
                    href="/marketplace"
                    className="block px-3 py-2 rounded-md text-base font-medium transition-colors hover:text-green-700"
                    style={{color: '#333333'}}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Browse
                  </Link>
                  <Link
                    href="/my/listings"
                    className="block px-3 py-2 rounded-md text-base font-medium transition-colors hover:text-green-700"
                    style={{color: '#333333'}}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    List Product
                  </Link>
                  <Link
                    href="/cart"
                    className="block px-3 py-2 rounded-md text-base font-medium flex items-center transition-colors hover:text-green-700"
                    style={{color: '#333333'}}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cart
                    {itemCount > 0 && (
                      <span className="ml-2 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold" style={{backgroundColor: '#FF9800'}}>
                        {itemCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-3 py-2 rounded-md text-base font-medium transition-colors hover:text-green-700"
                    style={{color: '#333333'}}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium transition-colors hover:text-green-700"
                    style={{color: '#333333'}}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors hover:opacity-90"
                    style={{color: '#FF9800'}}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block px-3 py-2 rounded-md text-base font-medium transition-colors hover:text-green-700"
                    style={{color: '#333333'}}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block px-3 py-2 rounded-md text-base font-medium transition-colors hover:text-green-700"
                    style={{color: '#2E7D32'}}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
