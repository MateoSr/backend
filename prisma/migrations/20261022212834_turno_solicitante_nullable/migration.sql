-- AlterTable
ALTER TABLE "turno" ADD COLUMN     "apellidoSolicitante" TEXT,
ADD COLUMN     "nombreSolicitante" TEXT,
ALTER COLUMN "clienteId" DROP NOT NULL;
