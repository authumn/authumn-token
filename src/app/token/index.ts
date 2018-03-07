import {
  MiddlewaresConsumer,
  Module,
  NestModule, RequestMethod,
  Inject
} from '@nestjs/common'
import { TokenService } from './token.service'
import { OAuth2ModelRedis } from './oauth2.model.redis'
import { TokenController } from './token.controller'
import { tokenProviders } from './token.providers'
import * as oAuthServer from 'express-oauth-server'

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
  public configure ( consumer: MiddlewaresConsumer) { }
}
