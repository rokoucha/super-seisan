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
  version: string
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
        version: Number(data.version),
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
    version: string
  },
) {
  const [itemsResult] = await drizzle.batch([
    drizzle
      .update(items)
      .set({
        name: data.name,
        icon: data.icon,
        payerId: data.payerId,
        price: data.price,
        currencyId: data.currencyId,
        amount: data.amount,
        total: data.total,
        version: Number(data.version),
        updatedAt: new Date(),
      })
      .where(and(eq(items.id, id), eq(items.seisanId, seisanId)))
      .returning(),
    drizzle.delete(itemExempts).where(eq(itemExempts.itemId, id)),
    ...(data.exemptIds.length > 0
      ? [
          drizzle.insert(itemExempts).values(
            data.exemptIds.map((participantId) => ({
              itemId: id,
              participantId,
            })),
          ),
        ]
      : []),
  ])

  return itemsResult[0]
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
