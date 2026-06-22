import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

const PUBLIC_PATHS = ['/', '/login', '/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('aliadiss_token')?.value

  if (PUBLIC_PATHS.some(p => pathname === p) || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const payload = await verifyToken(token)
  if (!payload) {
    const res = NextResponse.redirect(new URL('/login', request.url))
    res.cookies.delete('aliadiss_token')
    return res
  }

  // Admin routes only for SUPER_ADMIN
  if (pathname.startsWith('/admin') && payload.role !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/shop', request.url))
  }

  // Shop / customer routes: redirect admins to their dashboard
  if (pathname.startsWith('/shop') && payload.role === 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|.*\\.png$).*)'],
}
