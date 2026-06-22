'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Store, Package, ShoppingBag, Users,
  LogOut, ChevronRight, TrendingUp, Settings, Shield
} from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface AdminSidebarProps {
  user: { name: string; email: string }
  pendingStores?: number
  pendingProducts?: number
}

export function AdminSidebar({ user, pendingStores = 0, pendingProducts = 0 }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    toast.success('Signed out')
    router.push('/login')
    router.refresh()
  }

  const links = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/stores', icon: Store, label: 'Stores', badge: pendingStores },
    { href: '/admin/products', icon: Package, label: 'Products', badge: pendingProducts },
    { href: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/revenue', icon: TrendingUp, label: 'Revenue' },
  ]

  return (
    <aside className="w-64 bg-gray-950 min-h-screen flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="h-9 aspect-square">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M15 20 L25 20 L35 65 L85 65 L95 30 L30 30" stroke="#F97316" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M42 62 L55 22 L68 62" stroke="#fff" strokeWidth="7" strokeLinecap="round" fill="none"/>
              <path d="M46 48 L64 48" stroke="#fff" strokeWidth="6" strokeLinecap="round"/>
              <circle cx="42" cy="76" r="6" fill="#F97316"/>
              <circle cx="72" cy="76" r="6" fill="#F97316"/>
            </svg>
          </div>
          <div>
            <div className="font-display font-bold text-lg text-white leading-none">
              Ali<span className="text-orange-500">Addis</span>
            </div>
            <div className="text-[9px] text-gray-500 font-medium tracking-widest uppercase mt-0.5">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Admin badge */}
      <div className="px-4 py-3 mx-3 mt-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-2">
        <Shield className="w-4 h-4 text-orange-400" />
        <span className="text-xs font-medium text-orange-300">Super Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 mt-2 space-y-0.5">
        {links.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                active
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {badge ? (
                <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full', active ? 'bg-white/20 text-white' : 'bg-orange-500 text-white')}>
                  {badge}
                </span>
              ) : (
                <ChevronRight className={cn('w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity', active && 'opacity-100')} />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-800 transition-colors">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <button onClick={logout} className="text-gray-500 hover:text-red-400 transition-colors p-1" title="Sign out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
