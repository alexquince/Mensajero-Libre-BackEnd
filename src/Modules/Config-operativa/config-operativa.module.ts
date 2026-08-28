import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConfigOperativaController } from './config-operativa.controller';
import { ConfigOperativaService } from './config-operativa.service';

@Module({
  imports: [PrismaModule],
  controllers: [ConfigOperativaController],
  providers: [ConfigOperativaService],
  exports: [ConfigOperativaService],
})
export class ConfigOperativaModule {}