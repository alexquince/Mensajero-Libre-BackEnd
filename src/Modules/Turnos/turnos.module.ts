import { Module } from '@nestjs/common';
import { AccionesAdminModule } from '../AccionesAdmin/acciones-admin.module';
import { TurnosService } from './turnos.service';
import { TurnosController } from './turnos.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { MetricaMensajeroModule } from '../MetricaMensajero/metrica-mensajero.module';
import { NotificacionModule } from '../Notificacion/notificacion.module';
import { DocumentoModule } from '../Documento/documento.module';

@Module({
  imports: [AccionesAdminModule,DocumentoModule,PrismaModule,NotificacionModule,MetricaMensajeroModule],
  controllers: [TurnosController],
  providers: [TurnosService],
  exports: [TurnosService],
})
export class TurnosModule {}