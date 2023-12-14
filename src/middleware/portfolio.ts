import { body } from 'express-validator'

import {
  FORM_CAPTCHA,
  FORM_EMAIL,
  FORM_FIRST_NAME,
  FORM_LAST_NAME,
  FORM_MESSAGE,
  FORM_SUBJECT
} from 'constants/forms'

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
