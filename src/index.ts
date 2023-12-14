import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors, { CorsOptions } from 'cors'
import helmet from 'helmet'
import { app, io, server } from 'server'

import { connect } from 'database'

import routes from 'routes/index'

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
  res.status(200).json({ message: 'Welcome to the API' })
})

const PORT = process?.env?.PORT ?? '3001'
try {
  io.on('connection', socket => {
    console.log('A user connected:', socket.id)

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
  })

  server.listen(PORT, async (): Promise<void> => {
    await connect()
  })
} catch (error) {
  if (error instanceof Error) {
    console.error(`Error occurred: ${error.message}`)
  }
}
