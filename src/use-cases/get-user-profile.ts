import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { ResourcesNotFoundError } from './errors/resources-not-found-error'

interface GetUserProfileUseCaseParams {
  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseParams): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourcesNotFoundError()
    }

    return {
      user,
    }
  }
}
