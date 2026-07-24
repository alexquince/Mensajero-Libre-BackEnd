/*
  Warnings:

  - A unique constraint covering the columns `[mensajero_id,tipo]` on the table `documentos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "documentos_mensajero_id_tipo_key" ON "documentos"("mensajero_id", "tipo");
