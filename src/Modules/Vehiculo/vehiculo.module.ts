import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { VehiculoController } from './vehiculo.controller';
import { VehiculoService } from './vehiculo.service';

@Module({
  imports: [PrismaModule],
  controllers: [VehiculoController],
  providers: [VehiculoService],
  exports: [VehiculoService],
})
export class VehiculoModule {}