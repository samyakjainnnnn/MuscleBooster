import { UserDTO } from './UserDTO'

export type SignInDTO = {
  refresh_token: string
  token: string
  user: UserDTO
}
