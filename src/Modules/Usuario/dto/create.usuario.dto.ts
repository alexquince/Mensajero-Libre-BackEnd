import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { rol_usuario } from '@prisma/client';

export class CreateUsuarioDto {
    @IsString()
    name!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    @IsEnum(rol_usuario)
    role!: rol_usuario;
}