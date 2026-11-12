/*
  Warnings:

  - Added the required column `telefono` to the `complejo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cancha" ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'Activo';

-- AlterTable
ALTER TABLE "complejo" ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "telefono" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tipoCancha" ALTER COLUMN "duracion" DROP DEFAULT;
