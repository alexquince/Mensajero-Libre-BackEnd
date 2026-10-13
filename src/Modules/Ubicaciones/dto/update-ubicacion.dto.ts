import { Transform } from 'class-transformer';
import {IsNumber,IsOptional,Max,Min,} from 'class-validator';

export class UpdateUbicacionDto {
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? Number(value)
      : value,
  )
  @IsNumber({ maxDecimalPlaces: 6, allowNaN: false, allowInfinity: false })
  @Min(-90)
  @Max(90)
  latitud?: number;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? Number(value)
      : value,
  )
  @IsNumber({ maxDecimalPlaces: 6, allowNaN: false, allowInfinity: false })
  @Min(-180)
  @Max(180)
  longitud?: number;
}
