import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: true
      }
    })

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Check if all products are still available
    for (const item of cartItems) {
      if (item.product.status !== 'Available') {
        return NextResponse.json(
          { error: `Product "${item.product.title}" is no longer available` },
          { status: 400 }
        )
      }
    }

    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

    // Create order and order items in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: {
          buyerId: user.id,
          total,
        }
      })

      // Create order items
      const orderItems = await Promise.all(
        cartItems.map(item =>
          tx.orderItem.create({
            data: {
              orderId: order.id,
              productId: item.productId,
              price: item.product.price,
              quantity: item.quantity,
            }
          })
        )
      )

      // Mark products as sold
      await Promise.all(
        cartItems.map(item =>
          tx.product.update({
            where: { id: item.productId },
            data: { status: 'Sold' }
          })
        )
      )

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { userId: user.id }
      })

      return { order, orderItems }
    })

    // Fetch complete order with items and products
    const completeOrder = await prisma.order.findUnique({
      where: { id: result.order.id },
      include: {
        items: {
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
        }
      }
    })

    return NextResponse.json({
      order: completeOrder,
      message: 'Order created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
