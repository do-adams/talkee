import { createRouter, createWebHistory } from 'vue-router'

import ChannelView from '@/views/channels/ChannelView.vue'
import CreateChannel from '@/views/channels/CreateChannel.vue'
import SignIn from '@/views/SignIn.vue'
import HomeView from '../views/HomeView.vue'

import {
  CREATE_CHANNEL,
  VIEW_CHANNEL,
  SIGN_IN,
  SIGN_OUT,
  HOME,
  NOT_FOUND
} from '@/router/namedRoutes'

import { useAuthStore } from '@/stores/auth'
import { getAuth, signOut } from 'firebase/auth'
import { checkAuthentication } from '@/router/navGuards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/channels/create',
      name: CREATE_CHANNEL,
      component: CreateChannel,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/channels/:id',
      name: VIEW_CHANNEL,
      component: ChannelView
    },
    {
      path: '/sign-in',
      name: SIGN_IN,
      beforeEnter: async (to, from, next) => {
        const authStore = useAuthStore()

        await authStore.isReady
        if (authStore.isAuthenticated) return next({ name: HOME })

        return next()
      },
      component: SignIn
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
      }
    },
    {
      path: '/',
      name: HOME,
      component: HomeView
    },
    {
      path: '/:pathMatch(.*)*',
      name: NOT_FOUND,
      redirect: { name: HOME }
    }
  ]
})

router.beforeEach(checkAuthentication)

export default router
