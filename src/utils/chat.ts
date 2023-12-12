import { User } from 'models/auth/user'

export const prepareMembers = (members: User[], userId: string) => [
  ...new Set([...members.map(({ id }) => id), userId])
]
