import * as express from 'express'
import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { TokenModule } from '../../src/app/token'
import { TokenService } from '../../src/app/token/token.service'
import { INestApplication } from '@nestjs/common'

describe('TokenService', () => {
  let server
  let app: INestApplication

  const tokenService = { findAll: () => ['srd'] }

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [TokenModule]
    })
      .overrideComponent(TokenService)
      .useValue(tokenService)
      .compile()

    server = express()
    app = module.createNestApplication(server)
    await app.init()
  })

  it(`/GET token`, () => {
    return request(server)
      .get('/token')
      .expect(200)
      .expect({
        data: tokenService.findAll()
      })
  })

  afterAll(async () => {
    await app.close()
  })
})
