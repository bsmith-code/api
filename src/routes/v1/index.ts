import express from 'express'
import portfolioRouter from 'routes/v1/portfolio'

const router = express.Router()

// router.use('/chat', chatRoutes)
router.use('/portfolio', portfolioRouter)

export default router
