import { and, eq } from 'drizzle-orm'
import { itemExempts, items } from '../db/schema'
import { drizzle } from '../lib/drizzle'

export async function addItem(data: {
  seisanId: string
  name: string
  icon: string
  payerId: string
  price: number
  currencyId: string | null
  amount: number
  total: number
  exemptIds: string[]
  version: number
}) {
  const itemId = crypto.randomUUID()

  const [itemsResult] = await drizzle.batch([
    drizzle
      .insert(items)
      .values({
        id: itemId,
        seisanId: data.seisanId,
        name: data.name,
        icon: data.icon,
        payerId: data.payerId,
        price: data.price,
        currencyId: data.currencyId,
        amount: data.amount,
        total: data.total,
        version: data.version,
      })
      .returning(),
    ...(data.exemptIds.length > 0
      ? [
          drizzle.insert(itemExempts).values(
            data.exemptIds.map((participantId) => ({
              itemId,
              participantId,
            })),
          ),
        ]
      : []),
  ])

  const result = itemsResult[0]
  if (!result) {
    throw new Error('Failed to add item')
  }

  return result
}

export async function updateItem(
  seisanId: string,
  id: string,
  data: {
    name: string
    icon: string
    payerId: string
    price: number
    currencyId: string | null
    amount: number
    total: number
    exemptIds: string[]
    version: number
  },
) {
  const nextVersion = data.version

  const [updatedItem] = await drizzle
    .update(items)
    .set({
      name: data.name,
      icon: data.icon,
      payerId: data.payerId,
      price: data.price,
      currencyId: data.currencyId,
      amount: data.amount,
      total: data.total,
      version: nextVersion,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(items.id, id),
        eq(items.seisanId, seisanId),
        eq(items.version, nextVersion - 1),
      ),
    )
    .returning()

  if (!updatedItem) {
    return undefined
  }

  await drizzle.delete(itemExempts).where(eq(itemExempts.itemId, id))

  if (data.exemptIds.length > 0) {
    await drizzle.insert(itemExempts).values(
      data.exemptIds.map((participantId) => ({
        itemId: id,
        participantId,
      })),
    )
  }

  return updatedItem
}

export async function getItem(seisanId: string, id: string) {
  const [result] = await drizzle
    .select()
    .from(items)
    .where(and(eq(items.id, id), eq(items.seisanId, seisanId)))
    .limit(1)

  return result
}

export async function deleteItem(seisanId: string, id: string) {
  const [result] = await drizzle
    .delete(items)
    .where(and(eq(items.id, id), eq(items.seisanId, seisanId)))
    .returning()

  return result
}
