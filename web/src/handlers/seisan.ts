import { type RouteHandler } from '@hono/zod-openapi'
import { postSeisanRoute } from '../generated/routes'
import { addSeisanUsecase } from '../usecases/seisan'

export const addSeisanHandler: RouteHandler<typeof postSeisanRoute> = async (
  c,
) => {
  const input = c.req.valid('json')
  const result = await addSeisanUsecase(input)
  return c.json(result, 200)
}
