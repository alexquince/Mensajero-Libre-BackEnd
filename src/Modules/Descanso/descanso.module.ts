import { Module } from '@nestjs/common';
import { DescansoService } from './descanso.service';
import { DescansoController } from './descanso.controller';
import { PrismaModule } from '../../../prisma/prisma.module'; 

@Module({
  imports: [PrismaModule],
  controllers: [DescansoController],
  providers: [DescansoService],
  exports: [DescansoService],
})
export class DescansoModule {}