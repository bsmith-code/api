import express from 'express'
import authRouter from 'routes/auth'
import chatRouter from 'routes/chat'
import portfolioRouter from 'routes/portfolio'

import { validateAndRefreshToken } from 'middleware/auth'

const router = express.Router()

router.use('/auth', authRouter)
router.use('/chat', validateAndRefreshToken, chatRouter)
router.use('/portfolio', portfolioRouter)

export default router
