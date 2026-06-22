import { prisma } from '@/lib/db'
import { Badge } from '@/components/ui/Badge'
import { Users, Shield, Store, ShoppingBag } from 'lucide-react'
import { formatDate } from '@/lib/utils'

async function getUsers() {
  return prisma.user.findMany({
    include: {
      store: { select: { id: true, name: true, status: true } },
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function AdminUsersPage() {
  const users = await getUsers()

  const roleIcon = (role: string) => {
    if (role === 'SUPER_ADMIN') return <Shield className="w-3.5 h-3.5" />
    if (role === 'STORE_OWNER') return <Store className="w-3.5 h-3.5" />
    return <ShoppingBag className="w-3.5 h-3.5" />
  }

  const roleVariant = (role: string) => {
    if (role === 'SUPER_ADMIN') return 'orange' as const
    if (role === 'STORE_OWNER') return 'blue' as const
    return 'gray' as const
  }

  const roleLabel = (role: string) => {
    if (role === 'SUPER_ADMIN') return 'Super Admin'
    if (role === 'STORE_OWNER') return 'Seller'
    return 'Customer'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">User Management</p>
        <h1 className="font-display text-2xl font-bold text-gray-900">All Users</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} registered accounts</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Customers', count: users.filter(u => u.role === 'CUSTOMER').length, variant: 'gray' as const },
          { label: 'Sellers', count: users.filter(u => u.role === 'STORE_OWNER').length, variant: 'blue' as const },
          { label: 'Admins', count: users.filter(u => u.role === 'SUPER_ADMIN').length, variant: 'orange' as const },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className="font-display text-2xl font-bold text-gray-900">{s.count}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex items-center gap-3">
          <Users className="w-4 h-4 text-orange-500" />
          <h2 className="font-display text-sm font-bold text-gray-900">User Accounts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Store</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Orders</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm flex-shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={roleVariant(user.role)}>
                      {roleIcon(user.role)}
                      {roleLabel(user.role)}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    {user.store ? (
                      <div>
                        <p className="text-sm text-gray-900">{user.store.name}</p>
                        <Badge variant={user.store.status === 'APPROVED' ? 'verified' : user.store.status === 'REJECTED' ? 'rejected' : 'pending'} className="mt-1">
                          {user.store.status}
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-medium text-gray-700">{user._count.orders}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-gray-500">{formatDate(user.createdAt)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
