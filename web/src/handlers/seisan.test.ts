import { OpenAPIHono } from '@hono/zod-openapi'
import { describe, expect, test, vi } from 'vitest'
import { postSeisanRoute, putSeisanIdRoute } from '../generated/routes'
import * as seisanUsecase from '../usecases/seisan'
import { addSeisanHandler, updateSeisanHandler } from './seisan'

vi.mock('../usecases/seisan', () => ({
  addSeisan: vi.fn(),
  updateSeisan: vi.fn(),
}))

describe('addSeisanHandler', () => {
  test('精算を正常に作成できること', async () => {
    const mockSeisan = {
      id: 'uuid-1',
      name: 'テスト精算',
      icon: '💰',
      items: [],
      participants: [],
      currencies: [],
      result: {
        id: 'result-uuid-1',
        surplus: 0,
        details: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    vi.mocked(seisanUsecase.addSeisan).mockResolvedValue(mockSeisan)

    const app = new OpenAPIHono()
    app.openapi(postSeisanRoute, addSeisanHandler)

    const res = await app.request('/seisan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'テスト精算',
        emoji: '💰',
      }),
    })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual(mockSeisan)
    expect(seisanUsecase.addSeisan).toHaveBeenCalledWith({
      name: 'テスト精算',
      emoji: '💰',
    })
  })
})

describe('updateSeisanHandler', () => {
  test('精算を正常に更新できること', async () => {
    const seisanId = 'uuid-1'
    const mockSeisan = {
      id: seisanId,
      name: '更新後の精算',
      icon: '💳',
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

    vi.mocked(seisanUsecase.updateSeisan).mockResolvedValue(mockSeisan)

    const app = new OpenAPIHono()
    app.openapi(putSeisanIdRoute, updateSeisanHandler)

    const res = await app.request(`/seisan/${seisanId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '更新後の精算',
        emoji: '💳',
      }),
    })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual(mockSeisan)
    expect(seisanUsecase.updateSeisan).toHaveBeenCalledWith(seisanId, {
      name: '更新後の精算',
      emoji: '💳',
    })
  })
})
