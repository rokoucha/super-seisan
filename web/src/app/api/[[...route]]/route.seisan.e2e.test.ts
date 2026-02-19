import { describe, expect, test, vi } from 'vitest'
import { app } from './route'

vi.mock('../../../repositories/seisan', () => ({
  addSeisan: vi.fn(),
  update: vi.fn(),
  get: vi.fn(),
}))

vi.mock('../../../repositories/currency', () => ({
  addCurrency: vi.fn(),
  updateCurrency: vi.fn(),
  deleteCurrency: vi.fn(),
}))

vi.mock('../../../repositories/participant', () => ({
  addParticipant: vi.fn(),
  updateParticipant: vi.fn(),
  deleteParticipant: vi.fn(),
}))

vi.mock('../../../repositories/item', () => ({
  addItem: vi.fn(),
  updateItem: vi.fn(),
  deleteItem: vi.fn(),
  getItem: vi.fn(),
}))

describe('Seisan API E2E', () => {
  describe('GET /seisan/{id}', () => {
    test('精算を正常に取得できること', async () => {
      const seisanId = 'uuid-get-123'
      const mockSeisan = {
        id: seisanId,
        name: '取得テスト精算',
        icon: '📘',
        createdAt: new Date(),
        updatedAt: new Date(),
        participants: [],
        currencies: [],
        items: [],
      }

      const { get } = await import('../../../repositories/seisan')
      vi.mocked(get).mockResolvedValue(mockSeisan as any)

      const res = await app.request(`/api/seisan/${seisanId}`, {
        method: 'GET',
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toMatchObject({
        id: seisanId,
        name: '取得テスト精算',
        icon: '📘',
        result: {
          surplus: 0,
        },
      })
    })
  })

  describe('POST /seisan', () => {
    test('精算を正常に作成できること', async () => {
      const mockSeisan = {
        id: 'uuid-123',
        name: '新年会',
        icon: '🍶',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const { addSeisan, get } = await import('../../../repositories/seisan')
      vi.mocked(addSeisan).mockResolvedValue(mockSeisan as any)
      vi.mocked(get).mockResolvedValue({
        ...mockSeisan,
        participants: [],
        currencies: [],
        items: [],
      } as any)

      const res = await app.request('/api/seisan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: '新年会',
          emoji: '🍶',
        }),
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toMatchObject({
        id: 'uuid-123',
        name: '新年会',
        icon: '🍶',
        result: {
          surplus: 0,
        },
      })
    })

    test('バリデーションエラーをハンドルできること', async () => {
      const res = await app.request('/api/seisan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: '',
        }),
      })

      expect(res.status).toBe(400)
      const data = (await res.json()) as any
      expect(data.error.code).toBe('BAD_REQUEST')
    })
  })

  describe('PUT /seisan/{id}', () => {
    test('精算を正常に更新できること', async () => {
      const seisanId = 'uuid-put-123'
      const mockSeisan = {
        id: seisanId,
        name: '更新後の精算',
        icon: '💎',
        createdAt: new Date(),
        updatedAt: new Date(),
        participants: [],
        currencies: [],
        items: [],
      }

      const { update, get } = await import('../../../repositories/seisan')
      vi.mocked(update).mockResolvedValue({
        id: seisanId,
        name: '更新後の精算',
        icon: '💎',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      vi.mocked(get).mockResolvedValue(mockSeisan as any)

      const res = await app.request(`/api/seisan/${seisanId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: '更新後の精算',
          emoji: '💎',
        }),
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toMatchObject({
        id: seisanId,
        name: '更新後の精算',
        icon: '💎',
        result: {
          surplus: 0,
        },
      })
    })

    test('バリデーションエラーをハンドルできること', async () => {
      const res = await app.request('/api/seisan/invalid-uuid', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: '',
        }),
      })

      expect(res.status).toBe(400)
    })
  })
})
