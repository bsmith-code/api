// Common
import express from 'express'

// Controllers
import { postEmail } from 'controllers/portfolio'

// Middleware
import { validateForm } from 'middleware/portfolio'

const portfolioRouter = express.Router()
portfolioRouter.post('/email', validateForm(), postEmail)

export default portfolioRouter
