import { useAuthStore } from '@/stores/auth'
import type { NavigationGuard } from 'vue-router'
import { SIGN_IN } from '@/router/namedRoutes'

export const checkAuthentication: NavigationGuard = async (to, from) => {
  const requiresAuth = to.meta.requiresAuth
  if (!requiresAuth) return true

  const authStore = useAuthStore()

  await authStore.isReady
  if (authStore.isAuthenticated) return true

  return {
    name: SIGN_IN,
    query: {
      redirect_to: to.path
    }
  }
}
