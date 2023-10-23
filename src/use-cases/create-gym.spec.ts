import { GymsInMemoryRepository } from '@/repositories/in-memory/gyms-in-memory-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: GymsInMemoryRepository
let sut: CreateGymUseCase

describe('CreateGymUseCase', () => {
  beforeEach(() => {
    gymsRepository = new GymsInMemoryRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Javascript Gym',
      description: null,
      phone: null,
      latitude: -12.978855,
      longitude: -38.504259,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
