import { PartialType } from '@nestjs/mapped-types';
import { CreateMetricaMensajeroDto } from './create-metrica-mensajero.dto';

export class UpdateMetricaMensajeroDto extends PartialType(
  CreateMetricaMensajeroDto,
) {}