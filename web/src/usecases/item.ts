import { ConflictError, NotFoundError } from '../errors'
import * as itemRepository from '../repositories/item'
import * as seisanRepository from '../repositories/seisan'

export async function addItemToSeisan(
  seisanId: string,
  input: {
    name: string
    icon: string
    payerId: string
    price: number
    currencyId?: string | null
    amount: number
    total: number
    exemptIds: string[]
    version: number
  },
) {
  const seisan = await seisanRepository.get(seisanId)
  if (!seisan) {
    throw new NotFoundError('Seisan not found')
  }

  await itemRepository.addItem({
    seisanId,
    name: input.name,
    icon: input.icon,
    payerId: input.payerId,
    price: input.price,
    currencyId: input.currencyId ?? null,
    amount: input.amount,
    total: input.total,
    exemptIds: input.exemptIds,
    version: input.version,
  })
}

export async function updateItemInSeisan(
  seisanId: string,
  id: string,
  input: {
    name: string
    icon: string
    payerId: string
    price: number
    currencyId?: string | null
    amount: number
    total: number
    exemptIds: string[]
    version: number
  },
) {
  const seisan = await seisanRepository.get(seisanId)
  if (!seisan) {
    throw new NotFoundError('Seisan not found')
  }

  const result = await itemRepository.updateItem(seisanId, id, {
    name: input.name,
    icon: input.icon,
    payerId: input.payerId,
    price: input.price,
    currencyId: input.currencyId ?? null,
    amount: input.amount,
    total: input.total,
    exemptIds: input.exemptIds,
    version: input.version,
  })

  if (!result) {
    const current = await itemRepository.getItem(seisanId, id)
    if (current) {
      throw new ConflictError('Item version conflict')
    }
    throw new NotFoundError('Item not found')
  }
}

export async function removeItemFromSeisan(seisanId: string, id: string) {
  const seisan = await seisanRepository.get(seisanId)
  if (!seisan) {
    throw new NotFoundError('Seisan not found')
  }

  const result = await itemRepository.deleteItem(seisanId, id)
  if (!result) {
    throw new NotFoundError('Item not found')
  }
}
