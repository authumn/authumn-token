import * as crypto from 'crypto'
import * as util from 'util'

const randomBytes = util.promisify(crypto.randomBytes)

/**
 * Generate random token.
 *
 * @returns {Bluebird<string>}
 */
export function generateRandomToken (): Promise<string> {
  return randomBytes(256).then((buffer) => {
    return crypto
      .createHash('sha1')
      .update(buffer)
      .digest('hex')
  })
}
