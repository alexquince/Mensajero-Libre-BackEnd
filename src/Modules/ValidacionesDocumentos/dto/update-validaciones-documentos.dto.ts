import { PartialType } from '@nestjs/mapped-types';
import { CreateValidacionesDocumentosDto } from './create-validaciones-documentos.dto';

export class UpdateValidacionesDocumentosDto extends PartialType(
  CreateValidacionesDocumentosDto,
) {}