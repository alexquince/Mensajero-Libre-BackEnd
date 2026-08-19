import {IsBoolean,IsDateString,IsEnum,IsOptional,IsString,IsUUID,} from 'class-validator';
import { tipo_doc } from '@prisma/client';

export class CreateDocumentoDto {
  @IsUUID()
  mensajero_id!: string;

  @IsEnum(tipo_doc)
  tipo!: tipo_doc;

  @IsOptional()
  @IsString()
  numero_documento?: string;

  @IsString()
  archivo_url!: string;

  @IsOptional()
  @IsDateString()
  fecha_vencimiento?: Date;

  @IsOptional()
  @IsBoolean()
  validado_por_admin?: boolean;
}