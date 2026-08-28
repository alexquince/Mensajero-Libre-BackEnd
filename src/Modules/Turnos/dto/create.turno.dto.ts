import { IsUUID, IsEnum } from 'class-validator';
import { tipo_asignacion } from '@prisma/client';  // enum de tu schema

export class CreateTurnoDto {
  @IsUUID()
  solicitud_id!: string;

  @IsUUID()
  mensajero_id!: string;

  @IsEnum(tipo_asignacion)
  tipo_asignacion!: tipo_asignacion;
}