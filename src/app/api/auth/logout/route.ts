import { NextRequest, NextResponse } from 'next/server'
import { clearAuthCookies } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const cookies = clearAuthCookies()
    const response = NextResponse.json({ message: 'Logout successful' })

    // Clear cookies
    cookies.forEach(cookie => {
      response.cookies.set(cookie.name, cookie.value, {
        httpOnly: cookie.httpOnly,
        secure: cookie.secure,
        sameSite: cookie.sameSite,
        maxAge: cookie.maxAge,
        path: cookie.path,
      })
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
