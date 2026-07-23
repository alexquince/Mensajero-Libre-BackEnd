import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './Modules/Auth/auth.module';
import { UsuarioModule } from './Modules/Usuario/usuario.module';
import { MensajeroModule } from './Modules/Mensajero/mensajero.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsuarioModule,
    MensajeroModule,
  ],
})
export class AppModule {}