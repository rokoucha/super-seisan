import { type RouteHandler } from '@hono/zod-openapi'
import { postSeisanRoute } from '../generated/routes'
import * as seisanUsecase from '../usecases/seisan'

export const addSeisanHandler: RouteHandler<typeof postSeisanRoute> = async (
  c,
) => {
  const input = c.req.valid('json')
  const result = await seisanUsecase.addSeisan(input)
  return c.json(result, 200)
}
