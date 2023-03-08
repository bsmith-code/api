// Common
import express from 'express'
import bodyParser from 'body-parser'

// Routes
import routes from 'routes/v1'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/v1', routes)

app.get('/', (_, res) => {
  res.status(200).json({ message: 'Welcome to the API Gateway.' })
})

const PORT = 3000
try {
  app.listen(PORT, (): void => {
    console.log(`Connected successfully on port ${PORT}`)
  })
} catch (error) {
  if (error instanceof Error) {
    console.error(`Error occurred: ${error.message}`)
  }
}
