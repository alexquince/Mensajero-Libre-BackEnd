import {Injectable,BadRequestException,NotFoundException,} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMensajeroDto } from './dto/create-mensajero.dto';
import { UpdateMensajeroDto } from './dto/update-mensajero.dto';


@Injectable()
export class MensajeroService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMensajeroDto: CreateMensajeroDto) {
    const { user_id, dia_descanso } = createMensajeroDto;

    // Verificar que el usuario exista
    const usuario = await this.prisma.users.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!usuario) {
      throw new NotFoundException('El usuario no existe.');
    }

    // Verificar que tenga el rol de mensajero
    if (usuario.role !== 'mensajero') {
      throw new BadRequestException(
        'El usuario no tiene el rol de mensajero.',
      );
    }

    // Verificar que no exista ya como mensajero
    const existeMensajero = await this.prisma.mensajeros.findUnique({
      where: {
        user_id,
      },
    });

    if (existeMensajero) {
      throw new BadRequestException(
        'Este usuario ya está registrado como mensajero.',
      );
    }

    // Crear el mensajero
    return this.prisma.mensajeros.create({
      data: {
        user_id,
        dia_descanso,
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
  return this.prisma.mensajeros.findMany({
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          estado: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });
}

async findOne(id: string) {
  const mensajero = await this.prisma.mensajeros.findUnique({
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
          estado: true,
        },
      },
    },
  });

  if (!mensajero) {
    throw new NotFoundException(
      'Mensajero no encontrado.',
    );
  }

  return mensajero;
}

async update(id: string, dto: UpdateMensajeroDto) {
  const existe = await this.prisma.mensajeros.findUnique({
    where: { id },
  });

  if (!existe) {
    throw new NotFoundException('Mensajero no encontrado.');
  }

  return this.prisma.mensajeros.update({
    where: { id },
    data: dto,
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          estado: true,
        },
      },
    },
  });
}

async remove(id: string) {
  const existe = await this.prisma.mensajeros.findUnique({
    where: { id },
  });

  if (!existe) {
    throw new NotFoundException('Mensajero no encontrado.');
  }

  await this.prisma.mensajeros.delete({
    where: { id },
  });

  return {
    message: 'Mensajero eliminado correctamente.',
  };
}
}