import {IsEnum,IsNotEmpty,IsString,IsUUID,MaxLength,} from 'class-validator';

export class CreateAccionesAdminDto {
  @IsUUID()
  admin_id!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  tipo_accion!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  entidad!: string;

  @IsUUID()
  entidad_id!: string;
}