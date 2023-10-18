// Common
import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import cors, { CorsOptions } from 'cors'
import bodyParser from 'body-parser'
import { connect } from 'database'

// Routes
import routes from 'routes/index'

const app = express()

// Set security HTTP headers
app.use(helmet())

// Parse JSON request body
app.use(bodyParser.json())

// Parse urlencoded request body
app.use(bodyParser.urlencoded({ extended: true }))

// Enable gzip compression
app.use(compression())

// Enable CORS
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || origin?.includes('brianmatthewsmith')) {
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

const PORT = process?.env?.PORT ?? '3001'
try {
  app.listen(PORT, async (): Promise<void> => {
    await connect()
  })
} catch (error) {
  if (error instanceof Error) {
    console.error(`Error occurred: ${error.message}`)
  }
}
