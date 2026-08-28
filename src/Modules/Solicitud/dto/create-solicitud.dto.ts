import {IsBoolean,IsDateString,IsOptional,IsString,IsUUID,} from 'class-validator';

export class CreateSolicitudDto {

  @IsUUID()
  cliente_id!: string;

  @IsUUID()
  tarifa_id!: string;

  @IsDateString()
  fecha!: string;

  @IsString()
  direccion!: string;

  @IsOptional()
  latitud?: number;

  @IsOptional()
  longitud?: number;

  @IsString()
  hora_inicio!: string;

  @IsString()
  hora_fin!: string;

  @IsOptional()
  @IsBoolean()
  requiere_alimentacion?: boolean;
}