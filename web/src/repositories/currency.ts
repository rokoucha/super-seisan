import { eq } from 'drizzle-orm'
import { currencies } from '../db/schema'
import { drizzle } from '../lib/drizzle'

export async function addCurrency(data: {
  seisanId: string
  code: string
  rate: number
}) {
  const [result] = await drizzle
    .insert(currencies)
    .values({
      id: crypto.randomUUID(),
      seisanId: data.seisanId,
      code: data.code,
      rate: data.rate,
    })
    .returning()

  if (!result) {
    throw new Error('Failed to create currency')
  }

  return result
}

export async function updateCurrency(
  id: string,
  data: { seisanId: string; code: string; rate: number },
) {
  const [result] = await drizzle
    .update(currencies)
    .set({
      seisanId: data.seisanId,
      code: data.code,
      rate: data.rate,
      updatedAt: new Date(),
    })
    .where(eq(currencies.id, id))
    .returning()

  if (!result) {
    throw new Error('Failed to update currency')
  }

  return result
}

export async function deleteCurrency(id: string) {
  const [result] = await drizzle
    .delete(currencies)
    .where(eq(currencies.id, id))
    .returning()

  if (!result) {
    throw new Error('Failed to delete currency')
  }

  return result
}
