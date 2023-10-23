import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { FetchMemberCheckInsHistoryUseCase } from '../fetch-member-check-ins-history'

export function makeFetchMemberCheckInsHistoryUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()
  const fetchMemberCheckInsHistoryUseCase =
    new FetchMemberCheckInsHistoryUseCase(checkInRepository)

  return fetchMemberCheckInsHistoryUseCase
}
