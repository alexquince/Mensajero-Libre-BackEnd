import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { dia_semana } from '@prisma/client';

export class CreateMensajeroDto {
  @IsUUID()
  user_id: string;

  @IsOptional()
  @IsEnum(dia_semana)
  dia_descanso?: dia_semana;
}