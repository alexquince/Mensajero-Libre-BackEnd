import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ClienteController } from './cliente.controller';
import { ClienteService } from './cliente.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClienteController],
  providers: [ClienteService],
  exports: [ClienteService],
})
export class ClienteModule {}