import { string, type ValidationError } from 'yup'

export const requiredRule =
  (message = 'This field is required') =>
  <T>(value: T) =>
    Boolean(value) || message

export const emailRule =
  (message = 'Please enter a valid email') =>
  (value: string) =>
    string()
      .email(message)
      .validate(value)
      .then(() => true)
      .catch((e: ValidationError) => e.errors[0])

export const minLengthRule = (n: number) => (value: string) =>
  string()
    .min(n, `This field must be at least ${n} characters long`)
    .validate(value)
    .then(() => true)
    .catch((e: ValidationError) => e.errors[0])
