import { CookieParseOptions } from 'cookie-parser'
import { Request } from 'express'

export interface IRequest<T> extends Request {
  body: T
  cookies: Record<string, string>
}
