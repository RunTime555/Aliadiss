'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingCart, Package, LogOut, User, Search, Bell } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface CustomerNavProps {
  user: { name: string; email: string; role: string }
  cartCount?: number
}

export function CustomerNav({ user, cartCount = 0 }: CustomerNavProps) {
  const pathname = usePathname()
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    toast.success('Signed out')
    router.push('/login')
    router.refresh()
  }

  const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/shop/categories', label: 'Categories' },
    { href: '/shop/stores', label: 'Stores' },
    { href: '/shop/deals', label: 'Deals' },
  ]

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top bar */}
        <div className="flex items-center h-16 gap-6">
          <Logo size="sm" />

          {/* Search */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search phones, laptops, accessories..."
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            <button className="btn-ghost p-2.5 relative">
              <Bell className="w-5 h-5" />
            </button>

            <Link href="/shop/cart" className="btn-ghost p-2.5 relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900 leading-none">{user.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">Customer</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm">
                {user.name.charAt(0)}
              </div>
              <button onClick={logout} className="btn-ghost p-2 text-gray-400 hover:text-red-500" title="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex items-center gap-1 h-10 -mx-2">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                pathname === link.href || pathname.startsWith(link.href + '/')
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/shop/orders" className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5', pathname.startsWith('/shop/orders') ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50')}>
            <Package className="w-3.5 h-3.5" />
            My Orders
          </Link>
        </nav>
      </div>
    </header>
  )
}
