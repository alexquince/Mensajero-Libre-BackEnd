import {IsUUID,IsInt,IsOptional,IsString,Min,Max,} from 'class-validator';

export class CreateCalificacionDto {
  @IsUUID()
  turno_id!: string;

  @IsUUID()
  cliente_id!: string;

  @IsUUID()
  mensajero_id!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  puntualidad!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  presentacion!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  actitud!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  vehiculo!: number;

  @IsOptional()
  @IsString()
  comentario?: string;
}