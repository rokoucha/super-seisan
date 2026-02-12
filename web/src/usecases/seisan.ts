import { NotFoundError } from '../errors'
import * as seisanRepository from '../repositories/seisan'

export async function addSeisan(input: { name: string; emoji: string }) {
  // 1. Create seisan
  const created = await seisanRepository.addSeisan({
    name: input.name,
    icon: input.emoji,
  })

  // 2. Fetch full seisan with relations
  const seisan = await seisanRepository.get(created.id)

  if (!seisan) {
    throw new Error('Failed to fetch created seisan')
  }

  // 3. Format result
  return formatSeisanDetail(seisan)
}

export async function updateSeisan(
  id: string,
  input: { name: string; emoji: string },
) {
  // 1. Update seisan
  await seisanRepository.update(id, {
    name: input.name,
    icon: input.emoji,
  })

  // 2. Fetch full seisan with relations
  const seisan = await seisanRepository.get(id)

  if (!seisan) {
    throw new NotFoundError('Seisan not found')
  }

  // 3. Format result
  return formatSeisanDetail(seisan)
}

export async function getSeisan(id: string) {
  const seisan = await seisanRepository.get(id)

  if (!seisan) {
    throw new Error('Seisan not found')
  }

  return formatSeisanDetail(seisan)
}

function formatSeisanDetail(
  seisan: NonNullable<Awaited<ReturnType<typeof seisanRepository.get>>>,
) {
  return {
    ...seisan,
    items: seisan.items.map((item) => ({
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
        : null,
      exempts: item.exempts.map((e) => ({
        ...e.participant,
        createdAt: e.participant.createdAt.toISOString(),
        updatedAt: e.participant.updatedAt.toISOString(),
      })),
      version: item.version.toString(),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    })),
    participants: seisan.participants.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    })),
    currencies: seisan.currencies.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    })),
    result: {
      id: `result-${seisan.id}`,
      surplus: 0,
      details: [],
    },
    createdAt: seisan.createdAt.toISOString(),
    updatedAt: seisan.updatedAt.toISOString(),
  }
}
