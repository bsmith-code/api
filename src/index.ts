// Common
import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import cors, { CorsOptions } from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { connect } from 'database'

// Routes
import routes from 'routes/index'

const app = express()

const corsOptions: CorsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200
}

app.use(helmet())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(compression())
app.use(cors(corsOptions))
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
