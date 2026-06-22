'use client'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Store, CheckCircle, XCircle, Clock, MapPin, User, FileText, RefreshCw } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

type StoreData = {
  id: string; name: string; legalName: string; city: string; address: string | null;
  legalCredentials: string; status: string; createdAt: string; rejectionReason: string | null;
  owner: { name: string; email: string };
  _count: { products: number; sales: number };
}

export default function AdminStoresPage() {
  const [stores, setStores] = useState<StoreData[]>([])
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [rejectingId, setRejectingId] = useState<string | null>(null)

  const fetchStores = async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/stores${filter !== 'ALL' ? `?status=${filter}` : ''}`)
    const data = await res.json()
    setStores(data)
    setLoading(false)
  }

  useEffect(() => { fetchStores() }, [filter])

  const updateStatus = async (storeId: string, status: 'APPROVED' | 'REJECTED', reason?: string) => {
    setActionLoading(storeId)
    try {
      const res = await fetch('/api/admin/stores', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId, status, rejectionReason: reason }),
      })
      if (res.ok) {
        toast.success(status === 'APPROVED' ? 'Store approved! ✓' : 'Store rejected')
        setRejectingId(null)
        setRejectionReason('')
        fetchStores()
      }
    } finally {
      setActionLoading(null)
    }
  }

  const statusBadge = (status: string) => {
    if (status === 'APPROVED') return <Badge variant="verified"><CheckCircle className="w-3 h-3" /> Approved</Badge>
    if (status === 'REJECTED') return <Badge variant="rejected"><XCircle className="w-3 h-3" /> Rejected</Badge>
    return <Badge variant="pending"><Clock className="w-3 h-3" /> Pending</Badge>
  }

  const filtered = filter === 'ALL' ? stores : stores.filter(s => s.status === filter)
  const counts = {
    ALL: stores.length,
    PENDING: stores.filter(s => s.status === 'PENDING').length,
    APPROVED: stores.filter(s => s.status === 'APPROVED').length,
    REJECTED: stores.filter(s => s.status === 'REJECTED').length,
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">Verification Queue</p>
          <h1 className="font-display text-2xl font-bold text-gray-900">Store Management</h1>
          <p className="text-gray-500 text-sm mt-1">Review and approve store applications</p>
        </div>
        <button onClick={fetchStores} className="btn-secondary gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {f}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${filter === f ? 'bg-orange-100 text-orange-600' : 'bg-gray-200 text-gray-500'}`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card p-12 text-center">
          <RefreshCw className="w-6 h-6 text-gray-300 mx-auto mb-2 animate-spin" />
          <p className="text-sm text-gray-400">Loading stores...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Store className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="font-medium text-gray-700">No stores found</p>
          <p className="text-sm text-gray-400 mt-1">No stores match the current filter</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(store => (
            <div key={store.id} className="card p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <Store className="w-6 h-6 text-orange-500" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-display font-bold text-gray-900">{store.name}</h3>
                    {statusBadge(store.status)}
                    <span className="text-xs text-gray-400">Applied {formatDate(store.createdAt)}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">{store.owner.name}</p>
                        <p className="text-xs text-gray-400">{store.owner.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">{store.city}</p>
                        {store.address && <p className="text-xs text-gray-400">{store.address}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-lg">{store._count.products} products</span>
                      <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-lg">{store._count.sales} sales</span>
                    </div>
                  </div>

                  <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> Legal name & credentials
                    </p>
                    <p className="text-sm font-medium text-gray-800">{store.legalName}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{store.legalCredentials}</p>
                  </div>

                  {store.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-50 rounded-xl border border-red-100">
                      <p className="text-xs font-semibold text-red-600 mb-1">Rejection reason</p>
                      <p className="text-sm text-red-700">{store.rejectionReason}</p>
                    </div>
                  )}

                  {/* Rejection form */}
                  {rejectingId === store.id && (
                    <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100 space-y-3">
                      <p className="text-sm font-semibold text-red-800">Reason for rejection</p>
                      <textarea
                        className="w-full px-3 py-2 rounded-lg border border-red-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
                        rows={3}
                        placeholder="Explain why this store is being rejected..."
                        value={rejectionReason}
                        onChange={e => setRejectionReason(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(store.id, 'REJECTED', rejectionReason)}
                          disabled={!rejectionReason.trim() || actionLoading === store.id}
                          className="btn-danger text-sm py-1.5 px-4"
                        >
                          Confirm rejection
                        </button>
                        <button onClick={() => { setRejectingId(null); setRejectionReason('') }} className="btn-secondary text-sm py-1.5 px-4">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {store.status === 'PENDING' && rejectingId !== store.id && (
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateStatus(store.id, 'APPROVED')}
                      disabled={actionLoading === store.id}
                      className="btn-primary text-sm py-1.5 px-4 gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => setRejectingId(store.id)}
                      className="btn-danger text-sm py-1.5 px-4 gap-1.5"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}

                {store.status === 'REJECTED' && (
                  <button
                    onClick={() => updateStatus(store.id, 'APPROVED')}
                    disabled={actionLoading === store.id}
                    className="btn-secondary text-sm py-1.5 px-4 flex-shrink-0 gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" /> Re-approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
