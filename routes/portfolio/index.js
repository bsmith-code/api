const portfolioRouter = require('express').Router()
const { sendEmail } = require('../../controllers/portfolio')

portfolioRouter.post('/email/send', sendEmail)

module.exports = portfolioRouter
