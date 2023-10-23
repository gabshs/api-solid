import { Gym, Prisma } from '@prisma/client'
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { randomUUID } from 'crypto'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class GymsInMemoryRepository implements GymsRepository {
  public gyms: Gym[] = []

  public async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.gyms.push(gym)

    return gym
  }

  public async findById(id: string): Promise<Gym | null> {
    const gym = this.gyms.find((g) => g.id === id)

    if (!gym) {
      return null
    }

    return gym
  }

  public async searchMany(query: string, page: number): Promise<Gym[]> {
    return this.gyms
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  public async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    return this.gyms
      .filter((gyms) => {
        const distance = getDistanceBetweenCoordinates(
          {
            latitude: params.latitude,
            longitude: params.longitude,
          },
          {
            latitude: gyms.latitude.toNumber(),
            longitude: gyms.longitude.toNumber(),
          },
        )

        return distance < 10
      })
      .slice((params.page - 1) * 20, params.page * 20)
  }
}
