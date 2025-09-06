import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'
import { productSchema, searchSchema } from '@/lib/validations'
import { Category } from '@prisma/client'

function getOrderBy(sort: string) {
  switch (sort) {
    case 'price-low':
      return { price: 'asc' as const }
    case 'price-high':
      return { price: 'desc' as const }
    case 'title':
      return { title: 'asc' as const }
    case 'oldest':
      return { createdAt: 'asc' as const }
    case 'newest':
    default:
      return { createdAt: 'desc' as const }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const sort = searchParams.get('sort') || 'newest'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    console.log('API Search params:', { search, category, sort, page, limit })

    const whereClause = {
      status: 'Available',
      ...(search && {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
          { brand: { contains: search } },
          { color: { contains: search } },
          { material: { contains: search } },
          { location: { contains: search } },
        ],
      }),
      ...(category && { category: category as Category }),
    }

    console.log('Where clause:', JSON.stringify(whereClause, null, 2))

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              username: true,
            },
          },
        },
        orderBy: getOrderBy(sort),
        skip,
        take: limit,
      }),
      prisma.product.count({
        where: whereClause,
      })
    ])

    console.log('Found products:', products.length, 'Total:', total)

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get products error:', error)
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
    const validatedData = productSchema.parse(body)

    const product = await prisma.product.create({
      data: {
        ...validatedData,
        ownerId: user.id,
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json({
      product,
      message: 'Product created successfully'
    }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error },
        { status: 400 }
      )
    }

    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
