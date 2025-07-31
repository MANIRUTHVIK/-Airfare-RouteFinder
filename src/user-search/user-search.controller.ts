import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserSearchService } from './user-search.service';
import { CreateUserSearchDto } from './dto/create-user-search.dto';
import { UpdateUserSearchDto } from './dto/update-user-search.dto';

@Controller('user-search')
export class UserSearchController {
  constructor(private readonly userSearchService: UserSearchService) {}

  @Post()
  create(@Body() createUserSearchDto: CreateUserSearchDto) {
    return this.userSearchService.create(createUserSearchDto);
  }

  @Get()
  findAll() {
    return this.userSearchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userSearchService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserSearchDto: UpdateUserSearchDto) {
    return this.userSearchService.update(+id, updateUserSearchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userSearchService.remove(+id);
  }
}
