import { Module } from '@nestjs/common';
import { UserSearchService } from './user-search.service';
import { UserSearchController } from './user-search.controller';

@Module({
  controllers: [UserSearchController],
  providers: [UserSearchService],
})
export class UserSearchModule {}
