-- CreateEnum
CREATE TYPE "estado_cliente" AS ENUM ('activo', 'bloqueado');

-- CreateEnum
CREATE TYPE "estado_descanso" AS ENUM ('pendiente', 'aprobado', 'rechazado');

-- CreateEnum
CREATE TYPE "estado_doc" AS ENUM ('pendiente', 'aprobado', 'rechazado', 'vencido');

-- CreateEnum
CREATE TYPE "estado_mensajero" AS ENUM ('pendiente', 'activo', 'suspendido');

-- CreateEnum
CREATE TYPE "estado_solicitud" AS ENUM ('pendiente', 'confirmada', 'asignada', 'cancelada');

-- CreateEnum
CREATE TYPE "estado_turno" AS ENUM ('pendiente', 'confirmado', 'en_proceso', 'completado', 'no_show');

-- CreateEnum
CREATE TYPE "estado_usuario" AS ENUM ('activo', 'bloqueado');

-- CreateEnum
CREATE TYPE "metodo_pago" AS ENUM ('semanal', 'mensual');

-- CreateEnum
CREATE TYPE "nivel_incidente" AS ENUM ('leve', 'grave');

-- CreateEnum
CREATE TYPE "rol_usuario" AS ENUM ('admin', 'cliente', 'mensajero');

-- CreateEnum
CREATE TYPE "tipo_alerta" AS ENUM ('demanda', 'incidente', 'vencimiento_doc', 'otro');

-- CreateEnum
CREATE TYPE "tipo_asignacion" AS ENUM ('manual', 'automatico');

-- CreateEnum
CREATE TYPE "tipo_bloqueo_ent" AS ENUM ('cliente', 'mensajero');

-- CreateEnum
CREATE TYPE "tipo_dia" AS ENUM ('normal', 'domingo', 'festivo');

-- CreateEnum
CREATE TYPE "tipo_notificacion" AS ENUM ('sistema', 'solicitud', 'turno', 'documento', 'pago', 'alerta');

-- CreateEnum
CREATE TYPE "dia_semana" AS ENUM ('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo');

-- CreateEnum
CREATE TYPE "tipo_doc" AS ENUM ('soat', 'tecnomecanica', 'licencia', 'cedula');

-- CreateEnum
CREATE TYPE "tipo_empresa" AS ENUM ('restaurante', 'comercio', 'farmacia', 'otro');

-- CreateEnum
CREATE TYPE "tipo_incidente" AS ENUM ('inasistencia', 'retraso', 'comportamiento', 'accidente');

-- CreateEnum
CREATE TYPE "tipo_punto" AS ENUM ('presentacion', 'puntualidad', 'actitud', 'vehiculo', 'cumplimiento');

-- CreateEnum
CREATE TYPE "tipo_cliente" AS ENUM ('empresa', 'persona');

-- CreateEnum
CREATE TYPE "tipo_vehiculo" AS ENUM ('moto', 'bicicleta', 'carro');

-- CreateEnum
CREATE TYPE "estado_vehiculo" AS ENUM ('activo', 'mantenimiento', 'inactivo');

