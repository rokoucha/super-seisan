import { OpenAPIHono } from '@hono/zod-openapi'
import { describe, expect, test, vi } from 'vitest'
import {
  postSeisanSeisanIdCurrenciesRoute,
  putSeisanSeisanIdCurrenciesIdRoute,
} from '../generated/routes'
import * as currencyUsecase from '../usecases/currency'
import * as seisanUsecase from '../usecases/seisan'
import {
  addCurrencyToSeisanHandler,
  updateCurrencyInSeisanHandler,
} from './currency'

vi.mock('../usecases/currency', () => ({
  addCurrencyToSeisan: vi.fn(),
  updateCurrencyInSeisan: vi.fn(),
}))
vi.mock('../usecases/seisan', () => ({
  getSeisan: vi.fn(),
}))

describe('addCurrencyToSeisanHandler', () => {
  test('精算に通貨を正常に追加できること', async () => {
    const seisanId = 'uuid-1'
    const mockSeisan = {
      id: seisanId,
      name: 'テスト精算',
      icon: '💰',
      items: [],
      participants: [],
      currencies: [
        {
          id: 'currency-1',
          seisanId,
          code: 'USD',
          rate: 150,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      result: {
        id: `result-${seisanId}`,
        surplus: 0,
        details: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    vi.mocked(currencyUsecase.addCurrencyToSeisan).mockResolvedValue(undefined)
    vi.mocked(seisanUsecase.getSeisan).mockResolvedValue(mockSeisan as any)

    const app = new OpenAPIHono()
    app.openapi(postSeisanSeisanIdCurrenciesRoute, addCurrencyToSeisanHandler)

    const res = await app.request(`/seisan/${seisanId}/currencies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: 'USD',
        rate: 150,
      }),
    })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual(mockSeisan)
    expect(currencyUsecase.addCurrencyToSeisan).toHaveBeenCalledWith(seisanId, {
      code: 'USD',
      rate: 150,
    })
    expect(seisanUsecase.getSeisan).toHaveBeenCalledWith(seisanId)
  })
})

describe('updateCurrencyInSeisanHandler', () => {
  test('精算内の通貨を正常に更新できること', async () => {
    const seisanId = 'uuid-1'
    const currencyId = 'currency-1'
    const mockSeisan = {
      id: seisanId,
      name: 'テスト精算',
      icon: '💰',
      items: [],
      participants: [],
      currencies: [
        {
          id: currencyId,
          seisanId,
          code: 'EUR',
          rate: 161.5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      result: {
        id: `result-${seisanId}`,
        surplus: 0,
        details: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    vi.mocked(currencyUsecase.updateCurrencyInSeisan).mockResolvedValue(
      undefined,
    )
    vi.mocked(seisanUsecase.getSeisan).mockResolvedValue(mockSeisan as any)

    const app = new OpenAPIHono()
    app.openapi(
      putSeisanSeisanIdCurrenciesIdRoute,
      updateCurrencyInSeisanHandler,
    )

    const res = await app.request(
      `/seisan/${seisanId}/currencies/${currencyId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: 'EUR',
          rate: 161.5,
        }),
      },
    )

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual(mockSeisan)
    expect(currencyUsecase.updateCurrencyInSeisan).toHaveBeenCalledWith(
      seisanId,
      currencyId,
      {
        code: 'EUR',
        rate: 161.5,
      },
    )
    expect(seisanUsecase.getSeisan).toHaveBeenCalledWith(seisanId)
  })
})
