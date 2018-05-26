import {
  MiddlewareConsumer,
  Module,
  NestModule
} from '@nestjs/common'
import { TokenService } from './token.service'
import { OAuth2ModelRedis } from './oauth2.model.redis'
import { TokenController } from './token.controller'
import { tokenProviders } from './token.providers'

@Module({
  components: [
    TokenService,
    OAuth2ModelRedis,
    ...tokenProviders
  ],
  controllers: [
    TokenController
  ]
})
export class TokenModule implements NestModule {
  public configure (_consumer: MiddlewareConsumer) { }
}
