import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateConnectionDto {
  @ApiProperty({
    description: 'The name of the city from which the connection starts',
    example: 'Bengaluru',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(
    ({ value }) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
  )
  fromCity: string;

  @ApiProperty({
    description: 'The name of the city to which the connection ends',
    example: 'Delhi',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(
    ({ value }) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
  )
  toCity: string;

  @ApiProperty({
    description: 'The airfare of the connection',
    example: 1000,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  airfare: number;

  @ApiProperty({
    description: 'The duration of the connection',
    example: 10,
  })
  @IsNumber({ maxDecimalPlaces: 1 })
  @IsPositive()
  duration: number;
}
