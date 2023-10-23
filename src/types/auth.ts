interface IUser {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface IAuthUser extends IUser {
  id: string
  createdAt: string
  updatedAt: string
}

export interface IAuthUserCreate extends IUser {
  recaptcha: string
}
