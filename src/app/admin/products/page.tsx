'use client'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Package, CheckCircle, XCircle, Clock, RefreshCw, ShieldCheck } from 'lucide-react'
import { formatBirr, formatDate, CATEGORY_EMOJI, WARRANTY_LABELS } from '@/lib/utils'
import toast from 'react-hot-toast'

type ProductData = {
  id: string; title: string; description: string; category: string; condition: string;
  priceBirr: number; warrantyType: string; warrantyMonths: number; status: string;
  featured: boolean; stock: number; createdAt: string; rejectionReason: string | null;
  ramGb: string | null; batteryMah: string | null; processorType: string | null;
  storageGb: string | null; cameraMp: string | null; screenSizeIn: string | null;
  store: { id: string; name: string };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductData[]>([])
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'REJECTED'>('PENDING')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const fetchProducts = async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/products${filter !== 'ALL' ? `?status=${filter}` : ''}`)
    const data = await res.json()
    setProducts(data)
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [filter])

  const updateStatus = async (productId: string, status: 'VERIFIED' | 'REJECTED', reason?: string) => {
    setActionLoading(productId)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, status, rejectionReason: reason }),
      })
      if (res.ok) {
        toast.success(status === 'VERIFIED' ? 'Product verified! ✓' : 'Product rejected')
        setRejectingId(null)
        setRejectionReason('')
        fetchProducts()
      }
    } finally {
      setActionLoading(null)
    }
  }

  const statusBadge = (status: string) => {
    if (status === 'VERIFIED') return <Badge variant="verified"><CheckCircle className="w-3 h-3" /> Verified</Badge>
    if (status === 'REJECTED') return <Badge variant="rejected"><XCircle className="w-3 h-3" /> Rejected</Badge>
    return <Badge variant="pending"><Clock className="w-3 h-3" /> Pending</Badge>
  }

  const warrantyBadge = (type: string, months: number) => {
    if (type === 'OFFICIAL') return <Badge variant="blue">Official · {months}m</Badge>
    if (type === 'SELLER') return <Badge variant="orange">Seller · {months}m</Badge>
    return <Badge variant="gray">No warranty</Badge>
  }

  const counts = {
    ALL: products.length,
    PENDING: products.filter(p => p.status === 'PENDING').length,
    VERIFIED: products.filter(p => p.status === 'VERIFIED').length,
    REJECTED: products.filter(p => p.status === 'REJECTED').length,
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">Product Review</p>
          <h1 className="font-display text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-500 text-sm mt-1">Verify listings before they appear in the marketplace</p>
        </div>
        <button onClick={fetchProducts} className="btn-secondary gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['PENDING', 'ALL', 'VERIFIED', 'REJECTED'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${filter === f ? 'bg-orange-100 text-orange-600' : 'bg-gray-200 text-gray-500'}`}>
              {f === 'ALL' ? products.length : counts[f]}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card p-12 text-center">
          <RefreshCw className="w-6 h-6 text-gray-300 mx-auto mb-2 animate-spin" />
          <p className="text-sm text-gray-400">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="card p-12 text-center">
          <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="font-medium text-gray-700">No products found</p>
          <p className="text-sm text-gray-400 mt-1">No products match the current filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {products.map(product => (
            <div key={product.id} className="card p-5 flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center flex-shrink-0 text-3xl">
                  {CATEGORY_EMOJI[product.category] ?? '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display font-bold text-gray-900 text-sm leading-tight">{product.title}</h3>
                    {statusBadge(product.status)}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{product.store.name} · Submitted {formatDate(product.createdAt)}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {warrantyBadge(product.warrantyType, product.warrantyMonths)}
                    <Badge variant="gray">{product.condition}</Badge>
                    <Badge variant="gray">{product.category}</Badge>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{product.description}</p>

              {/* Specs */}
              <div className="bg-gray-50 rounded-xl p-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
                {[
                  ['Price', formatBirr(product.priceBirr)],
                  ['Stock', `${product.stock} units`],
                  product.ramGb ? ['RAM', `${product.ramGb} GB`] : null,
                  product.storageGb ? ['Storage', `${product.storageGb} GB`] : null,
                  product.batteryMah ? ['Battery', `${product.batteryMah} mAh`] : null,
                  product.processorType ? ['Processor', product.processorType] : null,
                  product.cameraMp ? ['Camera', `${product.cameraMp} MP`] : null,
                  product.screenSizeIn ? ['Screen', `${product.screenSizeIn}"`] : null,
                ].filter(Boolean).map(([label, value]) => (
                  <div key={label as string} className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{label}</span>
                    <span className="text-xs font-semibold text-gray-800">{value}</span>
                  </div>
                ))}
              </div>

              {/* Rejection reason */}
              {product.rejectionReason && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                  <p className="text-xs font-semibold text-red-600 mb-1">Rejection reason</p>
                  <p className="text-xs text-red-700">{product.rejectionReason}</p>
                </div>
              )}

              {/* Rejection form */}
              {rejectingId === product.id && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-100 space-y-2">
                  <p className="text-xs font-semibold text-red-800">Reason for rejection</p>
                  <textarea
                    className="w-full px-3 py-2 rounded-lg border border-red-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
                    rows={2}
                    placeholder="e.g. Missing warranty documentation, incorrect specs..."
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(product.id, 'REJECTED', rejectionReason)} disabled={!rejectionReason.trim() || actionLoading === product.id} className="btn-danger text-xs py-1.5 px-3">
                      Confirm
                    </button>
                    <button onClick={() => { setRejectingId(null); setRejectionReason('') }} className="btn-secondary text-xs py-1.5 px-3">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              {product.status === 'PENDING' && rejectingId !== product.id && (
                <div className="flex gap-2 pt-1 border-t border-gray-50">
                  <button onClick={() => updateStatus(product.id, 'VERIFIED')} disabled={actionLoading === product.id} className="btn-primary text-xs py-1.5 px-3 flex-1 gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verify & publish
                  </button>
                  <button onClick={() => setRejectingId(product.id)} className="btn-danger text-xs py-1.5 px-3 gap-1.5">
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              )}
              {product.status === 'REJECTED' && rejectingId !== product.id && (
                <div className="flex gap-2 pt-1 border-t border-gray-50">
                  <button onClick={() => updateStatus(product.id, 'VERIFIED')} disabled={actionLoading === product.id} className="btn-secondary text-xs py-1.5 px-3 gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" /> Re-verify
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
