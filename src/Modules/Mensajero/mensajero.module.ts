import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { MensajeroController } from './mensajero.controller';
import { MensajeroService } from './mensajero.service';

@Module({
  imports: [PrismaModule],
  controllers: [MensajeroController],
  providers: [MensajeroService],
  exports: [MensajeroService],
})
export class MensajeroModule {}