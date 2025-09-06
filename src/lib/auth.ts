import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { prisma } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'
const ACCESS_TOKEN_EXPIRY = '15m'
const REFRESH_TOKEN_EXPIRY = '7d'

export interface JWTPayload {
  userId: string
  email: string
  type: 'access' | 'refresh'
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateTokens(userId: string, email: string) {
  const accessToken = jwt.sign(
    { userId, email, type: 'access' } as JWTPayload,
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  )

  const refreshToken = jwt.sign(
    { userId, email, type: 'refresh' } as JWTPayload,
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  )

  return { accessToken, refreshToken }
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function getUserFromRequest(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value
  
  if (!token) {
    return null
  }

  const payload = verifyToken(token)
  if (!payload || payload.type !== 'access') {
    return null
  }

  try {
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
    return user
  } catch {
    return null
  }
}

export function createAuthCookies(accessToken: string, refreshToken: string) {
  return [
    {
      name: 'accessToken',
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    },
    {
      name: 'refreshToken',
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    },
  ]
}

export function clearAuthCookies() {
  return [
    {
      name: 'accessToken',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 0,
      path: '/',
    },
    {
      name: 'refreshToken',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 0,
      path: '/',
    },
  ]
}
