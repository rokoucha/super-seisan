import { describe, expect, test } from 'vitest'
import { app } from './route'

describe('API Routes', () => {
  test('GET /api returns version info', async () => {
    // basePathが'/api'で、app.get('/', ...)なので、'/api'でアクセス
    const res = await app.request('/api')

    expect(res.status).toBe(200)

    const data = (await res.json()) as { version: string }
    expect(data).toHaveProperty('version')
    expect(typeof data.version).toBe('string')
    expect(data.version).toBe('1.0.0')
  })
})
