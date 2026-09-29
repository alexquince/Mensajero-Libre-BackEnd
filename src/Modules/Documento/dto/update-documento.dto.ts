import {IsDateString,IsOptional,IsString,} from 'class-validator';

export class UpdateDocumentoDto {
  @IsOptional()
  @IsString()
  numero_documento?: string;

  @IsOptional()
  @IsString()
  archivo_url?: string;

  @IsOptional()
  @IsDateString()
  fecha_vencimiento?: string;
}