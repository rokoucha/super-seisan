import { OpenAPIHono } from '@hono/zod-openapi'
import { describe, expect, test, vi } from 'vitest'
import {
  deleteSeisanSeisanIdParticipantsIdRoute,
  postSeisanSeisanIdParticipantsRoute,
  putSeisanSeisanIdParticipantsIdRoute,
} from '../generated/routes'
import * as participantUsecase from '../usecases/participant'
import * as seisanUsecase from '../usecases/seisan'
import {
  addParticipantToSeisanHandler,
  removeParticipantFromSeisanHandler,
  updateParticipantInSeisanHandler,
} from './participant'

vi.mock('../usecases/participant', () => ({
  addParticipantToSeisan: vi.fn(),
  removeParticipantFromSeisan: vi.fn(),
  updateParticipantInSeisan: vi.fn(),
}))
vi.mock('../usecases/seisan', () => ({
  getSeisan: vi.fn(),
}))

describe('addParticipantToSeisanHandler', () => {
  test('精算に参加者を正常に追加できること', async () => {
    const seisanId = 'uuid-1'
    const mockSeisan = {
      id: seisanId,
      name: 'テスト精算',
      icon: '💰',
      items: [],
      participants: [
        {
          id: 'participant-1',
          name: '参加者A',
          icon: '😀',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      currencies: [],
      result: {
        id: `result-${seisanId}`,
        surplus: 0,
        details: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    vi.mocked(participantUsecase.addParticipantToSeisan).mockResolvedValue(
      undefined,
    )
    vi.mocked(seisanUsecase.getSeisan).mockResolvedValue(mockSeisan as any)

    const app = new OpenAPIHono()
    app.openapi(
      postSeisanSeisanIdParticipantsRoute,
      addParticipantToSeisanHandler,
    )

    const res = await app.request(`/seisan/${seisanId}/participants`, {
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
    expect(data).toEqual(mockSeisan)
    expect(participantUsecase.addParticipantToSeisan).toHaveBeenCalledWith(
      seisanId,
      {
        name: '参加者A',
        icon: '😀',
      },
    )
    expect(seisanUsecase.getSeisan).toHaveBeenCalledWith(seisanId)
  })
})

describe('updateParticipantInSeisanHandler', () => {
  test('精算内の参加者を正常に更新できること', async () => {
    const seisanId = 'uuid-1'
    const participantId = 'participant-1'
    const mockSeisan = {
      id: seisanId,
      name: 'テスト精算',
      icon: '💰',
      items: [],
      participants: [
        {
          id: participantId,
          name: '参加者B',
          icon: '😎',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      currencies: [],
      result: {
        id: `result-${seisanId}`,
        surplus: 0,
        details: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    vi.mocked(participantUsecase.updateParticipantInSeisan).mockResolvedValue(
      undefined,
    )
    vi.mocked(seisanUsecase.getSeisan).mockResolvedValue(mockSeisan as any)

    const app = new OpenAPIHono()
    app.openapi(
      putSeisanSeisanIdParticipantsIdRoute,
      updateParticipantInSeisanHandler,
    )

    const res = await app.request(
      `/seisan/${seisanId}/participants/${participantId}`,
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
    expect(data).toEqual(mockSeisan)
    expect(participantUsecase.updateParticipantInSeisan).toHaveBeenCalledWith(
      seisanId,
      participantId,
      {
        name: '参加者B',
        icon: '😎',
      },
    )
    expect(seisanUsecase.getSeisan).toHaveBeenCalledWith(seisanId)
  })
})

describe('removeParticipantFromSeisanHandler', () => {
  test('精算内の参加者を正常に削除できること', async () => {
    const seisanId = 'uuid-1'
    const participantId = 'participant-1'
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

    vi.mocked(participantUsecase.removeParticipantFromSeisan).mockResolvedValue(
      undefined,
    )
    vi.mocked(seisanUsecase.getSeisan).mockResolvedValue(mockSeisan as any)

    const app = new OpenAPIHono()
    app.openapi(
      deleteSeisanSeisanIdParticipantsIdRoute,
      removeParticipantFromSeisanHandler,
    )

    const res = await app.request(
      `/seisan/${seisanId}/participants/${participantId}`,
      {
        method: 'DELETE',
      },
    )

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual(mockSeisan)
    expect(participantUsecase.removeParticipantFromSeisan).toHaveBeenCalledWith(
      seisanId,
      participantId,
    )
    expect(seisanUsecase.getSeisan).toHaveBeenCalledWith(seisanId)
  })
})
