import { OpenAPIHono } from '@hono/zod-openapi'
import { describe, expect, test, vi } from 'vitest'
import { postSeisanSeisanIdParticipantsRoute } from '../generated/routes'
import * as participantUsecase from '../usecases/participant'
import * as seisanUsecase from '../usecases/seisan'
import { addParticipantToSeisanHandler } from './participant'

vi.mock('../usecases/participant', () => ({
  addParticipantToSeisan: vi.fn(),
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
