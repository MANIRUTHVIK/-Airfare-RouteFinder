import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserSearchService } from './user-search.service';
import { CreateUserSearchDto } from './dto/create-user-search.dto';
import { UpdateUserSearchDto } from './dto/update-user-search.dto';

@Controller('user-search')
export class UserSearchController {
  constructor(private readonly userSearchService: UserSearchService) {}

  @Get('search')
  search(
    @Query('fromCity') fromCity: string,
    @Query('toCity') toCity: string,
    @Query('fliterBy') filterBy: string,
  ) {
    return this.userSearchService.search(fromCity, toCity, filterBy);
  }
}
