/*
  Warnings:

  - A unique constraint covering the columns `[solicitud_id]` on the table `turnos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "turnos_solicitud_id_key" ON "turnos"("solicitud_id");
