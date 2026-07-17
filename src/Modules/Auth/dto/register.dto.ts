import {IsEmail,IsEnum,IsNotEmpty,IsString,MinLength,} from 'class-validator';
import { rol_usuario } from '@prisma/client';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(rol_usuario)
  role: rol_usuario;
}