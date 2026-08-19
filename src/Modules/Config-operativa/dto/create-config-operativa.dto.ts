import {IsDateString,IsInt,IsOptional,IsUUID,IsDecimal,} from 'class-validator';

export class CreateConfigOperativaDto {
  @IsDateString()
  fecha!: Date;

  @IsOptional()
  @IsInt()
  minimo_mensajeros?: number;

  @IsOptional()
  @IsInt()
  radio_geocerca_metros?: number;

  @IsOptional()
  @IsDecimal()
  horas_max_turno?: string;

  @IsOptional()
  @IsInt()
  alerta_demanda_umbral?: number;

  @IsOptional()
  @IsUUID()
  updated_by?: string;
}