import {Injectable,NotFoundException,} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {alertas,Prisma,} from '@prisma/client';
import { CreateAlertaDto } from './dto/create-alerta.dto';
import { UpdateAlertaDto } from './dto/update-alerta.dto';

@Injectable()
export class AlertasService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    dto: CreateAlertaDto,
  ): Promise<alertas> {
    return this.prisma.alertas.create({
      data: dto,
    });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    orderBy?: Prisma.alertasOrderByWithRelationInput;
  }): Promise<alertas[]> {
    const { skip, take, orderBy } = params || {};

    return this.prisma.alertas.findMany({
      skip,
      take,
      orderBy: orderBy || {
        fecha: 'desc',
      },
    });
  }

  async findOne(
    id: string,
  ): Promise<alertas> {
    const alerta =
      await this.prisma.alertas.findUnique({
        where: {
          id,
        },
      });

    if (!alerta) {
      throw new NotFoundException(
        'Alerta no encontrada.',
      );
    }

    return alerta;
  }

  async update(
    id: string,
    dto: UpdateAlertaDto,
  ): Promise<alertas> {
    await this.findOne(id);

    return this.prisma.alertas.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(
    id: string,
  ): Promise<alertas> {
    await this.findOne(id);

    return this.prisma.alertas.delete({
      where: {
        id,
      },
    });
  }
}