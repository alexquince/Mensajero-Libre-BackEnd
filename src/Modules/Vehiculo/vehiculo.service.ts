import {BadRequestException,ForbiddenException,Injectable,NotFoundException,} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';

interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  estado: string;
}

@Injectable()
export class VehiculoService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private readonly includeMensajero = {
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
  };

  async create(
    dto: CreateVehiculoDto,
    user: AuthenticatedUser,
  ) {
    let mensajeroId: string;

    if (user.role === 'admin') {
      if (!dto.mensajero_id) {
        throw new BadRequestException(
          'El administrador debe indicar el mensajero.',
        );
      }

      mensajeroId = dto.mensajero_id;
    } else if (user.role === 'mensajero') {
      // El propietario se determina mediante el JWT.
      // Se ignora cualquier mensajero_id enviado por el cliente.
      const mensajero =
        await this.prisma.mensajeros.findUnique({
          where: {
            user_id: user.id,
          },
          select: {
            id: true,
          },
        });

      if (!mensajero) {
        throw new NotFoundException(
          'El perfil del mensajero no existe.',
        );
      }

      mensajeroId = mensajero.id;
    } else {
      throw new ForbiddenException(
        'No tienes permisos para registrar vehículos.',
      );
    }

    const mensajero =
      await this.prisma.mensajeros.findUnique({
        where: {
          id: mensajeroId,
        },
        select: {
          id: true,
        },
      });

    if (!mensajero) {
      throw new NotFoundException(
        'El mensajero no existe.',
      );
    }

    const vehiculoExistente =
      await this.prisma.vehiculos.findUnique({
        where: {
          mensajero_id: mensajeroId,
        },
        select: {
          id: true,
        },
      });

    if (vehiculoExistente) {
      throw new BadRequestException(
        'Este mensajero ya tiene un vehículo registrado.',
      );
    }

    const placaExistente =
      await this.prisma.vehiculos.findUnique({
        where: {
          placa: dto.placa,
        },
        select: {
          id: true,
        },
      });

    if (placaExistente) {
      throw new BadRequestException(
        'La placa ya está registrada.',
      );
    }

    return this.prisma.vehiculos.create({
      data: {
        mensajero_id: mensajeroId,
        marca: dto.marca,
        modelo: dto.modelo,
        color: dto.color,
        cilindraje: dto.cilindraje,
        placa: dto.placa,
        tipo: dto.tipo,
      },
      include: this.includeMensajero,
    });
  }

  async findAll(user: AuthenticatedUser) {
    if (user.role === 'admin') {
      return this.prisma.vehiculos.findMany({
        include: this.includeMensajero,
        orderBy: {
          created_at: 'desc',
        },
      });
    }

    if (user.role === 'mensajero') {
      return this.prisma.vehiculos.findMany({
        where: {
          mensajeros: {
            user_id: user.id,
          },
        },
        include: this.includeMensajero,
        orderBy: {
          created_at: 'desc',
        },
      });
    }

    throw new ForbiddenException(
      'No tienes permisos para consultar vehículos.',
    );
  }

  async findOne(
    id: string,
    user: AuthenticatedUser,
  ) {
    let vehiculo;

    if (user.role === 'admin') {
      vehiculo =
        await this.prisma.vehiculos.findUnique({
          where: {
            id,
          },
          include: this.includeMensajero,
        });
    } else if (user.role === 'mensajero') {
      vehiculo =
        await this.prisma.vehiculos.findFirst({
          where: {
            id,
            mensajeros: {
              user_id: user.id,
            },
          },
          include: this.includeMensajero,
        });
    } else {
      throw new ForbiddenException(
        'No tienes permisos para consultar vehículos.',
      );
    }

    if (!vehiculo) {
      throw new NotFoundException(
        'Vehículo no encontrado.',
      );
    }

    return vehiculo;
  }

  private async findVehiculoForUser(
    id: string,
    user: AuthenticatedUser,
  ) {
    let vehiculo;

    if (user.role === 'admin') {
      vehiculo =
        await this.prisma.vehiculos.findUnique({
          where: {
            id,
          },
        });
    } else if (user.role === 'mensajero') {
      vehiculo =
        await this.prisma.vehiculos.findFirst({
          where: {
            id,
            mensajeros: {
              user_id: user.id,
            },
          },
        });
    } else {
      throw new ForbiddenException(
        'No tienes permisos para gestionar vehículos.',
      );
    }

    if (!vehiculo) {
      throw new NotFoundException(
        'Vehículo no encontrado.',
      );
    }

    return vehiculo;
  }

  async update(
    id: string,
    dto: UpdateVehiculoDto,
    user: AuthenticatedUser,
  ) {
    const vehiculo =
      await this.findVehiculoForUser(id, user);

    if (dto.placa) {
      const placaExistente =
        await this.prisma.vehiculos.findFirst({
          where: {
            placa: dto.placa,
            id: {
              not: vehiculo.id,
            },
          },
          select: {
            id: true,
          },
        });

      if (placaExistente) {
        throw new BadRequestException(
          'La placa ya está registrada.',
        );
      }
    }

    return this.prisma.vehiculos.update({
      where: {
        id: vehiculo.id,
      },
      data: dto,
      include: this.includeMensajero,
    });
  }

  async remove(
    id: string,
    user: AuthenticatedUser,
  ) {
    const vehiculo =
      await this.findVehiculoForUser(id, user);

    await this.prisma.vehiculos.delete({
      where: {
        id: vehiculo.id,
      },
    });

    return {
      message: 'Vehículo eliminado correctamente.',
    };
  }
}