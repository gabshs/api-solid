import { UsersInMemoryRepository } from '@/repositories/in-memory/users-in-memory-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { ResourcesNotFoundError } from './errors/resources-not-found-error'
import { GetUserProfileUseCase } from './get-user-profile'

let usersInMemoryRepository: UsersRepository
let sut: GetUserProfileUseCase

describe('GetUserProfileUseCase', () => {
  beforeEach(() => {
    usersInMemoryRepository = new UsersInMemoryRepository()
    sut = new GetUserProfileUseCase(usersInMemoryRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = usersInMemoryRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123123q', 6),
    })

    const { user } = await sut.execute({
      userId: (await createdUser).id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('John Doe')
  })

  it('should not be able to get user profile with wrong id', async () => {
    const result = sut.execute({
      userId: 'non-existing-id',
    })

    await expect(result).rejects.toBeInstanceOf(ResourcesNotFoundError)
  })
})
