import * as express from 'express'
import * as axios from 'axios'
import * as AxiosMockAdapter from 'axios-mock-adapter'
import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { TokenModule } from '../../src/app/token'
import { TokenService } from '../../src/app/token/token.service'
import { INestApplication } from '@nestjs/common'

describe('TokenService', () => {
  let server
  let app: INestApplication
  const axiosMock = new AxiosMockAdapter(axios)

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

  it(`/POST token/login`, () => {
    axiosMock.onPost('http://test.com/api/user/login', {
      email: 'test@test.com',
      password: '123456'
    }).reply(202, {
      _id: 'test-user-id',
      email: 'test@test.com'
    })

    return request(server)
      .post('/token/login')
      .type('form')
      .send({
        username: 'test@test.com',
        password: '123456'
      })
      .expect(202)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.email).toBe('test@test.com')
      })
  })

  afterAll(async () => {
    await app.close()
  })
})
