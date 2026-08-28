import { IsEnum, IsUUID } from 'class-validator';
import { tipo_asignacion } from '@prisma/client';

export class CreateAsignacionDto {
  @IsUUID()
  turno_id!: string;

  @IsEnum(tipo_asignacion)
  tipo!: tipo_asignacion;
}