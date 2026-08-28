import { PartialType } from '@nestjs/mapped-types';
import { CreatePuntoMensajeroDto } from './create-punto-mensajero.dto';

export class UpdatePuntoMensajeroDto extends PartialType(
  CreatePuntoMensajeroDto,
) {}