import { NotFoundError } from '../errors'
import * as seisanRepository from '../repositories/seisan'

export async function addParticipantToSeisan(
  seisanId: string,
  input: { name: string; icon: string },
) {
  const seisan = await seisanRepository.get(seisanId)
  if (!seisan) {
    throw new NotFoundError('Seisan not found')
  }

  await seisanRepository.addParticipant({
    seisanId,
    name: input.name,
    icon: input.icon,
  })
}
