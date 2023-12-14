import express from 'express'
import http from 'node:http'
import { Server } from 'socket.io'

export const app = express()
export const server = http.createServer(app)
export const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Check if the origin is allowed, adjust accordingly
      callback(null, true)
    },
    methods: ['GET', 'POST']
  }
})
