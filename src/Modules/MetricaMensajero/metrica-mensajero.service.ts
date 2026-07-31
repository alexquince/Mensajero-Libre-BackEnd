import {Injectable,NotFoundException,BadRequestException,} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, metricas_mensajero } from '@prisma/client';
import { CreateMetricaMensajeroDto } from './dto/create-metrica-mensajero.dto';
import { UpdateMetricaMensajeroDto } from './dto/update-metrica-mensajero.dto';

@Injectable()
export class MetricaMensajeroService {
  constructor(private prisma: PrismaService) {}

  async create(
  dto: CreateMetricaMensajeroDto,
): Promise<metricas_mensajero> {
  const mensajero = await this.prisma.mensajeros.findUnique({
    where: {
      id: dto.mensajero_id,
    },
  });

  if (!mensajero) {
    throw new NotFoundException(
      'Mensajero no encontrado',
    );
  }

  const existe = await this.prisma.metricas_mensajero.findUnique({
    where: {
      mensajero_id: dto.mensajero_id,
    },
  });

  if (existe) {
    throw new BadRequestException(
      'El mensajero ya posee métricas registradas',
    );
  }

  return this.prisma.metricas_mensajero.create({
    data: {
      ...dto,
      semana_inicio: dto.semana_inicio
        ? new Date(dto.semana_inicio)
        : undefined,
    },
  });
}

async findAll(params: {
  skip?: number;
  take?: number;
  mensajero_id?: string;
  orderBy?: Prisma.metricas_mensajeroOrderByWithRelationInput;
}): Promise<metricas_mensajero[]> {
  const { skip, take, mensajero_id, orderBy } = params;

  const where: Prisma.metricas_mensajeroWhereInput = {};

  if (mensajero_id) {
    where.mensajero_id = mensajero_id;
  }

  return this.prisma.metricas_mensajero.findMany({
    skip,
    take,
    where,
    orderBy: orderBy || {
      score: 'desc',
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

async findOne(id: string): Promise<metricas_mensajero> {
  const metrica = await this.prisma.metricas_mensajero.findUnique({
    where: { id },
    include: {
      mensajeros: {
        include: {
          users: true,
        },
      },
    },
  });

  if (!metrica) {
    throw new NotFoundException(
      `Métrica con id ${id} no encontrada`,
    );
  }

  return metrica;
}

async update(
  id: string,
  dto: UpdateMetricaMensajeroDto,
): Promise<metricas_mensajero> {
  await this.findOne(id);

  const data: Prisma.metricas_mensajeroUpdateInput = {
    ...dto,
  };

  if (dto.semana_inicio) {
    data.semana_inicio = new Date(dto.semana_inicio);
  }

  return this.prisma.metricas_mensajero.update({
    where: { id },
    data,
  });
}

async remove(id: string): Promise<metricas_mensajero> {
  const metrica = await this.findOne(id);

  return this.prisma.metricas_mensajero.delete({
    where: {
      id: metrica.id,
    },
  });
}

async recalcularMetricas(mensajeroId: string): Promise<void> {
  // Verificar que existan métricas para el mensajero
  const metrica = await this.prisma.metricas_mensajero.findUnique({
    where: {
      mensajero_id: mensajeroId,
    },
  });

  if (!metrica) {
    throw new NotFoundException(
      'El mensajero no tiene métricas registradas',
    );
  }

  // Obtener todas las calificaciones
  const calificaciones = await this.prisma.calificaciones.findMany({
    where: {
      mensajero_id: mensajeroId,
    },
  });

  // Calcular score
  let score = 0;

  if (calificaciones.length > 0) {
    let suma = 0;

    for (const calificacion of calificaciones) {
      suma +=
        (calificacion.puntualidad +
          calificacion.presentacion +
          calificacion.actitud +
          calificacion.vehiculo) / 4;
    }

    score = Number(
      (suma / calificaciones.length).toFixed(2),
    );
  }

  // Contar turnos completados
  const totalTurnos = await this.prisma.turnos.count({
    where: {
      mensajero_id: mensajeroId,
      estado: 'completado',
    },
  });

  await this.prisma.metricas_mensajero.update({
    where: {
      mensajero_id: mensajeroId,
    },
    data: {
      score,
      total_turnos: totalTurnos,
    },
  });
}

}