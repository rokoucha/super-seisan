import { beforeEach, describe, expect, test, vi } from 'vitest'
import * as seisanRepo from '../repositories/seisan'
import * as participantUsecase from './participant'

vi.mock('../repositories/seisan', () => ({
  addParticipant: vi.fn(),
  updateParticipant: vi.fn(),
  get: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('participantUsecase.addParticipantToSeisan', () => {
  test('精算に参加者を正常に追加できること', async () => {
    const seisanId = 'uuid-1'
    const input = {
      name: '参加者A',
      icon: '😀',
    }

    vi.mocked(seisanRepo.get).mockResolvedValue({ id: seisanId } as any)
    vi.mocked(seisanRepo.addParticipant).mockResolvedValue({
      id: 'participant-1',
      seisanId,
      name: input.name,
      icon: input.icon,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any)

    await participantUsecase.addParticipantToSeisan(seisanId, input)

    expect(seisanRepo.get).toHaveBeenCalledWith(seisanId)
    expect(seisanRepo.addParticipant).toHaveBeenCalledWith({
      seisanId,
      name: input.name,
      icon: input.icon,
    })
  })

  test('精算が見つからない場合にNotFoundErrorを投げること', async () => {
    const seisanId = 'non-existent'
    vi.mocked(seisanRepo.get).mockResolvedValue(null as any)

    await expect(
      participantUsecase.addParticipantToSeisan(seisanId, {
        name: '参加者A',
        icon: '😀',
      }),
    ).rejects.toThrow('Seisan not found')

    expect(seisanRepo.get).toHaveBeenCalledWith(seisanId)
    expect(seisanRepo.addParticipant).not.toHaveBeenCalled()
  })
})

describe('participantUsecase.updateParticipantInSeisan', () => {
  test('精算に存在する参加者を正常に更新できること', async () => {
    const seisanId = 'uuid-1'
    const participantId = 'participant-1'
    const input = {
      name: '参加者B',
      icon: '😎',
    }

    vi.mocked(seisanRepo.get).mockResolvedValue({ id: seisanId } as any)
    vi.mocked(seisanRepo.updateParticipant).mockResolvedValue({
      id: participantId,
      seisanId,
      name: input.name,
      icon: input.icon,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any)

    await participantUsecase.updateParticipantInSeisan(
      seisanId,
      participantId,
      input,
    )

    expect(seisanRepo.get).toHaveBeenCalledWith(seisanId)
    expect(seisanRepo.updateParticipant).toHaveBeenCalledWith(participantId, {
      seisanId,
      name: input.name,
      icon: input.icon,
    })
  })

  test('精算が見つからない場合にNotFoundErrorを投げること', async () => {
    const seisanId = 'non-existent'
    const participantId = 'participant-1'
    vi.mocked(seisanRepo.get).mockResolvedValue(null as any)

    await expect(
      participantUsecase.updateParticipantInSeisan(seisanId, participantId, {
        name: '参加者B',
        icon: '😎',
      }),
    ).rejects.toThrow('Seisan not found')

    expect(seisanRepo.get).toHaveBeenCalledWith(seisanId)
    expect(seisanRepo.updateParticipant).not.toHaveBeenCalled()
  })
})
