import { Module } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { ConnectionsController } from './connections.controller';
import { PrismaService } from 'src/core/services/prisma.service';
import { GeminiService } from 'src/core/services/gemini.service';
import { S3Service } from 'src/core/services/s3.service';

@Module({
  controllers: [ConnectionsController],
  providers: [ConnectionsService, PrismaService, GeminiService, S3Service],
})
export class ConnectionsModule {}
