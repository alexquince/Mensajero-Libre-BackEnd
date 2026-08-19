import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ?? 'mensajero_libre_secret',
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    const user = await this.prisma.users.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        estado: true,
      },
    });

    if (!user || user.estado !== 'activo') {
      throw new UnauthorizedException('El usuario ya no está activo.');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
