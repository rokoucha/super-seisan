import { and, eq } from 'drizzle-orm'
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
  seisanId: string,
  id: string,
  data: { code: string; rate: number },
) {
  const [result] = await drizzle
    .update(currencies)
    .set({
      code: data.code,
      rate: data.rate,
      updatedAt: new Date(),
    })
    .where(and(eq(currencies.id, id), eq(currencies.seisanId, seisanId)))
    .returning()

  return result
}

export async function deleteCurrency(seisanId: string, id: string) {
  const [result] = await drizzle
    .delete(currencies)
    .where(and(eq(currencies.id, id), eq(currencies.seisanId, seisanId)))
    .returning()

  return result
}
