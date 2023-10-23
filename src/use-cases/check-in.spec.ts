import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckInsInMemoryRepository } from '@/repositories/in-memory/check-ins-in-memory-repository'
import { GymsInMemoryRepository } from '@/repositories/in-memory/gyms-in-memory-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let gymsRepository: GymsInMemoryRepository
let checkInsRepository: CheckInsRepository
let sut: CheckInUseCase

describe('CheckInUseCase', () => {
  beforeEach(async () => {
    gymsRepository = new GymsInMemoryRepository()
    checkInsRepository = new CheckInsInMemoryRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JS Gym',
      description: '',
      phone: '',
      latitude: -12.978855,
      longitude: -38.504259,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check-in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -12.978855,
      userLongitude: -38.504259,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check-in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -12.978855,
      userLongitude: -38.504259,
    })

    vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0))

    const result = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -12.978855,
      userLongitude: -38.504259,
    })

    expect(result).toBeTruthy()
  })

  it('should be able to check-in twice on the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -12.978855,
      userLongitude: -38.504259,
    })

    const result = sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -12.978855,
      userLongitude: -38.504259,
    })

    await expect(result).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should not be able to check-in distant', async () => {
    gymsRepository.gyms.push({
      id: 'gym-02',
      title: 'JS Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-12.978855),
      longitude: new Decimal(-38.504259),
    })

    const result = sut.execute({
      gymId: 'gym-02',
      userId: 'user-01',
      userLatitude: -16.3242458,
      userLongitude: -48.9515304,
    })

    await expect(result).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
