import {BadRequestException,ForbiddenException,Injectable,NotFoundException,} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';

interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  estado: string;
}

@Injectable()
export class DocumentoService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    createDocumentoDto: CreateDocumentoDto,
    user: AuthenticatedUser,
  ) {
    let mensajeroId: string;

    if (user.role === 'admin') {
      if (!createDocumentoDto.mensajero_id) {
        throw new BadRequestException(
          'El administrador debe indicar el mensajero.',
        );
      }

      mensajeroId = createDocumentoDto.mensajero_id;
    } else if (user.role === 'mensajero') {
      const mensajero =
        await this.prisma.mensajeros.findUnique({
          where: {
            user_id: user.id,
          },
        });

      if (!mensajero) {
        throw new NotFoundException(
          'El perfil de mensajero no existe.',
        );
      }

      mensajeroId = mensajero.id;
    } else {
      throw new ForbiddenException(
        'No tienes permisos para gestionar documentos.',
      );
    }

    const mensajero =
      await this.prisma.mensajeros.findUnique({
        where: {
          id: mensajeroId,
        },
      });

    if (!mensajero) {
      throw new NotFoundException(
        'El mensajero no existe.',
      );
    }

    const documentoExistente =
      await this.prisma.documentos.findUnique({
        where: {
          mensajero_id_tipo: {
            mensajero_id: mensajeroId,
            tipo: createDocumentoDto.tipo,
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
        mensajero_id: mensajeroId,
        tipo: createDocumentoDto.tipo,
        numero_documento:
          createDocumentoDto.numero_documento,
        archivo_url:
          createDocumentoDto.archivo_url,
        fecha_vencimiento:
          createDocumentoDto.fecha_vencimiento
            ? new Date(
                createDocumentoDto.fecha_vencimiento,
              )
            : undefined,
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
  }

  async findAll(user: AuthenticatedUser) {
    if (user.role === 'admin') {
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

    if (user.role === 'mensajero') {
      return this.prisma.documentos.findMany({
        where: {
          mensajeros: {
            user_id: user.id,
          },
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
        orderBy: {
          created_at: 'desc',
        },
      });
    }

    throw new ForbiddenException(
      'No tienes permisos para consultar documentos.',
    );
  }

  async findOne(
    id: string,
    user: AuthenticatedUser,
  ) {
    let documento;

    if (user.role === 'admin') {
      documento =
        await this.prisma.documentos.findUnique({
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
    } else if (user.role === 'mensajero') {
      documento =
        await this.prisma.documentos.findFirst({
          where: {
            id,
            mensajeros: {
              user_id: user.id,
            },
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
    } else {
      throw new ForbiddenException(
        'No tienes permisos para consultar documentos.',
      );
    }

    if (!documento) {
      throw new NotFoundException(
        'Documento no encontrado.',
      );
    }

    return documento;
  }

  async update(
    id: string,
    updateDocumentoDto: UpdateDocumentoDto,
    user: AuthenticatedUser,
  ) {
    const documento =
      await this.getDocumentoForUser(id, user);

    const data: any = {
      ...updateDocumentoDto,
    };

    if (updateDocumentoDto.fecha_vencimiento) {
      data.fecha_vencimiento =
        new Date(updateDocumentoDto.fecha_vencimiento);
    }

    if (user.role === 'mensajero') {
      data.estado = 'pendiente';
      data.validado_por_admin = false;
    }

    return this.prisma.documentos.update({
      where: {
        id: documento.id,
      },
      data,
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

  async remove(
    id: string,
    user: AuthenticatedUser,
  ) {
    const documento =
      await this.getDocumentoForUser(id, user);

    await this.prisma.documentos.delete({
      where: {
        id: documento.id,
      },
    });

    return {
      message: 'Documento eliminado correctamente.',
    };
  }

  private async getDocumentoForUser(
    id: string,
    user: AuthenticatedUser,
  ) {
    if (user.role === 'admin') {
      const documento =
        await this.prisma.documentos.findUnique({
          where: {
            id,
          },
        });

      if (!documento) {
        throw new NotFoundException(
          'Documento no encontrado.',
        );
      }

      return documento;
    }

    if (user.role === 'mensajero') {
      const documento =
        await this.prisma.documentos.findFirst({
          where: {
            id,
            mensajeros: {
              user_id: user.id,
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

    throw new ForbiddenException(
      'No tienes permisos para gestionar documentos.',
    );
  }

  async validarDocumentosMensajero(
    mensajeroId: string,
  ): Promise<void> {
    const documentos =
      await this.prisma.documentos.findMany({
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