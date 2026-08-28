import { Module } from '@nestjs/common';
import { BloqueosController } from './bloqueos.controller';
import { BloqueosService } from './bloqueos.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BloqueosController],
  providers: [BloqueosService],
  exports: [BloqueosService],
})
export class BloqueosModule {}