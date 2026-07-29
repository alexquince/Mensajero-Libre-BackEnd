import {
  IsUUID,
  IsOptional,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateMetricaMensajeroDto {
  @IsUUID()
  mensajero_id!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tasa_cumplimiento?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tiempo_promedio_entrega_min?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  score?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  total_turnos?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  horas_acumuladas_semana?: number;

  @IsOptional()
  @IsDateString()
  semana_inicio?: string;
}