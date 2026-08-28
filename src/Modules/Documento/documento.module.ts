import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { DocumentoController } from './documento.controller';
import { DocumentoService } from './documento.service';

@Module({
  imports: [PrismaModule],
  controllers: [DocumentoController],
  providers: [DocumentoService],
  exports: [DocumentoService],
})
export class DocumentoModule {}