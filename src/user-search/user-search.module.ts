import { Module } from '@nestjs/common';
import { UserSearchService } from './user-search.service';
import { UserSearchController } from './user-search.controller';
import { PrismaService } from 'src/core/services/prisma.service';

@Module({
  controllers: [UserSearchController],
  providers: [UserSearchService, PrismaService],
})
export class UserSearchModule {}
