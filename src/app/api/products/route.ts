import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const q = searchParams.get('q')
  const featured = searchParams.get('featured')

  const products = await prisma.product.findMany({
    where: {
      status: 'VERIFIED',
      store: { status: 'APPROVED' },
      ...(category && category !== 'ALL' ? { category: category as any } : {}),
      ...(q ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] } : {}),
      ...(featured === 'true' ? { featured: true } : {}),
    },
    include: { store: { select: { id: true, name: true, city: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || !['STORE_OWNER', 'SUPER_ADMIN'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const data = await req.json()
    const store = await prisma.store.findFirst({ where: { ownerId: session.sub } })
    if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    const product = await prisma.product.create({ data: { ...data, storeId: store.id, status: 'PENDING' } })
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
