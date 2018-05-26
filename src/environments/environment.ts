

let whitelist = [
  'http://localhost:2301',
  'http://authumn'
]

if (process.env.WHITELIST) {
  whitelist = process.env.WHITELIST.split(',')
    .map((str) => str.trim())
}

const {
  PORT,
  USER_API,
  TOKEN_EXPIRATION_TIME,
  TOKEN_REFRESH_EXPIRATION_TIME,
  TOKEN_ISSUER,
  TOKEN_SECRET,
  REDIS_PORT,
  REDIS_HOST,
  REDIS_DATABASE
} = process.env

export const environment = {
  client: {
    id: 'authumn'
  },
  port: PORT || 2301,
  user: {
    api: USER_API || 'http://test.com/api/user/login'
  },
  token: {
    issuer: TOKEN_ISSUER || 'https://test.com',
    expiration_time: TOKEN_EXPIRATION_TIME ? parseInt(TOKEN_EXPIRATION_TIME, 10) : 24 * 60 * 60 * 1000,
    refresh_expiration_time: TOKEN_REFRESH_EXPIRATION_TIME ? parseInt(TOKEN_REFRESH_EXPIRATION_TIME, 10) : 10 * 60 * 1000,
    secret: TOKEN_SECRET || 'change_me'
  },
  redis: {
    port: REDIS_PORT ? parseInt(REDIS_PORT, 10) : 6379,
    host: REDIS_HOST || 'localhost',
    database: REDIS_DATABASE || 0
  },
  whitelist
}
