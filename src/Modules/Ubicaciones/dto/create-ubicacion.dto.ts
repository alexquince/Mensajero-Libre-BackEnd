import { Transform } from 'class-transformer';
import {IsNumber,IsOptional,IsUUID,Max,Min,} from 'class-validator';

export class CreateUbicacionDto {
  @IsOptional()
  @IsUUID()
  mensajero_id?: string;

  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? Number(value)
      : value,
  )
  @IsNumber({ maxDecimalPlaces: 6, allowNaN: false, allowInfinity: false })
  @Min(-90)
  @Max(90)
  latitud!: number;

  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? Number(value)
      : value,
  )
  @IsNumber({ maxDecimalPlaces: 6, allowNaN: false, allowInfinity: false })
  @Min(-180)
  @Max(180)
  longitud!: number;
}
