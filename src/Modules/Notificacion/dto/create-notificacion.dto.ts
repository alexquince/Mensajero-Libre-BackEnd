import {IsUUID,IsEnum,IsString,IsBoolean,IsOptional,} from 'class-validator';
import { tipo_notificacion } from '@prisma/client';

export class CreateNotificacionDto {
  @IsUUID()
  user_id!: string;

  @IsEnum(tipo_notificacion)
  tipo!: tipo_notificacion;

  @IsString()
  titulo!: string;

  @IsString()
  mensaje!: string;

  @IsOptional()
  @IsBoolean()
  enviada?: boolean;

  @IsOptional()
  @IsBoolean()
  leido?: boolean;

  @IsOptional()
  @IsString()
  entidad?: string;

  @IsOptional()
  @IsUUID()
  entidad_id?: string;
}