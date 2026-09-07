import type { AdminSession, UserSession } from '@/features/auth/session'
import {
  loadAdminSession,
  loadUserSession,
  saveAdminSession,
  saveUserSession,
} from '@/features/auth/session-storage'
import type { ApiAudience } from '@/shared/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const userSession = ref<UserSession | null>(loadUserSession())
  const adminSession = ref<AdminSession | null>(loadAdminSession())

  const isUserAuthenticated = computed(() => userSession.value !== null)
  const isAdminAuthenticated = computed(() => adminSession.value !== null)

  const tenantSlug = computed(() => userSession.value?.tenantSlug ?? null)
  const adminFullName = computed(() =>
    !adminSession.value?.firstName || adminSession.value?.lastName
      ? null
      : `${adminSession.value?.firstName} ${adminSession.value?.lastName}`,
  )

  function getTokenFor(audience: ApiAudience): string | null {
    const session = audience === 'admin' ? adminSession.value : userSession.value

    return session?.token ?? null
  }

  function startUserSession(session: UserSession) {
    userSession.value = session
    saveUserSession(session)
  }

  function startAdminSession(session: AdminSession) {
    adminSession.value = session
    saveAdminSession(session)
  }

  function clear(audience: ApiAudience) {
    if (audience === 'admin') {
      adminSession.value = null
      saveAdminSession(null)
    } else {
      userSession.value = null
      saveUserSession(null)
    }
  }

  return {
    userSession,
    adminSession,
    isUserAuthenticated,
    isAdminAuthenticated,
    tenantSlug,
    adminFullName,
    getTokenFor,
    startUserSession,
    startAdminSession,
    clear,
  }
})
