import { OpenAPIHono } from '@hono/zod-openapi'
import { describe, expect, test, vi } from 'vitest'
import { postSeisanSeisanIdItemsRoute } from '../generated/routes'
import * as itemUsecase from '../usecases/item'
import * as seisanUsecase from '../usecases/seisan'
import { addItemToSeisanHandler } from './item'

vi.mock('../usecases/item', () => ({
  addItemToSeisan: vi.fn(),
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
