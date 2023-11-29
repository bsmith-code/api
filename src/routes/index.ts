// Common
import express from 'express'

// Routes
import authRouter from 'routes/auth'
import portfolioRouter from 'routes/portfolio'
import chatRouter from 'routes/chat'

const router = express.Router()

router.use('/auth', authRouter)
router.use('/chat', chatRouter)
router.use('/portfolio', portfolioRouter)

export default router
