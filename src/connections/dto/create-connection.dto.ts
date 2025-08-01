import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateConnectionDto {
  @IsString()
  @IsNotEmpty()
  @Transform(
    ({ value }) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
  )
  fromCity: string;

  @IsString()
  @IsNotEmpty()
  @Transform(
    ({ value }) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
  )
  toCity: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  airfare: number;

  @IsNumber({ maxDecimalPlaces: 1 })
  @IsPositive()
  duration: number;
}
