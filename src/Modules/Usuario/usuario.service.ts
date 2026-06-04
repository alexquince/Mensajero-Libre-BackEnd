// src/usuario/usuario.service.ts
import {
  Injectable,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create.usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Prisma, users } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

 
  // CREAR USUARIO (solo admin)
 
  async create(adminId: string, dto: CreateUsuarioDto): Promise<Omit<users, 'password'>> {
    const { name, email, role, password } = dto;

    // Verificar rol del administrador
    const admin = await this.prisma.users.findUnique({
      where: { id: adminId },
    });
    if (!admin || admin.role !== 'admin') {
      throw new ForbiddenException('No cuentas con los permisos para la administración');
    }

    // Validar email único
    const existingUser = await this.prisma.users.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Ya se encuentra registrado en el sistema');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const nuevoUsuario = await this.prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        estado: 'activo',
      },
    });

    // Crear perfil según el rol
    if (role === 'mensajero') {
      await this.prisma.mensajeros.create({
        data: {
          user_id: nuevoUsuario.id,
          estado: 'pendiente',
          horas_semanales_objetivo: 48,
          dias_compensatorios: 0,
        },
      });
    }

    if (role === 'cliente') {
      await this.prisma.clientes.create({
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

    // Registrar acción del administrador
    await this.prisma.acciones_admin.create({
      data: {
        admin_id: adminId,
        tipo_accion: 'crear_usuario',
        entidad: 'users',
        entidad_id: nuevoUsuario.id,
        descripcion: `Creó usuario con rol ${role}`,
      },
    });

    // No devolver la contraseña
    const { password: _, ...usuarioSinPassword } = nuevoUsuario;
    return usuarioSinPassword as Omit<users, 'password'>;
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
        created_at: true,
        
      },
    });
  }


  // BUSCAR POR ID
  
  async findOne(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        estado: true,
        created_at: true,
        cliente: true,   
        mensajero: true, 
      },
    });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return user;
  }

  // ACTUALIZAR USUARIO
 
  async update(id: string, dto: UpdateUsuarioDto) {
    // Verificar existencia
    await this.findOne(id);

    // Preparar datos
    let data: any = { ...dto };
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }
  
    delete data.role;

    const updated = await this.prisma.users.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        estado: true,
        created_at: true,
      },
    });
    return updated;
  }

 // ELIMINAR USUARIO (solo admin)

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.users.delete({ where: { id } });
  }
}