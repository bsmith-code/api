import { JwtPayload as JsonWebToken } from 'jsonwebtoken'

declare module 'jsonwebtoken' {
  interface JwtPayload {
    userId: string
  }
}
