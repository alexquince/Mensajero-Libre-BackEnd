import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './Modules/Auth/auth.module';
import { UsuarioModule } from './Modules/Usuario/usuario.module';
import { MensajeroModule } from './Modules/Mensajero/mensajero.module';
import { VehiculoModule } from './Modules/Vehiculo/vehiculo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsuarioModule,
    MensajeroModule,
    VehiculoModule,
  ],
})
export class AppModule {}