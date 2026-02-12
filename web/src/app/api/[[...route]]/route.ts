import { OpenAPIHono } from '@hono/zod-openapi'
import { handle } from 'hono/vercel'
import { ZodError } from 'zod'
import packageJson from '../../../../package.json' assert { type: 'json' }
import {
  BadRequestError,
  ConflictError,
  DomainError,
  InternalServerError,
  NotFoundError,
} from '../../../errors'
import {
  deleteSeisanSeisanIdCurrenciesIdRoute,
  deleteSeisanSeisanIdParticipantsIdRoute,
  getSeisanIdRoute,
  postSeisanRoute,
  postSeisanSeisanIdCurrenciesRoute,
  postSeisanSeisanIdParticipantsRoute,
  putSeisanSeisanIdCurrenciesIdRoute,
  putSeisanSeisanIdParticipantsIdRoute,
  putSeisanIdRoute,
} from '../../../generated/routes'
import {
  addCurrencyToSeisanHandler,
  removeCurrencyFromSeisanHandler,
  updateCurrencyInSeisanHandler,
} from '../../../handlers/currency'
import {
  addParticipantToSeisanHandler,
  removeParticipantFromSeisanHandler,
  updateParticipantInSeisanHandler,
} from '../../../handlers/participant'
import {
  addSeisanHandler,
  getSeisanHandler,
  updateSeisanHandler,
} from '../../../handlers/seisan'

export const app = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json(
        {
          error: {
            code: 'BAD_REQUEST',
            message: 'Validation failed',
            details: result.error.issues,
          },
        },
        400,
      )
    }
  },
}).basePath('/api')

app.onError((err, c) => {
  if (err instanceof DomainError) {
    if (err instanceof BadRequestError) {
      return c.json(
        {
          error: {
            code: 'BAD_REQUEST',
            message: err.message,
          },
        },
        400,
      )
    }
    if (err instanceof NotFoundError) {
      return c.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: err.message,
          },
        },
        404,
      )
    }
    if (err instanceof ConflictError) {
      return c.json(
        {
          error: {
            code: 'CONFLICT',
            message: err.message,
          },
        },
        409,
      )
    }
    if (err instanceof InternalServerError) {
      return c.json(
        {
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: err.message,
          },
        },
        500,
      )
    }
  }

  if (err instanceof ZodError) {
    return c.json(
      {
        error: {
          code: 'BAD_REQUEST',
          message: 'Validation failed',
          details: err.issues,
        },
      },
      400,
    )
  }

  console.error(err)
  return c.json(
    {
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
    },
    500,
  )
})

app.get('/', (c) => {
  return c.json({
    version: packageJson.version,
  })
})

app.openapi(postSeisanRoute, addSeisanHandler)
app.openapi(putSeisanIdRoute, updateSeisanHandler)
app.openapi(getSeisanIdRoute, getSeisanHandler)
app.openapi(postSeisanSeisanIdParticipantsRoute, addParticipantToSeisanHandler)
app.openapi(
  putSeisanSeisanIdParticipantsIdRoute,
  updateParticipantInSeisanHandler,
)
app.openapi(
  deleteSeisanSeisanIdParticipantsIdRoute,
  removeParticipantFromSeisanHandler,
)
app.openapi(postSeisanSeisanIdCurrenciesRoute, addCurrencyToSeisanHandler)
app.openapi(putSeisanSeisanIdCurrenciesIdRoute, updateCurrencyInSeisanHandler)
app.openapi(
  deleteSeisanSeisanIdCurrenciesIdRoute,
  removeCurrencyFromSeisanHandler,
)

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
