import { describe, expect, test, vi } from 'vitest'
import { z } from 'zod'
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
} from '../../../errors'
import { app } from './route'

describe('APIルート', () => {
  test('GET /api がバージョン情報を返すこと', async () => {
    // basePathが'/api'で、app.get('/', ...)なので、'/api'でアクセス
    const res = await app.request('/api')

    expect(res.status).toBe(200)

    const data = (await res.json()) as { version: string }
    expect(data).toHaveProperty('version')
    expect(typeof data.version).toBe('string')
    expect(data.version).toBe('1.0.0')
  })

  describe('エラーハンドリング', () => {
    // テスト用のルートを追加
    app.get('/error/bad-request', () => {
      throw new BadRequestError('test message')
    })

    app.get('/error/not-found', () => {
      throw new NotFoundError('test message')
    })

    app.get('/error/conflict', () => {
      throw new ConflictError('test message')
    })

    app.get('/error/internal', () => {
      throw new InternalServerError('test message')
    })

    app.get('/error/zod', () => {
      const schema = z.object({
        name: z.string(),
      })
      schema.parse({})
      return new Response('ok')
    })

    app.get('/error/unknown', () => {
      throw new Error('unknown error')
    })

    test('BadRequestError をハンドルできること', async () => {
      const res = await app.request('/api/error/bad-request')
      expect(res.status).toBe(400)
      const data = (await res.json()) as {
        error: { code: string; message: string }
      }
      expect(data.error.code).toBe('BAD_REQUEST')
      expect(data.error.message).toBe('test message')
    })

    test('NotFoundError をハンドルできること', async () => {
      const res = await app.request('/api/error/not-found')
      expect(res.status).toBe(404)
      const data = (await res.json()) as {
        error: { code: string; message: string }
      }
      expect(data.error.code).toBe('NOT_FOUND')
      expect(data.error.message).toBe('test message')
    })

    test('ConflictError をハンドルできること', async () => {
      const res = await app.request('/api/error/conflict')
      expect(res.status).toBe(409)
      const data = (await res.json()) as {
        error: { code: string; message: string }
      }
      expect(data.error.code).toBe('CONFLICT')
      expect(data.error.message).toBe('test message')
    })

    test('InternalServerError をハンドルできること', async () => {
      const res = await app.request('/api/error/internal')
      expect(res.status).toBe(500)
      const data = (await res.json()) as {
        error: { code: string; message: string }
      }
      expect(data.error.code).toBe('INTERNAL_SERVER_ERROR')
      expect(data.error.message).toBe('test message')
    })

    test('ZodError をハンドルできること', async () => {
      const res = await app.request('/api/error/zod')
      expect(res.status).toBe(400)
      const data = (await res.json()) as {
        error: { code: string; message: string; details: unknown[] }
      }
      expect(data.error.code).toBe('BAD_REQUEST')
      expect(data.error.message).toBe('Validation failed')
      expect(data.error.details).toBeDefined()
    })

    test('未知のエラーをハンドルできること', async () => {
      const res = await app.request('/api/error/unknown')
      expect(res.status).toBe(500)
      const data = (await res.json()) as {
        error: { code: string; message: string }
      }
      expect(data.error.code).toBe('INTERNAL_SERVER_ERROR')
      expect(data.error.message).toBe('An unexpected error occurred')
    })
  })

  vi.mock('../../../repositories/seisan', () => ({
    addSeisan: vi.fn(),
    update: vi.fn(),
    get: vi.fn(),
  }))

  vi.mock('../../../repositories/currency', () => ({
    addCurrency: vi.fn(),
  }))

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
          name: '', // 不正な名前
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
          name: '', // 不正な名前
        }),
      })

      expect(res.status).toBe(400)
    })
  })
})
