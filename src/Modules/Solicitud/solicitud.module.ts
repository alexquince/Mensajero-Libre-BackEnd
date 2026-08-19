import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { SolicitudController } from './solicitud.controller';
import { SolicitudService } from './solicitud.service';

@Module({
  imports: [PrismaModule],
  controllers: [SolicitudController],
  providers: [SolicitudService],
  exports: [SolicitudService],
})
export class SolicitudModule {}