import { Injectable } from '@nestjs/common';
import { CreateUserSearchDto } from './dto/create-user-search.dto';
import { UpdateUserSearchDto } from './dto/update-user-search.dto';
import { PrismaService } from '../core/services/prisma.service';
import { from } from 'rxjs';

@Injectable()
export class UserSearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(fromCity: string, toCity: string, filterBy: string) {
    const normalizedFromCity = await this.normalizeCityName(fromCity);
    const normalizedToCity = await this.normalizeCityName(toCity);

    const connections = await this.prisma.connection.findMany({
      where: {
        fromCity: normalizedFromCity,
        toCity: normalizedToCity,
      },
      orderBy: {
        [filterBy === 'Cheapest' ? 'airfare' : 'duration']: 'asc',
      },
    });
    if (connections.length === 0) {
      return { message: 'No connections found for the specified route.' };
    }

    const fromCityImg = await this.getCityImage(normalizedFromCity);
    const toCityImg = await this.getCityImage(normalizedToCity);

    return {
      connections,
      fromCityImage: fromCityImg,
      toCityImage: toCityImg,
    };
  }

  private async getCityImage(cityName: string) {
    const cityImgurl = await this.prisma.city.findUnique({
      where: { name: cityName },
      select: { imageUrl: true },
    });
    return cityImgurl?.imageUrl || 'No image available';
  }

  private async normalizeCityName(name: String) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
}
