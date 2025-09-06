'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signup } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signup(email, password, username || undefined)
      router.push('/')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{backgroundColor: '#F5F0E6'}}>
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 rounded-lg flex items-center justify-center" style={{backgroundColor: '#2E7D32'}}>
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold" style={{color: '#333333'}}>
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm" style={{color: '#666666'}}>
            Or{' '}
            <Link
              href="/auth/login"
              className="font-medium transition-colors hover:opacity-80"
              style={{color: '#2E7D32'}}
            >
              sign in to existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="px-4 py-3 rounded-md" style={{backgroundColor: '#FFEBEE', borderColor: '#FFCDD2', color: '#D32F2F', border: '1px solid'}}>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium" style={{color: '#333333'}}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium" style={{color: '#333333'}}>
                Username (optional)
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium" style={{color: '#333333'}}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Create a password (min 8 characters)"
              />
              <p className="mt-1 text-xs" style={{color: '#666666'}}>
                Password must be at least 8 characters long
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:opacity-90"
              style={{backgroundColor: '#2E7D32'}}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm transition-colors hover:opacity-80"
              style={{color: '#2E7D32'}}
            >
              ← Back to home
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
