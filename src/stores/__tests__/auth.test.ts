import { onAuthStateChanged } from '@/vitest/mocks/mockFirebaseAuth'

// Import after mocks
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

describe('Auth Store', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    setActivePinia(createPinia())
  })

  it('Subscribes to Firebase Auth', () => {
    useAuthStore()
    expect(onAuthStateChanged).toHaveBeenCalledOnce()
  })

  it('Is not authenticated by default', () => {
    const auth = useAuthStore()
    expect(auth.user).toBeNull()
    expect(auth.isAuthenticated).toBeFalsy()
  })
})
