import { useAuthStore } from '@/stores/auth'
import type { NavigationGuard, NavigationHookAfter } from 'vue-router'
import { SIGN_IN } from '@/router/namedRoutes'
import { usePageTitle, DEFAULT_TITLE } from '@/composables/usePageTitle'

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

export const setTitle: NavigationHookAfter = (to) => {
  const routeTitle = to.meta.title
  if (!routeTitle) return

  const title = usePageTitle()
  title.value = `${DEFAULT_TITLE} - ${routeTitle}`
}
