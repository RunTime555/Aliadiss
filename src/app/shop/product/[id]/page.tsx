import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { ShieldCheck, ArrowLeft, Store, MapPin, ShoppingCart, Zap } from 'lucide-react'
import { formatBirr, WARRANTY_LABELS, CATEGORY_EMOJI } from '@/lib/utils'

interface PageProps { params: { id: string } }

async function getProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { store: { include: { owner: { select: { name: true } } } } },
  })
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProduct(params.id)
  if (!product || product.status !== 'VERIFIED') notFound()

  const commissionBirr = Math.round(product.priceBirr * 0.05)
  const emoji = CATEGORY_EMOJI[product.category] ?? '📦'

  const specs = [
    product.screenSizeIn ? ['Screen size', `${product.screenSizeIn}"`] : null,
    product.screenResolution ? ['Resolution', product.screenResolution] : null,
    product.cameraMp ? ['Camera', `${product.cameraMp} MP`] : null,
    product.ramGb ? ['RAM', `${product.ramGb} GB`] : null,
    product.storageGb ? ['Storage', `${product.storageGb} GB`] : null,
    product.processorType ? ['Processor', product.processorType] : null,
    product.batteryMah ? ['Battery', `${product.batteryMah} mAh`] : null,
    ['Condition', product.condition],
    ['Category', product.category],
  ].filter(Boolean) as [string, string][]

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/shop" className="text-gray-400 hover:text-gray-600">Home</Link>
        <span className="text-gray-300">/</span>
        <Link href="/shop/products" className="text-gray-400 hover:text-gray-600">Products</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-700 font-medium line-clamp-1">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Image + specs */}
        <div className="lg:col-span-2 space-y-5">
          {/* Product image */}
          <div className="card overflow-hidden">
            <div className="h-72 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
              <span className="text-8xl">{emoji}</span>
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <Badge variant="verified"><ShieldCheck className="w-3.5 h-3.5" /> Admin Verified</Badge>
                <Badge variant={product.warrantyType === 'OFFICIAL' ? 'blue' : product.warrantyType === 'SELLER' ? 'orange' : 'gray'}>
                  {WARRANTY_LABELS[product.warrantyType as keyof typeof WARRANTY_LABELS]}
                  {product.warrantyMonths > 0 && ` · ${product.warrantyMonths} months`}
                </Badge>
              </div>
              {product.condition === 'New' && (
                <div className="absolute top-4 right-4"><Badge variant="orange">New</Badge></div>
              )}
            </div>
          </div>

          {/* Title & description */}
          <div className="card p-6">
            <h1 className="font-display text-2xl font-bold text-gray-900">{product.title}</h1>
            <p className="text-gray-500 mt-3 leading-relaxed">{product.description}</p>
          </div>

          {/* Specs table */}
          {specs.length > 0 && (
            <div className="card p-6">
              <h2 className="font-display text-sm font-bold text-gray-900 mb-4">Technical specifications</h2>
              <div className="divide-y divide-gray-50">
                {specs.map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-3">
                    <span className="text-sm text-gray-500">{key}</span>
                    <span className="text-sm font-semibold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Purchase card */}
        <div className="space-y-4">
          {/* Price card */}
          <div className="card p-6 sticky top-24">
            <div className="mb-5">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">Price</p>
              <p className="font-display text-3xl font-bold text-gray-900">{formatBirr(product.priceBirr)}</p>
              <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                <span className="text-orange-500 font-medium">5% commission</span>
                ({formatBirr(commissionBirr)}) goes to Ali Addis
              </p>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-5">
              {product.stock > 5 ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ) : product.stock > 0 ? (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-red-400" />
              )}
              <span className="text-sm text-gray-600">
                {product.stock > 5 ? 'In stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of stock'}
              </span>
            </div>

            <div className="space-y-2.5">
              <button className="btn-primary w-full h-11 text-sm" disabled={product.stock === 0}>
                <ShoppingCart className="w-4 h-4" />
                {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
              </button>
              <button className="btn-secondary w-full h-11 text-sm" disabled={product.stock === 0}>
                <Zap className="w-4 h-4" />
                Buy now
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-5 pt-5 border-t border-gray-50 space-y-2.5">
              {[
                { icon: '🛡️', text: 'Admin-verified seller' },
                { icon: '📋', text: product.warrantyType !== 'NONE' ? `${WARRANTY_LABELS[product.warrantyType as keyof typeof WARRANTY_LABELS]} included` : 'No warranty — buy as-is' },
                { icon: '🔒', text: 'Secure checkout' },
              ].map(item => (
                <div key={item.icon} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <span className="text-base">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Store card */}
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <Store className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{product.store.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Badge variant="verified"><ShieldCheck className="w-3 h-3" /> Verified</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <MapPin className="w-3.5 h-3.5" />
              {product.store.city}
              {product.store.address && ` · ${product.store.address}`}
            </div>
            <Link href={`/shop/stores/${product.store.id}`} className="text-xs font-semibold text-orange-500 hover:text-orange-600 mt-3 flex items-center gap-1">
              View all from this store →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
