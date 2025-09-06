'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardPage() {
  const { user, updateProfile, logout } = useAuth()
  const router = useRouter()
  
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState(user?.username || '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to view your dashboard
          </h1>
          <Link
            href="/auth/login"
            className="text-green-600 hover:text-green-500"
          >
            Go to login
          </Link>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    setError('')
    setLoading(true)

    try {
      await updateProfile({
        username: username || undefined,
        avatarUrl: avatarUrl || undefined,
      })
      setIsEditing(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setUsername(user?.username || '')
    setAvatarUrl(user?.avatarUrl || '')
    setIsEditing(false)
    setError('')
  }

  const handleDeleteAccount = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/users/delete', {
        method: 'DELETE',
      })
      
      if (response.ok) {
        await logout()
        router.push('/')
      } else {
        setError('Failed to delete account')
      }
    } catch (error) {
      setError('Failed to delete account')
    } finally {
      setLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{backgroundColor: '#F5F0E6', minHeight: '100vh'}}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{color: '#333333'}}>Dashboard</h1>
        <p className="mt-2" style={{color: '#666666'}}>Manage your profile and account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6" style={{borderColor: '#E0E0E0', border: '1px solid'}}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{color: '#333333'}}>Profile Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="font-medium transition-colors hover:opacity-80" style={{color: '#2E7D32'}}
                >
                  Edit Profile
                </button>
              )}
            </div>

            {error && (
              <div className="px-4 py-3 rounded-md mb-4" style={{backgroundColor: '#FFEBEE', borderColor: '#FFCDD2', color: '#D32F2F', border: '1px solid'}}>
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center relative overflow-hidden" style={{background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)'}}>
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-2xl">
                      {(user.username || user.email).charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium" style={{color: '#333333'}}>
                    {user.username || 'No username set'}
                  </h3>
                  <p style={{color: '#666666'}}>{user.email}</p>
                  {isEditing && (
                    <label className="mt-2 cursor-pointer inline-flex items-center px-3 py-1 text-sm rounded-md transition-colors hover:opacity-80" style={{backgroundColor: '#A5D6A7', color: '#333333'}}>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (e) => {
                              setAvatarUrl(e.target?.result as string)
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs mt-1" style={{color: '#666666'}}>Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter a username"
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-colors" style={{borderColor: '#E0E0E0', color: '#333333', backgroundColor: 'white'}} onFocus={(e) => {e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 2px rgba(46, 125, 50, 0.2)'}} onBlur={(e) => {e.target.style.borderColor = '#E0E0E0'; e.target.style.boxShadow = 'none'}}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{color: '#333333'}}>
                    Profile Image URL
                  </label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://example.com/profile.jpg"
                    className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:ring-2 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    style={{
                      focusRingColor: '#2E7D32',
                      color: '#333333'
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Member Since
                  </label>
                  <input
                    type="text"
                    value={new Date(user.createdAt).toLocaleDateString()}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="text-white px-4 py-2 rounded-md transition-colors hover:opacity-90 disabled:opacity-50" style={{backgroundColor: '#2E7D32'}}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-4 py-2 rounded-md transition-colors hover:opacity-80" style={{backgroundColor: '#E0E0E0', color: '#333333'}}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6" style={{borderColor: '#E0E0E0', border: '1px solid'}}>
            <h3 className="text-lg font-semibold mb-4" style={{color: '#333333'}}>Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/my/listings"
                className="block w-full text-left px-4 py-3 rounded-md transition-colors hover:opacity-90" style={{backgroundColor: '#A5D6A7', color: '#333333'}}
              >
                <div className="font-medium">My Listings</div>
                <div className="text-sm">Manage your products</div>
              </Link>
              
              <Link
                href="/orders"
                className="block w-full text-left px-4 py-3 rounded-md transition-colors hover:opacity-90" style={{backgroundColor: '#81C784', color: '#333333'}}
              >
                <div className="font-medium">Order History</div>
                <div className="text-sm">View past purchases</div>
              </Link>
              
              <Link
                href="/cart"
                className="block w-full text-left px-4 py-3 rounded-md transition-colors hover:opacity-90" style={{backgroundColor: '#FFB74D', color: '#333333'}}
              >
                <div className="font-medium">Shopping Cart</div>
                <div className="text-sm">Review cart items</div>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6" style={{borderColor: '#E0E0E0', border: '1px solid'}}>
            <h3 className="text-lg font-semibold mb-4" style={{color: '#333333'}}>Account</h3>
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full text-white px-4 py-2 rounded-md transition-colors hover:opacity-90" style={{backgroundColor: '#666666'}}
              >
                Logout
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full text-white px-4 py-2 rounded-md transition-colors hover:opacity-90" style={{backgroundColor: '#D32F2F'}}
              >
                Delete Account
              </button>
            </div>
          </div>

          {/* Delete Account Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 flex items-center justify-center z-50" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" style={{borderColor: '#E0E0E0', border: '1px solid'}}>
                <h3 className="text-lg font-semibold mb-4" style={{color: '#333333'}}>
                  Delete Account
                </h3>
                <p className="mb-6" style={{color: '#666666'}}>
                  Are you sure you want to delete your account? This action cannot be undone. 
                  All your listings, orders, and data will be permanently removed.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="flex-1 text-white px-4 py-2 rounded-md transition-colors hover:opacity-90 disabled:opacity-50" style={{backgroundColor: '#D32F2F'}}
                  >
                    {loading ? 'Deleting...' : 'Yes, Delete Account'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={loading}
                    className="flex-1 px-4 py-2 rounded-md transition-colors hover:opacity-80" style={{backgroundColor: '#E0E0E0', color: '#333333'}}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
