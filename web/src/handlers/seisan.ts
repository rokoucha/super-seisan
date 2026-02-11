import { type RouteHandler } from '@hono/zod-openapi'
import {
  getSeisanIdRoute,
  postSeisanRoute,
  putSeisanIdRoute,
} from '../generated/routes'
import * as seisanUsecase from '../usecases/seisan'

export const addSeisanHandler: RouteHandler<typeof postSeisanRoute> = async (
  c,
) => {
  const input = c.req.valid('json')
  const result = await seisanUsecase.addSeisan(input)
  return c.json(result, 200)
}

export const updateSeisanHandler: RouteHandler<
  typeof putSeisanIdRoute
> = async (c) => {
  const { id } = c.req.valid('param')
  const input = c.req.valid('json')
  const result = await seisanUsecase.updateSeisan(id, input)
  return c.json(result, 200)
}

export const getSeisanHandler: RouteHandler<typeof getSeisanIdRoute> = async (
  c,
) => {
  const { id } = c.req.valid('param')
  const result = await seisanUsecase.getSeisan(id)
  return c.json(result, 200)
}
