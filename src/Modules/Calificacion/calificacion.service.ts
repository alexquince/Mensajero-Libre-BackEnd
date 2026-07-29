import {Injectable,NotFoundException,BadRequestException,} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, calificaciones } from '@prisma/client';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';

@Injectable()
export class CalificacionService {
  constructor(private prisma: PrismaService) {}

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

}