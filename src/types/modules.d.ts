import { Response as ExpressResponse } from 'express'
import { JwtPayload as JsonWebToken } from 'jsonwebtoken'

declare module 'jsonwebtoken' {
  interface JwtPayload {
    userId: string
  }
}

declare module 'express' {
  interface Response {
    locals: {
      userId?: string
    }
  }
}
