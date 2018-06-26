import { Injectable, Inject } from '@nestjs/common'
import { RedisClient } from 'redis'
import axios from 'axios'
import {
  AccessTokenData,
  Falsey,
  RefreshTokenData,
  TokenInfo
} from '../models/types'
import {
  Client,
  PasswordModel,
  Token,
  User
} from 'oauth2-server'
import { environment } from '../../environments/environment'
import * as uuid from 'uuid'
import * as jwt from 'jsonwebtoken'

export type DecodedToken = {
  jti: string
}

const GRANT_TYPE = 'password'

const KEYS = {
  TOKEN: val => `tokens:${val}`,
  CLIENT: val => `clients:${val}`,
  REFRESH_TOKEN: val => `refresh_tokens:${val}`,
  GRANT_TYPES: val => `clients:${val}:grant_types`,
  USER: val => `users:${val}`
}

@Injectable()
export class OAuth2ModelRedis implements PasswordModel { // , RefreshTokenModel, AuthorizationCodeModel {
  constructor (
    @Inject('RedisToken') private redis: RedisClient
  ) {
    this.redis.select(environment.redis.database)
  }

  /**
   * Invoked to retrieve an existing access token previously saved through Model#saveToken().
   *
   * This model function is required if OAuth2Server#authenticate() is used.
   *
   * Invoked during:
   *
   *   - request authentication
   *
   * Remarks:
   *
   * `token.client` and `token.user` can carry additional properties that will be ignored by *oauth2-server*.
   *
   * @param accessToken
   * @returns {Promise<AccessTokenData>} AccessTokenData
   */
  async getAccessToken (accessToken: string): Promise<Token> {
    const decoded = jwt.decode(accessToken) as DecodedToken

    if (decoded.jti) {
      return JSON.parse(
        await this.redis.getAsync(KEYS.TOKEN(decoded.jti))
      )
    }

    throw Error('Unable to retrieve access token.')
  }

  /**
   * Invoked to retrieve an existing refresh token previously saved through Model#saveToken().
   *
   * This model function is required if the refresh_token grant is used.
   *
   * Invoked during:
   *
   *   - `refresh_token` grant
   *
   * Remarks:
   *
   * `token.client` and `token.user` can carry additional properties that will be ignored by *oauth2-server*.
   *
   * @param refreshToken
   * @returns {Promise<RefreshTokenData>} RefreshTokenData
   */
  async getRefreshToken (refreshToken: string): Promise<RefreshTokenData> {
    return JSON.parse(await this.redis.getAsync(KEYS.REFRESH_TOKEN(refreshToken)))
  }

  /**
   * Invoked to retrieve a client using a client id or a client id/client secret combination, depending on the grant type.
   *
   *  This model function is required for all grant types.
   *
   *  Invoked during:
   *
   *    - `authorization_code` grant
   *    - `client_credentials` grant
   *    - `refresh_token` grant
   *    - `password` grant
   *
   * Remarks:
   *
   * The return value (`client`) can carry additional properties that will be ignored by *oauth2-server*.
   *
   * ### From: https://blog.cloudboost.io/how-to-make-an-oauth-2-server-with-node-js-a6db02dc2ce7
   *
   * This method returns the client application which is attempting to get the
   * accessToken. The client is normally found using the clientID & clientSecret
   * and validated using the clientSecret. However, with user facing client applications
   * such as mobile apps or websites which use the password grantType we don't use the
   * clientID or clientSecret in the authentication flow.  Therefore, although the client
   * object is required by the library all of the client's fields can be  be null. This
   * also includes the grants field. Note that we did, however, specify that we're using the
   * password grantType when we made the* oAuth object in the index.js file.
   *
   * The callback takes 2 parameters. The first parameter is an error of type falsey
   * and the second is a client object. As we're not retrieving the client using the
   * clientID and clientSecret (as we're using the password grantt type) we can just
   * create an empty client with all null values. Because the client is a hardcoded
   * object - as opposed to a client we've retrieved through another operation - we just
   * pass false for the error parameter as no errors can occur due to the aforementioned hardcoding.
   *
   * Me: GRANT_TYPE is set just to emphasize the why.
   *
   * @param clientId {string} The client id of the client to retrieve.
   * @param clientSecret {string} The client secret of the client to retrieve. Can be `null`
   * @returns {Promise<Client>}
   */
  async getClient (clientId: string, clientSecret?: string): Promise<Client> {
    if (GRANT_TYPE === 'password') {
      return {
        id: clientId,
        // redirectUris: null,
        grants: ['password']
      }
    } else {
      throw Error('Only password grant type supported.')
      /*
      const json = await this.redis.hgetallAsync(KEYS.CLIENT(clientId))
      const client = JSON.parse(json)

      // TODO: not sure what to do with the client secret..
      if (!client || client.clientSecret !== clientSecret) {
        return undefined
      }

      return client
      */
    }
  }

