import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { IncidenteController } from './incidente.controller';
import { IncidenteService } from './incidente.service';

@Module({
  imports: [PrismaModule],
  controllers: [IncidenteController],
  providers: [IncidenteService],
  exports: [IncidenteService],
})
export class IncidenteModule {}