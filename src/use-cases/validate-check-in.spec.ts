import { CheckInsInMemoryRepository } from '@/repositories/in-memory/check-ins-in-memory-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourcesNotFoundError } from './errors/resources-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let checkInsRepository: CheckInsInMemoryRepository
let sut: ValidateCheckInUseCase

describe('CheckInUseCase', () => {
  beforeEach(async () => {
    checkInsRepository = new CheckInsInMemoryRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate and save check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await sut.execute({ checkInId: createdCheckIn.id })

    expect(createdCheckIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.checkIns[0].validated_at).toEqual(
      expect.any(Date),
    )
  })

  it('should not be able to validate and save an inexistent check-in', async () => {
    const result = sut.execute({ checkInId: 'inexistent-check-in-id' })

    expect(result).rejects.toBeInstanceOf(ResourcesNotFoundError)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const TWENTY_ONE_MINUTES_IN_MS = 1000 * 60 * 21
    vi.advanceTimersByTime(TWENTY_ONE_MINUTES_IN_MS)

    const result = sut.execute({ checkInId: createdCheckIn.id })

    await expect(result).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
