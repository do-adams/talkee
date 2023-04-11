import { getAuth, onAuthStateChanged, type User } from 'firebase/auth'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const auth = getAuth()

  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  const setUser = async (newUser: User | null) => (user.value = newUser)

  const init = new Promise<void>((resolve) =>
    onAuthStateChanged(auth, (newUser) => setUser(newUser).finally(resolve))
  )

  return {
    user,
    isAuthenticated,
    isReady: init
  }
})
