import { OpenAPIHono } from '@hono/zod-openapi'
import { describe, expect, test, vi } from 'vitest'
import { postSeisanRoute, putSeisanIdRoute } from '../generated/routes'
import * as seisanUsecase from '../usecases/seisan'
import { addSeisanHandler, updateSeisanHandler } from './seisan'

vi.mock('../usecases/seisan', () => ({
  addSeisan: vi.fn(),
  updateSeisan: vi.fn(),
  getSeisan: vi.fn(),
}))

describe('addSeisanHandler', () => {
  test('精算を正常に作成できること', async () => {
    const createdSeisan = {
      id: 'uuid-1',
      name: 'テスト精算',
      icon: '💰',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const mockSeisan = {
      id: createdSeisan.id,
      name: 'テスト精算',
      icon: '💰',
      items: [],
      participants: [],
      currencies: [],
      result: {
        id: `result-${createdSeisan.id}`,
        surplus: 0,
        details: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    vi.mocked(seisanUsecase.addSeisan).mockResolvedValue(createdSeisan as any)
    vi.mocked(seisanUsecase.getSeisan).mockResolvedValue(mockSeisan)

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
    expect(seisanUsecase.getSeisan).toHaveBeenCalledWith(createdSeisan.id)
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

    vi.mocked(seisanUsecase.updateSeisan).mockResolvedValue(undefined)
    vi.mocked(seisanUsecase.getSeisan).mockResolvedValue(mockSeisan)

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
    expect(seisanUsecase.getSeisan).toHaveBeenCalledWith(seisanId)
  })
})

describe('getSeisanHandler', () => {
  test('指定されたIDの精算を正常に取得できること', async () => {
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

    vi.mocked(seisanUsecase.getSeisan).mockResolvedValue(mockSeisan)

    const app = new OpenAPIHono()
    const { getSeisanIdRoute } = await import('../generated/routes')
    const { getSeisanHandler } = await import('./seisan')
    app.openapi(getSeisanIdRoute, getSeisanHandler)

    const res = await app.request(`/seisan/${seisanId}`, {
      method: 'GET',
    })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual(mockSeisan)
    expect(seisanUsecase.getSeisan).toHaveBeenCalledWith(seisanId)
  })
})
