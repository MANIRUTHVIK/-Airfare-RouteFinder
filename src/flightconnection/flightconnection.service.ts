import { Injectable } from '@nestjs/common';
import { CreateFlightconnectionDto } from './dto/create-flightconnection.dto';
import { UpdateFlightconnectionDto } from './dto/update-flightconnection.dto';

@Injectable()
export class FlightconnectionService {
  create(createFlightconnectionDto: CreateFlightconnectionDto) {
    return 'This action adds a new flightconnection';
  }

  findAll() {
    return `This action returns all flightconnection`;
  }

  findOne(id: number) {
    return `This action returns a #${id} flightconnection`;
  }

  update(id: number, updateFlightconnectionDto: UpdateFlightconnectionDto) {
    return `This action updates a #${id} flightconnection`;
  }

  remove(id: number) {
    return `This action removes a #${id} flightconnection`;
  }
}
