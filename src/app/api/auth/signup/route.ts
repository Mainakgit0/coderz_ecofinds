import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword, generateTokens, createAuthCookies } from '@/lib/auth'
import { signupSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = signupSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(validatedData.password)
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        username: validatedData.username,
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        createdAt: true,
      }
    })

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.email)
    const cookies = createAuthCookies(accessToken, refreshToken)

    const response = NextResponse.json({
      user,
      message: 'User created successfully'
    }, { status: 201 })

    // Set cookies
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
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error },
        { status: 400 }
      )
    }

    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
