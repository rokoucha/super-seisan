import { type RouteHandler } from '@hono/zod-openapi'
import {
  postSeisanSeisanIdCurrenciesRoute,
  putSeisanSeisanIdCurrenciesIdRoute,
} from '../generated/routes'
import * as currencyUsecase from '../usecases/currency'
import * as seisanUsecase from '../usecases/seisan'

export const addCurrencyToSeisanHandler: RouteHandler<
  typeof postSeisanSeisanIdCurrenciesRoute
> = async (c) => {
  const { seisanId } = c.req.valid('param')
  const input = c.req.valid('json')
  await currencyUsecase.addCurrencyToSeisan(seisanId, input)
  const result = await seisanUsecase.getSeisan(seisanId)
  return c.json(result, 200)
}

export const updateCurrencyInSeisanHandler: RouteHandler<
  typeof putSeisanSeisanIdCurrenciesIdRoute
> = async (c) => {
  const { seisanId, id } = c.req.valid('param')
  const input = c.req.valid('json')
  await currencyUsecase.updateCurrencyInSeisan(seisanId, id, input)
  const result = await seisanUsecase.getSeisan(seisanId)
  return c.json(result, 200)
}
