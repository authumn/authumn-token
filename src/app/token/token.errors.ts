import { IErrorMessage } from '@nestling/errors'

import * as oauth from 'oauth2-server'

export const oauth2ServerErrorHandler = {
  type: (oauth as any).OAuthError,
  handler: (exception): IErrorMessage => {
    return {
      code: exception.name,
      message: exception.message,
      statusCode: exception.statusCode
    }
  }
}
