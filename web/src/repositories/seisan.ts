import { seisans } from '../db/schema'
import { drizzle } from '../lib/drizzle'

export async function addSeisan(data: { name: string; icon: string }) {
  const [result] = await drizzle
    .insert(seisans)
    .values({
      id: crypto.randomUUID(),
      name: data.name,
      icon: data.icon,
    })
    .returning()

  if (!result) {
    throw new Error('Failed to create seisan')
  }

  return result
}
