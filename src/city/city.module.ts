import { Module } from '@nestjs/common';
import { CitiesService } from './city.service';
import { CitiesController } from './city.controller';
import { PrismaService } from 'src/core/services/prisma.service';
import { S3Service } from 'src/core/services/s3.service';
import { ConnectionsModule } from 'src/connections/connections.module';

@Module({
  imports: [ConnectionsModule],
  controllers: [CitiesController],
  providers: [CitiesService, PrismaService, S3Service],
})
export class CitiesModule {}
