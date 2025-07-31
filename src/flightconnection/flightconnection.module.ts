import { Module } from '@nestjs/common';
import { FlightconnectionService } from './flightconnection.service';
import { FlightconnectionController } from './flightconnection.controller';

@Module({
  controllers: [FlightconnectionController],
  providers: [FlightconnectionService],
})
export class FlightconnectionModule {}
