import { User } from 'models/user'

export const prepareMembers = (members: User[], userId: string) => [
  ...new Set([...members.map(({ id }) => id), userId])
]
