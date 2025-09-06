import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: params.id }
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    if (cartItem.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden - You can only remove your own cart items' },
        { status: 403 }
      )
    }

    await prisma.cartItem.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: 'Item removed from cart successfully'
    })
  } catch (error) {
    console.error('Remove from cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
