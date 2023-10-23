import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckInsInMemoryRepository } from '@/repositories/in-memory/check-ins-in-memory-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInsRepository: CheckInsRepository
let sut: GetUserMetricsUseCase

describe('GetUserMetricsUseCase', () => {
  beforeEach(async () => {
    checkInsRepository = new CheckInsInMemoryRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkInsCount } = await sut.execute({ userId: 'user-01' })

    expect(checkInsCount).toEqual(2)
  })
})
