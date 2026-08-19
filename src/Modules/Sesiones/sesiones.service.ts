import {Injectable,NotFoundException,} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {Prisma,sesiones,} from '@prisma/client';
import { CreateSesionDto } from './dto/create-sesion.dto';
import { UpdateSesionDto } from './dto/update-sesion.dto';

@Injectable()
export class SesionService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    dto: CreateSesionDto,
  ): Promise<sesiones> {
    const usuario =
      await this.prisma.users.findUnique({
        where: {
          id: dto.user_id,
        },
      });

    if (!usuario) {
      throw new NotFoundException(
        'Usuario no encontrado.',
      );
    }

    return this.prisma.sesiones.create({
      data: dto,
    });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    orderBy?: Prisma.sesionesOrderByWithRelationInput;
  }): Promise<sesiones[]> {
    const { skip, take, orderBy } = params || {};

    return this.prisma.sesiones.findMany({
      skip,
      take,
      orderBy: orderBy || {
        created_at: 'desc',
      },
      include: {
        usuario: true,
      },
    });
  }

  async findOne(
    id: string,
  ): Promise<sesiones> {
    const sesion =
      await this.prisma.sesiones.findUnique({
        where: {
          id,
        },
        include: {
          usuario: true,
        },
      });

    if (!sesion) {
      throw new NotFoundException(
        'Sesión no encontrada.',
      );
    }

    return sesion;
  }

  async update(
    id: string,
    dto: UpdateSesionDto,
  ): Promise<sesiones> {
    await this.findOne(id);

    if (dto.user_id) {
      const usuario =
        await this.prisma.users.findUnique({
          where: {
            id: dto.user_id,
          },
        });

      if (!usuario) {
        throw new NotFoundException(
          'Usuario no encontrado.',
        );
      }
    }

    return this.prisma.sesiones.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(
    id: string,
  ): Promise<sesiones> {
    await this.findOne(id);

    return this.prisma.sesiones.delete({
      where: {
        id,
      },
    });
  }

  // Elimina todas las sesiones de un usuario
  async removeByUser(
    userId: string,
  ) {
    return this.prisma.sesiones.deleteMany({
      where: {
        user_id: userId,
      },
    });
  }

  // Busca una sesión por refresh token
  async findByRefreshToken(
    refreshToken: string,
  ) {
    return this.prisma.sesiones.findFirst({
      where: {
        refresh_token: refreshToken,
      },
      include: {
        usuario: true,
      },
    });
  }
}