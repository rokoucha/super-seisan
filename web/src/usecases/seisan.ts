import * as seisanRepository from '../repositories/seisan'

export async function addSeisan(input: { name: string; emoji: string }) {
  const seisan = await seisanRepository.addSeisan({
    name: input.name,
    icon: input.emoji,
  })

  return {
    ...seisan,
    items: [],
    participants: [],
    currencies: [],
    result: {
      id: `result-${seisan.id}`,
      surplus: 0,
      details: [],
    },
    createdAt: seisan.createdAt.toISOString(),
    updatedAt: seisan.updatedAt.toISOString(),
  }
}
