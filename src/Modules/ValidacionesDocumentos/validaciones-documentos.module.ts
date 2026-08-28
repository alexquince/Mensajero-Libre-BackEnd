import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ValidacionesDocumentosController } from './validaciones-documentos.controller';
import { ValidacionesDocumentosService } from './validaciones-documentos.service';
import { NotificacionModule } from '../Notificacion/notificacion.module';
import { DocumentoModule } from '../Documento/documento.module';

@Module({
  imports: [PrismaModule,DocumentoModule,NotificacionModule,],
  controllers: [ValidacionesDocumentosController],
  providers: [ValidacionesDocumentosService],
  exports: [ValidacionesDocumentosService],
})
export class ValidacionesDocumentosModule {}