import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CitiesService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Cities') // Group under 'Cities' tag in Swagger UI
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @ApiOperation({ summary: 'Create a new city' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cityName: { type: 'string', example: 'Hyderabad' },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file for the city',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'City created successfully' })
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createCityDto: CreateCityDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.citiesService.create(createCityDto, file);
  }

  @ApiOperation({ summary: 'Get all cities' })
  @ApiResponse({ status: 200, description: 'List of all cities' })
  @Get()
  findAll() {
    return this.citiesService.findAll();
  }

  @ApiOperation({ summary: 'Get a single city by ID' })
  @ApiResponse({ status: 200, description: 'City found' })
  @ApiResponse({ status: 404, description: 'City not found' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.citiesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a city by ID' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cityName: {
          type: 'string',
          example: 'New Delhi',
          description: 'New name for the city (optional)',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'New image for the city (optional)',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'City updated successfully' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCityDto: UpdateCityDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.citiesService.update(id, updateCityDto, file);
  }

  @ApiOperation({ summary: 'Delete a city by ID' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'City deleted successfully' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.citiesService.delete(id);
  }
}
