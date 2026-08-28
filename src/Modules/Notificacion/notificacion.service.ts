import { Injectable } from '@nestjs/common';
import {NotFoundException,} from '@nestjs/common';
import {Prisma,notificaciones,} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';

@Injectable()
export class NotificacionService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
  dto: CreateNotificacionDto,
): Promise<notificaciones> {
  const usuario = await this.prisma.users.findUnique({
    where: {
      id: dto.user_id,
    },
  });

  if (!usuario) {
    throw new NotFoundException(
      'Usuario no encontrado.',
    );
  }

  return this.prisma.notificaciones.create({
    data: dto,
  });
}

async findAll(params?: {
  skip?: number;
  take?: number;
  user_id?: string;
  leido?: boolean;
  orderBy?: Prisma.notificacionesOrderByWithRelationInput;
}): Promise<notificaciones[]> {
  const {
    skip,
    take,
    user_id,
    leido,
    orderBy,
  } = params || {};

  const where: Prisma.notificacionesWhereInput = {};

  if (user_id) {
    where.user_id = user_id;
  }

  if (leido !== undefined) {
    where.leido = leido;
  }

  return this.prisma.notificaciones.findMany({
    skip,
    take,
    where,
    orderBy: orderBy || {
      created_at: 'desc',
    },
    include: {
      users: true,
    },
  });
}

async findOne(
  id: string,
): Promise<notificaciones> {
  const notificacion =
    await this.prisma.notificaciones.findUnique({
      where: {
        id,
      },
      include: {
        users: true,
      },
    });

  if (!notificacion) {
    throw new NotFoundException(
      'Notificación no encontrada.',
    );
  }

  return notificacion;
}

async update(
  id: string,
  dto: UpdateNotificacionDto,
): Promise<notificaciones> {
  await this.findOne(id);

  return this.prisma.notificaciones.update({
    where: {
      id,
    },
    data: dto,
    include: {
      users: true,
    },
  });
}

async remove(
  id: string,
): Promise<notificaciones> {
  const notificacion = await this.findOne(id);

  return this.prisma.notificaciones.delete({
    where: {
      id: notificacion.id,
    },
  });
}
}