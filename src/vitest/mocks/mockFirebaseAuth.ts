import type { Mock } from 'vitest'

export const getAuth = vi.fn(() => ({}))
export const signInAnonymously = vi.fn()
export const signInWithEmailAndPassword = vi.fn()
export const createUserWithEmailAndPassword = vi.fn()
export const onAuthStateChanged = vi.fn((auth: unknown, cb: Function) => cb(null))

/**
 * Apparently vi.mock() works across modules in Vitest. However, mock hoisting will not work across modules so the import statement for this module must come before any other test imports.
 */
vi.mock('firebase/auth', () => {
  return {
    getAuth,
    signInAnonymously,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged
  }
})
