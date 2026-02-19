import { eq } from 'drizzle-orm'
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
    drizzle.insert(itemExempts).values(
      data.exemptIds.map((participantId) => ({
        itemId,
        participantId,
      })),
    ),
  ])

  const result = itemsResult[0]
  if (!result) {
    throw new Error('Failed to add item')
  }

  return result
}

export async function updateItem(
  id: string,
  data: {
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
  },
) {
  const [itemsResult] = await drizzle.batch([
    drizzle
      .update(items)
      .set({
        seisanId: data.seisanId,
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
      .where(eq(items.id, id))
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

export async function deleteItem(id: string) {
  const [result] = await drizzle
    .delete(items)
    .where(eq(items.id, id))
    .returning()

  return result
}
