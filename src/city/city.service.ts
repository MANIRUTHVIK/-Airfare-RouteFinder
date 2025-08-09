import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { PrismaService } from 'src/core/services/prisma.service';
import { S3Service } from 'src/core/services/s3.service';

@Injectable()
export class CitiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  // CREATE a new city and upload an optional image
  async create(createCityDto: CreateCityDto, file?: Express.Multer.File) {
    const normalizedCityName =
      createCityDto.name.charAt(0).toUpperCase() +
      createCityDto.name.slice(1).toLowerCase();

    createCityDto.name = normalizedCityName;
    if (!createCityDto.name) {
      throw new NotFoundException('City name is required.');
    }
    // Check if a city with the same name already exists
    const existingCity = await this.prisma.city.findUnique({
      where: { name: createCityDto.name },
    });
    if (existingCity) {
      throw new NotFoundException('City with this name already exists.');
    }
    const newCity = await this.prisma.city.create({
      data: { name: createCityDto.name },
    });

    let imageUrl: string | undefined;
    if (file) {
      const fileKey = `city-images/${newCity.id}-${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;
      imageUrl = await this.s3Service.uploadFile(file, fileKey);
    }

    return this.prisma.city.update({
      where: { id: newCity.id },
      data: { imageUrl },
    });
  }

  async update(
    id: number,
    updateCityDto: UpdateCityDto,
    file?: Express.Multer.File,
  ) {
    const city = await this.prisma.city.findUnique({ where: { id } });
    if (!city) {
      throw new NotFoundException(`City with ID ${id} not found.`);
    }
    let imageUrl = city.imageUrl;
    if (file) {
      // If an old image exists, delete it from S3
      if (city.imageUrl) {
        const oldKey = city.imageUrl.split('/').pop();
        if (oldKey) await this.s3Service.deleteFile(`city-images/${oldKey}`);
      }
      // Upload the new image
      const newKey = `city-images/${id}-${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;
      imageUrl = await this.s3Service.uploadFile(file, newKey);
    }
    if (updateCityDto.name) {
      const normalizedCityName =
        updateCityDto.name.charAt(0).toUpperCase() +
        updateCityDto.name.slice(1).toLowerCase();
      updateCityDto.name = normalizedCityName;
      const UpdateFromCity = await this.prisma.connection.updateMany({
        where: { fromCity: city.name },
        data: { fromCity: normalizedCityName },
      });
      const UpdateToCity = await this.prisma.connection.updateMany({
        where: { toCity: city.name },
        data: { toCity: normalizedCityName },
      });
    }

    return this.prisma.city.update({
      where: { id },
      data: {
        name: updateCityDto.name,
        imageUrl: imageUrl,
      },
    });
  }

  // DELETE a city, its connections, and its S3 image
  async delete(id: number) {
    const city = await this.prisma.city.findUnique({ where: { id } });
    if (!city) {
      throw new NotFoundException(`City with ID ${id} not found.`);
    }

    // Delete associated connections first to prevent errors
    // await this.prisma.connection.deleteMany({
    //   where: { OR: [{ fromCityId: id }, { toCityId: id }] },
    // });

    // If an image exists in S3, delete it
    if (city.imageUrl) {
      const key = city.imageUrl.split('/').pop();
      if (key) await this.s3Service.deleteFile(`city-images/${key}`);
    }

    // Finally, delete the city from the database
    await this.prisma.city.delete({ where: { id } });
    return { message: `City '${city.name}' and all associated data deleted.` };
  }

  // FIND ALL cities
  async findAll() {
    return this.prisma.city.findMany();
  }

  // FIND ONE city by ID
  async findOne(id: number) {
    const city = await this.prisma.city.findUnique({ where: { id } });
    if (!city) {
      throw new NotFoundException(`City with ID ${id} not found.`);
    }
    return city;
  }
}
