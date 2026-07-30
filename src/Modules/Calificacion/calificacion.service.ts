import {Injectable,NotFoundException,BadRequestException,} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, calificaciones } from '@prisma/client';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';
import { MetricaMensajeroService } from '../MetricaMensajero/metrica-mensajero.service';

@Injectable()
export class CalificacionService {
  constructor(private prisma: PrismaService,private readonly metricaMensajeroService: MetricaMensajeroService,) {}
  
  async create(dto: CreateCalificacionDto): Promise<calificaciones> {
  const { turno_id, cliente_id, mensajero_id } = dto;

  // Verificar que el turno exista
  const turno = await this.prisma.turnos.findUnique({
    where: { id: turno_id },
    include: {
      solicitudes: true,
    },
  });

  if (!turno) {
    throw new NotFoundException('Turno no encontrado');
  }

  // El turno debe estar completado
  if (turno.estado !== 'completado') {
    throw new BadRequestException(
      'Solo se pueden calificar turnos completados',
    );
  }

  // Verificar que el mensajero corresponda al turno
  if (turno.mensajero_id !== mensajero_id) {
    throw new BadRequestException(
      'El mensajero no corresponde al turno',
    );
  }

  // Verificar que el cliente corresponda a la solicitud
  if (turno.solicitudes.cliente_id !== cliente_id) {
    throw new BadRequestException(
      'El cliente no corresponde a la solicitud',
    );
  }

  // Verificar que no exista una calificación previa
  const existe = await this.prisma.calificaciones.findUnique({
    where: {
      turno_id,
    },
  });

  if (existe) {
    throw new BadRequestException(
      'Este turno ya fue calificado',
    );
  }

  return this.prisma.calificaciones.create({
    data: dto,
  });
}

async findAll(params: {
  skip?: number;
  take?: number;
  where?: Prisma.calificacionesWhereInput;
  orderBy?: Prisma.calificacionesOrderByWithRelationInput;
}): Promise<calificaciones[]> {
  const { skip, take, where, orderBy } = params;

  return this.prisma.calificaciones.findMany({
    skip,
    take,
    where,
    orderBy,
    include: {
      clientes: true,
      mensajeros: {
        include: {
          users: true,
        },
      },
      turnos: true,
    },
  });
}

async findOne(id: string): Promise<calificaciones> {
  const calificacion = await this.prisma.calificaciones.findUnique({
    where: { id },
    include: {
      clientes: true,
      mensajeros: {
        include: {
          users: true,
        },
      },
      turnos: {
        include: {
          solicitudes: true,
        },
      },
    },
  });

  if (!calificacion) {
    throw new NotFoundException(
      `Calificación con id ${id} no encontrada`,
    );
  }

  return calificacion;
}

async update(
  id: string,
  dto: UpdateCalificacionDto,
): Promise<calificaciones> {
  await this.findOne(id);

  return this.prisma.calificaciones.update({
    where: { id },
    data: dto,
  });
}

async remove(id: string): Promise<calificaciones> {
  const calificacion = await this.findOne(id);

  return this.prisma.calificaciones.delete({
    where: { id: calificacion.id },
  });
}

async recalcularMetricas(mensajeroId: string): Promise<void> {
  // Verificar que exista el registro de métricas
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

  // Buscar todas las calificaciones del mensajero
  const calificaciones = await this.prisma.calificaciones.findMany({
    where: {
      mensajero_id: mensajeroId,
    },
  });

  // Si aún no tiene calificaciones
  if (calificaciones.length === 0) {
    await this.prisma.metricas_mensajero.update({
      where: {
        mensajero_id: mensajeroId,
      },
      data: {
        score: 0,
      },
    });
    
    return;
  }
  // Calcular el promedio de todas las calificaciones
let suma = 0;

for (const calificacion of calificaciones) {
  suma +=
    (calificacion.puntualidad +
      calificacion.presentacion +
      calificacion.actitud +
      calificacion.vehiculo) / 4;
}

const score = Number(
  (suma / calificaciones.length).toFixed(2),
);

// Contar los turnos del mensajero
const totalTurnos = await this.prisma.turnos.count({
  where: {
    mensajero_id: mensajeroId,
  },
});

// Actualizar métricas
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