// src/usuario/dto/update-usuario.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create.usuario.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { estado_usuario } from '@prisma/client';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @IsOptional()
  @IsEnum(estado_usuario)
  estado?: estado_usuario;
}