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

      const { addSeisan } = await import('../../../repositories/seisan')
      vi.mocked(addSeisan).mockResolvedValue(mockSeisan as any)

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
          name: '', // バリデーション内容はスキーマに依存するが、ここでは不正な型などを試すのが一般的
          // emoji が欠落している
        }),
      })

      expect(res.status).toBe(400)
      const data = (await res.json()) as any
      expect(data.error.code).toBe('BAD_REQUEST')
    })
  })
})
