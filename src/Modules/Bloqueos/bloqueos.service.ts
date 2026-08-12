import {Injectable,BadRequestException,NotFoundException,} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {Prisma,bloqueos,} from '@prisma/client';
import { CreateBloqueoDto } from './dto/create-bloqueo.dto';
import { UpdateBloqueoDto } from './dto/update-bloqueo.dto';

@Injectable()
export class BloqueosService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    dto: CreateBloqueoDto,
  ): Promise<bloqueos> {
    const {
      cliente_id,
      mensajero_id,
      creado_por,
    } = dto;

    if (!cliente_id && !mensajero_id) {
      throw new BadRequestException(
        'Debe indicar un cliente o un mensajero.',
      );
    }

    const admin = await this.prisma.users.findUnique({
      where: {
        id: creado_por,
      },
    });

    if (!admin) {
      throw new NotFoundException(
        'Administrador no encontrado.',
      );
    }

    if (admin.role !== 'admin') {
      throw new BadRequestException(
        'El usuario no tiene permisos.',
      );
    }

    if (cliente_id) {
      const cliente =
        await this.prisma.clientes.findUnique({
          where: {
            id: cliente_id,
          },
        });

      if (!cliente) {
        throw new NotFoundException(
          'Cliente no encontrado.',
        );
      }

      const bloqueo =
        await this.prisma.bloqueos.findFirst({
          where: {
            cliente_id,
            activo: true,
          },
        });

      if (bloqueo) {
        throw new BadRequestException(
          'El cliente ya tiene un bloqueo activo.',
        );
      }
    }

    if (mensajero_id) {
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

      const bloqueo =
        await this.prisma.bloqueos.findFirst({
          where: {
            mensajero_id,
            activo: true,
          },
        });

      if (bloqueo) {
        throw new BadRequestException(
          'El mensajero ya tiene un bloqueo activo.',
        );
      }
    }

    return this.prisma.bloqueos.create({
      data: dto,
    });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    orderBy?: Prisma.bloqueosOrderByWithRelationInput;
  }): Promise<bloqueos[]> {
    const { skip, take, orderBy } = params || {};

    return this.prisma.bloqueos.findMany({
      skip,
      take,
      orderBy: orderBy || {
        created_at: 'desc',
      },
      include: {
        clientes: true,
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
  ): Promise<bloqueos> {
    const bloqueo =
      await this.prisma.bloqueos.findUnique({
        where: {
          id,
        },
        include: {
          clientes: true,
          mensajeros: {
            include: {
              users: true,
            },
          },
          users: true,
        },
      });

    if (!bloqueo) {
      throw new NotFoundException(
        'Bloqueo no encontrado.',
      );
    }

    return bloqueo;
  }

  async update(
    id: string,
    dto: UpdateBloqueoDto,
  ): Promise<bloqueos> {
    await this.findOne(id);

    return this.prisma.bloqueos.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(
    id: string,
  ): Promise<bloqueos> {
    await this.findOne(id);

    return this.prisma.bloqueos.delete({
      where: {
        id,
      },
    });
  }
    async verificarBloqueoMensajero(
    mensajeroId: string,
  ): Promise<boolean> {
    const bloqueo = await this.prisma.bloqueos.findFirst({
      where: {
        mensajero_id: mensajeroId,
        activo: true,
      },
    });

    return !!bloqueo;
  }
}