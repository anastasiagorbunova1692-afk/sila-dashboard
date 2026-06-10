import { cookies } from 'next/headers'

export type Role = 'founder' | 'manager' | 'investor'

export interface AuthUser {
  email: string
  role: Role
}

export function getAuthUser(): AuthUser | null {
  const cookieStore = cookies()
  const token = cookieStore.get('auth_token')
  if (!token) return null
  try {
    return JSON.parse(token.value) as AuthUser
  } catch {
    return null
  }
}

export function checkCredentials(email: string, password: string): AuthUser | null {
  const users = [
    { email: process.env.FOUNDER_EMAIL!, password: process.env.FOUNDER_PASSWORD!, role: 'founder' as Role },
    { email: process.env.MANAGER_EMAIL!, password: process.env.MANAGER_PASSWORD!, role: 'manager' as Role },
    { email: process.env.INVESTOR_EMAIL!, password: process.env.INVESTOR_PASSWORD!, role: 'investor' as Role },
  ]
  const user = users.find(u => u.email === email && u.password === password)
  if (!user) return null
  return { email: user.email, role: user.role }
}
