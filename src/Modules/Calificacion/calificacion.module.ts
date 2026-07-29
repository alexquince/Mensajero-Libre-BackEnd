import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CalificacionController } from './calificacion.controller';
import { CalificacionService } from './calificacion.service';

@Module({
  imports: [PrismaModule],
  controllers: [CalificacionController],
  providers: [CalificacionService],
  exports: [CalificacionService],
})
export class CalificacionModule {}