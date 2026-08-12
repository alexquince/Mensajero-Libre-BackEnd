import {IsBoolean,IsDateString,IsOptional,IsString,IsUUID,} from 'class-validator';

export class CreateBloqueoDto {
  @IsOptional()
  @IsUUID()
  cliente_id?: string;

  @IsOptional()
  @IsUUID()
  mensajero_id?: string;

  @IsString()
  motivo!: string;

  @IsOptional()
  @IsDateString()
  fecha_inicio?: Date;

  @IsOptional()
  @IsDateString()
  fecha_fin?: Date;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsUUID()
  creado_por!: string;
}