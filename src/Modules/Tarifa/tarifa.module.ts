import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TarifaController } from './tarifa.controller';
import { TarifaService } from './tarifa.service';

@Module({
  imports: [PrismaModule],
  controllers: [TarifaController],
  providers: [TarifaService],
  exports: [TarifaService],
})
export class TarifaModule {}