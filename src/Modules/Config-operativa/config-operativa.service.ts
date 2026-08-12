import {Injectable,NotFoundException,BadRequestException,} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {Prisma,config_operativa,} from '@prisma/client';
import { CreateConfigOperativaDto } from './dto/create-config-operativa.dto';
import { UpdateConfigOperativaDto } from './dto/update-config-operativa.dto';

@Injectable()
export class ConfigOperativaService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    dto: CreateConfigOperativaDto,
  ): Promise<config_operativa> {
    if (dto.updated_by) {
      const usuario = await this.prisma.users.findUnique({
        where: {
          id: dto.updated_by,
        },
      });

      if (!usuario) {
        throw new NotFoundException(
          'Usuario no encontrado.',
        );
      }

      if (usuario.role !== 'admin') {
        throw new BadRequestException(
          'Solo un administrador puede modificar la configuración operativa.',
        );
      }
    }

    return this.prisma.config_operativa.create({
      data: dto,
    });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    orderBy?: Prisma.config_operativaOrderByWithRelationInput;
  }): Promise<config_operativa[]> {
    const { skip, take, orderBy } = params || {};

    return this.prisma.config_operativa.findMany({
      skip,
      take,
      orderBy: orderBy || {
        fecha: 'desc',
      },
      include: {
        users: true,
      },
    });
  }

  async findOne(
    id: string,
  ): Promise<config_operativa> {
    const configuracion =
      await this.prisma.config_operativa.findUnique({
        where: {
          id,
        },
        include: {
          users: true,
        },
      });

    if (!configuracion) {
      throw new NotFoundException(
        'Configuración operativa no encontrada.',
      );
    }

    return configuracion;
  }

  async update(
    id: string,
    dto: UpdateConfigOperativaDto,
  ): Promise<config_operativa> {
    await this.findOne(id);

    if (dto.updated_by) {
      const usuario = await this.prisma.users.findUnique({
        where: {
          id: dto.updated_by,
        },
      });

      if (!usuario) {
        throw new NotFoundException(
          'Usuario no encontrado.',
        );
      }

      if (usuario.role !== 'admin') {
        throw new BadRequestException(
          'Solo un administrador puede modificar la configuración operativa.',
        );
      }
    }

    return this.prisma.config_operativa.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(
    id: string,
  ): Promise<config_operativa> {
    await this.findOne(id);

    return this.prisma.config_operativa.delete({
      where: {
        id,
      },
    });
  }
}