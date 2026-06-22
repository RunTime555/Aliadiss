# Ali Addis — Verified Tech Marketplace

🇪🇹 Ethiopia's trust-first multi-vendor tech e-commerce platform.

## Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: JWT (jose) — httpOnly cookie, role-gated middleware
- **Styling**: Tailwind CSS + custom brand tokens
- **UI Library**: lucide-react, react-hot-toast

## Roles & routing
| Role | After login | Access |
|------|-------------|--------|
| CUSTOMER | `/shop` | Browse, cart, orders |
| STORE_OWNER | `/shop` | Browse + seller tools |
| SUPER_ADMIN | `/admin/dashboard` | Full admin panel |

Middleware at `src/middleware.ts` enforces all redirects server-side.

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.local .env
# Edit .env and set your DATABASE_URL and JWT_SECRET
```
Example:
```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/aliadiss"
JWT_SECRET="your-32+-char-secret-key-here"
```

### 3. Push schema & seed
```bash
npm run db:push   # creates all tables
npm run db:seed   # seeds demo users, store, products
```

### 4. Run dev server
```bash
npm run dev
# → http://localhost:3000
```

## Demo credentials (after seeding)
| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@aliadiss.com | admin123 |
| Seller | selam@aliadiss.com | seller123 |
| Customer | yonas@aliadiss.com | buyer123 |

## Project structure
```
src/
├── app/
│   ├── page.tsx                  ← Landing page (/)
│   ├── login/page.tsx            ← Auth login
│   ├── register/page.tsx         ← Auth register
│   ├── shop/                     ← Customer area (role-gated)
│   │   ├── layout.tsx
│   │   ├── page.tsx              ← Shop homepage
│   │   ├── products/page.tsx     ← Browse & filter
│   │   └── product/[id]/page.tsx ← Product detail
│   ├── admin/                    ← Admin area (SUPER_ADMIN only)
│   │   ├── layout.tsx            ← Sidebar layout
│   │   ├── dashboard/page.tsx    ← Stats & alerts
│   │   ├── stores/page.tsx       ← Approve/reject stores
│   │   ├── products/page.tsx     ← Verify/reject products
│   │   ├── orders/page.tsx       ← Sales ledger
│   │   └── users/page.tsx        ← User management
│   └── api/
│       ├── auth/{login,register,logout,me}/route.ts
│       ├── products/route.ts
│       └── admin/{stores,products,stats}/route.ts
├── components/
│   ├── ui/{Logo,Badge,StatCard}.tsx
│   └── layout/{CustomerNav,AdminSidebar}.tsx
├── lib/{auth.ts,db.ts,utils.ts}
├── middleware.ts                  ← Route protection
prisma/
├── schema.prisma                  ← Full DB schema
└── seed.ts                        ← Demo data
```

## Key features
- ✅ Role-based auth with JWT (httpOnly cookies)
- ✅ Middleware-level route protection (no client-side only)
- ✅ Admin approval queue for stores and products
- ✅ Warranty transparency (Official / Seller / None)
- ✅ Commission tracking (5% per sale)
- ✅ Full product specs (RAM, battery, processor, camera…)
- ✅ Orange & black brand identity from logo
- ✅ Responsive layout (mobile + desktop)
- ✅ PostgreSQL with Prisma — production-ready schema

## Deployment (Vercel + Neon)
1. Create a Neon PostgreSQL database
2. Set `DATABASE_URL` and `JWT_SECRET` in Vercel env vars
3. `npx prisma generate` runs automatically on build
4. Push schema: `prisma db push`
5. Seed once: `npx tsx prisma/seed.ts`
