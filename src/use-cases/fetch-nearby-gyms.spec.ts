import { GymsInMemoryRepository } from '@/repositories/in-memory/gyms-in-memory-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: GymsInMemoryRepository
let sut: FetchNearbyGymsUseCase

describe('FetchNearbyGymsUseCase', () => {
  beforeEach(async () => {
    gymsRepository = new GymsInMemoryRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to find nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      latitude: -16.3242458,
      longitude: -48.9515304,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      latitude: -12.978855,
      longitude: -38.504259,
    })

    const { gyms } = await sut.execute({
      userLatitude: -16.3242458,
      userLongitude: -48.9515304,
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })

  it('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `TS Gym ${i}`,
        latitude: Number(`-16.32424${String(i).padStart(2, '0')}`),
        longitude: Number(`-48.95153${String(i).padStart(2, '0')}`),
      })
    }

    const { gyms } = await sut.execute({
      userLatitude: -16.3242458,
      userLongitude: -48.9515304,
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'TS Gym 21' }),
      expect.objectContaining({ title: 'TS Gym 22' }),
    ])
  })
})
