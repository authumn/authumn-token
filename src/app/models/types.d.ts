type ClientId = string
type ClientSecret = string
type ClientAccessTokenLifetime = number
type ClientRefreshTokenLifeTime = number

type AccessToken = string
type RefreshToken = string
type AuthorizationCode = string
type RedirectUri = string
type RedirectUris = RedirectUri[]
type Grant = string
type Grants = Grant[]

type Falsey = '' | 0 | false | null | undefined

type AccessTokenExpiresAt = Date
type RefreshTokenExpiresAt = Date

interface TokenInfo {
  accessToken: AccessToken
  accessTokenExpireAt: AccessTokenExpiresAt
  refreshToken?: RefreshToken
  refreshTokenExpiresAt?: RefreshTokenExpiresAt
  scope: Scope,
  user: string,
  client: string
}

type Username = string
type Password = string

export interface Client {
  id: ClientId
  redirectUris: RedirectUris
  grants: Grants
  accessTokenLifetime?: ClientAccessTokenLifetime
  refreshTokenLifetime?: ClientRefreshTokenLifeTime
}

export interface User {
  // The user object is completely transparent to oauth2-server
  // and is simply used as input to other model functions.
}

type Scope = string

export interface AccessTokenData {
  accessToken: string
  accessTokenExpiresAt?: AccessTokenExpiresAt
  scope?: string
  client: Client
  user: User
}

export interface RefreshTokenData {
  refreshToken: RefreshToken
  refreshTokenExpiresAt?: RefreshTokenExpiresAt
  scope?: Scope
  client: Client
  user: User
}

export interface AuthorizationCodeData {
  code: AuthorizationCode
  expiresAt?: Date
  redirectUri?: RedirectUri
  scope?: Scope
  client: Client
  user: User
}
