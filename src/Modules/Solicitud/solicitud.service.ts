import {PrismaService} from '../../prisma/prisma.service';
import {Injectable,NotFoundException,BadRequestException} from '@nestjs/common';
import {CreateSolicitudDto} from './dto/create-solicitud.dto';
import {UpdateSolicitudDto} from './dto/update-solicitud.dto';

@Injectable()
export class SolicitudService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}
  async create(createSolicitudDto: CreateSolicitudDto) {

  const cliente = await this.prisma.clientes.findUnique({
    where: {
      id: createSolicitudDto.cliente_id,
    },
  });

  if (!cliente) {
    throw new NotFoundException(
      'Cliente no encontrado.',
    );
  }

  const tarifa = await this.prisma.tarifas.findUnique({
    where: {
      id: createSolicitudDto.tarifa_id,
    },
  });

  if (!tarifa) {
    throw new NotFoundException(
      'Tarifa no encontrada.',
    );
  }

  

  const inicio = new Date(`1970-01-01T${createSolicitudDto.hora_inicio}`);
  const fin = new Date(`1970-01-01T${createSolicitudDto.hora_fin}`);

  if (fin <= inicio) {
    throw new Error('La hora de fin debe ser mayor que la hora de inicio.');
  }

  const diferenciaMs = fin.getTime() - inicio.getTime();

  const totalHoras = Number(
    (diferenciaMs / (1000 * 60 * 60)).toFixed(2),
  );

  const tarifaHora = Number(tarifa.tarifa_hora);

const costoAlimentacion = createSolicitudDto.requiere_alimentacion
  ? Number(tarifa.costo_alimentacion)
  : 0;

const costoTotal =
  totalHoras * tarifaHora + costoAlimentacion;

 const solicitud = await this.prisma.solicitudes.create({
  data: {
    cliente_id: createSolicitudDto.cliente_id,
    tarifa_id: createSolicitudDto.tarifa_id,
    fecha: new Date(createSolicitudDto.fecha),
    direccion: createSolicitudDto.direccion,
    latitud: createSolicitudDto.latitud,
    longitud: createSolicitudDto.longitud,
    hora_inicio: new Date(`1970-01-01T${createSolicitudDto.hora_inicio}`),
    hora_fin: new Date(`1970-01-01T${createSolicitudDto.hora_fin}`),
    total_horas: totalHoras,
    tipo_dia: tarifa.tipo_dia,
    requiere_alimentacion:
      createSolicitudDto.requiere_alimentacion ?? false,
    costo_total: costoTotal,
  },
  include: {
    clientes: {
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
    tarifas: true,
  },
});

return solicitud;
}

async findAll() {
  return this.prisma.solicitudes.findMany({
    include: {
      clientes: {
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
      tarifas: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });
}

async findOne(id: string) {
  const solicitud = await this.prisma.solicitudes.findUnique({
    where: {
      id,
    },
    include: {
      clientes: {
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
      tarifas: true,
    },
  });

  if (!solicitud) {
    throw new NotFoundException(
      'Solicitud no encontrada.',
    );
  }

  return solicitud;
}

async update(
  id: string,
  updateSolicitudDto: UpdateSolicitudDto,
) {

  const solicitud = await this.prisma.solicitudes.findUnique({
    where: {
      id,
    },
  });

  if (!solicitud) {
    throw new NotFoundException(
      'Solicitud no encontrada.',
    );
  }

  const clienteId =
  updateSolicitudDto.cliente_id ?? solicitud.cliente_id;

const tarifaId =
  updateSolicitudDto.tarifa_id ?? solicitud.tarifa_id;

const cliente = await this.prisma.clientes.findUnique({
  where: {
    id: clienteId,
  },
});

if (!cliente) {
  throw new NotFoundException(
    'Cliente no encontrado.',
  );
}

const tarifa = await this.prisma.tarifas.findUnique({
  where: {
    id: tarifaId!,
  },
});

if (!tarifa) {
  throw new NotFoundException(
    'Tarifa no encontrada.',
  );
}

const horaInicio =
  updateSolicitudDto.hora_inicio ??
  solicitud.hora_inicio.toISOString().substring(11, 19);

const horaFin =
  updateSolicitudDto.hora_fin ??
  solicitud.hora_fin.toISOString().substring(11, 19);

const inicio = new Date(`1970-01-01T${horaInicio}`);
const fin = new Date(`1970-01-01T${horaFin}`);

if (fin <= inicio) {
  throw new BadRequestException(
    'La hora de fin debe ser mayor que la hora de inicio.',
  );
}

const diferenciaMs = fin.getTime() - inicio.getTime();

const totalHoras = Number(
  (diferenciaMs / (1000 * 60 * 60)).toFixed(2),
);

const costoAlimentacion =
  (
    updateSolicitudDto.requiere_alimentacion ??
    solicitud.requiere_alimentacion
  )
    ? Number(tarifa.costo_alimentacion)
    : 0;

const costoTotal =
  totalHoras * Number(tarifa.tarifa_hora) +
  costoAlimentacion;

const solicitudActualizada =
  await this.prisma.solicitudes.update({
    where: {
      id,
    },
    data: {
      cliente_id: clienteId,
      tarifa_id: tarifaId,
      fecha: updateSolicitudDto.fecha
        ? new Date(updateSolicitudDto.fecha)
        : solicitud.fecha,
      direccion:
        updateSolicitudDto.direccion ??
        solicitud.direccion,
      latitud:
        updateSolicitudDto.latitud ??
        solicitud.latitud,
      longitud:
        updateSolicitudDto.longitud ??
        solicitud.longitud,
      hora_inicio: inicio,
      hora_fin: fin,
      total_horas: totalHoras,
      tipo_dia: tarifa.tipo_dia,
      requiere_alimentacion:
        updateSolicitudDto.requiere_alimentacion ??
        solicitud.requiere_alimentacion,
      costo_total: costoTotal,
    },
    include: {
      clientes: {
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
      tarifas: true,
    },
  });

return solicitudActualizada;

}

async remove(id: string) {

  const solicitud = await this.prisma.solicitudes.findUnique({
    where: {
      id,
    },
  });

  if (!solicitud) {
    throw new NotFoundException(
      'Solicitud no encontrada.',
    );
  }

  await this.prisma.solicitudes.delete({
    where: {
      id,
    },
  });

  return {
    message: 'Solicitud eliminada correctamente.',
  };
}
}