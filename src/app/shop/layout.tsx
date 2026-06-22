import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CustomerNav } from '@/components/layout/CustomerNav'

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role === 'SUPER_ADMIN') redirect('/admin/dashboard')

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNav user={{ name: session.name, email: session.email, role: session.role }} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  )
}
