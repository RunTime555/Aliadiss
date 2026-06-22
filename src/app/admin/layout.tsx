import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { prisma } from '@/lib/db'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role !== 'SUPER_ADMIN') redirect('/shop')

  const [pendingStores, pendingProducts] = await Promise.all([
    prisma.store.count({ where: { status: 'PENDING' } }),
    prisma.product.count({ where: { status: 'PENDING' } }),
  ])

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar user={{ name: session.name, email: session.email }} pendingStores={pendingStores} pendingProducts={pendingProducts} />
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-6 lg:p-8 max-w-[1400px]">
          {children}
        </div>
      </main>
    </div>
  )
}
