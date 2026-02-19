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

describe('Currency API E2E', () => {
  describe('POST /seisan/{seisanId}/currencies', () => {
    test('精算に通貨を正常に追加できること', async () => {
      const seisanId = 'uuid-currency-123'
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
      const { addCurrency } = await import('../../../repositories/currency')
      vi.mocked(get).mockResolvedValue(mockSeisan as any)
      vi.mocked(addCurrency).mockResolvedValue({
        id: 'currency-1',
        seisanId,
        code: 'USD',
        rate: 150,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)

      const res = await app.request(`/api/seisan/${seisanId}/currencies`, {
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

  describe('PUT /seisan/{seisanId}/currencies/{id}', () => {
    test('精算内の通貨を正常に更新できること', async () => {
      const seisanId = 'uuid-currency-123'
      const currencyId = 'currency-1'
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
      const { updateCurrency } = await import('../../../repositories/currency')
      vi.mocked(get).mockResolvedValue(mockSeisan as any)
      vi.mocked(updateCurrency).mockResolvedValue({
        id: currencyId,
        seisanId,
        code: 'EUR',
        rate: 160,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)

      const res = await app.request(
        `/api/seisan/${seisanId}/currencies/${currencyId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: 'EUR',
            rate: 160,
          }),
        },
      )

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

  describe('DELETE /seisan/{seisanId}/currencies/{id}', () => {
    test('精算内の通貨を正常に削除できること', async () => {
      const seisanId = 'uuid-currency-123'
      const currencyId = 'currency-1'
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
      const { deleteCurrency } = await import('../../../repositories/currency')
      vi.mocked(get).mockResolvedValue(mockSeisan as any)
      vi.mocked(deleteCurrency).mockResolvedValue({
        id: currencyId,
        seisanId,
        code: 'EUR',
        rate: 160,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)

      const res = await app.request(
        `/api/seisan/${seisanId}/currencies/${currencyId}`,
        {
          method: 'DELETE',
        },
      )

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
