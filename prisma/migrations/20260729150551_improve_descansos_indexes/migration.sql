-- CreateIndex
CREATE INDEX "idx_descansos_estado" ON "descansos"("estado");

-- CreateIndex
CREATE INDEX "idx_descansos_fecha" ON "descansos"("fecha");

-- CreateIndex
CREATE INDEX "idx_descansos_estado_fecha" ON "descansos"("estado", "fecha");
