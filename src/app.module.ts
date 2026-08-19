import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccionesAdminModule } from './Modules/AccionesAdmin/acciones-admin.module';
import { AlertasModule } from './Modules/Alertas/alertas.module';
import { AsignacionModule } from './Modules/Asignacion/asignacion.module';
import { AuthModule } from './Modules/Auth/auth.module';
import { BonosModule } from './Modules/Bonos/bonos.module';
import { BloqueosModule } from './Modules/Bloqueos/bloqueos.module';
import { CalificacionModule } from './Modules/Calificacion/calificacion.module';
import { ClienteModule } from './Modules/Cliente/cliente.module';
import { ConfigOperativaModule } from './Modules/Config-operativa/config-operativa.module';
import { DescansoModule } from './Modules/Descanso/descanso.module';
import { DocumentoModule } from './Modules/Documento/documento.module';
import { IncidenteModule } from './Modules/Incidente/incidente.module';
import { MensajeroModule } from './Modules/Mensajero/mensajero.module';
import { MetricaMensajeroModule } from './Modules/MetricaMensajero/metrica-mensajero.module';
import { NotificacionModule } from './Modules/Notificacion/notificacion.module';
import { PuntosMensajeroModule } from './Modules/Puntos-mensajero/puntos-mensajero.module';
import { PrismaModule } from './prisma/prisma.module';
import { SesionesModule } from './Modules/Sesiones/sesiones.module';
import { SolicitudModule } from './Modules/Solicitud/solicitud.module';
import { TarifaModule } from './Modules/Tarifa/tarifa.module';
import { TurnosModule } from './Modules/Turnos/turnos.module';
import { UbicacionesModule } from './Modules/Ubicaciones/ubicaciones.module';
import { UsuarioModule } from './Modules/Usuario/usuario.module';
import { ValidacionesDocumentosModule } from './Modules/ValidacionesDocumentos/validaciones-documentos.module';
import { VehiculoModule } from './Modules/Vehiculo/vehiculo.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AccionesAdminModule,
    AlertasModule,
    AsignacionModule,
    AuthModule,
    BonosModule,
    BloqueosModule,
    CalificacionModule,
    ClienteModule,
    ConfigOperativaModule,
    DescansoModule,
    DocumentoModule,
    IncidenteModule,
    MensajeroModule,
    MetricaMensajeroModule,
    NotificacionModule,
    PuntosMensajeroModule,
    PrismaModule,
    SesionesModule,
    SolicitudModule,
    TarifaModule,
    TurnosModule,
    UbicacionesModule,
    UsuarioModule,
    ValidacionesDocumentosModule,
    VehiculoModule,     
  ],
})
export class AppModule {}