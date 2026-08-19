import {Injectable,NotFoundException,BadRequestException,} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {Prisma,acciones_admin,} from '@prisma/client';
import { CreateAccionesAdminDto } from './dto/create-acciones-admin.dto';
import { UpdateAccionesAdminDto } from './dto/update-acciones-admin.dto';

@Injectable()
export class AccionesAdminService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    dto: CreateAccionesAdminDto,
  ): Promise<acciones_admin> {
    const admin = await this.prisma.users.findUnique({
      where: {
        id: dto.admin_id,
      },
    });

    if (!admin) {
      throw new NotFoundException(
        'Administrador no encontrado.',
      );
    }

    if (admin.role !== 'admin') {
      throw new BadRequestException(
        'El usuario no tiene permisos de administrador.',
      );
    }

    return this.prisma.acciones_admin.create({
      data: dto,
    });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    orderBy?: Prisma.acciones_adminOrderByWithRelationInput;
  }): Promise<acciones_admin[]> {
    const { skip, take, orderBy } = params || {};

    return this.prisma.acciones_admin.findMany({
      skip,
      take,
      orderBy: orderBy || {
        created_at: 'desc',
      },
    });
  }

  async findOne(
    id: string,
  ): Promise<acciones_admin> {
    const accion =
      await this.prisma.acciones_admin.findUnique({
        where: {
          id,
        },
      });

    if (!accion) {
      throw new NotFoundException(
        'Acción administrativa no encontrada.',
      );
    }

    return accion;
  }

  async update(
    id: string,
    dto: UpdateAccionesAdminDto,
  ): Promise<acciones_admin> {
    await this.findOne(id);

    return this.prisma.acciones_admin.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(
    id: string,
  ): Promise<acciones_admin> {
    await this.findOne(id);

    return this.prisma.acciones_admin.delete({
      where: {
        id,
      },
    });
  }
}