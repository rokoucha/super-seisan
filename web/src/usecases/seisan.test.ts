import { describe, expect, test, vi } from 'vitest'
import * as seisanRepo from '../repositories/seisan'
import * as seisanUsecase from './seisan'

vi.mock('../repositories/seisan', () => ({
  addSeisan: vi.fn(),
  update: vi.fn(),
  get: vi.fn(),
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

    const mockSeisanWithRelations = {
      ...mockSavedSeisan,
      items: [],
      participants: [],
      currencies: [],
    }

    vi.mocked(seisanRepo.addSeisan).mockResolvedValue(mockSavedSeisan)
    vi.mocked(seisanRepo.get).mockResolvedValue(mockSeisanWithRelations as any)

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
    expect(seisanRepo.get).toHaveBeenCalledWith('uuid-1')
  })
})

describe('seisanUsecase.updateSeisan', () => {
  test('精算を正常に更新し、全データを返すこと', async () => {
    const seisanId = 'uuid-1'
    const mockInput = {
      name: '更新後の精算',
      emoji: '💳',
    }

    const mockUpdatedSeisan = {
      id: seisanId,
      name: '更新後の精算',
      icon: '💳',
      createdAt: new Date(),
      updatedAt: new Date(),
      participants: [],
      currencies: [],
      items: [],
    }

    vi.mocked(seisanRepo.update).mockResolvedValue({
      id: seisanId,
      name: '更新後の精算',
      icon: '💳',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    vi.mocked(seisanRepo.get).mockResolvedValue(mockUpdatedSeisan as any)

    const result = await seisanUsecase.updateSeisan(seisanId, mockInput)

    expect(result).toMatchObject({
      id: seisanId,
      name: '更新後の精算',
      icon: '💳',
      items: [],
      participants: [],
      currencies: [],
    })
    expect(seisanRepo.update).toHaveBeenCalledWith(seisanId, {
      name: '更新後の精算',
      icon: '💳',
    })
    expect(seisanRepo.get).toHaveBeenCalledWith(seisanId)
  })
})
describe('seisanUsecase.getSeisan', () => {
  test('指定されたIDの精算を正常に取得し、整形して返すこと', async () => {
    const seisanId = 'uuid-1'
    const mockSeisanWithRelations = {
      id: seisanId,
      name: 'テスト精算',
      icon: '💰',
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [],
      participants: [],
      currencies: [],
    }

    vi.mocked(seisanRepo.get).mockResolvedValue(mockSeisanWithRelations as any)

    const result = await seisanUsecase.getSeisan(seisanId)

    expect(result).toMatchObject({
      id: seisanId,
      name: 'テスト精算',
      icon: '💰',
      items: [],
      participants: [],
      currencies: [],
    })
    expect(seisanRepo.get).toHaveBeenCalledWith(seisanId)
  })

  test('精算が見つからない場合にNotFoundErrorを投げること', async () => {
    const seisanId = 'non-existent'
    vi.mocked(seisanRepo.get).mockResolvedValue(null as any)

    await expect(seisanUsecase.getSeisan(seisanId)).rejects.toThrow(
      'Seisan not found',
    )
  })
})
