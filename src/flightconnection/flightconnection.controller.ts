import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FlightconnectionService } from './flightconnection.service';
import { CreateFlightconnectionDto } from './dto/create-flightconnection.dto';
import { UpdateFlightconnectionDto } from './dto/update-flightconnection.dto';

@Controller('flightconnection')
export class FlightconnectionController {
  constructor(
    private readonly flightconnectionService: FlightconnectionService,
  ) {}

  @Post()
  create(@Body() createFlightconnectionDto: CreateFlightconnectionDto) {
    return this.flightconnectionService.create(createFlightconnectionDto);
  }

  @Get()
  findAll() {
    return this.flightconnectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flightconnectionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFlightconnectionDto: UpdateFlightconnectionDto,
  ) {
    return this.flightconnectionService.update(+id, updateFlightconnectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flightconnectionService.remove(+id);
  }
}
