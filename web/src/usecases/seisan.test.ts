import { describe, expect, test, vi } from 'vitest'
import * as seisanRepo from '../repositories/seisan'
import * as seisanUsecase from './seisan'

vi.mock('../repositories/seisan', () => ({
  addSeisan: vi.fn(),
}))

describe('seisanUsecase.addSeisan', () => {
  test('精算を正常に作成し、初期状態の結果を返すこと', async () => {
    const mockInput = {
      name: 'テスト精算',
      emoji: '💰',
    }

    const mockSavedSeisan = {
      id: 'uuid-1',
      name: 'テスト精算',
      icon: '💰',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(seisanRepo.addSeisan).mockResolvedValue(mockSavedSeisan)

    const result = await seisanUsecase.addSeisan(mockInput)

    expect(result).toMatchObject({
      id: 'uuid-1',
      name: 'テスト精算',
      icon: '💰',
      items: [],
      participants: [],
      currencies: [],
      result: {
        surplus: 0,
        details: [],
      },
    })
    expect(result.createdAt).toBeDefined()
    expect(result.updatedAt).toBeDefined()

    expect(seisanRepo.addSeisan).toHaveBeenCalledWith({
      name: 'テスト精算',
      icon: '💰',
    })
  })
})
