import { Module } from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { TurnosController } from './turnos.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { MetricaMensajeroModule } from '../MetricaMensajero/metrica-mensajero.module';
import { DocumentoModule } from '../Documento/documento.module';

@Module({
  imports: [DocumentoModule,PrismaModule,MetricaMensajeroModule],
  controllers: [TurnosController],
  providers: [TurnosService],
  exports: [TurnosService],
})
export class TurnosModule {}