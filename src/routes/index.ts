import express from 'express'
import authRouter from 'routes/auth'
import portfolioRouter from 'routes/portfolio'

const router = express.Router()

router.use('/auth', authRouter)
router.use('/portfolio', portfolioRouter)

export default router