import { Request } from 'express'

export interface IRequest<T = null> extends Request {
  body: T
  cookies: Record<string, string>
}
