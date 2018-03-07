import * as crypto from 'crypto'
import * as Bluebird from 'bluebird'

const randomBytes = Bluebird.promisify(crypto.randomBytes)

/**
 * Generate random token.
 *
 * @returns {Bluebird<string>}
 */
export function generateRandomToken() {
  return randomBytes(256).then(function (buffer) {
    return crypto
      .createHash('sha1')
      .update(buffer)
      .digest('hex')
  })
}
