import { Response } from 'express'

import { Permission } from 'models/permission'

import { IRequest } from 'types'

export const getPermissions = async (req: IRequest, res: Response) => {
  try {
    const permissions = await Permission.findAll()

    return res.json(permissions)
  } catch (error) {
    return res.status(400).send({ message: (error as Error).message })
  }
}
