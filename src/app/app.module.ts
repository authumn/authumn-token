import { Module, NestModule } from '@nestjs/common'
import { TokenModule } from './token'

@Module({
  modules: [
    TokenModule
  ]
})
export class ApplicationModule { }
