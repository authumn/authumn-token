import { Test } from '@nestjs/testing'
import { expect } from 'chai'
import { TokenService } from '../token.service'
import { environment } from '../../../environments/environment'
import { createRedisToken } from '../../providers'
import { OAuth2ModelRedis } from '../oauth2.model.redis'
import { Client, User } from 'oauth2-server'
import { RedisClient } from 'redis'

const redisToken = createRedisToken(environment.redis)

describe('Oauth2 Model Redis', () => {
  let model: OAuth2ModelRedis
  let client: Client
  let accessToken: string
  let redis: RedisClient

  const user: User = {
    id: 'testUser',
    email: 'john.doe@test.com'
  }

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OAuth2ModelRedis,
        redisToken
      ]
    }).compile()

    model = module.get<OAuth2ModelRedis>(OAuth2ModelRedis)
    redis = module.get<RedisClient>('RedisToken')
  })

  afterAll((done) => {
    redis.quit(done)
  })

  it('can get client', async () => {
    client = await model.getClient(null)

    expect(client).to.eql({
      id: null,
      grants: ['password']
    })
  })

  // needs access to user service, so Mock That.
  it.skip('can get user', async () => {
    const username = 'testUser'
    const password = '123123me'

    expect(
      await model.getUser(username, password)).to.be.a('string')
  })

  it('can generate access token', async () => {
    const scope = ''

    accessToken = await model.generateAccessToken(client, user, scope)

    expect(accessToken).to.be.a('string')
    expect(accessToken.split('.')).to.have.lengthOf(3)
  })

  it('can saveToken ', async () => {
    const accessTokenExpiresAt = new Date()
    const refreshTokenExpiresAt = new Date()

    const token = {
      accessToken,
      accessTokenExpiresAt,
      refreshToken: 'generated_refresh_token',
      refreshTokenExpiresAt,
      // scope: undefined,
      client,
      user
    }

    expect(await model.saveToken(token, client, user)).to.eql(token)
  })

  it('can retrieve access token', async () => {
    const token = await model.getAccessToken(accessToken)

    expect(token.accessToken).to.eql(accessToken)
    expect(token.user).to.eql(user)
    expect(token.client).to.eql(client)
  })

  it('can retrieve refresh token', async () => {
    const token = await model.getRefreshToken('generated_refresh_token')

    expect(token.refreshToken).to.eql('generated_refresh_token')
    expect(token.user).to.eql(user)
    expect(token.client).to.eql(client)
  })

  it('can revoke token', async () => {
    expect(
      await model.revokeToken({
        refreshToken: 'generated_refresh_token',
        client,
        user
      })
    ).to.eql(true)
  })

  it('can verify scope', async () => {
    expect(
      await model.verifyScope({
        ...accessToken,
        scope: 'testScope'
      }, 'testScope')).to.eql(true)

    expect(
      await model.verifyScope({
        ...accessToken,
        scope: 'testScope'
      }, 'testScope2')).to.eql(false)

    expect(
      await model.verifyScope({
        ...accessToken,
        scope: 'articles admin'
      }, 'admin')).to.eql(true)
  })
})
