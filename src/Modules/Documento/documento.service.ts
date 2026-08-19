import {Injectable,BadRequestException,NotFoundException,} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';

@Injectable()
export class DocumentoService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(createDocumentoDto: CreateDocumentoDto) {
    const {
      mensajero_id,
      tipo,
      numero_documento,
      archivo_url,
      fecha_vencimiento,
    } = createDocumentoDto;

    // Verificar que exista el mensajero
    const mensajero = await this.prisma.mensajeros.findUnique({
      where: {
        id: mensajero_id,
      },
    });

    if (!mensajero) {
      throw new NotFoundException(
        'El mensajero no existe.',
      );
    }

    // Verificar que no exista un documento del mismo tipo
    const documentoExistente =
      await this.prisma.documentos.findUnique({
        where: {
          mensajero_id_tipo: {
            mensajero_id,
            tipo,
          },
        },
      });

    if (documentoExistente) {
      throw new BadRequestException(
        'Este tipo de documento ya está registrado para el mensajero.',
      );
    }

    return this.prisma.documentos.create({
      data: {
        mensajero_id,
        tipo,
        numero_documento,
        archivo_url,
        fecha_vencimiento,
      },
      include: {
        mensajeros: {
          include: {
            users: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll() {
  return this.prisma.documentos.findMany({
    include: {
      mensajeros: {
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              estado: true,
            },
          },
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });
}

async findOne(id: string) {
  const documento = await this.prisma.documentos.findUnique({
    where: {
      id,
    },
    include: {
      mensajeros: {
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              estado: true,
            },
          },
        },
      },
    },
  });

  if (!documento) {
    throw new NotFoundException(
      'Documento no encontrado.',
    );
  }

  return documento;
}

async update(id: string, updateDocumentoDto: UpdateDocumentoDto) {
  const documento = await this.prisma.documentos.findUnique({
    where: {
      id,
    },
  });

  if (!documento) {
    throw new NotFoundException(
      'Documento no encontrado.',
    );
  }

  return this.prisma.documentos.update({
    where: {
      id,
    },
    data: updateDocumentoDto,
    include: {
      mensajeros: {
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              estado: true,
            },
          },
        },
      },
    },
  });
}

async remove(id: string) {
  const documento = await this.prisma.documentos.findUnique({
    where: {
      id,
    },
  });

  if (!documento) {
    throw new NotFoundException(
      'Documento no encontrado.',
    );
  }

  await this.prisma.documentos.delete({
    where: {
      id,
    },
  });

  return {
    message: 'Documento eliminado correctamente.',
  };
}
async validarDocumentosMensajero(
  mensajeroId: string,
): Promise<void> {
  const documentos = await this.prisma.documentos.findMany({
    where: {
      mensajero_id: mensajeroId,
    },
  });

  const tiposRequeridos = [
    'cedula',
    'licencia',
    'soat',
    'tecnomecanica',
  ];

  for (const tipo of tiposRequeridos) {
    const documento = documentos.find(
      (d) => d.tipo === tipo,
    );

    if (!documento) {
      throw new BadRequestException(
        `El mensajero no tiene registrado el documento ${tipo}.`,
      );
    }

    if (
      documento.estado !== 'aprobado' ||
      !documento.validado_por_admin
    ) {
      throw new BadRequestException(
        `El documento ${tipo} aún no está aprobado.`,
      );
    }

    if (
      documento.fecha_vencimiento &&
      documento.fecha_vencimiento < new Date()
    ) {
      throw new BadRequestException(
        `El documento ${tipo} está vencido.`,
      );
    }
  }
}
}