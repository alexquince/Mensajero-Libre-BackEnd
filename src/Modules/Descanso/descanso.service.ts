import {Injectable,NotFoundException,BadRequestException,ForbiddenException,} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDescansoDto } from './dto/create-descanso.dto';
import { UpdateDescansoDto } from './dto/update-descanso.dto';
import { descansos, Prisma } from '@prisma/client';

@Injectable()
export class DescansoService {
  constructor(private prisma: PrismaService) {}

  
  async create(dto: CreateDescansoDto): Promise<descansos> {
    const { mensajero_id, fecha, tipo } = dto;

    // Validar que el mensajero existe y está activo
    const mensajero = await this.prisma.mensajeros.findUnique({
      where: { id: mensajero_id },
    });
    if (!mensajero) {
      throw new BadRequestException('El mensajero no existe');
    }
    if (mensajero.estado !== 'activo') {
      throw new BadRequestException('El mensajero no está activo');
    }

    // Validar que no exista otro descanso en la misma fecha (la DB ya tiene unique, pero validamos antes)
    const existing = await this.prisma.descansos.findFirst({
      where: {
        mensajero_id,
        fecha: new Date(fecha),
      },
    });
    if (existing) {
      throw new BadRequestException('Ya existe un descanso para este mensajero en esa fecha');
    }

    // Crear descanso
    return this.prisma.descansos.create({
      data: {
        mensajero_id,
        fecha: new Date(fecha),
        tipo: tipo || 'programado',
        estado: 'pendiente',
      },
    });
  }

  
  //  LISTAR DESCANSOS (con filtros)
    async findAll(params: {
    skip?: number;
    take?: number;
    mensajero_id?: string;
    estado?: string;
    fecha_desde?: Date;
    fecha_hasta?: Date;
    orderBy?: Prisma.descansosOrderByWithRelationInput;
  }) {
    const { skip, take, mensajero_id, estado, fecha_desde, fecha_hasta, orderBy } = params;

    const where: Prisma.descansosWhereInput = {};
    if (mensajero_id) where.mensajero_id = mensajero_id;
    if (estado) where.estado = estado as any;
    if (fecha_desde || fecha_hasta) {
      where.fecha = {};
      if (fecha_desde) where.fecha.gte = fecha_desde;
      if (fecha_hasta) where.fecha.lte = fecha_hasta;
    }

    return this.prisma.descansos.findMany({
      skip,
      take,
      where,
      orderBy: orderBy || { fecha: 'asc' },
      include: {
  mensajeros: {
    include: {
      users: true,
    },
  },
  users: true,
},
    });
  }

  
  //  OBTENER UN DESCANSO POR ID
  
  async findOne(id: string): Promise<descansos> {
    const descanso = await this.prisma.descansos.findUnique({
      where: { id },
      include: {
  mensajeros: {
    include: {
      users: true,
    },
  },
  users: true,
},
    });
    if (!descanso) {
      throw new NotFoundException(`Descanso con id ${id} no encontrado`);
    }
    return descanso;
  }

  
  //  ACTUALIZAR DESCANSO (solo admin para aprobar/rechazar)
  
  async update(id: string, adminId: string, dto: UpdateDescansoDto) {
    // Verificar que el descanso existe
    await this.findOne(id);

    // Verificar que el admin existe y tiene rol admin
    const admin = await this.prisma.users.findUnique({
      where: { id: adminId },
    });
    if (!admin || admin.role !== 'admin') {
      throw new ForbiddenException('Solo los administradores pueden aprobar o rechazar descansos');
    }

    // Si el estado cambia a 'aprobado' o 'rechazado', asignar aprobado_por
    const data: any = { ...dto };
    if (dto.estado === 'aprobado' || dto.estado === 'rechazado') {
      data.aprobado_por = adminId;
    }

    return this.prisma.descansos.update({
      where: { id },
      data,
      include: {
  mensajeros: {
    include: {
      users: true,
    },
  },
  users: true,
},
    });
  }

    //  ELIMINAR DESCANSO (solo si está pendiente o admin)
  
  async remove(id: string, adminId?: string) {
    const descanso = await this.findOne(id);

    // Si es admin, puede eliminar siempre
    if (adminId) {
      const admin = await this.prisma.users.findUnique({
        where: { id: adminId },
      });
      if (admin?.role === 'admin') {
        return this.prisma.descansos.delete({ where: { id } });
      }
    }

    // Si no es admin, solo puede eliminar si está pendiente
    if (descanso.estado !== 'pendiente') {
      throw new ForbiddenException('Solo se pueden eliminar descansos en estado pendiente');
    }

    return this.prisma.descansos.delete({ where: { id } });
  }
}