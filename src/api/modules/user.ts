import { post } from '../request'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  userInfo: {
    id: number
    username: string
    nickname: string
    email: string
    avatar: string
    roles: string[]
    tokenExp: number
  }
}

export function loginApi(data: LoginParams): Promise<LoginResult> {
  return post('/api/auth/login', data)
}
