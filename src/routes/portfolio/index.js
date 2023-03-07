const portfolioRouter = require('express').Router()
const { postEmail } = require('../../controllers/portfolio')

portfolioRouter.post('/email', postEmail)

module.exports = portfolioRouter
