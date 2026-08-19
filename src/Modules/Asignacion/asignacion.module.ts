import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AsignacionController } from './asignacion.controller';
import { AsignacionService } from './asignacion.service';

@Module({
  imports: [PrismaModule],
  controllers: [AsignacionController],
  providers: [AsignacionService],
  exports: [AsignacionService],
})
export class AsignacionModule {}