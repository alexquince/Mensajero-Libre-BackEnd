import {IsEnum,IsOptional,IsString,IsUUID,} from 'class-validator';
import { estado_doc } from '@prisma/client';

export class CreateValidacionesDocumentosDto {
  @IsUUID()
  documento_id!: string;

  @IsUUID()
  admin_id!: string;

  @IsEnum(estado_doc)
  estado!: estado_doc;

  @IsOptional()
  @IsString()
  comentario?: string;
}