import * as Bluebird from 'bluebird'
import { createClient, RedisClient } from 'redis'

Bluebird.promisifyAll(RedisClient.prototype)

export function createRedisToken (config: any) { // redis.ClientOpts) {
  return {
    provide: 'RedisToken',

    useFactory: async (): Promise<RedisClient> => {
      const client: RedisClient = createClient(config)

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
