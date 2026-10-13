import {BadRequestException,ForbiddenException,Injectable,NotFoundException,} from '@nestjs/common';
import { Prisma, ubicaciones } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto';
import { UpdateUbicacionDto } from './dto/update-ubicacion.dto';

export interface AuthenticatedUser {
  id: string;
  role: string;
}

@Injectable()
export class UbicacionesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private assertAllowedRole(user: AuthenticatedUser): void {
    if (!user || !['admin', 'mensajero'].includes(user.role)) {
      throw new ForbiddenException(
        'No tienes permisos para acceder a las ubicaciones.',
      );
    }
  }

  private async getMessengerForUser(
    user: AuthenticatedUser,
  ): Promise<{ id: string }> {
    const mensajero = await this.prisma.mensajeros.findUnique({
      where: {
        user_id: user.id,
      },
      select: {
        id: true,
      },
    });

    if (!mensajero) {
      throw new ForbiddenException(
        'El usuario no tiene un perfil de mensajero asociado.',
      );
    }

    return mensajero;
  }

  async create(
    dto: CreateUbicacionDto,
    user: AuthenticatedUser,
  ): Promise<ubicaciones> {
    this.assertAllowedRole(user);

    let mensajeroId: string;

    if (user.role === 'admin') {
      if (!dto.mensajero_id) {
        throw new BadRequestException(
          'El administrador debe indicar el mensajero de la ubicación.',
        );
      }

      const mensajero = await this.prisma.mensajeros.findUnique({
        where: {
          id: dto.mensajero_id,
        },
        select: {
          id: true,
        },
      });

      if (!mensajero) {
        throw new NotFoundException('Mensajero no encontrado.');
      }

      mensajeroId = mensajero.id;
    } else {
      const mensajero = await this.getMessengerForUser(user);

      if (
        dto.mensajero_id &&
        dto.mensajero_id !== mensajero.id
      ) {
        throw new ForbiddenException(
          'No puedes registrar ubicaciones para otro mensajero.',
        );
      }

      mensajeroId = mensajero.id;
    }

    return this.prisma.ubicaciones.create({
      data: {
        mensajero_id: mensajeroId,
        latitud: dto.latitud,
        longitud: dto.longitud,
      },
    });
  }

  async findAll(
    user: AuthenticatedUser,
    params?: {
      skip?: number;
      take?: number;
      orderBy?: Prisma.ubicacionesOrderByWithRelationInput;
    },
  ): Promise<ubicaciones[]> {
    this.assertAllowedRole(user);

    const { skip, take, orderBy } = params || {};

    const where: Prisma.ubicacionesWhereInput = {};

    if (user.role === 'mensajero') {
      const mensajero = await this.getMessengerForUser(user);
      where.mensajero_id = mensajero.id;
    }

    return this.prisma.ubicaciones.findMany({
      where,
      skip,
      take,
      orderBy: orderBy || {
        timestamp: 'desc',
      },
      include: {
        mensajeros: {
          select: {
            id: true,
            users: {
              select: {
                id: true,
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

  async findOne(
    id: bigint,
    user: AuthenticatedUser,
  ): Promise<ubicaciones> {
    this.assertAllowedRole(user);

    const where: Prisma.ubicacionesWhereInput = { id };

    if (user.role === 'mensajero') {
      const mensajero = await this.getMessengerForUser(user);
      where.mensajero_id = mensajero.id;
    }

    const ubicacion = await this.prisma.ubicaciones.findFirst({
      where,
      include: {
        mensajeros: {
          select: {
            id: true,
            users: {
              select: {
                id: true,
                email: true,
                role: true,
                estado: true,
              },
            },
          },
        },
      },
    });

    if (!ubicacion) {
      throw new NotFoundException('Ubicación no encontrada.');
    }

    return ubicacion;
  }

  async update(
    id: bigint,
    dto: UpdateUbicacionDto,
    user: AuthenticatedUser,
  ): Promise<ubicaciones> {
    await this.findOne(id, user);

    if (
      dto.latitud === undefined &&
      dto.longitud === undefined
    ) {
      throw new BadRequestException(
        'Debes indicar la latitud, la longitud o ambas para actualizar.',
      );
    }

    const data: Prisma.ubicacionesUpdateInput = {};

    if (dto.latitud !== undefined) {
      data.latitud = dto.latitud;
    }

    if (dto.longitud !== undefined) {
      data.longitud = dto.longitud;
    }

    return this.prisma.ubicaciones.update({
      where: {
        id,
      },
      data,
      include: {
        mensajeros: {
          select: {
            id: true,
            users: {
              select: {
                id: true,
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
    id: bigint,
    user: AuthenticatedUser,
  ): Promise<ubicaciones> {
    await this.findOne(id, user);

    return this.prisma.ubicaciones.delete({
      where: {
        id,
      },
    });
  }
}
