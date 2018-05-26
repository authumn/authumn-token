import { Module, NestModule } from '@nestjs/common'
import { TokenModule } from './token'

@Module({
  imports: [
    TokenModule
  ]
})
export class ApplicationModule { }