-- CreateTable
CREATE TABLE "acciones_admin" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "admin_id" UUID NOT NULL,
    "tipo_accion" VARCHAR(60) NOT NULL,
    "entidad" VARCHAR(40) NOT NULL,
    "entidad_id" UUID NOT NULL,
    "descripcion" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "acciones_admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alertas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tipo" "tipo_alerta" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "entidad" VARCHAR(40),
    "entidad_id" UUID,
    "resuelta" BOOLEAN NOT NULL DEFAULT false,
    "fecha" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alertas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asignaciones" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "turno_id" UUID NOT NULL,
    "admin_id" UUID NOT NULL,
    "tipo" "tipo_asignacion" NOT NULL DEFAULT 'manual',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asignaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bloqueos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cliente_id" UUID,
    "mensajero_id" UUID,
    "motivo" TEXT NOT NULL,
    "fecha_inicio" DATE NOT NULL DEFAULT CURRENT_DATE,
    "fecha_fin" DATE,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_por" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bloqueos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bonos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mensajero_id" UUID NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "motivo" TEXT NOT NULL,
    "fecha" DATE NOT NULL DEFAULT CURRENT_DATE,
    "aprobado_por" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bonos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calificaciones" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "turno_id" UUID NOT NULL,
    "cliente_id" UUID NOT NULL,
    "mensajero_id" UUID NOT NULL,
    "puntualidad" SMALLINT NOT NULL,
    "presentacion" SMALLINT NOT NULL,
    "actitud" SMALLINT NOT NULL,
    "vehiculo" SMALLINT NOT NULL,
    "comentario" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "nombre_empresa" VARCHAR(150) NOT NULL,
    "tipo_empresa" "tipo_empresa" NOT NULL DEFAULT 'comercio',
    "tipo_cliente" "tipo_cliente" NOT NULL DEFAULT 'empresa',
    "estado" "estado_cliente" NOT NULL DEFAULT 'activo',
    "saldo_pendiente" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "metodo_pago" "metodo_pago" NOT NULL DEFAULT 'semanal',
    "autorizado_mensual" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config_operativa" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "fecha" DATE NOT NULL,
    "minimo_mensajeros" INTEGER NOT NULL DEFAULT 1,
    "radio_geocerca_metros" INTEGER NOT NULL DEFAULT 200,
    "horas_max_turno" DECIMAL(4,1) NOT NULL DEFAULT 12,
    "alerta_demanda_umbral" INTEGER NOT NULL DEFAULT 5,
    "updated_by" UUID,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "config_operativa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "descansos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mensajero_id" UUID NOT NULL,
    "fecha" DATE NOT NULL,
    "tipo" VARCHAR(20) NOT NULL DEFAULT 'programado',
    "estado" "estado_descanso" NOT NULL DEFAULT 'pendiente',
    "aprobado_por" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "descansos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mensajero_id" UUID NOT NULL,
    "tipo" "tipo_doc" NOT NULL,
    "numero_documento" TEXT,
    "archivo_url" TEXT NOT NULL,
    "fecha_vencimiento" DATE,
    "estado" "estado_doc" NOT NULL DEFAULT 'pendiente',
    "validado_por_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidentes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "turno_id" UUID NOT NULL,
    "mensajero_id" UUID NOT NULL,
    "tipo" "tipo_incidente" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "nivel" "nivel_incidente" NOT NULL DEFAULT 'leve',
    "accion_tomada" TEXT,
    "hay_lesionados" BOOLEAN NOT NULL DEFAULT false,
    "reportado_a_seguro" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "incidentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensajeros" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "estado" "estado_mensajero" NOT NULL DEFAULT 'pendiente',
    "dia_descanso" "dia_semana",
    "horas_semanales_objetivo" DECIMAL(5,2) NOT NULL DEFAULT 48,
    "dias_compensatorios" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "mensajeros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metricas_mensajero" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mensajero_id" UUID NOT NULL,
    "tasa_cumplimiento" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "tiempo_promedio_entrega_min" DECIMAL(6,2),
    "score" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "total_turnos" INTEGER NOT NULL DEFAULT 0,
    "horas_acumuladas_semana" DECIMAL(6,2) NOT NULL DEFAULT 0,
    "semana_inicio" DATE,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "metricas_mensajero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "tipo" "tipo_notificacion" NOT NULL,
    "titulo" VARCHAR(120) NOT NULL,
    "mensaje" TEXT NOT NULL,
    "enviada" BOOLEAN NOT NULL DEFAULT false,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "entidad" VARCHAR(40),
    "entidad_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "puntos_mensajero" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mensajero_id" UUID NOT NULL,
    "puntos" INTEGER NOT NULL DEFAULT 0,
    "tipo" "tipo_punto" NOT NULL,
    "origen_id" UUID,
    "fecha" DATE NOT NULL DEFAULT CURRENT_DATE,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "puntos_mensajero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitudes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cliente_id" UUID NOT NULL,
    "tarifa_id" UUID,
    "fecha" DATE NOT NULL,
    "direccion" TEXT NOT NULL,
    "latitud" DECIMAL(65,30),
    "longitud" DECIMAL(65,30),
    "hora_inicio" TIME(6) NOT NULL,
    "hora_fin" TIME(6) NOT NULL,
    "total_horas" DECIMAL(5,2) NOT NULL,
    "tipo_dia" "tipo_dia" NOT NULL DEFAULT 'normal',
    "requiere_alimentacion" BOOLEAN NOT NULL DEFAULT false,
    "costo_total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "estado" "estado_solicitud" NOT NULL DEFAULT 'pendiente',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitudes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarifas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tipo_dia" "tipo_dia" NOT NULL,
    "tarifa_hora" DECIMAL(10,2) NOT NULL,
    "costo_alimentacion" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "vigente_desde" DATE NOT NULL,
    "vigente_hasta" DATE,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tarifas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turnos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "solicitud_id" UUID NOT NULL,
    "mensajero_id" UUID NOT NULL,
    "estado" "estado_turno" NOT NULL DEFAULT 'pendiente',
    "observaciones" TEXT,
    "hora_checkin" TIMESTAMPTZ(6),
    "checkin_lat" DECIMAL(9,6),
    "checkin_lon" DECIMAL(9,6),
    "hora_checkout" TIMESTAMPTZ(6),
    "checkout_lat" DECIMAL(9,6),
    "checkout_lon" DECIMAL(9,6),
    "pago_mensajero" DECIMAL(12,2),
    "reemplaza_turno_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "turnos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ubicaciones" (
    "id" BIGSERIAL NOT NULL,
    "mensajero_id" UUID NOT NULL,
    "latitud" DECIMAL(9,6) NOT NULL,
    "longitud" DECIMAL(9,6) NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ubicaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "password" TEXT NOT NULL,
    "role" "rol_usuario" NOT NULL,
    "estado" "estado_usuario" NOT NULL DEFAULT 'activo',
    "last_login" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesiones" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "dispositivo" VARCHAR(100),
    "ip" VARCHAR(45),
    "expiracion" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sesiones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "validaciones_documentos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "documento_id" UUID NOT NULL,
    "admin_id" UUID NOT NULL,
    "estado" "estado_doc" NOT NULL,
    "comentario" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "validaciones_documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehiculos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mensajero_id" UUID NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "cilindraje" TEXT NOT NULL,
    "placa" VARCHAR(20) NOT NULL,
    "tipo" "tipo_vehiculo" NOT NULL,
    "estado" "estado_vehiculo" NOT NULL DEFAULT 'activo',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "vehiculos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_bloqueos_activos" ON "bloqueos"("activo", "fecha_fin");