  /**
   * Invoked to retrieve a user using a username/password combination.
   *
   * This model function is required if the password grant is used.
   *
   * Invoked during:
   *
   *   - `password` grant
   *
   * @param username {Username} The username of the user to retrieve
   * @param password {Password} The user's password
   * @returns {Promise<User>} An Object representing the user,
   *                          or a falsy value if no such user could be found.
   *                          The user object is completely transparent to oauth2-server
   *                          and is simply used as input to other model functions.
   */
  async getUser (login: string, password: string): Promise<User | false> {
    const data = {
      login,
      password
    }

    console.log('Sending', data, 'to', environment.user.api)

    const user = await axios({
      method: 'post',
      url: environment.user.api,
      headers: {
        'Content-Type': 'application/json'
      },
      data
    })

    if (user && user.data && user.data.email) {
      return {
        id: user.data.id,
        email: user.data.email,
        username: user.data.username
      }
    }

    return false
  }

  /**
   * Invoked to save an access token and optionally a refresh token, depending on the grant type.
   *
   * This model function is required for all grant types.
   *
   * Invoked during:
   *
   *   - authorization_code grant
   *   - client_credentials grant
   *   - refresh_token grant
   *   - password grant
   *
   * Remarks:
   *
   * `token.client` and `token.user` can carry additional properties
   * that will be ignored by oauth2-server.
   *
   *  If the `allowExtendedTokenAttributes` server option is enabled (see OAuth2Server#token())
   *  any additional attributes set on the result are copied to the token response sent to the client.
   *
   * @param token {TokenInfo} The token(s) to be saved.
   * @param client {Client} The client associated with the token(s).
   * @param user {User} The user associated with the token(s).
   * @returns {Promise<Token>}
   */
  async saveToken (token: Token, client: Client, user: User): Promise<Token> {
    const decoded = jwt.decode(token.accessToken) as DecodedToken

    if (decoded.jti) {
      const jti = decoded.jti

      const accessTokenData = {
        client,
        user,
        scope: '',
        ...token
      }

      const refreshTokenData = {
        refreshToken: token.refreshToken,
        refreshTokenExpireAt: token.refreshTokenExpiresAt,
        scope: token.scope,
        client,
        user
      }

      const accessTokenKey = KEYS.TOKEN(jti)
      const refreshTokenKey = KEYS.REFRESH_TOKEN(token.refreshToken)

      const writeAccessToken = await this.redis.setAsync(accessTokenKey, JSON.stringify(accessTokenData)) as string
      const writeRefreshToken = await this.redis.setAsync(refreshTokenKey, JSON.stringify(refreshTokenData)) as string

      await this.redis.expireAsync(accessTokenKey, environment.token.expiration_time)
      await this.redis.expireAsync(refreshTokenKey, environment.token.refresh_expiration_time)

      if (writeAccessToken === 'OK' && writeRefreshToken === 'OK') {
        return accessTokenData
      }

      throw Error('Failed to write tokens')
    }

    throw Error('Invalid token.')
  }

  /**
   * Invoked to revoke a refresh token.
   *
   * This model function is required if the `refresh_token` grant is used.
   *
   * Invoked during:
   *
   *   - `refresh_token` grant
   *
   * Remarks:
   *
   * token is the refresh token object previously obtained through Model#getRefreshToken().
   *
   * @param token {TokenInfo} The token to be revoked.
   * @returns {Promise<boolean>} Return `true` if the revocation was successful or `false` if the refresh token could not be found.
   */
  async revokeToken (token: RefreshTokenData): Promise<boolean> {
    const refreshToken = await this.redis.getAsync(KEYS.REFRESH_TOKEN(token.refreshToken))

    if (refreshToken) {
      await this.redis.delAsync(KEYS.TOKEN(token.refreshToken))

      return true
    }

    return false
  }

