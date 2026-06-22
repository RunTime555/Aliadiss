'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Login failed')
        return
      }
      toast.success('Welcome back!')
      router.push(data.redirectUrl)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  const demoAccounts = [
    { label: 'Admin', email: 'admin@aliadiss.com', pw: 'admin123', color: 'bg-orange-500' },
    { label: 'Seller', email: 'selam@aliadiss.com', pw: 'seller123', color: 'bg-blue-500' },
    { label: 'Buyer', email: 'yonas@aliadiss.com', pw: 'buyer123', color: 'bg-emerald-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl" />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        <div className="relative z-10">
          <Logo size="md" />

          <div className="mt-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium mb-6">
              <ShieldCheck className="w-3.5 h-3.5" />
              Ethiopia's most trusted tech marketplace
            </div>

            <h1 className="font-display text-4xl xl:text-5xl font-bold text-white leading-tight">
              Buy tech with<br />
              <span className="text-orange-500">confidence.</span>
            </h1>

            <p className="mt-5 text-gray-400 text-lg leading-relaxed max-w-sm">
              Every store is admin-verified. Every product shows a warranty tag. Real specs, honest prices.
            </p>
          </div>

          {/* Features */}
          <div className="mt-14 space-y-4">
            {[
              { icon: '🛡️', title: 'Verified sellers', desc: 'Admin checks legal credentials before stores go live' },
              { icon: '📋', title: 'Warranty transparency', desc: 'Official, Seller, or None — always clearly shown' },
              { icon: '🔬', title: 'Full tech specs', desc: 'RAM, battery, processor — search like an engineer' },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-4">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Logo size="md" />
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 text-sm mt-1">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-orange-500 hover:text-orange-600 font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full h-11 text-base mt-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-500">Don't have an account? </span>
            <Link href="/register" className="text-sm font-semibold text-orange-500 hover:text-orange-600">
              Create account
            </Link>
          </div>

          {/* Demo accounts */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center mb-3 uppercase tracking-wide font-medium">Demo accounts</p>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map(acc => (
                <button
                  key={acc.label}
                  type="button"
                  onClick={() => { setEmail(acc.email); setPassword(acc.pw) }}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-6 h-6 rounded-full ${acc.color} text-white text-xs font-bold flex items-center justify-center`}>
                    {acc.label[0]}
                  </div>
                  <span className="text-xs font-medium text-gray-700">{acc.label}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-300 text-center mt-2">Click to fill credentials, then sign in</p>
          </div>
        </div>
      </div>
    </div>
  )
}
