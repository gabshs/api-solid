import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckInsInMemoryRepository } from '@/repositories/in-memory/check-ins-in-memory-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FetchMemberCheckInsHistoryUseCase } from './fetch-member-check-ins-history'

let checkInsRepository: CheckInsRepository
let sut: FetchMemberCheckInsHistoryUseCase

describe('FetchMemberCheckInsHistoryUseCase', () => {
  beforeEach(async () => {
    checkInsRepository = new CheckInsInMemoryRepository()
    sut = new FetchMemberCheckInsHistoryUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to fetch check-ins history', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkIns } = await sut.execute({ userId: 'user-01', page: 1 })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })

  it('should be able to fetch paginated user check-ins history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      })
    }

    const { checkIns } = await sut.execute({ userId: 'user-01', page: 2 })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})
