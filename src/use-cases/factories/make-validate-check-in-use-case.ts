import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { ValidateCheckInUseCase } from '../validate-check-in'

export function makeValidateCheckInUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()
  const validatecheckInUseCase = new ValidateCheckInUseCase(checkInRepository)

  return validatecheckInUseCase
}
