import { type RouteHandler } from '@hono/zod-openapi'
import {
  deleteSeisanSeisanIdItemsIdRoute,
  postSeisanSeisanIdItemsRoute,
  putSeisanSeisanIdItemsIdRoute,
} from '../generated/routes'
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

export const updateItemInSeisanHandler: RouteHandler<
  typeof putSeisanSeisanIdItemsIdRoute
> = async (c) => {
  const { seisanId, id } = c.req.valid('param')
  const input = c.req.valid('json')
  await itemUsecase.updateItemInSeisan(seisanId, id, input)
  const result = await seisanUsecase.getSeisan(seisanId)
  return c.json(result, 200)
}

export const removeItemFromSeisanHandler: RouteHandler<
  typeof deleteSeisanSeisanIdItemsIdRoute
> = async (c) => {
  const { seisanId, id } = c.req.valid('param')
  await itemUsecase.removeItemFromSeisan(seisanId, id)
  const result = await seisanUsecase.getSeisan(seisanId)
  return c.json(result, 200)
}
