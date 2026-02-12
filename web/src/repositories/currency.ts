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
