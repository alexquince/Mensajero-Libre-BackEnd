import { PartialType } from '@nestjs/mapped-types';
import { CreateConfigOperativaDto } from './create-config-operativa.dto';

export class UpdateConfigOperativaDto extends PartialType(
  CreateConfigOperativaDto,
) {}