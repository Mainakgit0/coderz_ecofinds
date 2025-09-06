import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { cartItemSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            owner: {
              select: {
                id: true,
                username: true,
                email: true,
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

    return NextResponse.json({
      items: cartItems,
      total,
      count: cartItems.length
    })
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = cartItemSchema.parse(body)

    // Check if product exists and is available
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    if (product.status !== 'Available') {
      return NextResponse.json(
        { error: 'Product is not available' },
        { status: 400 }
      )
    }

    if (product.ownerId === user.id) {
      return NextResponse.json(
        { error: 'You cannot add your own product to cart' },
        { status: 400 }
      )
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: validatedData.productId
        }
      }
    })

    let cartItem
    if (existingItem) {
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + validatedData.quantity },
        include: {
          product: {
            include: {
              owner: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                }
              }
            }
          }
        }
      })
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: user.id,
          productId: validatedData.productId,
          quantity: validatedData.quantity,
        },
        include: {
          product: {
            include: {
              owner: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                }
              }
            }
          }
        }
      })
    }

    return NextResponse.json({
      item: cartItem,
      message: 'Item added to cart successfully'
    }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error },
        { status: 400 }
      )
    }

    console.error('Add to cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
