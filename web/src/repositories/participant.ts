import { and, eq } from 'drizzle-orm'
import { participants } from '../db/schema'
import { drizzle } from '../lib/drizzle'

export async function addParticipant(data: {
  seisanId: string
  name: string
  icon: string
}) {
  const [result] = await drizzle
    .insert(participants)
    .values({
      id: crypto.randomUUID(),
      seisanId: data.seisanId,
      name: data.name,
      icon: data.icon,
    })
    .returning()

  if (!result) {
    throw new Error('Failed to add participant')
  }

  return result
}

export async function updateParticipant(
  seisanId: string,
  id: string,
  data: { name: string; icon: string },
) {
  const [result] = await drizzle
    .update(participants)
    .set({
      name: data.name,
      icon: data.icon,
      updatedAt: new Date(),
    })
    .where(and(eq(participants.id, id), eq(participants.seisanId, seisanId)))
    .returning()

  return result
}

export async function deleteParticipant(seisanId: string, id: string) {
  const [result] = await drizzle
    .delete(participants)
    .where(and(eq(participants.id, id), eq(participants.seisanId, seisanId)))
    .returning()

  return result
}
