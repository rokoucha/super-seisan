import { beforeEach, describe, expect, test, vi } from 'vitest'
import { NotFoundError } from '../errors'
import * as itemRepo from '../repositories/item'
import * as seisanRepo from '../repositories/seisan'
import * as itemUsecase from './item'

vi.mock('../repositories/item', () => ({
  addItem: vi.fn(),
  updateItem: vi.fn(),
}))

vi.mock('../repositories/seisan', () => ({
  get: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('itemUsecase.addItemToSeisan', () => {
  test('精算に項目を正常に追加できること', async () => {
    const seisanId = 'uuid-1'
    const input = {
      name: '唐揚げ',
      icon: '🍗',
      payerId: 'participant-1',
      price: 1200,
      currencyId: null,
      amount: 2,
      total: 2400,
      exemptIds: ['participant-2'],
      version: '1',
    }

    vi.mocked(seisanRepo.get).mockResolvedValue({ id: seisanId } as any)
    vi.mocked(itemRepo.addItem).mockResolvedValue({
      id: 'item-1',
      seisanId,
      ...input,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any)

    await itemUsecase.addItemToSeisan(seisanId, input)

    expect(seisanRepo.get).toHaveBeenCalledWith(seisanId)
    expect(itemRepo.addItem).toHaveBeenCalledWith({
      seisanId,
      ...input,
    })
  })

  test('精算が見つからない場合にNotFoundErrorを投げること', async () => {
    const seisanId = 'not-found'
    const input = {
      name: '唐揚げ',
      icon: '🍗',
      payerId: 'participant-1',
      price: 1200,
      currencyId: null,
      amount: 2,
      total: 2400,
      exemptIds: [],
      version: '1',
    }

    vi.mocked(seisanRepo.get).mockResolvedValue(null as any)

    await expect(itemUsecase.addItemToSeisan(seisanId, input)).rejects.toThrow(
      NotFoundError,
    )

    expect(itemRepo.addItem).not.toHaveBeenCalled()
  })
})

describe('itemUsecase.updateItemInSeisan', () => {
  test('精算に存在する項目を正常に更新できること', async () => {
    const seisanId = 'uuid-1'
    const itemId = 'item-1'
    const input = {
      name: '焼き鳥',
      icon: '🍢',
      payerId: 'participant-1',
      price: 1800,
      currencyId: null,
      amount: 2,
      total: 3600,
      exemptIds: ['participant-2'],
      version: '2',
    }

    vi.mocked(seisanRepo.get).mockResolvedValue({ id: seisanId } as any)
    vi.mocked(itemRepo.updateItem).mockResolvedValue({
      id: itemId,
      seisanId,
      ...input,
      version: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any)

    await itemUsecase.updateItemInSeisan(seisanId, itemId, input)

    expect(seisanRepo.get).toHaveBeenCalledWith(seisanId)
    expect(itemRepo.updateItem).toHaveBeenCalledWith(itemId, {
      seisanId,
      ...input,
    })
  })

  test('精算が見つからない場合にNotFoundErrorを投げること', async () => {
    const seisanId = 'not-found'
    const itemId = 'item-1'
    const input = {
      name: '焼き鳥',
      icon: '🍢',
      payerId: 'participant-1',
      price: 1800,
      currencyId: null,
      amount: 2,
      total: 3600,
      exemptIds: [],
      version: '2',
    }

    vi.mocked(seisanRepo.get).mockResolvedValue(null as any)

    await expect(
      itemUsecase.updateItemInSeisan(seisanId, itemId, input),
    ).rejects.toThrow(NotFoundError)

    expect(itemRepo.updateItem).not.toHaveBeenCalled()
  })
})
