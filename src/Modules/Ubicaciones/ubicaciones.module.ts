import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { UbicacionesController } from './ubicaciones.controller';
import { UbicacionesService } from './ubicaciones.service';

@Module({
  imports: [PrismaModule],
  controllers: [UbicacionesController],
  providers: [UbicacionesService],
  exports: [UbicacionesService],
})
export class UbicacionesModule {}