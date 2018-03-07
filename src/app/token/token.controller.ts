import { Controller, Inject, Param, Body, Post, HttpStatus, HttpCode, Get, Req, Res, Next } from '@nestjs/common'
import { OAuth2ModelRedis } from './oauth2.model.redis'
import * as OAuth2Server from 'oauth2-server'

const UnauthorizedRequestError = require('oauth2-server/lib/errors/unauthorized-request-error')

const {
  Request,
  Response
} = OAuth2Server

@Controller('token')
export class TokenController {
  oauth: OAuth2Server
  constructor (
    private readonly oAuthModel: OAuth2ModelRedis
  ) {
    this.oauth = new OAuth2Server({
      model: oAuthModel,
      grants: ['password', 'authorization_code', 'refresh_token'],
      debug: true
    })
  }

  @Get('/protected')
  async login (@Req() req, @Res() res, @Next() next) {
    const options = {}
    const request = new Request(req)
    const response = new Response(res)

    try {
      const token = await this.oauth.authenticate(request, response, options)

      res.locals.oauth = { token: token }

      next()
    } catch (error) {
      handleError.call(this, error, req, res, null, next)
    }
  }

  @Post('/login')
  async createToken (@Req() req, @Res() res, @Next() next) {
    if (!req.body.client_id) {
      req.body.client_id = 'global'
    }

    if (!req.body.client_secret) {
      req.body.client_secret = 'global'
    }

    if (!req.body.grant_type) {
      req.body.grant_type = 'password'
    }

    const options = {}
    const request = new Request(req)
    const response = new Response(res)

    try {
      const token = await this.oauth.token(request, response, options)

      res.locals.oauth = { token: token }

      return handleResponse.call(this, req, res, response)
    } catch (error) {
      handleError.call(this, error, req, res, null, next)
    }
  }

  @Post('/authorize')
  async protectedZone (@Req() req, @Res() res, @Next() next) {
    const options = {}
    const request = new Request(req)
    const response = new Response(res)

    const code = this.oauth.authorize(request, response, options)

    res.locals.oauth = { code: code }

    return handleResponse.call(this, req, res, response)
  }

  @Get('/keys')
  async keys () {
    // return this.tokenService.keys()
  }
}

/**
 * Handle response.
 */
function handleResponse (req, res, response) {
  if (response.status === 302) {
    const location = response.headers.location

    delete response.headers.location

    res.set(response.headers)
    res.redirect(location)
  } else {
    res.set(response.headers)
    res.status(response.status).send(response.body)
  }
}

/**
 * Handle error.
 */
function handleError (e, req, res, response, next) {
  if (this.useErrorHandler === true) {
    next(e)
  } else {
    if (response) {
      res.set(response.headers)
    }

    res.status(e.code)

    if (e instanceof UnauthorizedRequestError) {
      return res.send()
    }

    res.send({ error: e.name, error_description: e.message })
  }
}
