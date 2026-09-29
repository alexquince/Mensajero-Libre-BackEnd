import {IsEmail,IsEnum,IsOptional,IsString,} from 'class-validator';
import {rol_usuario,estado_usuario,} from '@prisma/client';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(rol_usuario)
  role?: rol_usuario;

  @IsOptional()
  @IsEnum(estado_usuario)
  estado?: estado_usuario;
}
