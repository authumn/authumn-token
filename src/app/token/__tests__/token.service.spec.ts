import { Test } from '@nestjs/testing'
import { expect } from 'chai'
import { TokenService } from '../token.service'
import { environment } from '../../../environments/environment'
import { createRedisToken } from '../../providers'

const redisToken = createRedisToken(environment.redis)

describe('TokenService', () => {
  let tokenService: TokenService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TokenService,
        redisToken
      ]
    }).compile()

    tokenService = module.get<TokenService>(TokenService)
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
