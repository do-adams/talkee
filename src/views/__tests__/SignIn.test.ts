import {
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from '@/vitest/mocks/mockFirebaseAuth'

// Import after mocks
import { render, fireEvent, screen } from '@/vitest/testing-library'
import SignIn from '@/views/SignIn.vue'
import { nextTick } from 'vue'

const matchers = {
  emailField: 'E-mail',
  passwordField: 'Password',
  confirmPasswordField: 'Confirm Password',
  signInAnonymouslyButton: 'Sign In Anonymously',
  signInWithEmailButton: 'Sign In with Email',
  signUpButton: 'Sign Up',
  signInErrorMessage: 'There was an error signing you in. Please try again.',
  toggleSignIn: 'Already have an account? Sign in',
  toggleSignUp: `Don't have an account? Sign up`,
  signUpErrorMessage: 'There was an error creating your account. Please try again.'
}

describe('SignIn', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('Sign In Feature', () => {
    test('User can toggle the sign up form', async () => {
      render(SignIn)

      const toggle = await screen.findByText(matchers.toggleSignUp)
      const confirmPasswordField = screen.queryByLabelText(matchers.confirmPasswordField)

      expect(confirmPasswordField).toBeNull()

      await fireEvent.click(toggle)
      await screen.findByLabelText(matchers.confirmPasswordField)
    })

    test('User can sign in anonymously', async () => {
      render(SignIn)

      const button = await screen.findByText(matchers.signInAnonymouslyButton)

      await fireEvent.click(button)

      expect(signInAnonymously).toHaveBeenCalledOnce()
    })

    it('Displays an error message when user cannot sign in anonymously', async () => {
      signInAnonymously.mockImplementationOnce(() => {
        throw new Error()
      })

      render(SignIn)

      const button = await screen.findByText(matchers.signInAnonymouslyButton)

      await fireEvent.click(button)

      expect(signInAnonymously).toHaveBeenCalledOnce()

      await screen.findByText(matchers.signInErrorMessage)
    })

    test('User can sign in with valid email and password', async () => {
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

    test('User cannot sign in with an invalid email and password', async () => {
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

    it('Displays an error message when user cannot sign in anonymously', async () => {
      signInWithEmailAndPassword.mockImplementationOnce(() => {
        throw new Error()
      })

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

      await screen.findByText(matchers.signInErrorMessage)
    })
  })

  describe('Sign Up Feature', () => {
    test('User can toggle the sign in form', async () => {
      render(SignIn)

      let toggle = await screen.findByText(matchers.toggleSignUp)
      let confirmPasswordField = screen.queryByLabelText(matchers.confirmPasswordField)

      expect(confirmPasswordField).toBeNull()

      await fireEvent.click(toggle)
      await screen.findByLabelText(matchers.confirmPasswordField)

      toggle = await screen.findByText(matchers.toggleSignIn)

      await fireEvent.click(toggle)

      confirmPasswordField = screen.queryByLabelText(matchers.confirmPasswordField)
      expect(confirmPasswordField).toBeNull()
    })

    test('User can sign in with valid email and password', async () => {
      render(SignIn)

      const toggle = await screen.findByText(matchers.toggleSignUp)
      await fireEvent.click(toggle)

      const emailField: HTMLInputElement = await screen.findByLabelText(matchers.emailField)
      const passwordField: HTMLInputElement = await screen.findByLabelText(matchers.passwordField)
      const confirmPasswordField: HTMLInputElement = await screen.findByLabelText(
        matchers.confirmPasswordField
      )

      const mockEmail = 'test@gmail.com'
      const mockPassword = '12345678'

      await fireEvent.update(emailField, mockEmail)
      await fireEvent.update(passwordField, mockPassword)
      await fireEvent.update(confirmPasswordField, mockPassword)

      expect(emailField.value).toBe(mockEmail)
      expect(passwordField.value).toBe(mockPassword)
      expect(confirmPasswordField.value).toBe(mockPassword)

      // Touch a form input (and await updates on next tick) to update the v-form validation state
      await fireEvent.touch(passwordField)
      await nextTick()

      const button = await screen.findByText(matchers.signUpButton)
      await fireEvent.click(button)

      expect(createUserWithEmailAndPassword).toHaveBeenCalledOnce()
    })

    test('User cannot sign up with an invalid email and password', async () => {
      render(SignIn)

      const toggle = await screen.findByText(matchers.toggleSignUp)
      await fireEvent.click(toggle)

      const emailField: HTMLInputElement = await screen.findByLabelText(matchers.emailField)
      const passwordField: HTMLInputElement = await screen.findByLabelText(matchers.passwordField)
      const confirmPasswordField: HTMLInputElement = await screen.findByLabelText(
        matchers.confirmPasswordField
      )
      const button = await screen.findByText(matchers.signUpButton)

      await fireEvent.click(button)

      expect(createUserWithEmailAndPassword).not.toHaveBeenCalledOnce()

      const mockEmail = 'testatgmaildotcom'
      const mockPassword = '1234'

      await fireEvent.update(emailField, mockEmail)
      await fireEvent.update(passwordField, mockPassword)
      await fireEvent.update(confirmPasswordField, mockPassword)

      expect(emailField.value).toBe(mockEmail)
      expect(passwordField.value).toBe(mockPassword)
      expect(confirmPasswordField.value).toBe(mockPassword)

      // Touch a form input (and await updates on next tick) to update the v-form validation state
      await fireEvent.touch(passwordField)
      await nextTick()

      await fireEvent.click(button)

      expect(createUserWithEmailAndPassword).not.toHaveBeenCalledOnce()
    })

    it('Displays an error message when user cannot sign up', async () => {
      createUserWithEmailAndPassword.mockImplementationOnce(() => {
        throw new Error()
      })

      render(SignIn)

      const toggle = await screen.findByText(matchers.toggleSignUp)
      await fireEvent.click(toggle)

      const emailField: HTMLInputElement = await screen.findByLabelText(matchers.emailField)
      const passwordField: HTMLInputElement = await screen.findByLabelText(matchers.passwordField)
      const confirmPasswordField: HTMLInputElement = await screen.findByLabelText(
        matchers.confirmPasswordField
      )

      const mockEmail = 'test@gmail.com'
      const mockPassword = '12345678'

      await fireEvent.update(emailField, mockEmail)
      await fireEvent.update(passwordField, mockPassword)
      await fireEvent.update(confirmPasswordField, mockPassword)

      expect(emailField.value).toBe(mockEmail)
      expect(passwordField.value).toBe(mockPassword)
      expect(confirmPasswordField.value).toBe(mockPassword)

      // Touch a form input (and await updates on next tick) to update the v-form validation state
      await fireEvent.touch(passwordField)
      await nextTick()

      const button = await screen.findByText(matchers.signUpButton)
      await fireEvent.click(button)

      expect(createUserWithEmailAndPassword).toHaveBeenCalledOnce()

      await screen.findByText(matchers.signUpErrorMessage)
    })
  })
})
