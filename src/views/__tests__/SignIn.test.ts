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

const matchers = {
  emailField: 'E-mail',
  passwordField: 'Password',
  signInAnonymouslyButton: 'Sign In Anonymously',
  signInWithEmailButton: 'Sign In with Email'
}

describe('SignIn', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('Sign In', () => {
    it('User can sign in anonymously', async () => {
      render(SignIn)

      const button = await screen.findByText(matchers.signInAnonymouslyButton)

      await fireEvent.click(button)

      expect(signInAnonymously).toHaveBeenCalledOnce()
    })

    it('User cannot sign in with an invalid email and password', async () => {
      render(SignIn)

      const emailField: HTMLInputElement = await screen.findByLabelText(matchers.emailField)
      const passwordField: HTMLInputElement = await screen.findByLabelText(matchers.passwordField)
      const button = await screen.findByText(matchers.signInWithEmailButton)

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

    it('User can sign in with valid email and password', async () => {
      render(SignIn)

      const emailField: HTMLInputElement = await screen.findByLabelText(matchers.emailField)
      const passwordField: HTMLInputElement = await screen.findByLabelText(matchers.passwordField)
      const button = await screen.findByText(matchers.signInWithEmailButton)

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
