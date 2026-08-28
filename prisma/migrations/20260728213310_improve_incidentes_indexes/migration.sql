-- CreateIndex
CREATE INDEX "idx_incidentes_turno" ON "incidentes"("turno_id");

-- CreateIndex
CREATE INDEX "idx_incidentes_nivel" ON "incidentes"("nivel");

-- CreateIndex
CREATE INDEX "idx_incidentes_tipo" ON "incidentes"("tipo");

-- CreateIndex
CREATE INDEX "incidentes_created_at_idx" ON "incidentes"("created_at");
