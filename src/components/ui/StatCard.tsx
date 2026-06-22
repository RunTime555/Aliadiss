import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon?: LucideIcon
  trend?: { value: number; label: string }
  accent?: boolean
  className?: string
}

export function StatCard({ label, value, icon: Icon, trend, accent, className }: StatCardProps) {
  return (
    <div className={cn('card p-5 hover:shadow-card-hover transition-shadow', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">{label}</p>
          <p className={cn('text-2xl font-display font-bold', accent ? 'text-orange-500' : 'text-gray-900')}>{value}</p>
          {trend && (
            <p className={cn('text-xs mt-1.5 font-medium', trend.value >= 0 ? 'text-emerald-600' : 'text-red-500')}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', accent ? 'bg-orange-50' : 'bg-gray-50')}>
            <Icon className={cn('w-5 h-5', accent ? 'text-orange-500' : 'text-gray-500')} />
          </div>
        )}
      </div>
    </div>
  )
}
