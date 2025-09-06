import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, generateTokens, createAuthCookies } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token not found' },
        { status: 401 }
      )
    }

    const payload = verifyToken(refreshToken)
    if (!payload || payload.type !== 'refresh') {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      )
    }

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        createdAt: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id, user.email)
    const cookies = createAuthCookies(accessToken, newRefreshToken)

    const response = NextResponse.json({
      user,
      message: 'Tokens refreshed successfully'
    })

    // Set new cookies
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
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
