import {
  MiddlewareConsumer,
  Module,
  NestModule
} from '@nestjs/common'
import { TokenService } from './token.service'
import { OAuth2ModelRedis } from './oauth2.model.redis'
import { TokenController } from './token.controller'
import { createRedisToken } from '../providers'
import { environment } from '../../environments/environment'

const { port, host } = environment.redis

const redisToken = createRedisToken({
  host,
  port: port || 6379
} as any)

@Module({
  providers: [
    TokenService,
    OAuth2ModelRedis,
    redisToken
  ],
  controllers: [
    TokenController
  ]
})
export class TokenModule implements NestModule {
  public configure (_consumer: MiddlewareConsumer) { }
}
