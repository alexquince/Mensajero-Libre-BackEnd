import {Injectable,NotFoundException,} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {Prisma,puntos_mensajero,} from '@prisma/client';
import { CreatePuntoMensajeroDto } from './dto/create-punto-mensajero.dto';
import { UpdatePuntoMensajeroDto } from './dto/update-punto-mensajero.dto';

@Injectable()
export class PuntosMensajeroService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    dto: CreatePuntoMensajeroDto,
  ): Promise<puntos_mensajero> {
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

    return this.prisma.puntos_mensajero.create({
      data: dto,
    });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    orderBy?: Prisma.puntos_mensajeroOrderByWithRelationInput;
  }): Promise<puntos_mensajero[]> {
    const { skip, take, orderBy } = params || {};

    return this.prisma.puntos_mensajero.findMany({
      skip,
      take,
      orderBy: orderBy || {
        created_at: 'desc',
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
    id: string,
  ): Promise<puntos_mensajero> {
    const punto =
      await this.prisma.puntos_mensajero.findUnique({
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

    if (!punto) {
      throw new NotFoundException(
        'Registro de puntos no encontrado.',
      );
    }

    return punto;
  }

  async update(
    id: string,
    dto: UpdatePuntoMensajeroDto,
  ): Promise<puntos_mensajero> {
    await this.findOne(id);

    return this.prisma.puntos_mensajero.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(
    id: string,
  ): Promise<puntos_mensajero> {
    await this.findOne(id);

    return this.prisma.puntos_mensajero.delete({
      where: {
        id,
      },
    });
  }
}