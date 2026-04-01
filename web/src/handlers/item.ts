import { type RouteHandler } from '@hono/zod-openapi'
import { ConflictError } from '../errors'
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
  try {
    await itemUsecase.updateItemInSeisan(seisanId, id, input)
    const result = await seisanUsecase.getSeisan(seisanId)
    return c.json(result, 200)
  } catch (err) {
    if (!(err instanceof ConflictError)) {
      throw err
    }

    const seisan = await seisanUsecase.getSeisan(seisanId)
    const current = seisan.items.find((item) => item.id === id)
    if (!current) {
      throw err
    }

    const payer =
      seisan.participants.find(
        (participant) => participant.id === input.payerId,
      ) ?? current.payer
    const currency = input.currencyId
      ? (seisan.currencies.find((c) => c.id === input.currencyId) ??
        current.currency)
      : undefined
    const exemptParticipants = input.exemptIds
      .map((participantId) =>
        seisan.participants.find(
          (participant) => participant.id === participantId,
        ),
      )
      .filter((participant) => participant !== undefined)

    const incoming = {
      ...current,
      name: input.name,
      icon: input.icon,
      payer,
      price: input.price,
      currency,
      amount: input.amount,
      total: input.total,
      exempts: input.exemptIds.length > 0 ? exemptParticipants : [],
      version: input.version,
    }

    return c.json(
      {
        current,
        incoming,
      },
      409,
    )
  }
}

export const removeItemFromSeisanHandler: RouteHandler<
  typeof deleteSeisanSeisanIdItemsIdRoute
> = async (c) => {
  const { seisanId, id } = c.req.valid('param')
  await itemUsecase.removeItemFromSeisan(seisanId, id)
  const result = await seisanUsecase.getSeisan(seisanId)
  return c.json(result, 200)
}
