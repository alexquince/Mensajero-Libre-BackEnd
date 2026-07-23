import {Injectable,BadRequestException,NotFoundException,} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';

@Injectable()
export class VehiculoService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(createVehiculoDto: CreateVehiculoDto) {
    const {
      mensajero_id,
      marca,
      modelo,
      color,
      cilindraje,
      placa,
      tipo,
    } = createVehiculoDto;

    // Verificar que el mensajero exista
    const mensajero = await this.prisma.mensajeros.findUnique({
      where: {
        id: mensajero_id,
      },
    });

    if (!mensajero) {
      throw new NotFoundException(
        'El mensajero no existe.',
      );
    }

    // Verificar que no tenga otro vehículo
    const vehiculoMensajero =
      await this.prisma.vehiculos.findUnique({
        where: {
          mensajero_id,
        },
      });

    if (vehiculoMensajero) {
      throw new BadRequestException(
        'Este mensajero ya tiene un vehículo registrado.',
      );
    }

    // Verificar placa repetida
    const placaExiste =
      await this.prisma.vehiculos.findUnique({
        where: {
          placa,
        },
      });

    if (placaExiste) {
      throw new BadRequestException(
        'La placa ya está registrada.',
      );
    }

    // Crear vehículo
    return this.prisma.vehiculos.create({
      data: {
        mensajero_id,
        marca,
        modelo,
        color,
        cilindraje,
        placa,
        tipo,
      },
      include: {
        mensajeros: {
          include: {
            users: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll() {
  return this.prisma.vehiculos.findMany({
    include: {
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
    },
    orderBy: {
      created_at: 'desc',
    },
  });
}

async findOne(id: string) {
  const vehiculo = await this.prisma.vehiculos.findUnique({
    where: {
      id,
    },
    include: {
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
    },
  });

  if (!vehiculo) {
    throw new NotFoundException(
      'Vehículo no encontrado.',
    );
  }

  return vehiculo;
}

async update(
  id: string,
  updateVehiculoDto: UpdateVehiculoDto,
) {
  await this.findOne(id);

  if (updateVehiculoDto.placa) {
    const placaExiste = await this.prisma.vehiculos.findFirst({
      where: {
        placa: updateVehiculoDto.placa,
        NOT: {
          id,
        },
      },
    });

    if (placaExiste) {
      throw new BadRequestException(
        'La placa ya está registrada.',
      );
    }
  }

  return this.prisma.vehiculos.update({
    where: {
      id,
    },
    data: updateVehiculoDto,
    include: {
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
    },
  });
}

async remove(id: string) {
  await this.findOne(id);

  await this.prisma.vehiculos.delete({
    where: {
      id,
    },
  });

  return {
    message: 'Vehículo eliminado correctamente.',
  };
}
}