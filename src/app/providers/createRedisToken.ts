import * as Bluebird from 'bluebird'
import * as redis from 'redis'

Bluebird.promisifyAll(redis.RedisClient.prototype)

export function createRedisToken (config: any) { // redis.ClientOpts) {
  return {
    provide: 'RedisToken',

    useFactory: async () => {
      const client = redis.createClient(config)

      client.on('connect', () => {
        console.log('Redis connected')
      })

      client.on('reconnecting', (delay, attempt) => {
        console.log(`Lost connection: delay(${delay} attempt(${attempt}`)
      })

      client.on('error', (error) => {
        console.error(error)
      })

      return client
    }
  }
}
