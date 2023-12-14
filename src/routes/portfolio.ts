import express from 'express'

import { postEmail } from 'controllers/portfolio'

import { validateForm } from 'middleware/portfolio'

const portfolioRouter = express.Router()
portfolioRouter.post('/email', validateForm(), postEmail)

export default portfolioRouter
