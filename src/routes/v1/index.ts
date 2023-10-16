import express from 'express'
import authRouter from 'routes/v1/auth'
import portfolioRouter from 'routes/v1/portfolio'

const router = express.Router()

router.use('/auth', authRouter)
router.use('/portfolio', portfolioRouter)

export default router
