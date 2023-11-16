import { IPermission } from 'types/permission'

export interface IUserClient {
  id: string
  firstName: string
  lastName: string
  email: string
  permissions: IPermission[]
}

export interface IUserServer extends IUserClient {
  verified: boolean
  password: string
  createdAt: Date
  updatedAt: Date
}

export type TUserCreate = Omit<IUserClient, 'id' | 'permissions'> & {
  password: string
  recaptcha: string
}
