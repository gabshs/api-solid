import { GymsInMemoryRepository } from '@/repositories/in-memory/gyms-in-memory-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: GymsInMemoryRepository
let sut: SearchGymsUseCase

describe('SearchGymsUseCase', () => {
  beforeEach(async () => {
    gymsRepository = new GymsInMemoryRepository()
    sut = new SearchGymsUseCase(gymsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'JS Gym',
      latitude: 0,
      longitude: 0,
    })

    await gymsRepository.create({
      title: 'TS Gym',
      latitude: 0,
      longitude: 0,
    })

    const { gyms } = await sut.execute({ query: 'JS', page: 1 })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'JS Gym' })])
  })

  it('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `TS Gym ${i}`,
        latitude: 0,
        longitude: 0,
      })
    }

    const { gyms } = await sut.execute({ query: 'TS', page: 2 })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'TS Gym 21' }),
      expect.objectContaining({ title: 'TS Gym 22' }),
    ])
  })
})
