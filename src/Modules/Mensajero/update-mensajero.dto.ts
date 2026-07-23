import { IsEnum, IsOptional } from 'class-validator';
import { dia_semana, estado_mensajero } from '@prisma/client';

export class UpdateMensajeroDto {
  @IsOptional()
  @IsEnum(estado_mensajero)
  estado?: estado_mensajero;

  @IsOptional()
  @IsEnum(dia_semana)
  dia_descanso?: dia_semana;
}