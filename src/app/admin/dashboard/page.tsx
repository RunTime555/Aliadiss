import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'
import { Users, Store, Package, TrendingUp, Clock, CheckCircle, ShoppingBag } from 'lucide-react'
import { formatBirr, formatDate } from '@/lib/utils'
import Link from 'next/link'

async function getDashboardData() {
  const [totalUsers, approvedStores, totalStores, pendingStores, verifiedProducts, totalProducts, pendingProducts, totalOrders, sales, recentStores, recentSales] = await Promise.all([
    prisma.user.count(),
    prisma.store.count({ where: { status: 'APPROVED' } }),
    prisma.store.count(),
    prisma.store.count({ where: { status: 'PENDING' } }),
    prisma.product.count({ where: { status: 'VERIFIED' } }),
    prisma.product.count(),
    prisma.product.count({ where: { status: 'PENDING' } }),
    prisma.order.count(),
    prisma.sale.aggregate({ _sum: { amountBirr: true, commissionBirr: true } }),
    prisma.store.findMany({ where: { status: 'PENDING' }, include: { owner: { select: { name: true, email: true } } }, take: 5, orderBy: { createdAt: 'desc' } }),
    prisma.sale.findMany({ include: { store: { select: { name: true } }, product: { select: { title: true } } }, take: 6, orderBy: { createdAt: 'desc' } }),
  ])
  return { totalUsers, approvedStores, totalStores, pendingStores, verifiedProducts, totalProducts, pendingProducts, totalOrders, totalRevenue: sales._sum.amountBirr ?? 0, totalCommission: sales._sum.commissionBirr ?? 0, recentStores, recentSales }
}

export default async function AdminDashboard() {
  const session = await getSession()
  const d = await getDashboardData()
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">Admin Dashboard</p>
        <h1 className="font-display text-2xl font-bold text-gray-900">Good day, <span className="text-orange-500">{session?.name.split(' ')[0]}</span> 👋</h1>
        <p className="text-gray-500 text-sm mt-1">{new Date().toLocaleDateString('en-ET', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      {(d.pendingStores > 0 || d.pendingProducts > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Action required</p>
            <p className="text-sm text-amber-700 mt-0.5">
              {d.pendingStores > 0 && `${d.pendingStores} store${d.pendingStores > 1 ? 's' : ''} awaiting verification. `}
              {d.pendingProducts > 0 && `${d.pendingProducts} product${d.pendingProducts > 1 ? 's' : ''} pending review.`}
            </p>
            <div className="flex gap-3 mt-2">
              {d.pendingStores > 0 && <Link href="/admin/stores" className="text-xs font-semibold text-amber-700 underline">Review stores →</Link>}
              {d.pendingProducts > 0 && <Link href="/admin/products" className="text-xs font-semibold text-amber-700 underline">Review products →</Link>}
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={d.totalUsers} icon={Users} />
        <StatCard label="Active Stores" value={`${d.approvedStores}/${d.totalStores}`} icon={Store} />
        <StatCard label="Live Products" value={`${d.verifiedProducts}/${d.totalProducts}`} icon={Package} />
        <StatCard label="Total Orders" value={d.totalOrders} icon={ShoppingBag} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StatCard label="Total Revenue" value={formatBirr(d.totalRevenue)} icon={TrendingUp} accent />
        <StatCard label="Commission Earned" value={formatBirr(d.totalCommission)} icon={TrendingUp} accent />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <div><h2 className="font-display text-sm font-bold text-gray-900">Pending Store Approvals</h2><p className="text-xs text-gray-400 mt-0.5">Stores awaiting credential verification</p></div>
            <Link href="/admin/stores" className="text-xs font-medium text-orange-500 hover:text-orange-600">View all →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {d.recentStores.length === 0 ? (
              <div className="p-8 text-center"><CheckCircle className="w-8 h-8 text-emerald-300 mx-auto mb-2" /><p className="text-sm text-gray-500">All stores reviewed!</p></div>
            ) : d.recentStores.map(store => (
              <div key={store.id} className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0"><Store className="w-4 h-4 text-orange-500" /></div>
                <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-gray-900 truncate">{store.name}</p><p className="text-xs text-gray-400 truncate">{store.owner.name} · {store.city}</p></div>
                <div className="flex items-center gap-2 flex-shrink-0"><Badge variant="pending">Pending</Badge><Link href="/admin/stores" className="btn-ghost text-xs py-1 px-2">Review</Link></div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <div><h2 className="font-display text-sm font-bold text-gray-900">Recent Sales</h2><p className="text-xs text-gray-400 mt-0.5">Latest transactions on the platform</p></div>
            <Link href="/admin/orders" className="text-xs font-medium text-orange-500 hover:text-orange-600">Full report →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {d.recentSales.length === 0 ? (
              <div className="p-8 text-center"><ShoppingBag className="w-8 h-8 text-gray-200 mx-auto mb-2" /><p className="text-sm text-gray-500">No sales yet</p></div>
            ) : d.recentSales.map(sale => (
              <div key={sale.id} className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0"><ShoppingBag className="w-4 h-4 text-emerald-500" /></div>
                <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-gray-900 truncate">{sale.product.title}</p><p className="text-xs text-gray-400">{sale.store.name} · {formatDate(sale.createdAt)}</p></div>
                <div className="text-right flex-shrink-0"><p className="text-sm font-bold text-gray-900">{formatBirr(sale.amountBirr)}</p><p className="text-xs text-orange-500 font-medium">+{formatBirr(sale.commissionBirr)}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
