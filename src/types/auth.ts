export interface IUser {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface IAuthUser extends IUser {
  id: string
  verified: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface IAuthUserCreate extends IUser {
  recaptcha: string
}
