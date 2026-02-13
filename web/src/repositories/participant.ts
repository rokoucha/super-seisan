import { eq } from 'drizzle-orm'
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
  id: string,
  data: { seisanId: string; name: string; icon: string },
) {
  const [result] = await drizzle
    .update(participants)
    .set({
      seisanId: data.seisanId,
      name: data.name,
      icon: data.icon,
      updatedAt: new Date(),
    })
    .where(eq(participants.id, id))
    .returning()

  if (!result) {
    throw new Error('Failed to update participant')
  }

  return result
}

export async function deleteParticipant(id: string) {
  const [result] = await drizzle
    .delete(participants)
    .where(eq(participants.id, id))
    .returning()

  if (!result) {
    throw new Error('Failed to delete participant')
  }

  return result
}
