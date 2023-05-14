import { getAuth, onAuthStateChanged, type User as AuthUser } from 'firebase/auth'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface StoreUser {
  uid: AuthUser['uid']
  email: AuthUser['email']
  isAnonymous: AuthUser['isAnonymous']
}

export const getEmptyUser = (): StoreUser => ({
  uid: '',
  email: '',
  isAnonymous: false
})

export const useAuthStore = defineStore('auth', () => {
  /**
   * Firebase Authentication state is trinary:
   *   - true: user is authenticated
   *   - false: user is not authenticated
   *   - undefined: unknown
   *
   * Read more at: https://medium.com/firebase-developers/why-is-my-currentuser-null-in-firebase-auth-4701791f74f0
   */
  const isAuthenticated = ref<boolean | undefined>()

  const user = ref<StoreUser>(getEmptyUser())

  const setUser = async (newUser: AuthUser | null) => {
    if (newUser) {
      isAuthenticated.value = true
      user.value.uid = newUser.uid
      user.value.email = newUser.email
      user.value.isAnonymous = newUser.isAnonymous
    } else {
      isAuthenticated.value = false
      user.value = getEmptyUser()
    }
  }

  const init = new Promise<void>((resolve) =>
    onAuthStateChanged(getAuth(), (newUser) => setUser(newUser).finally(resolve))
  )

  return {
    isAuthenticated,
    user,
    isReady: init
  }
})
