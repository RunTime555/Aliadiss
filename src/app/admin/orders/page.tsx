import { prisma } from '@/lib/db'
import { Badge } from '@/components/ui/Badge'
import { ShoppingBag, TrendingUp } from 'lucide-react'
import { formatBirr, formatDate } from '@/lib/utils'

async function getSalesData() {
  const [sales, totalRevenue, totalCommission] = await Promise.all([
    prisma.sale.findMany({
      include: {
        store: { select: { name: true } },
        product: { select: { title: true, category: true } },
        order: { select: { id: true, status: true, customer: { select: { name: true, email: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    prisma.sale.aggregate({ _sum: { amountBirr: true } }),
    prisma.sale.aggregate({ _sum: { commissionBirr: true } }),
  ])
  return { sales, totalRevenue: totalRevenue._sum.amountBirr ?? 0, totalCommission: totalCommission._sum.commissionBirr ?? 0 }
}

export default async function AdminOrdersPage() {
  const { sales, totalRevenue, totalCommission } = await getSalesData()

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">Revenue & Orders</p>
        <h1 className="font-display text-2xl font-bold text-gray-900">Sales Ledger</h1>
        <p className="text-gray-500 text-sm mt-1">All transactions and commission tracking</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-2">Total Transactions</p>
          <p className="font-display text-2xl font-bold text-gray-900">{sales.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-2">Gross Revenue</p>
          <p className="font-display text-2xl font-bold text-gray-900">{formatBirr(totalRevenue)}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-2">Platform Commission (5%)</p>
          <p className="font-display text-2xl font-bold text-orange-500">{formatBirr(totalCommission)}</p>
        </div>
      </div>

      {/* Sales table */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex items-center gap-3">
          <TrendingUp className="w-4 h-4 text-orange-500" />
          <h2 className="font-display text-sm font-bold text-gray-900">Transaction History</h2>
        </div>

        {sales.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="font-medium text-gray-700">No sales yet</p>
            <p className="text-sm text-gray-400 mt-1">Transactions will appear here once orders are placed</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Store</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Commission</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sales.map(sale => (
                  <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{sale.product.title}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-gray-600">{sale.store.name}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-gray-900">{sale.order.customer.name}</p>
                      <p className="text-xs text-gray-400">{sale.order.customer.email}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-bold text-gray-900">{formatBirr(sale.amountBirr)}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-orange-500">+{formatBirr(sale.commissionBirr)}</p>
                      <p className="text-xs text-gray-400">{Math.round(sale.commissionRate * 100)}%</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={sale.order.status === 'DELIVERED' ? 'verified' : sale.order.status === 'CANCELLED' ? 'rejected' : 'pending'}>
                        {sale.order.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-gray-500">{formatDate(sale.createdAt)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
