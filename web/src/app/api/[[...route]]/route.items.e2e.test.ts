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
}))

describe('Item API E2E', () => {
  describe('POST /seisan/{seisanId}/items', () => {
    test('精算に項目を正常に追加できること', async () => {
      const seisanId = 'uuid-item-123'
      const mockSeisan = {
        id: seisanId,
        name: 'テスト精算',
        icon: '💰',
        createdAt: new Date(),
        updatedAt: new Date(),
        participants: [
          {
            id: 'participant-1',
            seisanId,
            name: '参加者A',
            icon: '😀',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        currencies: [],
        items: [],
      }

      const { get } = await import('../../../repositories/seisan')
      const { addItem } = await import('../../../repositories/item')
      vi.mocked(get).mockResolvedValue(mockSeisan as any)
      vi.mocked(addItem).mockResolvedValue({
        id: 'item-1',
        seisanId,
        name: '唐揚げ',
        icon: '🍗',
        payerId: 'participant-1',
        price: 1200,
        currencyId: null,
        amount: 2,
        total: 2400,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)

      const res = await app.request(`/api/seisan/${seisanId}/items`, {
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
          exemptIds: [],
          version: '1',
        }),
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toMatchObject({
        id: seisanId,
        name: 'テスト精算',
        icon: '💰',
        result: {
          surplus: 0,
        },
      })
    })
  })

  describe('PUT /seisan/{seisanId}/items/{id}', () => {
    test('精算内の項目を正常に更新できること', async () => {
      const seisanId = 'uuid-item-123'
      const itemId = 'item-1'
      const mockSeisan = {
        id: seisanId,
        name: 'テスト精算',
        icon: '💰',
        createdAt: new Date(),
        updatedAt: new Date(),
        participants: [
          {
            id: 'participant-1',
            seisanId,
            name: '参加者A',
            icon: '😀',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        currencies: [],
        items: [],
      }

      const { get } = await import('../../../repositories/seisan')
      const { updateItem } = await import('../../../repositories/item')
      vi.mocked(get).mockResolvedValue(mockSeisan as any)
      vi.mocked(updateItem).mockResolvedValue({
        id: itemId,
        seisanId,
        name: '焼き鳥',
        icon: '🍢',
        payerId: 'participant-1',
        price: 1800,
        currencyId: null,
        amount: 2,
        total: 3600,
        version: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)

      const res = await app.request(`/api/seisan/${seisanId}/items/${itemId}`, {
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
          exemptIds: [],
          version: '2',
        }),
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toMatchObject({
        id: seisanId,
        name: 'テスト精算',
        icon: '💰',
        result: {
          surplus: 0,
        },
      })
    })
  })

  describe('DELETE /seisan/{seisanId}/items/{id}', () => {
    test('精算内の項目を正常に削除できること', async () => {
      const seisanId = 'uuid-item-123'
      const itemId = 'item-1'
      const mockSeisan = {
        id: seisanId,
        name: 'テスト精算',
        icon: '💰',
        createdAt: new Date(),
        updatedAt: new Date(),
        participants: [],
        currencies: [],
        items: [],
      }

      const { get } = await import('../../../repositories/seisan')
      const { deleteItem } = await import('../../../repositories/item')
      vi.mocked(get).mockResolvedValue(mockSeisan as any)
      vi.mocked(deleteItem).mockResolvedValue({
        id: itemId,
        seisanId,
        name: '焼き鳥',
        icon: '🍢',
        payerId: 'participant-1',
        price: 1800,
        currencyId: null,
        amount: 2,
        total: 3600,
        version: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)

      const res = await app.request(`/api/seisan/${seisanId}/items/${itemId}`, {
        method: 'DELETE',
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toMatchObject({
        id: seisanId,
        name: 'テスト精算',
        icon: '💰',
        result: {
          surplus: 0,
        },
      })
    })
  })
})
