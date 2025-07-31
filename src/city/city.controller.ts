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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CitiesService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  // POST /api/cities
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createCityDto: CreateCityDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.citiesService.create(createCityDto, file);
  }

  // GET /api/cities
  @Get()
  findAll() {
    return this.citiesService.findAll();
  }

  // GET /api/cities/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.citiesService.findOne(id);
  }

  // PATCH /api/cities/:id
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCityDto: UpdateCityDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.citiesService.update(id, updateCityDto, file);
  }

  // DELETE /api/cities/:id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.citiesService.delete(id);
  }
}
