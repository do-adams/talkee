import { useAuthStore } from '@/stores/auth'
import type { NavigationGuard } from 'vue-router'
import { SIGN_IN } from '@/router/namedRoutes'

export const checkAuthentication: NavigationGuard = async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  if (!requiresAuth) return next()

  const authStore = useAuthStore()

  await authStore.isReady
  if (authStore.isAuthenticated) return next()

  return next({ name: SIGN_IN, query: { redirect_to: to.path } })
}
