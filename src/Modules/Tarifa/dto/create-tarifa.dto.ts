import {IsBoolean,IsDateString,IsEnum,IsNumber,IsOptional,IsUUID,} from 'class-validator';
import { tipo_dia } from '@prisma/client';

export class CreateTarifaDto {

  @IsEnum(tipo_dia)
  tipo_dia!: tipo_dia;

  @IsNumber()
  tarifa_hora!: number;

  @IsOptional()
  @IsNumber()
  costo_alimentacion?: number;

  @IsDateString()
  vigente_desde!: string;

  @IsOptional()
  @IsDateString()
  vigente_hasta?: string;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;

  @IsOptional()
  @IsUUID()
  created_by?: string;
}