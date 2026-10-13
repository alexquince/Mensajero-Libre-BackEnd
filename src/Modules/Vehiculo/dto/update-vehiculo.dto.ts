import {IsEnum,IsOptional,IsString,} from 'class-validator';
import { tipo_vehiculo } from '@prisma/client';

export class UpdateVehiculoDto {
  @IsOptional()
  @IsString()
  marca?: string;

  @IsOptional()
  @IsString()
  modelo?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  cilindraje?: string;

  @IsOptional()
  @IsString()
  placa?: string;

  @IsOptional()
  @IsEnum(tipo_vehiculo)
  tipo?: tipo_vehiculo;
}