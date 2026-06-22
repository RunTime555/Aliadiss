import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBirr(amount: number): string {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-ET', { dateStyle: 'medium' }).format(new Date(date))
}

export const WARRANTY_LABELS = { OFFICIAL: 'Official Warranty', SELLER: 'Seller Warranty', NONE: 'No Warranty' }
export const CATEGORY_LABELS = { PHONE: 'Phone', LAPTOP: 'Laptop', ACCESSORY: 'Accessory', OTHER: 'Other' }
export const CATEGORY_EMOJI: Record<string, string> = { PHONE: '📱', LAPTOP: '💻', ACCESSORY: '🎧', OTHER: '📦' }
