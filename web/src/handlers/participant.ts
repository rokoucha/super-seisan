import { type RouteHandler } from '@hono/zod-openapi'
import {
  postSeisanSeisanIdParticipantsRoute,
  putSeisanSeisanIdParticipantsIdRoute,
} from '../generated/routes'
import * as participantUsecase from '../usecases/participant'
import * as seisanUsecase from '../usecases/seisan'

export const addParticipantToSeisanHandler: RouteHandler<
  typeof postSeisanSeisanIdParticipantsRoute
> = async (c) => {
  const { seisanId } = c.req.valid('param')
  const input = c.req.valid('json')
  await participantUsecase.addParticipantToSeisan(seisanId, input)
  const result = await seisanUsecase.getSeisan(seisanId)
  return c.json(result, 200)
}

export const updateParticipantInSeisanHandler: RouteHandler<
  typeof putSeisanSeisanIdParticipantsIdRoute
> = async (c) => {
  const { seisanId, id } = c.req.valid('param')
  const input = c.req.valid('json')
  await participantUsecase.updateParticipantInSeisan(seisanId, id, input)
  const result = await seisanUsecase.getSeisan(seisanId)
  return c.json(result, 200)
}
