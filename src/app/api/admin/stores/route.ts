import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const stores = await prisma.store.findMany({
    where: status ? { status: status as any } : {},
    include: { owner: { select: { id: true, name: true, email: true } }, _count: { select: { products: true, sales: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(stores)
}

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { storeId, status, rejectionReason } = await req.json()
  const store = await prisma.store.update({ where: { id: storeId }, data: { status, rejectionReason } })
  return NextResponse.json(store)
}
