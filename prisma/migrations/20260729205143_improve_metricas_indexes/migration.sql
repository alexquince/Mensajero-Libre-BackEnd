-- CreateIndex
CREATE INDEX "idx_metricas_score" ON "metricas_mensajero"("score");

-- CreateIndex
CREATE INDEX "idx_metricas_cumplimiento" ON "metricas_mensajero"("tasa_cumplimiento");

-- CreateIndex
CREATE INDEX "idx_metricas_semana" ON "metricas_mensajero"("semana_inicio");

-- CreateIndex
CREATE INDEX "idx_metricas_ranking" ON "metricas_mensajero"("score", "tasa_cumplimiento");
