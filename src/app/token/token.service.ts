import * as jwt from 'jsonwebtoken'
import * as uuid from 'uuid'
import { Component, Inject } from '@nestjs/common'
import { RedisClient } from 'redis'
import { environment } from '../../environments/environment'
import { promisify } from 'util'

const signJwt = promisify(jwt.sign)

export function createSessionKey (...args) {
  return args.join(':')
}

@Component()
export class TokenService {
  constructor (
    @Inject('RedisToken') private redis: RedisClient
  ) {}

  /**
   * @param user
   * @param deviceId
   * @returns {Promise<Promise<any> & number & Buffer & string & PromiseLike<ArrayBuffer>>}
   */
  async sign (user, deviceId): Promise<string> {
    const userKey = uuid.v4()
    const issuedAt = Math.floor(Date.now() / 1000)

    const payload = {
      _id: user._id,
      email: user.email,
      deviceId,
      iat: issuedAt
    }

    const token = jwt.sign(
      payload,
      this.secret(userKey),
      {
        algorithm: 'HS256',
        expiresIn: environment.token.expiration_time,
        jwtid: environment.token.jwt_id || ''
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

    const sessionKey = createSessionKey('specsh', user._id, deviceId, issuedAt)

    await this.redis.setAsync(sessionKey, userKey)
    await this.redis.expireAsync(sessionKey, environment.token.expiration_time)

    return token
  }

  /**
   * TODO: double check this
   *
   * @param userKey
   * @returns {string}
   */
  secret (userKey) {
    return [environment.token.secretOrPrivateKey, userKey].join(':')
  }

  /**
   * Get Session from redis store
   *
   * @param {string} sessionKey
   * @returns {Promise<any>}
   */
  async get (sessionKey: string) {
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
