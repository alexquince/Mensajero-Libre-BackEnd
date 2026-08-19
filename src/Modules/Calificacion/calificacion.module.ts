import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { MetricaMensajeroModule } from '../MetricaMensajero/metrica-mensajero.module';
import { CalificacionController } from './calificacion.controller';
import { CalificacionService } from './calificacion.service';

@Module({
  imports: [PrismaModule,MetricaMensajeroModule,],
  controllers: [CalificacionController],
  providers: [CalificacionService],
  exports: [CalificacionService],
})
export class CalificacionModule {}