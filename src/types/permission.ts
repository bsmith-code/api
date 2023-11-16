import { PERMISSIONS_ALL } from 'constants/permissions'

export interface IPermission {
  id: string
  name: (typeof PERMISSIONS_ALL)[number]
}
