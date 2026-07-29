import {Injectable,NotFoundException,BadRequestException,} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, incidentes } from '@prisma/client';
import { CreateIncidenteDto } from './dto/create-incidente.dto';
import { UpdateIncidenteDto } from './dto/update-incidente.dto';

@Injectable()
export class IncidenteService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateIncidenteDto): Promise<incidentes> {
    const { turno_id, mensajero_id } = dto;

    const turno = await this.prisma.turnos.findUnique({
      where: { id: turno_id },
    });
    
    if (!turno) {
      throw new NotFoundException('Turno no encontrado');
    }

    const mensajero = await this.prisma.mensajeros.findUnique({
      where: { id: mensajero_id },
    });

    if (!mensajero) {
      throw new NotFoundException('Mensajero no encontrado');
    }

    if (turno.mensajero_id !== mensajero.id) {
      throw new BadRequestException('El mensajero no pertenece al turno indicado',);
    }

    const incidente = await this.prisma.incidentes.create({
     data: {
        turno_id,
        mensajero_id,
        tipo: dto.tipo,
        descripcion: dto.descripcion,
        nivel: dto.nivel,
        accion_tomada: dto.accion_tomada,
        hay_lesionados: dto.hay_lesionados,
        reportado_a_seguro: dto.reportado_a_seguro,
    },
    });
        return incidente;

}
  
  async findAll(params: {
  skip?: number;
  take?: number;
  where?: Prisma.incidentesWhereInput;
  orderBy?: Prisma.incidentesOrderByWithRelationInput;
}): Promise<incidentes[]> {
  const { skip, take, where, orderBy } = params;

  return this.prisma.incidentes.findMany({
    skip,
    take,
    where,
    orderBy,
    include: {
      turnos: {
        include: {
          solicitudes: {
            include: {
              clientes: true,
            },
          },
        },
      },
      mensajeros: {
        include: {
          users: true,
        },
      },
    },
  });
}

async findOne(id: string): Promise<incidentes> {
  const incidente = await this.prisma.incidentes.findUnique({
    where: { id },
    include: {
      turnos: {
        include: {
          solicitudes: {
            include: {
              clientes: true,
              tarifas: true,
            },
          },
        },
      },
      mensajeros: {
        include: {
          users: true,
        },
      },
    },
  });

  if (!incidente) {
    throw new NotFoundException(`Incidente ${id} no existe`);
  }

  return incidente;
}

async update(
  id: string,
  data: UpdateIncidenteDto,
): Promise<incidentes> {
  await this.findOne(id);

  return this.prisma.incidentes.update({
    where: { id },
    data,
  });
}

async remove(id: string): Promise<incidentes> {
  await this.findOne(id);

  return this.prisma.incidentes.delete({
    where: { id },
  });
}
}