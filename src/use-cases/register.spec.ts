import { UsersInMemoryRepository } from '@/repositories/in-memory/users-in-memory-repository'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { UsersRepository } from '@/repositories/users-repository'

let usersInMemoryRepository: UsersRepository
let sut: RegisterUseCase

describe('RegisterUseCase', () => {
  beforeEach(() => {
    usersInMemoryRepository = new UsersInMemoryRepository()
    sut = new RegisterUseCase(usersInMemoryRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123q',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should be able to hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123q',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123123q',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123q',
    })

    const result = sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123q',
    })

    await expect(result).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
