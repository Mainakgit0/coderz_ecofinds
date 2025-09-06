'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        // If user is logged in, redirect to marketplace
        router.push('/marketplace')
      } else {
        // If user is not logged in, redirect to login
        router.push('/auth/login')
      }
    }
  }, [user, loading, router])

  // Show loading spinner while checking auth state
  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#F5F0E6'}}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style={{borderColor: '#2E7D32'}}></div>
        <p className="text-lg" style={{color: '#333333'}}>Loading EcoFinds...</p>
      </div>
    </div>
  )
}
