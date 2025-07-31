import { PartialType } from '@nestjs/mapped-types';
import { CreateFlightconnectionDto } from './create-flightconnection.dto';

export class UpdateFlightconnectionDto extends PartialType(CreateFlightconnectionDto) {}
