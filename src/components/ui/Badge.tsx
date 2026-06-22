import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'verified' | 'pending' | 'rejected' | 'orange' | 'gray' | 'blue'
  children: React.ReactNode
  className?: string
}

const variants = {
  verified: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  pending: 'bg-amber-50 text-amber-700 border border-amber-100',
  rejected: 'bg-red-50 text-red-600 border border-red-100',
  orange: 'bg-orange-50 text-orange-700 border border-orange-100',
  gray: 'bg-gray-50 text-gray-600 border border-gray-100',
  blue: 'bg-blue-50 text-blue-700 border border-blue-100',
}

export function Badge({ variant = 'gray', children, className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}
