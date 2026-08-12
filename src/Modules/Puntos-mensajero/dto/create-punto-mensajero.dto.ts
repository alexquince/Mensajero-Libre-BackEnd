import {IsEnum,IsInt,IsOptional,IsUUID,} from 'class-validator';
import { tipo_punto } from '@prisma/client';

export class CreatePuntoMensajeroDto {
  @IsUUID()
  mensajero_id!: string;

  @IsInt()
  puntos!: number;

  @IsEnum(tipo_punto)
  tipo!: tipo_punto;

  @IsOptional()
  @IsUUID()
  origen_id?: string;
}