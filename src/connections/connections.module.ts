import { Module } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { ConnectionsController } from './connections.controller';
import { PrismaService } from 'src/core/services/prisma.service';
import { GeminiService } from 'src/core/services/gemini.service';
import { CloudinaryService } from 'src/core/services/cloudinary.service';

@Module({
  controllers: [ConnectionsController],
  providers: [
    ConnectionsService,
    PrismaService,
    GeminiService,
    CloudinaryService,
  ],
})
export class ConnectionsModule {}
