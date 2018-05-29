import { Test } from '@nestjs/testing'
import { expect } from 'chai'
import { TokenService } from '../token.service'
import { environment } from '../../../environments/environment'
import { createRedisToken } from '../../providers'
import { RedisClient } from 'redis'

const redisToken = createRedisToken(environment.redis)

describe('TokenService', () => {
  let tokenService: TokenService
  let redis: RedisClient

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TokenService,
        redisToken
      ]
    }).compile()

    tokenService = module.get<TokenService>(TokenService)
    redis = module.get<RedisClient>('RedisToken')
  })

  afterAll((done) => {
    redis.quit(done)
  })

  describe('sign', () => {
    it('signs and stores token', async () => {
      const testUser = {
        _id: 'test-id',
        email: 'john.doe@test.com'
      }
      expect(
        await tokenService.sign(
          testUser
        )).to.be.a('string')
    })
  })
})
