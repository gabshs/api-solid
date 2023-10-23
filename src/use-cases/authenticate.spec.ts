import { UsersInMemoryRepository } from '@/repositories/in-memory/users-in-memory-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersInMemoryRepository: UsersRepository
let sut: AuthenticateUseCase

describe('AuthenticateUseCase', () => {
  beforeEach(() => {
    usersInMemoryRepository = new UsersInMemoryRepository()
    sut = new AuthenticateUseCase(usersInMemoryRepository)
  })

  it('should be able to authenticate', async () => {
    usersInMemoryRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123123q', 6),
    })

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123123q',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const result = sut.execute({
      email: 'wrong@example.com',
      password: '123123q',
    })

    await expect(result).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    usersInMemoryRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123123q', 6),
    })

    const result = sut.execute({
      email: 'johndoe@example.com',
      password: 'wrong_password',
    })

    await expect(result).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
