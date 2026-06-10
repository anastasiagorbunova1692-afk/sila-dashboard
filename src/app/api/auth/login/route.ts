import { NextRequest, NextResponse } from 'next/server'
import { checkCredentials } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  const user = checkCredentials(email, password)
  if (!user) {
    return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 })
  }
  const res = NextResponse.json({ success: true, role: user.role })
  res.cookies.set('auth_token', JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
