import { Module } from '@nestjs/common';
import { AccionesAdminController } from './acciones-admin.controller';
import { AccionesAdminService } from './acciones-admin.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AccionesAdminController],
  providers: [AccionesAdminService],
  exports: [AccionesAdminService],
})
export class AccionesAdminModule {}