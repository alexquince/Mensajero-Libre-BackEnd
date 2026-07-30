import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AsignacionModule } from './Modules/Asignacion/asignacion.module';
import { AuthModule } from './Modules/Auth/auth.module';
import { CalificacionModule } from './Modules/Calificacion/calificacion.module';
import { ClienteModule } from './Modules/Cliente/cliente.module';
import { DescansoModule } from './Modules/Descanso/descanso.module';
import { DocumentoModule } from './Modules/Documento/documento.module';
import { IncidenteModule } from './Modules/Incidente/incidente.module';
import { MensajeroModule } from './Modules/Mensajero/mensajero.module';
import { MetricaMensajeroModule } from './Modules/MetricaMensajero/metrica-mensajero.module';
import { PrismaModule } from './prisma/prisma.module';
import { SolicitudModule } from './Modules/Solicitud/solicitud.module';
import { TarifaModule } from './Modules/Tarifa/tarifa.module';
import { TurnosModule } from './Modules/Turnos/turnos.module';
import { UsuarioModule } from './Modules/Usuario/usuario.module';
import { VehiculoModule } from './Modules/Vehiculo/vehiculo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AsignacionModule,
    AuthModule,
    CalificacionModule,
    ClienteModule,
    DescansoModule,
    DocumentoModule,
    IncidenteModule,
    MensajeroModule,
    MetricaMensajeroModule,
    PrismaModule,
    SolicitudModule,
    TarifaModule,
    TurnosModule,
    UsuarioModule,
    VehiculoModule,     
  ],
})
export class AppModule {}