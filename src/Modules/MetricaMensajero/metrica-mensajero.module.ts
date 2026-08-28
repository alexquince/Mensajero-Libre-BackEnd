import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { MetricaMensajeroController } from './metrica-mensajero.controller';
import { MetricaMensajeroService } from './metrica-mensajero.service';

@Module({
  imports: [PrismaModule],
  controllers: [MetricaMensajeroController],
  providers: [MetricaMensajeroService],
  exports: [MetricaMensajeroService],
})
export class MetricaMensajeroModule {}