  /**
   * Invoked during request authentication to check if the provided access token was authorized the requested scopes.
   *
   * This model function is required if scopes are used with OAuth2Server#authenticate().
   *
   * Invoked during:
   *
   *   - request authentication
   *
   * Remarks:
   *
   * `token` is the access token object previously obtained through Model#getAccessToken().
   *
   * `scope` is the required scope as given to OAuth2Server#authenticate() as options.scope.
   *
   * @param accessToken {AccessTokenData} The access token to test against.
   * @param scope {Scope} The required scopes.
   * @returns {Promise<boolean>}
   */
  async verifyScope (accessToken: Token, scope: string): Promise<boolean> {
    if (!accessToken.scope) {
      return false
    }

    const scopes = scope.split(' ')

    return Boolean(
      accessToken.scope.split(' ')
      .find((scopeName) => scopes.indexOf(scopeName) >= 0)
    )
  }

  /**
   * Invoked to generate a new access token.
   *
   * This model function is optional.
   * If not implemented, a default handler is used that generates access tokens
   * consisting of 40 characters in the range of `a..z0..9.`
   *
   * Invoked during:
   *
   *   - `authorization_code` grant
   *   - `client_credentials` grant
   *   - `refresh_token` grant
   *   - `password` grant
   *
   * @param client {Client} The client the access token is generated for.
   * @param user {User} The user the access token is generated for.
   * @param scope {string} The scopes associated with the access token. Can be `null`.
   * @returns {Promise<string>}
   */
  async generateAccessToken (client: Client, user: User, scope?: string): Promise<string> {
    const userKey = uuid.v4()
    const issuedAt = Math.floor(Date.now() / 1000)

    const leeway = 2 * 60 * 1000

    // https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
    // https://github.com/zmartzone/lua-resty-openidc/blob/cc66a454e1e63524459a8352c027fb96833d84a6/tests/spec/test_support.lua
    const payload = {
      iss: environment.token.issuer,
      aud: 'client_id', // TODO: should be set properly
      scope,
      // email_verified: ...
      sub: user.id || 'unique id missing',
      username: user.username,
      exp: issuedAt + environment.token.expiration_time + leeway,
      iat: issuedAt
      // profile: user,
      // deviceId, // allow login at multiple devices.
    }

    // This should just be a private key.
    // then must work in conjuction with openresty
    // const secret = [environment.token.secret, userKey].join(':')

    const secret = environment.token.secret

    const jwtid = uuid.v4()
    console.log('our jwtid', jwtid)
    const token = jwt.sign(
      payload,
      secret,
      {
        algorithm: 'HS256',
        // expiresIn: environment.token.expiration_time,
        jwtid
        // notBefore:
        // audience:
        // issuer:
        // jwtid:
        // subject:
        // noTimestamp
        // header
        // keyId
      }
    )

    return token
  }

  /**
   * Invoked to generate a new refresh token.
   *
   * This model function is optional.
   * If not implemented, a default handler is used that generates refresh tokens
   * consisting of 40 characters in the range of `a..z0..9.`
   *
   *   Invoked during:
   *
   *   - `authorization_code` grant
   *   - `refresh_token` grant
   *   - `password` grant
   *
   * @param client {Client} The client the access token is generated for.
   * @param user {User} The user the access token is generated for.
   * @param scope {Scope} The scopes associated with the access token. Can be `null`.
   * @returns {Promise<RefreshToken>}
   */
  /*
  async generateRefreshToken(client, user, scope): RefreshToken {
  }
  */

  /**
   * Invoked to check if the requested scope is valid for a particular client/user combination.
   *
   * This model function is optional. If not implemented, any scope is accepted.
   *
   * Invoked during:
   *
   *   - `authorization_code` grant
   *   - `client_credentials` grant
   *   - `password` grant
   *
   * Remarks:
   *
   * `user` is the user object previously obtained through:
   *
   *   - Model#getAuthorizationCode() (code.user; authorization code grant),
   *   - Model#getUserFromClient() (client credentials grant) or
   *   - Model#getUser() (password grant).
   *
   * `client` is the object previously obtained through Model#getClient (all grants).
   *
   *   You can decide yourself whether you want to reject or accept partially valid scopes by simply filtering out invalid scopes and returning only the valid ones.
   *
   * @param user {User} The associated user.
   * @param client {Client} The associated client.
   * @param scope {Scope} The associated scope.
   * @returns {Promise<Scope | Falsey>}
   */
  /*
  async validateScope (user: User, client: Client, scope: Scope): Promise<Scope | Falsey>  {
  }
  */
}
