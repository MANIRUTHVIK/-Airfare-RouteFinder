import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
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

  private normalizeCityName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  // CREATE a new city and upload an optional image
  async create(createCityDto: CreateCityDto, file?: Express.Multer.File) {
    // Validate city name first
    if (!createCityDto.name || !createCityDto.name.trim()) {
      throw new BadRequestException('City name is required.');
    }

    const normalizedCityName = this.normalizeCityName(
      createCityDto.name.trim(),
    );

    // Check if a city with the same name already exists
    const existingCity = await this.prisma.city.findUnique({
      where: { name: normalizedCityName },
    });

    if (existingCity) {
      throw new ConflictException('City with this name already exists.');
    }

    const newCity = await this.prisma.city.create({
      data: { name: normalizedCityName },
    });

    let imageUrl: string | undefined;
    if (file) {
      try {
        const fileKey = `city-images/${newCity.id}-${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;
        imageUrl = await this.s3Service.uploadFile(file, fileKey);
      } catch (error) {
        // If S3 upload fails, we should still return the city but log the error
        console.error('Failed to upload city image:', error);
      }
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

    // Handle file upload
    if (file) {
      try {
        // Delete old image if it exists
        if (city.imageUrl) {
          const oldKey = city.imageUrl.split('/').pop();
          if (oldKey) await this.s3Service.deleteFile(`city-images/${oldKey}`);
        }

        // Upload new image
        const newKey = `city-images/${id}-${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;
        imageUrl = await this.s3Service.uploadFile(file, newKey);
      } catch (error) {
        console.error('Failed to update city image:', error);
        throw new BadRequestException('Failed to update city image');
      }
    }

    let normalizedCityName: string | undefined;
    if (updateCityDto.name) {
      if (!updateCityDto.name.trim()) {
        throw new BadRequestException('City name cannot be empty.');
      }

      normalizedCityName = this.normalizeCityName(updateCityDto.name.trim());

      // Check if another city with this name exists
      const existingCity = await this.prisma.city.findUnique({
        where: { name: normalizedCityName },
      });

      if (existingCity && existingCity.id !== id) {
        throw new ConflictException('City with this name already exists.');
      }

      // Update connections with new city name
      await this.prisma.$transaction([
        this.prisma.connection.updateMany({
          where: { fromCity: city.name },
          data: { fromCity: normalizedCityName },
        }),
        this.prisma.connection.updateMany({
          where: { toCity: city.name },
          data: { toCity: normalizedCityName },
        }),
      ]);
    }

    return this.prisma.city.update({
      where: { id },
      data: {
        ...(normalizedCityName && { name: normalizedCityName }),
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

    // Delete associated connections first to prevent foreign key constraints
    await this.prisma.connection.deleteMany({
      where: {
        OR: [{ fromCity: city.name }, { toCity: city.name }],
      },
    });

    // Delete S3 image if it exists
    if (city.imageUrl) {
      try {
        const key = city.imageUrl.split('/').pop();
        if (key) await this.s3Service.deleteFile(`city-images/${key}`);
      } catch (error) {
        console.error('Failed to delete city image from S3:', error);
        // Continue with city deletion even if S3 deletion fails
      }
    }

    // Finally, delete the city from the database
    await this.prisma.city.delete({ where: { id } });
    return { message: `City '${city.name}' and all associated data deleted.` };
  }

  // FIND ALL cities
  async findAll() {
    return this.prisma.city.findMany({
      orderBy: { name: 'asc' },
    });
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
