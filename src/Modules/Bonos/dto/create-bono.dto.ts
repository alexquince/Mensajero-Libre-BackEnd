import {IsDecimal,IsNotEmpty,IsOptional,IsString,IsUUID,} from 'class-validator';

export class CreateBonoDto {
  @IsUUID()
  mensajero_id!: string;

  @IsDecimal()
  monto!: string;

  @IsString()
  @IsNotEmpty()
  motivo!: string;

  @IsUUID()
  @IsOptional()
  aprobado_por?: string;
}