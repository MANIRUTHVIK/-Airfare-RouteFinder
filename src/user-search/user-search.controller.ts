import { Controller, Get, Query } from '@nestjs/common';
import { UserSearchService } from './user-search.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User Search')
@Controller('user-search')
export class UserSearchController {
  constructor(private readonly userSearchService: UserSearchService) {}

  @ApiOperation({ summary: 'Search available routes by city names' })
  @ApiQuery({ name: 'fromCity', required: true, example: 'Bengaluru' })
  @ApiQuery({ name: 'toCity', required: true, example: 'Delhi' })
  @ApiQuery({
    name: 'filterBy',
    required: false,
    enum: ['fastest', 'cheapest'],
    description: 'Optional filter: "fastest" or "cheapest"',
  })
  @ApiResponse({
    status: 200,
    description: 'Matching routes returned successfully',
  })
  @Get('search')
  search(
    @Query('fromCity') fromCity: string,
    @Query('toCity') toCity: string,
    @Query('filterBy') filterBy: 'fastest' | 'cheapest',
  ) {
    return this.userSearchService.search(fromCity, toCity, filterBy);
  }
}
