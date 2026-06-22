import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [totalUsers, totalStores, totalProducts, pendingStores, pendingProducts, sales] = await Promise.all([
    prisma.user.count(),
    prisma.store.count({ where: { status: 'APPROVED' } }),
    prisma.product.count({ where: { status: 'VERIFIED' } }),
    prisma.store.count({ where: { status: 'PENDING' } }),
    prisma.product.count({ where: { status: 'PENDING' } }),
    prisma.sale.aggregate({ _sum: { amountBirr: true, commissionBirr: true } }),
  ])

  return NextResponse.json({
    totalUsers, totalStores, totalProducts, pendingStores, pendingProducts,
    totalRevenue: sales._sum.amountBirr ?? 0,
    totalCommission: sales._sum.commissionBirr ?? 0,
  })
}
