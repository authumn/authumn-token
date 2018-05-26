/* tslint:disable */

import {
  AccessToken,
  AccessTokenData,
  AuthorizationCode,
  AuthorizationCodeData,
  Client,
  ClientId,
  ClientSecret,
  Falsey,
  Password,
  RefreshToken,
  RefreshTokenData,
  Scope,
  TokenInfo,
  User,
  Username
} from './types'

export class OAuthModel {
  /**
   * Invoked to generate a new access token.
   *
   * This model function is optional.
   *
   * If not implemented, a default handler is used.
   *
   * That generates access tokens consisting of 40 characters in the range of a..z0..9.
   *
   * Invoked during:
   *
   *  - `authorization_code` grant
   *  - `client_credentials` grant
   *  - `refresh_token` grant
   *  - `password` grant
   *
   *  Remarks:
   *
   *  `client` is the object previously obtained through Model#getClient()
   *
   *  `user` is the user object previously obtained through:
   *
   *  - Model#getAuthorizationCode(): authorization grant
   *  - Model#getUserFromClient(): client credentials grant
   *  - Model#getRefreshToken(): refresh token grant
   *  - Model#getUser(): password grant
   *
   * @param client {Client} The client the access token is generated for.
   * @param user {User} The user the access token is generated for.
   * @param scope {Scope} The scopes associated with the access token. Can be `null`
   * @returns {Promise<AccessToken>} A `string` to be used as access token.
   */
  async generateAccessToken (client: Client, user: User, scope: Scope): Promise<AccessToken> {

  }

  /**
   * Invoked to generate a new refresh token.
   *
   * This model function is optional.
   *
   * If not implemented, a default handler is used.
   *
   * That generates refresh tokens consisting of 40 characters in the range of a..z0..9.
   *
   * Invoked during:
   *
   *   - authorization_code grant
   *   - refresh_token grant
   *   - password grant
   *
   * Remarks:
   *
   * `client` is the object previously obtained through Model#getClient()
   *
   *  `user` is the user object previously obtained through:
   *
   *  - Model#getAuthorizationCode(): authorization grant
   *  - Model#getRefreshToken(): refresh token grant
   *  - Model#getUser(): password grant
   *
   * @param client {Client} The client the refresh token is generated for.
   * @param user {User} The user the refresh token is generated for.
   * @param scope {Scope} The scopes associated with the refresh token.
   * @returns {Promise<RefreshToken>}
   */
  async generateRefreshToken (client: Client, user: User, scope: Scope): Promise<RefreshToken> {

  }

  /**
   * Invoked to generate a new authorization code.
   *
   * This model function is optional.
   *
   * If not implemented, a default handler is used.
   *
   * That generates authorization codes consisting of 40 characters in the range of a..z0..9.
   *
   * Invoked during:
   *
   *   - authorization_code grant
   *
   * @param client {Client} The client the authorization code is generated for.
   * @param user {User} The user the authorization code is generated for.
   * @param scope {Scope} The scopes associated with the authorization code. Can be `null`
   * @returns {Promise<AuthorizationCode>}
   */
  async generateAuthorizationCode (client: Client, user: User, scope: Scope): Promise<AuthorizationCode> {

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
  async getAccessToken (accessToken: AccessToken): Promise<AccessTokenData> {

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
   * @param accessToken
   * @returns {Promise<RefreshTokenData>} RefreshTokenData
   */
  async getRefreshToken (refreshToken: RefreshToken): Promise<RefreshTokenData> {

  }

  /**
   * Invoked to retrieve an existing authorization code previously saved through Model#saveAuthorizationCode().
   *
   * This model function is required if the authorization_code grant is used.
   *
   * Invoked during:
   *
   *   - `authorization_code` grant
   *
   * Remarks:
   *
   * `token.client` and `token.user` can carry additional properties that will be ignored by *oauth2-server*.
   *
   * @param authorizationCode
   * @returns {Promise<AuthorizationCodeData>}
   */
  async getAuthorizationCode (authorizationCode: AuthorizationCode): Promise<AuthorizationCodeData> {

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
   * @param client {ClientId} The client id of the client to retrieve.
   * @param clientSecret {ClientSecret} The client secret of the client to retrieve. Can be `null`
   * @returns {Promise<Client>}
   */
  // TODO: not sure if Client and return value Client are one on one here..
  async getClient (clientId: ClientId, clientSecret: ClientSecret): Promise<Client> {

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
  async getUser (username: Username, password: Password): Promise<User> {

  }

  /**
   * Invoked to retrieve the user associated with the specified client.
   *
   * This model function is required if the `client_credentials` grant is used.
   *
   * Invoked during:
   *
   *   - `client_credentials` grant
   *
   * Remarks:
   *
   *   `client` is the object previously obtained through Model#getClient()
   *
   * @param client {Client} The client to retrieve the associated user for
   * @returns {Promise<Client>}
   */
  async getUserFromClient (client: Client): Promise<User | false> {

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
   * @returns {Promise<TokenInfo>}
   */
  async saveToken (token: TokenInfo, client: Client, user: User): Promise<TokenInfo> {

  }

  /**
   * Invoked to save an authorization code.
   *
   * This model function is required if the authorization_code grant is used.
   *
   * Invoked during:
   *
   *   - `authorization_code` grant
   *
   * Remarks:
   *
   *  `code.client` and `code.user` can carry additional properties that will be ignored by oauth2-server.
   *
   * @param code {AuthorizationCode} The code to be saved.
   * @param client {Client} The client associated with the authorization code.
   * @param user {User} The user associated with the authorization code.
   * @returns {Promise<AuthorizationCodeData>}
   */
  async saveAuthorizationCode (code: AuthorizationCode, client: Client, user: User): Promise<AuthorizationCodeData> {

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
  async revokeToken (token: TokenInfo): Promise<boolean> {

  }

  /**
   * Invoked to revoke an authorization code.
   *
   * This model function is required if the `authorization_code` grant is used.
   *
   * Invoked during:
   *
   *   - `authorization_code` grant
   *
   * Remarks:
   *
   * `code` is the authorization code object previously obtained through Model#getAuthorizationCode().
   *
   * @param code {AuthorizationCodeData}
   * @returns {Promise<boolean>} Return `true` if the revocation was successful or `false` if the authorization code could not be found.
   */
  async revokeAuthorizationCode (code: AuthorizationCodeData): Promise<boolean> {

  }

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
  async validateScope (user: User, client: Client, scope: Scope): Promise<Scope | Falsey>  {

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
  async verifyScope (accessToken: AccessTokenData, scope: Scope): Promise<boolean> {

  }
}
