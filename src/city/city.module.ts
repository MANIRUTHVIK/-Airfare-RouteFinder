import { Module } from '@nestjs/common';
import { CitiesService } from './city.service';
import { CitiesController } from './city.controller';
import { PrismaService } from 'src/core/services/prisma.service';
import { CloudinaryService } from 'src/core/services/cloudinary.service';
import { ConnectionsModule } from 'src/connections/connections.module';

@Module({
  imports: [ConnectionsModule],
  controllers: [CitiesController],
  providers: [CitiesService, PrismaService, CloudinaryService],
})
export class CitiesModule {}
