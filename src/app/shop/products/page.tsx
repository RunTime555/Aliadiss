import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { ShieldCheck, SlidersHorizontal, ArrowRight } from 'lucide-react'
import { formatBirr, WARRANTY_LABELS, CATEGORY_EMOJI } from '@/lib/utils'

interface PageProps {
  searchParams: { category?: string; q?: string; featured?: string; sort?: string }
}

async function getProducts(params: PageProps['searchParams']) {
  const { category, q, featured, sort } = params
  const orderBy: any =
    sort === 'price_asc' ? { priceBirr: 'asc' } :
    sort === 'price_desc' ? { priceBirr: 'desc' } :
    { createdAt: 'desc' }

  return prisma.product.findMany({
    where: {
      status: 'VERIFIED',
      store: { status: 'APPROVED' },
      ...(category && category !== 'ALL' ? { category: category as any } : {}),
      ...(q ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] } : {}),
      ...(featured === 'true' ? { featured: true } : {}),
    },
    include: { store: { select: { id: true, name: true, city: true } } },
    orderBy,
  })
}

const CATEGORIES = [
  { value: 'ALL', label: 'All' },
  { value: 'PHONE', label: 'Phones' },
  { value: 'LAPTOP', label: 'Laptops' },
  { value: 'ACCESSORY', label: 'Accessories' },
  { value: 'OTHER', label: 'Other' },
]

export default async function ProductsPage({ searchParams }: PageProps) {
  const products = await getProducts(searchParams)
  const activeCategory = searchParams.category ?? 'ALL'
  const activeSort = searchParams.sort ?? 'newest'

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-bold text-gray-900">
            {activeCategory !== 'ALL' ? CATEGORIES.find(c => c.value === activeCategory)?.label : 'All Products'}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{products.length} verified product{products.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            defaultValue={activeSort}
            className="text-sm bg-white border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700"
          >
            <option value="newest">Newest first</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <div className="card p-4 sticky top-24 space-y-6">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Category</p>
              <div className="space-y-1">
                {CATEGORIES.map(cat => (
                  <Link
                    key={cat.value}
                    href={`/shop/products${cat.value !== 'ALL' ? `?category=${cat.value}` : ''}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors w-full ${
                      activeCategory === cat.value
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {cat.value !== 'ALL' && <span>{CATEGORY_EMOJI[cat.value]}</span>}
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Condition</p>
              <div className="space-y-1">
                {['New', 'Used'].map(c => (
                  <label key={c} className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-400" />
                    <span className="text-sm text-gray-600">{c}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
              <div className="flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
                <p className="text-xs font-semibold text-orange-700">Trust layer</p>
              </div>
              <p className="text-xs text-orange-600 leading-relaxed">All products here are from admin-verified stores only.</p>
            </div>
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          {/* Mobile categories */}
          <div className="flex gap-2 overflow-x-auto pb-3 lg:hidden mb-4 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.value}
                href={`/shop/products${cat.value !== 'ALL' ? `?category=${cat.value}` : ''}`}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeCategory === cat.value
                    ? 'bg-orange-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-600'
                }`}
              >
                {cat.value !== 'ALL' && CATEGORY_EMOJI[cat.value] + ' '}{cat.label}
              </Link>
            ))}
          </div>

          {products.length === 0 ? (
            <div className="card p-16 text-center">
              <span className="text-5xl">🔍</span>
              <p className="font-display font-bold text-gray-900 mt-4">No products found</p>
              <p className="text-sm text-gray-400 mt-1 mb-6">Try a different category or search term</p>
              <Link href="/shop/products" className="btn-primary">Browse all products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {products.map(product => (
                <Link
                  key={product.id}
                  href={`/shop/product/${product.id}`}
                  className="card overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className="h-44 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
                    <span className="text-5xl">{CATEGORY_EMOJI[product.category] ?? '📦'}</span>
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <Badge variant="verified"><ShieldCheck className="w-3 h-3" /> Verified</Badge>
                      <Badge variant={product.warrantyType === 'OFFICIAL' ? 'blue' : product.warrantyType === 'SELLER' ? 'orange' : 'gray'}>
                        {WARRANTY_LABELS[product.warrantyType as keyof typeof WARRANTY_LABELS]}
                      </Badge>
                    </div>
                    {product.condition === 'New' && (
                      <div className="absolute top-3 right-3"><Badge variant="orange">New</Badge></div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-400 mb-1">{product.store.name}</p>
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">
                      {product.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {product.ramGb && <span className="text-[10px] px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 font-medium">{product.ramGb}GB RAM</span>}
                      {product.storageGb && <span className="text-[10px] px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 font-medium">{product.storageGb}GB</span>}
                      {product.batteryMah && <span className="text-[10px] px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 font-medium">{product.batteryMah}mAh</span>}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                      <p className="font-display text-base font-bold text-gray-900">{formatBirr(product.priceBirr)}</p>
                      <span className="text-xs font-semibold text-orange-500 flex items-center gap-0.5">
                        View <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
