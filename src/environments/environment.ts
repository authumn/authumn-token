let whitelist = [
  'http://localhost:2301',
  'http://authumn'
]

if (process.env.WHITELIST) {
  whitelist = process.env.WHITELIST.split(',')
    .map((str) => str.trim())
}

export const environment = {
  port: process.env.PORT || 2301,
  user: {
    api: process.env.USER_API || 'http://test.com/api/user/login'
  },
  token: {
    issuer: process.env.JWT_ISSUER || 'https://test.com',
    expiration_time: 24 * 60 * 60 * 1000,
    refresh_expiration_time: 10 * 60 * 1000,
    secretOrPrivateKey: process.env.JWT_SECRET || 'change_me'
  },
  redis: {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || 'localhost',
    database: process.env.REDIS_DATABASE || 0
  },
  whitelist
}
