import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.users.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Ya existe un usuario con ese correo.');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.users.create({
        data: {
          name: registerDto.name,
          email: registerDto.email,
          password: hashedPassword,
          role: registerDto.role,
        },
      });

      if (registerDto.role === 'cliente') {
        await tx.clientes.create({
          data: {
            user_id: createdUser.id,
            nombre_empresa: registerDto.nombre_empresa ?? registerDto.name,
          },
        });
      }

      if (registerDto.role === 'mensajero') {
        await tx.mensajeros.create({
          data: {
            user_id: createdUser.id,
          },
        });
      }

      return createdUser;
    });

    return {
      message: 'Usuario creado correctamente.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        estado: user.estado,
      },
    };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const usuario = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!usuario) {
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }

    if (usuario.estado !== 'activo') {
      throw new UnauthorizedException('El usuario no está activo.');
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }

    await this.prisma.users.update({
      where: { id: usuario.id },
      data: { last_login: new Date() },
    });

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      role: usuario.role,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        role: usuario.role,
        estado: usuario.estado,
      },
    };
  }
}
