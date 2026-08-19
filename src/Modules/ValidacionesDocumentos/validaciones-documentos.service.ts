import {Injectable,NotFoundException,BadRequestException,} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {Prisma,validaciones_documentos,} from '@prisma/client';
import { CreateValidacionesDocumentosDto } from './dto/create-validaciones-documentos.dto';
import { UpdateValidacionesDocumentosDto } from './dto/update-validaciones-documentos.dto';
import { NotificacionService } from '../Notificacion/notificacion.service';

@Injectable()
export class ValidacionesDocumentosService {
  constructor(
  private readonly prisma: PrismaService,
  private readonly notificacionService: NotificacionService,
) {}

  async create(
  dto: CreateValidacionesDocumentosDto,
): Promise<validaciones_documentos> {
  const {
    documento_id,
    admin_id,
    estado,
    comentario,
  } = dto;

  // Verificar documento
  const documento =
await this.prisma.documentos.findUnique({
  where: {
    id: documento_id,
  },
  include: {
    mensajeros: true,
  },
});

  if (!documento) {
    throw new NotFoundException(
      'Documento no encontrado.',
    );
  }

  // Verificar administrador
  const admin = await this.prisma.users.findUnique({
    where: {
      id: admin_id,
    },
  });

  if (!admin) {
    throw new NotFoundException(
      'Administrador no encontrado.',
    );
  }

  if (admin.role !== 'admin') {
    throw new BadRequestException(
      'El usuario no tiene permisos para validar documentos.',
    );
  }

  // Registrar la validación
  const validacion =
    await this.prisma.validaciones_documentos.create({
      data: {
        documento_id,
        admin_id,
        estado,
        comentario,
      },
    });

  // Actualizar el documento
  await this.prisma.documentos.update({
    where: {
      id: documento_id,
    },
    data: {
      estado,
      validado_por_admin: estado === 'aprobado',
    },
  });
  await this.notificacionService.create({
  user_id: documento.mensajeros.user_id,
  tipo: 'documento',
  titulo:
    estado === 'aprobado'
      ? 'Documento aprobado'
      : 'Documento rechazado',
  mensaje:
    estado === 'aprobado'
      ? `Tu documento ${documento.tipo} fue aprobado por un administrador.`
      : `Tu documento ${documento.tipo} fue rechazado. Revisa las observaciones.`,
  entidad: 'documentos',
  entidad_id: documento.id,
  enviada: true,
  leido: false,
});

  return validacion;
}

async findAll(params?: {
  skip?: number;
  take?: number;
  orderBy?: Prisma.validaciones_documentosOrderByWithRelationInput;
}): Promise<validaciones_documentos[]> {
  const { skip, take, orderBy } = params || {};

  return this.prisma.validaciones_documentos.findMany({
    skip,
    take,
    orderBy: orderBy || {
      created_at: 'desc',
    },
    include: {
      documentos: {
        include: {
          mensajeros: {
            include: {
              users: true,
            },
          },
        },
      },
      users: true,
    },
  });
}

  async findOne(
  id: string,
): Promise<validaciones_documentos> {
  const validacion =
    await this.prisma.validaciones_documentos.findUnique({
      where: {
        id,
      },
      include: {
        documentos: {
          include: {
            mensajeros: {
              include: {
                users: true,
              },
            },
          },
        },
        users: true,
      },
    });

  if (!validacion) {
    throw new NotFoundException(
      'Validación de documento no encontrada.',
    );
  }

  return validacion;
}

  async update(
  id: string,
  dto: UpdateValidacionesDocumentosDto,
): Promise<validaciones_documentos> {
  const validacion = await this.findOne(id);

  const actualizada =
    await this.prisma.validaciones_documentos.update({
      where: {
        id,
      },
      data: dto,
    });

  // Si se actualiza el estado, sincronizar el documento
  if (dto.estado) {
    await this.prisma.documentos.update({
      where: {
        id: validacion.documento_id,
      },
      data: {
        estado: dto.estado,
        validado_por_admin:
          dto.estado === 'aprobado',
      },
    });
  }

  return actualizada;
}

  async remove(
  id: string,
): Promise<validaciones_documentos> {
  const validacion = await this.findOne(id);

  return this.prisma.validaciones_documentos.delete({
    where: {
      id: validacion.id,
    },
  });
}
}