import { NotFoundError } from '../errors'
import * as seisanRepository from '../repositories/seisan'
import { calculateSettlement } from './settlement'

export async function addSeisan(input: {
  name: string
  emoji: string
}): Promise<{ id: string }> {
  const created = await seisanRepository.addSeisan({
    name: input.name,
    icon: input.emoji,
  })
  return { id: created.id }
}

export async function updateSeisan(
  id: string,
  input: { name: string; emoji: string },
) {
  const seisan = await seisanRepository.get(id)

  if (!seisan) {
    throw new NotFoundError('Seisan not found')
  }

  const result = await seisanRepository.update(id, {
    name: input.name,
    icon: input.emoji,
  })

  if (!result) {
    throw new NotFoundError('Seisan not found')
  }
}

export async function getSeisan(id: string) {
  const seisan = await seisanRepository.get(id)

  if (!seisan) {
    throw new NotFoundError('Seisan not found')
  }

  return formatSeisanDetail(seisan)
}

function formatSeisanDetail(
  seisan: NonNullable<Awaited<ReturnType<typeof seisanRepository.get>>>,
) {
  const items = seisan.items.map((item) => ({
    ...item,
    payer: {
      ...item.payer,
      createdAt: item.payer.createdAt.toISOString(),
      updatedAt: item.payer.updatedAt.toISOString(),
    },
    currency: item.currency
      ? {
          ...item.currency,
          createdAt: item.currency.createdAt.toISOString(),
          updatedAt: item.currency.updatedAt.toISOString(),
        }
      : undefined,
    exempts: item.exempts.map((e) => ({
      ...e.participant,
      createdAt: e.participant.createdAt.toISOString(),
      updatedAt: e.participant.updatedAt.toISOString(),
    })),
    version: item.version,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }))

  const participants = seisan.participants.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }))

  const currencies = seisan.currencies.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }))

  const result = calculateSettlement(
    items.map((item) => ({
      ...item,
      currency: item.currency ?? null,
    })),
    participants,
    seisan.id,
  )

  return {
    ...seisan,
    items,
    participants,
    currencies,
    result: {
      ...result,
      details: result.details.map((detail) => ({
        ...detail,
        items: detail.items.map((detailItem) => ({
          ...detailItem,
          source: {
            ...detailItem.source,
            currency: detailItem.source.currency ?? undefined,
          },
        })),
      })),
    },
    createdAt: seisan.createdAt.toISOString(),
    updatedAt: seisan.updatedAt.toISOString(),
  }
}
