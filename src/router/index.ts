import { createRouter, createWebHistory } from 'vue-router'

import ChannelsShow from '@/views/channels/ChannelsShow.vue'
import ChannelsNew from '@/views/channels/ChannelsNew.vue'
import SignIn from '@/views/SignIn.vue'
import HomeView from '../views/HomeView.vue'

import {
  CHANNELS_NEW,
  CHANNELS_SHOW,
  SIGN_IN,
  SIGN_OUT,
  HOME,
  NOT_FOUND
} from '@/router/namedRoutes'

import { useAuthStore } from '@/stores/auth'
import { getAuth, signOut } from 'firebase/auth'
import { checkAuthentication, setTitle } from '@/router/navGuards'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    title?: string
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/channels/new',
      name: CHANNELS_NEW,
      component: ChannelsNew,
      meta: {
        requiresAuth: true,
        title: 'New Channel'
      }
    },
    {
      path: '/channels/:id',
      name: CHANNELS_SHOW,
      component: ChannelsShow,
      props: true
    },
    {
      path: '/sign-in',
      name: SIGN_IN,
      beforeEnter: async (to, from) => {
        const authStore = useAuthStore()

        await authStore.isReady
        if (authStore.isAuthenticated) return { name: HOME }

        return true
      },
      component: SignIn,
      meta: {
        title: 'Sign In'
      }
    },
    {
      path: '/sign-out',
      name: SIGN_OUT,
      redirect: () => {
        const auth = getAuth()
        const authStore = useAuthStore()

        authStore.isReady.then(() =>
          authStore.isAuthenticated ? signOut(auth) : Promise.resolve()
        )

        return { name: HOME }
      },
      meta: {
        title: 'Sign Out'
      }
    },
    {
      path: '/',
      name: HOME,
      component: HomeView,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: NOT_FOUND,
      redirect: { name: HOME }
    }
  ]
})

router.beforeEach(checkAuthentication)
router.afterEach(setTitle)

export default router
