import { User } from 'models/user'

export interface IRoomRequest {
  id?: string
  name: string
  description: string
  members: User[]
}
