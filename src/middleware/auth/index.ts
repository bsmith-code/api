// Common
import { body } from 'express-validator'

// Constants
import {
  FORM_EMAIL,
  FORM_CAPTCHA,
  FORM_PASSWORD,
  FORM_LAST_NAME,
  FORM_FIRST_NAME
} from 'constants/forms'

export const validateRegisterUser = () => {
  const requiredFields = body([
    FORM_EMAIL,
    FORM_CAPTCHA,
    FORM_PASSWORD,
    FORM_LAST_NAME,
    FORM_FIRST_NAME
  ])
    .trim()
    .notEmpty()
    .withMessage((_, { path }) => `${path} is required.`)

  const emailFields = body([FORM_EMAIL])
    .trim()
    .isEmail()
    .withMessage('Invalid email.')

  return [requiredFields, emailFields]
}

export const validateAuthenticateUser = () => {
  const requiredFields = body([FORM_EMAIL, FORM_PASSWORD])
    .trim()
    .notEmpty()
    .withMessage((_, { path }) => `${path} is required.`)

  const emailFields = body([FORM_EMAIL])
    .trim()
    .isEmail()
    .withMessage('Invalid email.')

  return [requiredFields, emailFields]
}
