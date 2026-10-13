import {IsEnum,IsOptional,IsString,IsUUID,} from 'class-validator';
import { tipo_vehiculo } from '@prisma/client';

export class CreateVehiculoDto {
  // Solo se utiliza para asignar el vehículo desde una cuenta admin.
  @IsOptional()
  @IsUUID()
  mensajero_id?: string;

  @IsString()
  marca!: string;

  @IsString()
  modelo!: string;

  @IsString()
  color!: string;

  @IsString()
  cilindraje!: string;

  @IsString()
  placa!: string;

  @IsEnum(tipo_vehiculo)
  tipo!: tipo_vehiculo;
}