import { addSeisanRepository } from '../repositories/seisan'

export async function addSeisanUsecase(input: { name: string; emoji: string }) {
  const seisan = await addSeisanRepository({
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
