import { string, type ValidationError } from 'yup'

type Result = string | boolean

type Validator<T, U> = (
  options?: T
) => Result | ((value: U) => Result) | ((value: U) => PromiseLike<Result>)

export const requiredRule: Validator<string, unknown> =
  (message = 'This field is required') =>
  (value) =>
    Boolean(value) || message

export const emailRule: Validator<string, string> =
  (message = 'Please enter a valid email') =>
  (value) =>
    string()
      .email(message)
      .validate(value)
      .then(() => true)
      .catch((e: ValidationError) => e.errors[0])

export const minLengthRule: Validator<number, string> =
  (n = 5) =>
  (value) =>
    string()
      .min(n, `This field must be at least ${n} characters long`)
      .validate(value)
      .then(() => true)
      .catch((e: ValidationError) => e.errors[0])
