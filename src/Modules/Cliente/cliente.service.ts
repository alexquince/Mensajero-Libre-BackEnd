import {Injectable,BadRequestException,NotFoundException,} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(createClienteDto: CreateClienteDto) {
  const {
    user_id,
    nombre_empresa,
    tipo_empresa,
    tipo_cliente,
    metodo_pago,
    autorizado_mensual,
  } = createClienteDto;

  // Verificar que el usuario exista
  const usuario = await this.prisma.users.findUnique({
    where: {
      id: user_id,
    },
  });

  if (!usuario) {
    throw new NotFoundException(
      'El usuario no existe.',
    );
  }

  // Verificar que sea un cliente
  if (usuario.role !== 'cliente') {
    throw new BadRequestException(
      'El usuario no tiene el rol de cliente.',
    );
  }

  // Verificar que no exista previamente
  const clienteExiste = await this.prisma.clientes.findUnique({
    where: {
      user_id,
    },
  });

  if (clienteExiste) {
    throw new BadRequestException(
      'Este usuario ya está registrado como cliente.',
    );
  }

  // Crear cliente
  return this.prisma.clientes.create({
    data: {
      user_id,
      nombre_empresa,
      tipo_empresa,
      tipo_cliente,
      metodo_pago,
      autorizado_mensual,
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
}

async findAll() {
  return this.prisma.clientes.findMany({
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

async findOne(id: string) {
  const cliente = await this.prisma.clientes.findUnique({
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

  if (!cliente) {
    throw new NotFoundException(
      'Cliente no encontrado.',
    );
  }

  return cliente;
}

async update(id: string, updateClienteDto: UpdateClienteDto) {
  const cliente = await this.prisma.clientes.findUnique({
    where: {
      id,
    },
  });

  if (!cliente) {
    throw new NotFoundException(
      'Cliente no encontrado.',
    );
  }

  return this.prisma.clientes.update({
    where: {
      id,
    },
    data: updateClienteDto,
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
  const cliente = await this.prisma.clientes.findUnique({
    where: {
      id,
    },
  });

  if (!cliente) {
    throw new NotFoundException(
      'Cliente no encontrado.',
    );
  }

  await this.prisma.clientes.delete({
    where: {
      id,
    },
  });

  return {
    message: 'Cliente eliminado correctamente.',
  };
}
}