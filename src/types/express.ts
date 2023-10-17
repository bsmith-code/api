import { Request, Response } from 'express'

export interface IRequest<T> extends Request {
  body: T
}

export interface IResponse<T> extends Response {
  json: T
}
