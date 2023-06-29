// Common
import { body } from 'express-validator'

// Constants
import {
  FORM_EMAIL,
  FORM_SUBJECT,
  FORM_CAPTCHA,
  FORM_MESSAGE,
  FORM_LAST_NAME,
  FORM_FIRST_NAME
} from 'constants/portfolio'

export const validateForm = () => {
  const requiredFields = body([
    FORM_EMAIL,
    FORM_SUBJECT,
    FORM_MESSAGE,
    FORM_CAPTCHA,
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
