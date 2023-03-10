import { Request, Response } from 'express'

export interface IRequest<T, U> extends Request {
  body: U
  query: T
}

export interface IResponse<T> extends Response {
  json: Send<T, this>
}
