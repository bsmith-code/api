// Common
import express from 'express'
import cors, { CorsOptions } from 'cors'
import bodyParser from 'body-parser'

// Routes
import routes from 'routes/v1'

const app = express()

// Parse JSON request body
app.use(bodyParser.json())

// Parse urlencoded request body
app.use(bodyParser.urlencoded({ extended: true }))

// Enable CORS
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (origin?.includes('brianmatthewsmith')) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  },
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

// v1 API routes
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
