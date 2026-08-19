import {BadRequestException,Injectable,NotFoundException,} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTarifaDto } from './dto/create-tarifa.dto';
import { UpdateTarifaDto } from './dto/update-tarifa.dto';

@Injectable()
export class TarifaService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(createTarifaDto: CreateTarifaDto) {
    const {
      created_by,
      ...data
    } = createTarifaDto;

    if (created_by) {
      const usuario = await this.prisma.users.findUnique({
        where: {
          id: created_by,
        },
      });

      if (!usuario) {
        throw new NotFoundException(
          'El usuario creador no existe.',
        );
      }
    }

    const tarifaExiste = await this.prisma.tarifas.findFirst({
      where: {
        tipo_dia: data.tipo_dia,
        vigente_desde: new Date(data.vigente_desde),
      },
    });

    if (tarifaExiste) {
      throw new BadRequestException(
        'Ya existe una tarifa para ese tipo de día y fecha de vigencia.',
      );
    }

    return this.prisma.tarifas.create({
      data: {
        ...data,
        vigente_desde: new Date(data.vigente_desde),
        vigente_hasta: data.vigente_hasta
          ? new Date(data.vigente_hasta)
          : null,
        created_by,
      },
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
    });
  }

  async findAll() {
  return this.prisma.tarifas.findMany({
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
    orderBy: {
      vigente_desde: 'desc',
    },
  });
}

async findOne(id: string) {
  const tarifa = await this.prisma.tarifas.findUnique({
    where: {
      id,
    },
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
  });

  if (!tarifa) {
    throw new NotFoundException(
      'Tarifa no encontrada.',
    );
  }

  return tarifa;
}

async update(id: string, updateTarifaDto: UpdateTarifaDto) {
  const tarifa = await this.prisma.tarifas.findUnique({
    where: {
      id,
    },
  });

  if (!tarifa) {
    throw new NotFoundException(
      'Tarifa no encontrada.',
    );
  }

  return this.prisma.tarifas.update({
    where: {
      id,
    },
    data: {
      ...updateTarifaDto,
      vigente_desde: updateTarifaDto.vigente_desde
        ? new Date(updateTarifaDto.vigente_desde)
        : undefined,
      vigente_hasta: updateTarifaDto.vigente_hasta
        ? new Date(updateTarifaDto.vigente_hasta)
        : undefined,
    },
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
  });
}

async remove(id: string) {
  const tarifa = await this.prisma.tarifas.findUnique({
    where: {
      id,
    },
  });

  if (!tarifa) {
    throw new NotFoundException(
      'Tarifa no encontrada.',
    );
  }

  await this.prisma.tarifas.delete({
    where: {
      id,
    },
  });

  return {
    message: 'Tarifa eliminada correctamente.',
  };
}
}