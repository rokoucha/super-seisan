import { NotFoundError } from '../errors'
import * as currencyRepository from '../repositories/currency'
import * as seisanRepository from '../repositories/seisan'

export async function addCurrencyToSeisan(
  seisanId: string,
  input: { code: string; rate: number },
) {
  const seisan = await seisanRepository.get(seisanId)
  if (!seisan) {
    throw new NotFoundError('Seisan not found')
  }

  await currencyRepository.addCurrency({
    seisanId,
    code: input.code,
    rate: input.rate,
  })
}

export async function updateCurrencyInSeisan(
  seisanId: string,
  id: string,
  input: { code: string; rate: number },
) {
  const seisan = await seisanRepository.get(seisanId)
  if (!seisan) {
    throw new NotFoundError('Seisan not found')
  }

  await currencyRepository.updateCurrency(id, {
    seisanId,
    code: input.code,
    rate: input.rate,
  })
}

export async function removeCurrencyFromSeisan(seisanId: string, id: string) {
  const seisan = await seisanRepository.get(seisanId)
  if (!seisan) {
    throw new NotFoundError('Seisan not found')
  }

  await currencyRepository.deleteCurrency(id)
}
