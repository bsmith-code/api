import { JwtPayload as JsonWebToken } from 'jsonwebtoken'
import { Response as ExpressResponse } from 'express'

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
