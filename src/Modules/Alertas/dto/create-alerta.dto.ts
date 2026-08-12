import {IsBoolean,IsEnum,IsOptional,IsString,IsUUID,MaxLength,} from 'class-validator';
import { tipo_alerta } from '@prisma/client';

export class CreateAlertaDto {
  @IsEnum(tipo_alerta)
  tipo!: tipo_alerta;

  @IsString()
  descripcion!: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  entidad?: string;

  @IsOptional()
  @IsUUID()
  entidad_id?: string;

  @IsOptional()
  @IsBoolean()
  resuelta?: boolean;
}