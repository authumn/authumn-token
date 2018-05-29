export type Falsey = '' | 0 | false | null | undefined

export interface TokenInfo {
  accessToken: string
  accessTokenExpiresAt?: Date
  refreshToken?: string
  refreshTokenExpiresAt?: Date
  scope: string,
  user: string,
  client: string
}

export interface Client {
  id: string
  redirectUris: string[]
  grants: string[]
  accessTokenLifetime?: number
  refreshTokenLifetime?: number
  [key: string]: any
}

// The user object is completely transparent to oauth2-server
// and is simply used as input to other model functions.
export interface User {
  _id: string
  email: string
  [key: string]: any
}

export interface AccessTokenData {
  accessToken: string
  accessTokenExpiresAt?: Date
  scope?: string
  client: Client
  user: User
}

export interface RefreshTokenData {
  refreshToken: string
  refreshTokenExpiresAt?: Date
  scope?: string
  client: Client
  user: User
}

export interface AuthorizationCodeData {
  code: string
  expiresAt?: Date
  redirectUri?: string
  scope?: string
  client: Client
  user: User
}
