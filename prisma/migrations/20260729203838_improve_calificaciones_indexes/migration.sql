-- CreateIndex
CREATE INDEX "idx_calificaciones_cliente" ON "calificaciones"("cliente_id");

-- CreateIndex
CREATE INDEX "idx_calificaciones_fecha" ON "calificaciones"("created_at");

-- CreateIndex
CREATE INDEX "idx_calificaciones_mens_fecha" ON "calificaciones"("mensajero_id", "created_at");
