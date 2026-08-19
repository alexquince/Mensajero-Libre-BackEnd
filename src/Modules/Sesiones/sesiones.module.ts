import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { SesionController } from './sesiones.controller';
import { SesionService } from './sesiones.service';

@Module({
  imports: [PrismaModule],
  controllers: [SesionController],
  providers: [SesionService],
  exports: [SesionService],
})
export class SesionesModule {}