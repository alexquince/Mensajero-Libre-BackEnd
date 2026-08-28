import {Injectable,BadRequestException,NotFoundException,} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {Prisma,bonos,} from '@prisma/client';
import { CreateBonoDto } from './dto/create-bono.dto';
import { UpdateBonoDto } from './dto/update-bono.dto';

@Injectable()
export class BonosService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    dto: CreateBonoDto,
  ): Promise<bonos> {
    const {
      mensajero_id,
      aprobado_por,
    } = dto;

    // Verificar mensajero
    const mensajero =
      await this.prisma.mensajeros.findUnique({
        where: {
          id: mensajero_id,
        },
      });

    if (!mensajero) {
      throw new NotFoundException(
        'Mensajero no encontrado.',
      );
    }

    // Verificar administrador (si existe)
    if (aprobado_por) {
      const admin =
        await this.prisma.users.findUnique({
          where: {
            id: aprobado_por,
          },
        });

      if (!admin) {
        throw new NotFoundException(
          'Administrador no encontrado.',
        );
      }

      if (admin.role !== 'admin') {
        throw new BadRequestException(
          'El usuario no tiene permisos para aprobar bonos.',
        );
      }
    }

    return this.prisma.bonos.create({
      data: dto,
    });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    orderBy?: Prisma.bonosOrderByWithRelationInput;
  }): Promise<bonos[]> {
    const { skip, take, orderBy } = params || {};

    return this.prisma.bonos.findMany({
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
        users: true,
      },
    });
  }

  async findOne(
    id: string,
  ): Promise<bonos> {
    const bono =
      await this.prisma.bonos.findUnique({
        where: {
          id,
        },
        include: {
          mensajeros: {
            include: {
              users: true,
            },
          },
          users: true,
        },
      });

    if (!bono) {
      throw new NotFoundException(
        'Bono no encontrado.',
      );
    }

    return bono;
  }

  async update(
    id: string,
    dto: UpdateBonoDto,
  ): Promise<bonos> {
    await this.findOne(id);

    return this.prisma.bonos.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(
    id: string,
  ): Promise<bonos> {
    await this.findOne(id);

    return this.prisma.bonos.delete({
      where: {
        id,
      },
    });
  }
}