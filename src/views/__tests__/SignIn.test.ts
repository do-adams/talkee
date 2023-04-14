// Mock Firebase Auth API
const getAuth = vi.fn(() => ({})),
  signInAnonymously = vi.fn(),
  signInWithEmailAndPassword = vi.fn(),
  createUserWithEmailAndPassword = vi.fn()

vi.mock('firebase/auth', () => {
  return {
    getAuth,
    signInAnonymously,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
  }
})

// Import after hoisted module mocks
import { render, fireEvent, screen } from '@/vitest/testing-library'
import SignIn from '@/views/SignIn.vue'
import { nextTick } from 'vue'

describe('SignIn', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('Sign In', () => {
    it('User can sign in anonymously', async () => {
      render(SignIn)

      const button = await screen.findByText('Sign In Anonymously')

      expect(button).toBeTruthy()

      await fireEvent.click(button)

      expect(signInAnonymously).toHaveBeenCalledOnce()
    })

    it('User cannot sign in with an invalid email and password', async () => {
      render(SignIn)

      const emailField: HTMLInputElement = await screen.findByLabelText('E-mail')
      const passwordField: HTMLInputElement = await screen.findByLabelText('Password')
      const button = await screen.findByText('Sign In with Email')

      expect(emailField).toBeTruthy()
      expect(passwordField).toBeTruthy()
      expect(button).toBeTruthy()

      await fireEvent.click(button)

      expect(signInWithEmailAndPassword).not.toHaveBeenCalledOnce()

      const mockEmail = 'testatgmaildotcom'
      const mockPassword = '1234'

      await fireEvent.update(emailField, mockEmail)
      await fireEvent.update(passwordField, mockPassword)

      expect(emailField.value).toBe(mockEmail)
      expect(passwordField.value).toBe(mockPassword)

      // Touch a form input (and await updates on next tick) to update the v-form validation state
      await fireEvent.touch(passwordField)
      await nextTick()

      await fireEvent.click(button)

      expect(signInWithEmailAndPassword).not.toHaveBeenCalledOnce()
    })

    it('User can sign in with valid email and passowrd', async () => {
      render(SignIn)

      const emailField: HTMLInputElement = await screen.findByLabelText('E-mail')
      const passwordField: HTMLInputElement = await screen.findByLabelText('Password')
      const button = await screen.findByText('Sign In with Email')

      expect(emailField).toBeTruthy()
      expect(passwordField).toBeTruthy()
      expect(button).toBeTruthy()

      const mockEmail = 'test@gmail.com'
      const mockPassword = '12345678'

      await fireEvent.update(emailField, mockEmail)
      await fireEvent.update(passwordField, mockPassword)

      expect(emailField.value).toBe(mockEmail)
      expect(passwordField.value).toBe(mockPassword)

      // Touch a form input (and await updates on next tick) to update the v-form validation state
      await fireEvent.touch(passwordField)
      await nextTick()

      await fireEvent.click(button)

      expect(signInWithEmailAndPassword).toHaveBeenCalledOnce()
    })
  })
})
