import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import {
  ShieldCheck,
  Cpu,
  ClipboardCheck,
  Receipt,
  ClipboardList,
  Award,
  ArrowRight,
  Store,
  Users,
} from 'lucide-react'

/* ─── Static data ─────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Verified sellers only',
    desc: 'Every store goes through admin credential verification before listing a single product. No unverified sellers, ever.',
  },
  {
    icon: ClipboardCheck,
    title: 'Honest warranty tags',
    desc: "Every product clearly shows Official, Seller, or No Warranty — so you always know exactly what you're getting.",
  },
  {
    icon: Cpu,
    title: 'Full tech specs',
    desc: 'RAM, battery, processor, camera — every spec that matters is listed. Filter and compare like an expert.',
  },
]

const ROLES = [
  {
    num: '1',
    name: 'Customer',
    icon: Users,
    color: 'bg-emerald-500',
    steps: [
      'Register & verify email',
      'Browse verified products',
      'Add to cart & checkout securely',
      'Track orders in real time',
    ],
  },
  {
    num: '2',
    name: 'Seller',
    icon: Store,
    color: 'bg-blue-500',
    steps: [
      'Register & submit legal credentials',
      'Wait for Super Admin approval',
      'List products with full specs',
      'Manage orders & payouts',
    ],
  },
  {
    num: '3',
    name: 'Super Admin',
    icon: ShieldCheck,
    color: 'bg-orange-500',
    steps: [
      'Review store credentials',
      'Approve or reject stores',
      'Verify product listings',
      'Track commission revenue',
    ],
  },
]

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: 'Admin-verified stores',
    desc: 'Legal credentials checked before any store goes live on the marketplace.',
  },
  {
    icon: Receipt,
    title: 'Transparent pricing',
    desc: '5% commission on every sale — visible to all parties, no hidden fees.',
  },
  {
    icon: ClipboardList,
    title: 'Verified product specs',
    desc: 'Every listing passes admin review before appearing to buyers.',
  },
  {
    icon: Award,
    title: 'Warranty on every item',
    desc: 'Official, Seller, or None — always clearly labelled, never hidden.',
  },
]

const METRICS = [
  { value: '100%', label: 'Verified sellers', accent: true },
  { value: '5%',   label: 'Fair commission',  accent: false },
  { value: '3',    label: 'Warranty tiers',   accent: false },
]

/* ─── Page ────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* ══ NAV ══════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <Logo size="sm" />
          <nav className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="btn-primary shadow-orange"
            >
              Get started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </nav>
        </div>
      </header>

      {/* ══ HERO ═════════════════════════════════════════════════ */}
      <section className="relative bg-white overflow-hidden pt-20 pb-40 px-6 text-center">
        {/* Subtle dot-grid background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Soft orange glow top-center */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[640px] h-[420px] rounded-full bg-orange-500/8 blur-3xl"
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold mb-8 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            🇪🇹 Ethiopia's trusted tech marketplace
          </div>

          <h1 className="font-display text-5xl sm:text-[56px] font-bold leading-[1.12] tracking-tight text-gray-900 mb-6">
            Buy tech with{' '}
            <span className="text-orange-500">confidence.</span>
          </h1>

          <p className="text-base text-gray-500 max-w-[420px] mx-auto leading-relaxed mb-10">
            Ali Addis connects Ethiopian buyers with admin-verified tech stores.
            Every seller is checked, every product shows a warranty tag.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            <Link href="/register" className="btn-primary text-base px-7 py-3 shadow-orange">
              Start shopping <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-medium text-sm px-7 py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-all"
            >
              Sign in
            </Link>
          </div>

          {/* Metrics card */}
          <div className="inline-grid grid-cols-3 divide-x divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-card">
            {METRICS.map((m) => (
              <div key={m.label} className="px-10 py-5 text-center">
                <p className={`font-display text-2xl font-bold leading-none ${m.accent ? 'text-orange-500' : 'text-gray-900'}`}>
                  {m.value}
                </p>
                <p className="text-[11px] text-gray-400 font-medium mt-1.5 tracking-wide uppercase">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
      
        </div>
      </section>
      

      {/* Thin orange divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-orange-400/40 to-transparent" />

      {/* ══ FEATURES ═════════════════════════════════════════════ */}
      <section className="bg-gray-50 border-t border-gray-100 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold text-orange-500 uppercase tracking-[0.14em] text-center mb-2">
            Why Ali Addis
          </p>
          <h2 className="font-display text-3xl font-bold text-gray-900 text-center mb-12 tracking-tight">
            Built on trust, not just listings
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-orange-50 border border-orange-100 rounded-2xl p-7 hover:border-orange-200 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-orange-100 flex items-center justify-center mb-5 shadow-sm">
                  <f.icon className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-display text-sm font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ═════════════════════════════════════════ */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold text-orange-500 uppercase tracking-[0.14em] text-center mb-2">
            How it works
          </p>
          <h2 className="font-display text-3xl font-bold text-gray-900 text-center mb-12 tracking-tight">
            Three roles, one trusted platform
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {ROLES.map((r) => (
              <div
                key={r.name}
                className="card p-7 hover:shadow-card-hover transition-shadow"
              >
                {/* Role header */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-9 h-9 rounded-xl bg-orange-500 text-white font-display text-sm font-bold flex items-center justify-center flex-shrink-0 shadow-orange">
                    {r.num}
                  </span>
                  <span className="font-display text-sm font-bold text-gray-900">{r.name}</span>
                </div>
                {/* Steps */}
                <ul className="space-y-3">
                  {r.steps.map((step) => (
                    <li key={step} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-[7px] flex-shrink-0" />
                      <span className="text-sm text-gray-500 leading-snug">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TRUST — dark band ════════════════════════════════════ */}
      <section className="bg-gray-950 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold text-orange-500 uppercase tracking-[0.14em] mb-2">
            Platform trust
          </p>
          <h2 className="font-display text-3xl font-bold text-white mb-10 tracking-tight">
            Why buyers choose Ali Addis
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TRUST_ITEMS.map((t) => (
              <div
                key={t.title}
                className="flex items-start gap-4 bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 hover:bg-white/[0.06] transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-orange">
                  <t.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-display text-sm font-bold text-white mb-1">{t.title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════════ */}
      <section className="bg-orange-500 py-20 px-6 text-center relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10 max-w-xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-white mb-3 tracking-tight">
            Ready to shop with confidence?
          </h2>
          <p className="text-sm text-white/75 mb-9 leading-relaxed">
            Join the marketplace where trust is built in, not bolted on.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-bold text-sm px-8 py-3 rounded-xl transition-colors"
            >
              Create free account <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 font-semibold text-sm px-8 py-3 rounded-xl transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════ */}
      <footer className="bg-white border-t border-gray-100 py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Ali Addis. Ethiopia's verified tech marketplace.
          </p>
          <div className="flex gap-6">
            {['Terms', 'Privacy', 'Support'].map((l) => (
              <Link
                key={l}
                href={`/${l.toLowerCase()}`}
                className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </footer>

    </div>
  )
}