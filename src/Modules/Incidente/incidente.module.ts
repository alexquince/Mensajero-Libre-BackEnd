import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { IncidenteController } from './incidente.controller';
import { IncidenteService } from './incidente.service';
import { MetricaMensajeroModule } from '../MetricaMensajero/metrica-mensajero.module';

@Module({
  imports: [PrismaModule, MetricaMensajeroModule],
  controllers: [IncidenteController],
  providers: [IncidenteService],
  exports: [IncidenteService],
})
export class IncidenteModule {}