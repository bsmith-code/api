export interface IRoomCreate {
  name: string
  members: string[]
}

export interface IRoomUpdate extends IRoomCreate {
  id: string
}
