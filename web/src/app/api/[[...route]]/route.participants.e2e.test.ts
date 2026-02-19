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

describe('Participant API E2E', () => {
  describe('POST /seisan/{seisanId}/participants', () => {
    test('精算に参加者を正常に追加できること', async () => {
      const seisanId = 'uuid-participant-123'
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
      const { addParticipant } =
        await import('../../../repositories/participant')
      vi.mocked(get).mockResolvedValue(mockSeisan as any)
      vi.mocked(addParticipant).mockResolvedValue({
        id: 'participant-1',
        seisanId,
        name: '参加者A',
        icon: '😀',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)

      const res = await app.request(`/api/seisan/${seisanId}/participants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: '参加者A',
          icon: '😀',
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

  describe('PUT /seisan/{seisanId}/participants/{id}', () => {
    test('精算内の参加者を正常に更新できること', async () => {
      const seisanId = 'uuid-participant-123'
      const participantId = 'participant-1'
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
      const { updateParticipant } =
        await import('../../../repositories/participant')
      vi.mocked(get).mockResolvedValue(mockSeisan as any)
      vi.mocked(updateParticipant).mockResolvedValue({
        id: participantId,
        seisanId,
        name: '参加者B',
        icon: '😎',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)

      const res = await app.request(
        `/api/seisan/${seisanId}/participants/${participantId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: '参加者B',
            icon: '😎',
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

  describe('DELETE /seisan/{seisanId}/participants/{id}', () => {
    test('精算内の参加者を正常に削除できること', async () => {
      const seisanId = 'uuid-participant-123'
      const participantId = 'participant-1'
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
      const { deleteParticipant } =
        await import('../../../repositories/participant')
      vi.mocked(get).mockResolvedValue(mockSeisan as any)
      vi.mocked(deleteParticipant).mockResolvedValue({
        id: participantId,
        seisanId,
        name: '参加者B',
        icon: '😎',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)

      const res = await app.request(
        `/api/seisan/${seisanId}/participants/${participantId}`,
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
