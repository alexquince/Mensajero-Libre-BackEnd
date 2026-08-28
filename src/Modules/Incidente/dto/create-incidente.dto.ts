import {IsUUID,IsEnum,IsString,IsOptional,IsBoolean,MaxLength,} from 'class-validator';
import { tipo_incidente, nivel_incidente } from '@prisma/client';

export class CreateIncidenteDto {
  @IsUUID()
  turno_id!: string;

  @IsUUID()
  mensajero_id!: string;

  @IsEnum(tipo_incidente)
  tipo!: tipo_incidente;

  @IsString()
  @MaxLength(500)
  descripcion!: string;

  @IsOptional()
  @IsEnum(nivel_incidente)
  nivel?: nivel_incidente;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  accion_tomada?: string;

  @IsOptional()
  @IsBoolean()
  hay_lesionados?: boolean;

  @IsOptional()
  @IsBoolean()
  reportado_a_seguro?: boolean;
}