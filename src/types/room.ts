import { User } from 'models/auth/user'

export interface IRoomRequest {
  id?: string
  name: string
  description: string
  members: User[]
}
