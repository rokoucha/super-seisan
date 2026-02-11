import { describe, expect, test, vi } from 'vitest'
import * as seisanRepo from '../repositories/seisan'
import { addSeisanUsecase } from './seisan'

vi.mock('../repositories/seisan', () => ({
  addSeisanRepository: vi.fn(),
}))

describe('addSeisanUsecase', () => {
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

    vi.mocked(seisanRepo.addSeisanRepository).mockResolvedValue(mockSavedSeisan)

    const result = await addSeisanUsecase(mockInput)

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

    expect(seisanRepo.addSeisanRepository).toHaveBeenCalledWith({
      name: 'テスト精算',
      icon: '💰',
    })
  })
})
