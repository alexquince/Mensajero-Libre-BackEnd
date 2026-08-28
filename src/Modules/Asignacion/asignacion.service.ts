import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, asignaciones } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class AsignacionService {
  constructor(private prisma: PrismaService) {}
  async findAll(params: {
  skip?: number;
  take?: number;
  where?: Prisma.asignacionesWhereInput;
  orderBy?: Prisma.asignacionesOrderByWithRelationInput;
}): Promise<asignaciones[]> {
  const { skip, take, where, orderBy } = params;

  return this.prisma.asignaciones.findMany({
    skip,
    take,
    where,
    orderBy,
    include: {
      users: true,
      turnos: {
        include: {
          solicitudes: true,
          mensajeros: {
            include: {
              users: true,
            },
          },
        },
      },
    },
  });
}

async findOne(id: string): Promise<asignaciones> {
  const asignacion = await this.prisma.asignaciones.findUnique({
    where: { id },
    include: {
      users: true,
      turnos: {
        include: {
          solicitudes: {
            include: {
              clientes: true,
              tarifas: true,
            },
          },
          mensajeros: {
            include: {
              users: true,
              metricas_mensajero: true,
            },
          },
          incidentes: true,
          calificaciones: true,
        },
      },
    },
  });

  if (!asignacion) {
    throw new NotFoundException(`Asignación ${id} no existe`);
  }

  return asignacion;
}

async findByTurno(turnoId: string): Promise<asignaciones[]> {
  return this.prisma.asignaciones.findMany({
    where: {
      turno_id: turnoId,
    },
    orderBy: {
      created_at: 'desc',
    },
    include: {
      users: true,
      turnos: {
        include: {
          solicitudes: {
            include: {
              clientes: true,
            },
          },
          mensajeros: {
            include: {
              users: true,
            },
          },
        },
      },
    },
  });
}

async findByAdmin(adminId: string): Promise<asignaciones[]> {
  return this.prisma.asignaciones.findMany({
    where: {
      admin_id: adminId,
    },
    orderBy: {
      created_at: 'desc',
    },
    include: {
      turnos: {
        include: {
          solicitudes: {
            include: {
              clientes: true,
            },
          },
          mensajeros: {
            include: {
              users: true,
            },
          },
        },
      },
    },
  });
}
}