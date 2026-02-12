import { beforeEach, describe, expect, test, vi } from 'vitest'
import { NotFoundError } from '../errors'
import * as currencyRepo from '../repositories/currency'
import * as seisanRepo from '../repositories/seisan'
import * as currencyUsecase from './currency'

vi.mock('../repositories/currency', () => ({
  addCurrency: vi.fn(),
}))

vi.mock('../repositories/seisan', () => ({
  get: vi.fn(),
}))

describe('currencyUsecase.addCurrencyToSeisan', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('精算に通貨を正常に追加できること', async () => {
    const seisanId = 'uuid-1'
    const input = {
      code: 'USD',
      rate: 150,
    }
    vi.mocked(seisanRepo.get).mockResolvedValue({ id: seisanId } as any)
    vi.mocked(currencyRepo.addCurrency).mockResolvedValue({
      id: 'currency-1',
      seisanId,
      code: 'USD',
      rate: 150,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await currencyUsecase.addCurrencyToSeisan(seisanId, input)

    expect(seisanRepo.get).toHaveBeenCalledWith(seisanId)
    expect(currencyRepo.addCurrency).toHaveBeenCalledWith({
      seisanId,
      code: 'USD',
      rate: 150,
    })
    expect(seisanRepo.get).toHaveBeenCalledTimes(1)
  })

  test('精算が存在しない場合にNotFoundErrorを投げること', async () => {
    const seisanId = 'not-found'

    vi.mocked(seisanRepo.get).mockResolvedValue(null as any)

    await expect(
      currencyUsecase.addCurrencyToSeisan(seisanId, {
        code: 'USD',
        rate: 150,
      }),
    ).rejects.toThrow(NotFoundError)

    expect(seisanRepo.get).toHaveBeenCalledTimes(1)
    expect(currencyRepo.addCurrency).not.toHaveBeenCalled()
  })
})
