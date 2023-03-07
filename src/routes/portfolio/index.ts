import express from "express"
import { postEmail } from 'controllers/portfolio'

const portfolioRouter = express.Router()
portfolioRouter.post('/email', postEmail)


export default portfolioRouter
