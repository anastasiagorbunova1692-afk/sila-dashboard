import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')
  const { pathname } = req.nextUrl

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  try {
    const user = JSON.parse(token.value)
    if (pathname.startsWith('/dashboard') && user.role === 'investor') {
      return NextResponse.redirect(new URL('/investor', req.url))
    }
  } catch {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/investor/:path*'],
}
