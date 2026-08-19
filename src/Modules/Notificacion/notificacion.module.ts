import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotificacionController } from './notificacion.controller';
import { NotificacionService } from './notificacion.service';

@Module({
  imports: [PrismaModule],
  controllers: [NotificacionController],
  providers: [NotificacionService],
  exports: [NotificacionService],
})
export class NotificacionModule {}