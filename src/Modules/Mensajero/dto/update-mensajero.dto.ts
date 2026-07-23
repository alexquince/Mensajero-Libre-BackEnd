import { PartialType } from '@nestjs/mapped-types';
import { CreateMensajeroDto } from './create-mensajero.dto';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { estado_mensajero, dia_semana } from '@prisma/client';

export class UpdateMensajeroDto extends PartialType(CreateMensajeroDto) {
  @IsOptional()
  @IsEnum(estado_mensajero)
  estado?: estado_mensajero;

  @IsOptional()
  @IsEnum(dia_semana)
  dia_descanso?: dia_semana;

  @IsOptional()
  @IsNumber()
  horas_semanales_objetivo?: number;

  @IsOptional()
  @IsInt()
  dias_compensatorios?: number;
}