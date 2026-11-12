-- CreateTable
CREATE TABLE "ordenPago" (
    "id" SERIAL NOT NULL,
    "mpOrderId" TEXT,
    "externalReference" TEXT NOT NULL,
    "clienteId" INTEGER,
    "complejoId" INTEGER NOT NULL,
    "canchaNro" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMPTZ(6) NOT NULL,
    "fechaFin" TIMESTAMPTZ(6) NOT NULL,
    "monto" DECIMAL(18,2) NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "motivoRechazo" TEXT,
    "turnoId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ordenPago_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ordenPago_mpOrderId_key" ON "ordenPago"("mpOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "ordenPago_externalReference_key" ON "ordenPago"("externalReference");

-- CreateIndex
CREATE UNIQUE INDEX "ordenPago_turnoId_key" ON "ordenPago"("turnoId");

-- CreateIndex
CREATE INDEX "ordenPago_complejoId_canchaNro_fechaInicio_fechaFin_idx" ON "ordenPago"("complejoId", "canchaNro", "fechaInicio", "fechaFin");

-- AddForeignKey
ALTER TABLE "ordenPago" ADD CONSTRAINT "ordenPago_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenPago" ADD CONSTRAINT "ordenPago_complejoId_fkey" FOREIGN KEY ("complejoId") REFERENCES "complejo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenPago" ADD CONSTRAINT "ordenPago_complejoId_canchaNro_fkey" FOREIGN KEY ("complejoId", "canchaNro") REFERENCES "cancha"("complejoId", "nro") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenPago" ADD CONSTRAINT "ordenPago_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "turno"("id") ON DELETE SET NULL ON UPDATE CASCADE;
