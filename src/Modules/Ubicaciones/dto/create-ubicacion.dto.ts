import {IsUUID,IsNumberString,} from 'class-validator';

export class CreateUbicacionDto {
  @IsUUID()
  mensajero_id!: string;

  @IsNumberString()
  latitud!: string;

  @IsNumberString()
  longitud!: string;
}