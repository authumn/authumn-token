import * as jwt from 'jsonwebtoken'
import * as uuid from 'uuid'
import {
  Injectable,
  Inject
} from '@nestjs/common'
import { RedisClient } from 'redis'
import { environment } from '../../environments/environment'
import { promisify } from 'util'
import { User } from '../models/types'

const signJwt = promisify(jwt.sign)

/**
 * TODO: double check this
 *
 * @param userKey
 * @returns {string}
 */
export function secret (userKey: string): string {
  return [environment.token.secret, userKey].join(':')
}

export function createSessionKey (...args) {
  return args.join(':')
}

export function createToken (user, userKey, payload) {
  return jwt.sign(
    payload,
    secret(userKey),
    {
      algorithm: 'HS256',
      expiresIn: environment.token.expiration_time
      // jwtid: environment.token.jwtid || ''
      // notBefore:
      // audience:
      // issuer:
      // jwtid:
      // subject:
      // noTimestamp
      // header
      // keyId
    }
  )
}

@Injectable()
export class TokenService {
  constructor (
    @Inject('RedisToken') private redis: RedisClient
  ) {}

  /**
   * @param user
   * @param deviceId
   * @returns {Promise<Promise<any> & number & Buffer & string & PromiseLike<ArrayBuffer>>}
   */
  async sign (user: User, deviceId: string | null = null): Promise<string> {
    const userKey = uuid.v4()
    const issuedAt = Math.floor(Date.now() / 1000)

    const payload = {
      _id: user._id,
      email: user.email,
      deviceId,
      iat: issuedAt
    }

    const token = createToken(user, userKey, payload)

    const sessionKey = createSessionKey(environment.client.id, user._id, deviceId, issuedAt)

    const writeSessionKey = await this.redis.setAsync(sessionKey, userKey)

    if (writeSessionKey === 'OK') {
      const expireAsyncResult = await this.redis.expireAsync(sessionKey, environment.token.expiration_time)

      if (expireAsyncResult === 1) {
        return token
      }

      throw Error('Failed to set expire.')
    }

    throw Error('Failed to write session key.')
  }

  /**
   * Get Session from redis store
   *
   * @param {string} sessionKey
   * @returns {Promise<any>}
   */
  async get (sessionKey: string): Promise<string> {
    return this.redis.getAsync(sessionKey)
  }

  /**
   * Remove session from redis store
   *
   * @param {string} sessionKey
   * @returns {Promise<any>}
   */
  async delete (sessionKey: string) {
    return this.redis.delAsync(sessionKey)
  }

  /**
   * Get token list as in redis
   *
   * @returns {Promise<void>}
   */
  async keys () {
    return this.redis.keysAsync('*')
  }
}
