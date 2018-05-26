export interface TokenServiceEnvironment {
  port: string
  user: {
    api: string
  },
  token: {
    issuer: string
    expiration_time: number
    refresh_expiration_time: number
    secret: string
  },
  redis: {
    port: string
    host: string
    database: number
  },
  whitelist: string[]
}
