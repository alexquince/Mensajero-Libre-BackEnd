import {IsBoolean,IsEnum,IsOptional,IsString,} from 'class-validator';
import {metodo_pago,tipo_cliente,tipo_empresa,} from '@prisma/client';

export class UpdateClienteDto {
  @IsOptional()
  @IsString()
  nombre_empresa?: string;

  @IsOptional()
  @IsEnum(tipo_empresa)
  tipo_empresa?: tipo_empresa;

  @IsOptional()
  @IsEnum(tipo_cliente)
  tipo_cliente?: tipo_cliente;

  @IsOptional()
  @IsEnum(metodo_pago)
  metodo_pago?: metodo_pago;

  @IsOptional()
  @IsBoolean()
  autorizado_mensual?: boolean;
}