import { PartialType } from '@nestjs/mapped-types';
import { CreateTurnoDto } from './create.turno.dto';
import { IsOptional, IsEnum, IsNumber } from 'class-validator';
import { estado_turno } from '@prisma/client';

export class UpdateTurnoDto extends PartialType(CreateTurnoDto) {
  @IsOptional()
  @IsEnum(estado_turno)
  estado?: estado_turno;

  @IsOptional()
  @IsNumber()
  pago_mensajero?: number;
}