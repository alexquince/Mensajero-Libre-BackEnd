import { Module } from '@nestjs/common';
import { PuntosMensajeroController } from './puntos-mensajero.controller';
import { PuntosMensajeroService } from './puntos-mensajero.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PuntosMensajeroController],
  providers: [PuntosMensajeroService],
  exports: [PuntosMensajeroService],
})
export class PuntosMensajeroModule {}