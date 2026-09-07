import { readJson, writeJson } from '@/lib/local-storage'
import type { AdminSession, UserSession } from './session'
import { isTokenExpired } from './jwt'

const USER_SESSION_KEY = 'user_session'
const ADMIN_SESSION_KEY = 'admin_session'

export function loadUserSession(): UserSession | null {
  const session = readJson<UserSession>(USER_SESSION_KEY)
  if (session && isTokenExpired(session.token)) {
    writeJson(USER_SESSION_KEY, null)
    return null
  }

  return session
}

export function saveUserSession(session: UserSession | null): void {
  writeJson(USER_SESSION_KEY, session)
}

export function loadAdminSession(): AdminSession | null {
  const session = readJson<AdminSession>(ADMIN_SESSION_KEY)
  if (session && isTokenExpired(session.token)) {
    writeJson(ADMIN_SESSION_KEY, null)
    return null
  }

  return session
}

export function saveAdminSession(session: AdminSession | null): void {
  writeJson(ADMIN_SESSION_KEY, session)
}