-- CreateIndex
CREATE UNIQUE INDEX "una_calificacion_por_turno" ON "calificaciones"("turno_id");

-- CreateIndex
CREATE INDEX "idx_calificaciones_mens" ON "calificaciones"("mensajero_id");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_user_id_key" ON "clientes"("user_id");

-- CreateIndex
CREATE INDEX "clientes_estado_idx" ON "clientes"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "config_operativa_fecha_key" ON "config_operativa"("fecha");

-- CreateIndex
CREATE INDEX "idx_descansos_mensajero" ON "descansos"("mensajero_id", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "un_descanso_por_dia" ON "descansos"("mensajero_id", "fecha");

-- CreateIndex
CREATE INDEX "documentos_mensajero_id_idx" ON "documentos"("mensajero_id");

-- CreateIndex
CREATE INDEX "documentos_estado_idx" ON "documentos"("estado");

-- CreateIndex
CREATE INDEX "idx_incidentes_mensajero" ON "incidentes"("mensajero_id");

-- CreateIndex
CREATE UNIQUE INDEX "mensajeros_user_id_key" ON "mensajeros"("user_id");

-- CreateIndex
CREATE INDEX "mensajeros_estado_idx" ON "mensajeros"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "un_metrica_por_mensajero" ON "metricas_mensajero"("mensajero_id");

-- CreateIndex
CREATE INDEX "notificaciones_user_id_leido_idx" ON "notificaciones"("user_id", "leido");

-- CreateIndex
CREATE INDEX "notificaciones_created_at_idx" ON "notificaciones"("created_at");

-- CreateIndex
CREATE INDEX "idx_solicitudes_cliente" ON "solicitudes"("cliente_id", "fecha");

-- CreateIndex
CREATE INDEX "solicitudes_created_at_idx" ON "solicitudes"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "no_solapamiento_tarifas" ON "tarifas"("tipo_dia", "vigente_desde");

-- CreateIndex
CREATE INDEX "idx_turnos_estado" ON "turnos"("estado");

-- CreateIndex
CREATE INDEX "idx_turnos_mensajero" ON "turnos"("mensajero_id");

-- CreateIndex
CREATE INDEX "idx_turnos_solicitud" ON "turnos"("solicitud_id");

-- CreateIndex
CREATE INDEX "turnos_created_at_idx" ON "turnos"("created_at");

-- CreateIndex
CREATE INDEX "ubicaciones_timestamp_idx" ON "ubicaciones"("timestamp");

-- CreateIndex
CREATE INDEX "idx_ubicaciones_mensajero_ts" ON "ubicaciones"("mensajero_id", "timestamp" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "sesiones_created_at_idx" ON "sesiones"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "vehiculos_mensajero_id_key" ON "vehiculos"("mensajero_id");

-- CreateIndex
CREATE UNIQUE INDEX "vehiculos_placa_key" ON "vehiculos"("placa");

-- CreateIndex
CREATE INDEX "vehiculos_mensajero_id_idx" ON "vehiculos"("mensajero_id");

-- AddForeignKey
ALTER TABLE "acciones_admin" ADD CONSTRAINT "acciones_admin_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "asignaciones" ADD CONSTRAINT "asignaciones_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "asignaciones" ADD CONSTRAINT "asignaciones_turno_id_fkey" FOREIGN KEY ("turno_id") REFERENCES "turnos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bloqueos" ADD CONSTRAINT "bloqueos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bloqueos" ADD CONSTRAINT "bloqueos_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bloqueos" ADD CONSTRAINT "bloqueos_mensajero_id_fkey" FOREIGN KEY ("mensajero_id") REFERENCES "mensajeros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bonos" ADD CONSTRAINT "bonos_aprobado_por_fkey" FOREIGN KEY ("aprobado_por") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bonos" ADD CONSTRAINT "bonos_mensajero_id_fkey" FOREIGN KEY ("mensajero_id") REFERENCES "mensajeros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "calificaciones" ADD CONSTRAINT "calificaciones_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "calificaciones" ADD CONSTRAINT "calificaciones_mensajero_id_fkey" FOREIGN KEY ("mensajero_id") REFERENCES "mensajeros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "calificaciones" ADD CONSTRAINT "calificaciones_turno_id_fkey" FOREIGN KEY ("turno_id") REFERENCES "turnos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "config_operativa" ADD CONSTRAINT "config_operativa_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "descansos" ADD CONSTRAINT "descansos_aprobado_por_fkey" FOREIGN KEY ("aprobado_por") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "descansos" ADD CONSTRAINT "descansos_mensajero_id_fkey" FOREIGN KEY ("mensajero_id") REFERENCES "mensajeros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_mensajero_id_fkey" FOREIGN KEY ("mensajero_id") REFERENCES "mensajeros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidentes" ADD CONSTRAINT "incidentes_mensajero_id_fkey" FOREIGN KEY ("mensajero_id") REFERENCES "mensajeros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "incidentes" ADD CONSTRAINT "incidentes_turno_id_fkey" FOREIGN KEY ("turno_id") REFERENCES "turnos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mensajeros" ADD CONSTRAINT "mensajeros_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metricas_mensajero" ADD CONSTRAINT "metricas_mensajero_mensajero_id_fkey" FOREIGN KEY ("mensajero_id") REFERENCES "mensajeros"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "puntos_mensajero" ADD CONSTRAINT "puntos_mensajero_mensajero_id_fkey" FOREIGN KEY ("mensajero_id") REFERENCES "mensajeros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "solicitudes" ADD CONSTRAINT "solicitudes_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "solicitudes" ADD CONSTRAINT "solicitudes_tarifa_id_fkey" FOREIGN KEY ("tarifa_id") REFERENCES "tarifas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tarifas" ADD CONSTRAINT "tarifas_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "turnos" ADD CONSTRAINT "turnos_mensajero_id_fkey" FOREIGN KEY ("mensajero_id") REFERENCES "mensajeros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "turnos" ADD CONSTRAINT "turnos_reemplaza_turno_id_fkey" FOREIGN KEY ("reemplaza_turno_id") REFERENCES "turnos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "turnos" ADD CONSTRAINT "turnos_solicitud_id_fkey" FOREIGN KEY ("solicitud_id") REFERENCES "solicitudes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ubicaciones" ADD CONSTRAINT "ubicaciones_mensajero_id_fkey" FOREIGN KEY ("mensajero_id") REFERENCES "mensajeros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sesiones" ADD CONSTRAINT "sesiones_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validaciones_documentos" ADD CONSTRAINT "validaciones_documentos_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "validaciones_documentos" ADD CONSTRAINT "validaciones_documentos_documento_id_fkey" FOREIGN KEY ("documento_id") REFERENCES "documentos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vehiculos" ADD CONSTRAINT "vehiculos_mensajero_id_fkey" FOREIGN KEY ("mensajero_id") REFERENCES "mensajeros"("id") ON DELETE CASCADE ON UPDATE CASCADE;
