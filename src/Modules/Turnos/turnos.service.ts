// src/turnos/turnos.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, turnos, estado_turno, tipo_asignacion } from '@prisma/client';
import { CreateTurnoDto } from './dto/create.turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';

@Injectable()
export class TurnosService {
  constructor(private prisma: PrismaService) {}

  // Crear turno con validaciones
  async create(adminId: string, dto: CreateTurnoDto): Promise<turnos> {
    const { solicitud_id, mensajero_id, tipo_asignacion } = dto;

    // Verificar solicitud
    const solicitud = await this.prisma.solicitudes.findUnique({
      where: { id: solicitud_id },
      include: { turnos: true },
    });
    if (!solicitud) throw new NotFoundException('Solicitud no encontrada');
    if (solicitud.estado !== 'confirmada')
      throw new BadRequestException('La solicitud debe estar confirmada');

    // Verificar mensajero activo
    const mensajero = await this.prisma.mensajeros.findUnique({
      where: { id: mensajero_id },
    });
    if (!mensajero || mensajero.estado !== 'activo')
      throw new BadRequestException('Mensajero no disponible');

    // Crear turno
    const turno = await this.prisma.turnos.create({
      data: {
        solicitud_id,
        mensajero_id,
        estado: 'confirmado',
      },
    });

    // Registrar asignación
    await this.prisma.asignaciones.create({
      data: {
        turno_id: turno.id,
        admin_id: adminId,
        tipo: tipo_asignacion === 'automatico' ? 'automatico' : 'manual',
      },
    });

    // Actualizar estado de solicitud
    await this.prisma.solicitudes.update({
      where: { id: solicitud_id },
      data: { estado: 'asignada' },
    });

    return this.findOne(turno.id);
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.turnosWhereInput;
    orderBy?: Prisma.turnosOrderByWithRelationInput;
  }): Promise<turnos[]> {
    const { skip, take, where, orderBy } = params;
    return this.prisma.turnos.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        solicitudes: { include: { clientes: true } },
        mensajeros: { include: { users: true } },
        calificaciones: true,
        incidentes: true,
      },
    });
  }

  async findOne(id: string): Promise<turnos> {
    const turno = await this.prisma.turnos.findUnique({
      where: { id },
      include: {
        solicitudes: { include: { clientes: true, tarifas: true } },
        mensajeros: { include: { users: true, metricas_mensajero: true } },
        calificaciones: true,
        incidentes: true,
        asignaciones: { include: { users: true } },
      },
    });
    if (!turno) throw new NotFoundException(`Turno ${id} no existe`);
    return turno;
  }

  async update(id: string, data: Prisma.turnosUpdateInput): Promise<turnos> {
    await this.findOne(id);
    return this.prisma.turnos.update({ where: { id }, data });
  }

  async remove(id: string): Promise<turnos> {
    const turno = await this.findOne(id);
    if (!['pendiente', 'no_show'].includes(turno.estado)) {
      throw new BadRequestException('No se puede eliminar un turno en curso o completado');
    }
    return this.prisma.turnos.delete({ where: { id } });
  }

  // Check-in
  async checkIn(id: string, lat: number, lon: number) {
    const turno = await this.prisma.turnos.findUnique({ where: { id } });
    if (!turno) throw new NotFoundException();
    if (turno.estado !== 'confirmado')
      throw new BadRequestException('El turno no está confirmado');
    return this.prisma.turnos.update({
      where: { id },
      data: {
        estado: 'en_proceso',
        hora_checkin: new Date(),
        checkin_lat: lat,
        checkin_lon: lon,
      },
    });
  }

  // Check-out + cálculo de pago
  async checkOut(id: string, lat: number, lon: number) {
    const turno = await this.prisma.turnos.findUnique({
      where: { id },
      include: { solicitudes: { include: { tarifas: true } } },
    });
    if (!turno) throw new NotFoundException();
    if (turno.estado !== 'en_proceso')
      throw new BadRequestException('Turno no está en proceso');

    const horas = turno.solicitudes.total_horas.toNumber();
    const tarifaHora = turno.solicitudes.tarifas?.tarifa_hora.toNumber() || 0;
    const pago = horas * tarifaHora;

    const updated = await this.prisma.turnos.update({
      where: { id },
      data: {
        estado: 'completado',
        hora_checkout: new Date(),
        checkout_lat: lat,
        checkout_lon: lon,
        pago_mensajero: pago,
      },
    });

    // Actualizar métricas del mensajero
    await this.prisma.metricas_mensajero.update({
      where: { mensajero_id: turno.mensajero_id },
      data: {
        total_turnos: { increment: 1 },
        horas_acumuladas_semana: { increment: horas },
      },
    });
    return updated;
  }
}