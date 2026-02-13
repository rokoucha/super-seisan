import { type RouteHandler } from '@hono/zod-openapi'
import { postSeisanSeisanIdItemsRoute } from '../generated/routes'
import * as itemUsecase from '../usecases/item'
import * as seisanUsecase from '../usecases/seisan'

export const addItemToSeisanHandler: RouteHandler<
  typeof postSeisanSeisanIdItemsRoute
> = async (c) => {
  const { seisanId } = c.req.valid('param')
  const input = c.req.valid('json')
  await itemUsecase.addItemToSeisan(seisanId, input)
  const result = await seisanUsecase.getSeisan(seisanId)
  return c.json(result, 200)
}
