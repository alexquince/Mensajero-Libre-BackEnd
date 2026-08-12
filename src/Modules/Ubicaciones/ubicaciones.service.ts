import {Injectable,NotFoundException,} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {Prisma,ubicaciones,} from '@prisma/client';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto';
import { UpdateUbicacionDto } from './dto/update-ubicacion.dto';

@Injectable()
export class UbicacionesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    dto: CreateUbicacionDto,
  ): Promise<ubicaciones> {
    const mensajero =
      await this.prisma.mensajeros.findUnique({
        where: {
          id: dto.mensajero_id,
        },
      });

    if (!mensajero) {
      throw new NotFoundException(
        'Mensajero no encontrado.',
      );
    }

    return this.prisma.ubicaciones.create({
      data: {
        ...dto,
      },
    });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    orderBy?: Prisma.ubicacionesOrderByWithRelationInput;
  }): Promise<ubicaciones[]> {
    const { skip, take, orderBy } = params || {};

    return this.prisma.ubicaciones.findMany({
      skip,
      take,
      orderBy: orderBy || {
        timestamp: 'desc',
      },
      include: {
        mensajeros: {
          include: {
            users: true,
          },
        },
      },
    });
  }

  async findOne(
    id: bigint,
  ): Promise<ubicaciones> {
    const ubicacion =
      await this.prisma.ubicaciones.findUnique({
        where: {
          id,
        },
        include: {
          mensajeros: {
            include: {
              users: true,
            },
          },
        },
      });

    if (!ubicacion) {
      throw new NotFoundException(
        'Ubicación no encontrada.',
      );
    }

    return ubicacion;
  }

  async update(
    id: bigint,
    dto: UpdateUbicacionDto,
  ): Promise<ubicaciones> {
    await this.findOne(id);

    return this.prisma.ubicaciones.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }

  async remove(
    id: bigint,
  ): Promise<ubicaciones> {
    await this.findOne(id);

    return this.prisma.ubicaciones.delete({
      where: {
        id,
      },
    });
  }
}