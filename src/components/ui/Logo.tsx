import Link from 'next/link'

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'h-8', md: 'h-10', lg: 'h-14' }
  const textSizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-3xl' }
  const subSizes = { sm: 'text-[9px]', md: 'text-[10px]', lg: 'text-xs' }

  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className={`${sizes[size]} aspect-square relative flex-shrink-0`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M15 20 L25 20 L35 65 L85 65 L95 30 L30 30" stroke="#F97316" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M42 62 L55 22 L68 62" stroke="#0A0A0A" strokeWidth="7" strokeLinecap="round" fill="none"/>
          <path d="M46 48 L64 48" stroke="#0A0A0A" strokeWidth="6" strokeLinecap="round"/>
          <circle cx="42" cy="76" r="6" fill="#F97316"/>
          <circle cx="72" cy="76" r="6" fill="#F97316"/>
        </svg>
      </div>
      <div>
        <div className={`font-display font-bold ${textSizes[size]} text-gray-900 leading-none tracking-tight`}>
          Ali<span className="text-orange-500">Addis</span>
        </div>
        <div className={`${subSizes[size]} text-gray-400 font-medium tracking-widest uppercase mt-0.5`}>
          Verified Marketplace
        </div>
      </div>
    </Link>
  )
}
