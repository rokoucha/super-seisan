import { NotFoundError } from '../errors'
import * as participantRepository from '../repositories/participant'
import * as seisanRepository from '../repositories/seisan'

export async function addParticipantToSeisan(
  seisanId: string,
  input: { name: string; icon: string },
) {
  const seisan = await seisanRepository.get(seisanId)
  if (!seisan) {
    throw new NotFoundError('Seisan not found')
  }

  await participantRepository.addParticipant({
    seisanId,
    name: input.name,
    icon: input.icon,
  })
}

export async function updateParticipantInSeisan(
  seisanId: string,
  id: string,
  input: { name: string; icon: string },
) {
  const seisan = await seisanRepository.get(seisanId)
  if (!seisan) {
    throw new NotFoundError('Seisan not found')
  }

  const result = await participantRepository.updateParticipant(id, {
    seisanId,
    name: input.name,
    icon: input.icon,
  })

  if (!result) {
    throw new NotFoundError('Participant not found')
  }
}

export async function removeParticipantFromSeisan(
  seisanId: string,
  id: string,
) {
  const seisan = await seisanRepository.get(seisanId)
  if (!seisan) {
    throw new NotFoundError('Seisan not found')
  }

  const result = await participantRepository.deleteParticipant(id)
  if (!result) {
    throw new NotFoundError('Participant not found')
  }
}
