import { beforeEach, describe, expect, test, vi } from 'vitest'
import * as participantRepo from '../repositories/participant'
import * as seisanRepo from '../repositories/seisan'
import * as participantUsecase from './participant'

vi.mock('../repositories/seisan', () => ({
  get: vi.fn(),
}))
vi.mock('../repositories/participant', () => ({
  addParticipant: vi.fn(),
  deleteParticipant: vi.fn(),
  updateParticipant: vi.fn(),
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
    vi.mocked(participantRepo.addParticipant).mockResolvedValue({
      id: 'participant-1',
      seisanId,
      name: input.name,
      icon: input.icon,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any)

    await participantUsecase.addParticipantToSeisan(seisanId, input)

    expect(seisanRepo.get).toHaveBeenCalledWith(seisanId)
    expect(participantRepo.addParticipant).toHaveBeenCalledWith({
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
    expect(participantRepo.addParticipant).not.toHaveBeenCalled()
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
    vi.mocked(participantRepo.updateParticipant).mockResolvedValue({
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
    expect(participantRepo.updateParticipant).toHaveBeenCalledWith(
      participantId,
      {
        seisanId,
        name: input.name,
        icon: input.icon,
      },
    )
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
    expect(participantRepo.updateParticipant).not.toHaveBeenCalled()
  })
})

describe('participantUsecase.removeParticipantFromSeisan', () => {
  test('精算に存在する参加者を正常に削除できること', async () => {
    const seisanId = 'uuid-1'
    const participantId = 'participant-1'

    vi.mocked(seisanRepo.get).mockResolvedValue({ id: seisanId } as any)
    vi.mocked(participantRepo.deleteParticipant).mockResolvedValue({
      id: participantId,
      seisanId,
      name: '参加者A',
      icon: '😀',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any)

    await participantUsecase.removeParticipantFromSeisan(
      seisanId,
      participantId,
    )

    expect(seisanRepo.get).toHaveBeenCalledWith(seisanId)
    expect(participantRepo.deleteParticipant).toHaveBeenCalledWith(
      participantId,
    )
  })

  test('精算が見つからない場合にNotFoundErrorを投げること', async () => {
    const seisanId = 'non-existent'
    const participantId = 'participant-1'
    vi.mocked(seisanRepo.get).mockResolvedValue(null as any)

    await expect(
      participantUsecase.removeParticipantFromSeisan(seisanId, participantId),
    ).rejects.toThrow('Seisan not found')

    expect(seisanRepo.get).toHaveBeenCalledWith(seisanId)
    expect(participantRepo.deleteParticipant).not.toHaveBeenCalled()
  })
})
