// src/usuario/usuario.service.ts
import {Injectable,ConflictException,ForbiddenException,NotFoundException,} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create.usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Prisma, users } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}

  // CREAR USUARIO
  
  async create(
    adminId: string,
    dto: CreateUsuarioDto,
  ): Promise<Omit<users, 'password'>> {
    const { name, email, password, role } = dto;

    // Verificar administrador
    const admin = await this.prisma.users.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.role !== 'admin') {
      throw new ForbiddenException(
        'No cuentas con permisos para realizar esta acción.',
      );
    }

    // Validar email
    const existe = await this.prisma.users.findUnique({
      where: { email },
    });

    if (existe) {
      throw new ConflictException(
        'Ya existe un usuario registrado con ese correo.',
      );
    }

    // Hash contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Transacción
    const usuario = await this.prisma.$transaction(async (tx) => {
      const nuevoUsuario = await tx.users.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
          estado: 'activo',
        },
      });

      // Perfil Mensajero
      if (role === 'mensajero') {
        await tx.mensajeros.create({
          data: {
            user_id: nuevoUsuario.id,
            estado: 'pendiente',
            horas_semanales_objetivo: 48,
            dias_compensatorios: 0,
          },
        });
      }

      // Perfil Cliente
      if (role === 'cliente') {
        await tx.clientes.create({
          data: {
            user_id: nuevoUsuario.id,
            nombre_empresa: 'Pendiente',
            tipo_empresa: 'comercio',
            estado: 'activo',
            saldo_pendiente: 0,
            metodo_pago: 'semanal',
            autorizado_mensual: false,
          },
        });
      }

      // Auditoría
      await tx.acciones_admin.create({
        data: {
          admin_id: adminId,
          tipo_accion: 'crear_usuario',
          entidad: 'users',
          entidad_id: nuevoUsuario.id,
          descripcion: `Creó un usuario con rol ${role}`,
        },
      });

      return nuevoUsuario;
    });

    const { password: _, ...usuarioSinPassword } = usuario;

    return usuarioSinPassword;
  }

  // LISTAR USUARIOS
  
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.usersWhereInput;
    orderBy?: Prisma.usersOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;

    return this.prisma.users.findMany({
      skip,
      take,
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        estado: true,
        last_login: true,
        created_at: true,
      },
    });
  }

  // BUSCAR POR ID
  
  async findOne(id: string) {
    const usuario = await this.prisma.users.findUnique({
      where: { id },
      include: {
        clientes: true,
        mensajeros: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException(
        `No existe un usuario con id ${id}`,
      );
    }

    const { password, ...resultado } = usuario;

    return resultado;
  }

  // ACTUALIZAR
  
  async update(id: string, dto: UpdateUsuarioDto) {
    await this.findOne(id);

    const data: Prisma.usersUpdateInput = {};

    if (dto.name !== undefined) data.name = dto.name;

    if (dto.email !== undefined) data.email = dto.email;

    if (dto.estado !== undefined) data.estado = dto.estado;

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    // El rol no debe modificarse
    const usuario = await this.prisma.users.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        estado: true,
        last_login: true,
        created_at: true,
        updated_at: true,
      },
    });

    return usuario;
  }

  // ELIMINAR
  
  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.users.delete({
      where: { id },
    });

    return {
      message: 'Usuario eliminado correctamente.',
    };
  }
}