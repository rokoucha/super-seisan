import { OpenAPIHono } from '@hono/zod-openapi'
import { describe, expect, test, vi } from 'vitest'
import { NotFoundError } from '../errors'
import {
  deleteSeisanSeisanIdItemsIdRoute,
  postSeisanSeisanIdItemsRoute,
  putSeisanSeisanIdItemsIdRoute,
} from '../generated/routes'
import * as itemUsecase from '../usecases/item'
import * as seisanUsecase from '../usecases/seisan'
import {
  addItemToSeisanHandler,
  removeItemFromSeisanHandler,
  updateItemInSeisanHandler,
} from './item'

vi.mock('../usecases/item', () => ({
  addItemToSeisan: vi.fn(),
  updateItemInSeisan: vi.fn(),
  removeItemFromSeisan: vi.fn(),
}))
vi.mock('../usecases/seisan', () => ({
  getSeisan: vi.fn(),
}))

describe('addItemToSeisanHandler', () => {
  test('精算に項目を正常に追加できること', async () => {
    const seisanId = 'uuid-1'
    const mockSeisan = {
      id: seisanId,
      name: 'テスト精算',
      icon: '💰',
      items: [],
      participants: [],
      currencies: [],
      result: {
        id: `result-${seisanId}`,
        surplus: 0,
        details: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    vi.mocked(itemUsecase.addItemToSeisan).mockResolvedValue(undefined)
    vi.mocked(seisanUsecase.getSeisan).mockResolvedValue(mockSeisan as any)

    const app = new OpenAPIHono()
    app.openapi(postSeisanSeisanIdItemsRoute, addItemToSeisanHandler)

    const res = await app.request(`/seisan/${seisanId}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '唐揚げ',
        icon: '🍗',
        payerId: 'participant-1',
        price: 1200,
        currencyId: null,
        amount: 2,
        total: 2400,
        exemptIds: ['participant-2'],
        version: '1',
      }),
    })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual(mockSeisan)
    expect(itemUsecase.addItemToSeisan).toHaveBeenCalledWith(seisanId, {
      name: '唐揚げ',
      icon: '🍗',
      payerId: 'participant-1',
      price: 1200,
      currencyId: null,
      amount: 2,
      total: 2400,
      exemptIds: ['participant-2'],
      version: '1',
    })
    expect(seisanUsecase.getSeisan).toHaveBeenCalledWith(seisanId)
  })
})

describe('updateItemInSeisanHandler', () => {
  test('精算内の項目を正常に更新できること', async () => {
    const seisanId = 'uuid-1'
    const itemId = 'item-1'
    const mockSeisan = {
      id: seisanId,
      name: 'テスト精算',
      icon: '💰',
      items: [
        {
          id: itemId,
          name: '焼き鳥',
          icon: '🍢',
          payerId: 'participant-1',
          price: 1800,
          currencyId: null,
          amount: 2,
          total: 3600,
          exemptIds: ['participant-2'],
          version: '2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      participants: [],
      currencies: [],
      result: {
        id: `result-${seisanId}`,
        surplus: 0,
        details: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    vi.mocked(itemUsecase.updateItemInSeisan).mockResolvedValue(undefined)
    vi.mocked(seisanUsecase.getSeisan).mockResolvedValue(mockSeisan as any)

    const app = new OpenAPIHono()
    app.openapi(putSeisanSeisanIdItemsIdRoute, updateItemInSeisanHandler)

    const res = await app.request(`/seisan/${seisanId}/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '焼き鳥',
        icon: '🍢',
        payerId: 'participant-1',
        price: 1800,
        currencyId: null,
        amount: 2,
        total: 3600,
        exemptIds: ['participant-2'],
        version: '2',
      }),
    })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual(mockSeisan)
    expect(itemUsecase.updateItemInSeisan).toHaveBeenCalledWith(
      seisanId,
      itemId,
      {
        name: '焼き鳥',
        icon: '🍢',
        payerId: 'participant-1',
        price: 1800,
        currencyId: null,
        amount: 2,
        total: 3600,
        exemptIds: ['participant-2'],
        version: '2',
      },
    )
    expect(seisanUsecase.getSeisan).toHaveBeenCalledWith(seisanId)
  })
})

describe('removeItemFromSeisanHandler', () => {
  test('精算内の項目を正常に削除できること', async () => {
    const seisanId = 'uuid-1'
    const itemId = 'item-1'
    const mockSeisan = {
      id: seisanId,
      name: 'テスト精算',
      icon: '💰',
      items: [],
      participants: [],
      currencies: [],
      result: {
        id: `result-${seisanId}`,
        surplus: 0,
        details: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    vi.mocked(itemUsecase.removeItemFromSeisan).mockResolvedValue(undefined)
    vi.mocked(seisanUsecase.getSeisan).mockResolvedValue(mockSeisan as any)

    const app = new OpenAPIHono()
    app.openapi(deleteSeisanSeisanIdItemsIdRoute, removeItemFromSeisanHandler)

    const res = await app.request(`/seisan/${seisanId}/items/${itemId}`, {
      method: 'DELETE',
    })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual(mockSeisan)
    expect(itemUsecase.removeItemFromSeisan).toHaveBeenCalledWith(
      seisanId,
      itemId,
    )
    expect(seisanUsecase.getSeisan).toHaveBeenCalledWith(seisanId)
  })

  test('精算が見つからない場合に404エラーを返すこと', async () => {
    const seisanId = 'invalid-id'
    const itemId = 'item-1'
    vi.mocked(seisanUsecase.getSeisan).mockRejectedValue(
      new NotFoundError('Seisan not found'),
    )

    const app = new OpenAPIHono()
    app.onError((err, c) => {
      if (err instanceof NotFoundError) {
        return c.json({ message: err.message }, 404)
      }
      return c.json({ message: err.message }, 500)
    })
    app.openapi(deleteSeisanSeisanIdItemsIdRoute, removeItemFromSeisanHandler)

    const res = await app.request(`/seisan/${seisanId}/items/${itemId}`, {
      method: 'DELETE',
    })

    expect(res.status).toBe(404)
    const data = (await res.json()) as { message: string }
    expect(data.message).toBe('Seisan not found')
  })
})
