import { eq } from 'drizzle-orm'
import { participants, seisans } from '../db/schema'
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

export async function get(id: string) {
  const result = await drizzle.query.seisans.findFirst({
    where: (seisans, { eq }) => eq(seisans.id, id),
    with: {
      participants: true,
      currencies: true,
      items: {
        with: {
          payer: true,
          currency: true,
          exempts: {
            with: {
              participant: true,
            },
          },
        },
      },
    },
  })

  return result
}

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

export async function update(id: string, data: { name: string; icon: string }) {
  const [result] = await drizzle
    .update(seisans)
    .set({
      name: data.name,
      icon: data.icon,
      updatedAt: new Date(),
    })
    .where(eq(seisans.id, id))
    .returning()

  if (!result) {
    throw new Error('Failed to update seisan')
  }

  return result
}
