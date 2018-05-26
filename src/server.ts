import { NestFactory } from '@nestjs/core'
import { INestApplication } from '@nestjs/common'
import { ApplicationModule } from './app/app.module'
import { environment } from './environments/environment'
import { whitelist } from '@nestling/cors'

const pkg = require('../package.json')

const app: Promise<INestApplication> = NestFactory.create(ApplicationModule)

app.then(instance => {
  instance.enableCors(
    whitelist(environment.whitelist, {})
  )
  instance.listen(environment.port, () =>
    console.log(`${pkg.name} is listening on port ${environment.port}`)
  )
}).catch((error) => {
  console.error(error)
})
