import { PartialType } from '@nestjs/mapped-types';
import { CreateAccionesAdminDto } from './create-acciones-admin.dto';

export class UpdateAccionesAdminDto extends PartialType(
  CreateAccionesAdminDto,
) {}