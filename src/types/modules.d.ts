import { JwtPayload } from 'jsonwebtoken'

// declare module 'jsonwebtoken' {
interface JwtPayload {
  id: string
}
// }
