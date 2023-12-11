export interface IRoomCreate {
  name: string
  description: string
  members: string[]
}

export interface IRoomUpdate extends IRoomCreate {
  id: string
}
