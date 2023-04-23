import { getAuth, onAuthStateChanged, type User } from 'firebase/auth'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const auth = getAuth()

  const user = ref<User | null>(null)
  const userId = computed(() => (user.value ? user.value.uid : ''))

  const isAuthenticated = computed(() => user.value !== null)

  const setUser = async (newUser: User | null) => (user.value = newUser)

  const init = new Promise<void>((resolve) =>
    onAuthStateChanged(auth, (newUser) => setUser(newUser).finally(resolve))
  )

  return {
    user,
    userId,
    isAuthenticated,
    isReady: init
  }
})
