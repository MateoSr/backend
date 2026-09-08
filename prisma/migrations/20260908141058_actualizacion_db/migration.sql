/*
  Warnings:

  - You are about to drop the `Usuarios` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Complejos" DROP CONSTRAINT "Complejos_duenoId_fkey";

-- DropForeignKey
ALTER TABLE "Complejos" DROP CONSTRAINT "Complejos_encargadoId_fkey";

-- DropForeignKey
ALTER TABLE "Turnos" DROP CONSTRAINT "Turnos_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "Usuarios" DROP CONSTRAINT "Usuarios_personaFisicaDni_fkey";

-- DropForeignKey
ALTER TABLE "Usuarios" DROP CONSTRAINT "Usuarios_personaJuridicaCuit_fkey";

-- DropForeignKey
ALTER TABLE "Usuarios" DROP CONSTRAINT "Usuarios_tipoUsuarioId_fkey";

-- DropTable
DROP TABLE "Usuarios";

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tipoUsuarioId" INTEGER NOT NULL,
    "personaFisicaDni" TEXT,
    "personaJuridicaCuit" TEXT,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_tipoUsuarioId_fkey" FOREIGN KEY ("tipoUsuarioId") REFERENCES "TipoUsuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_personaFisicaDni_fkey" FOREIGN KEY ("personaFisicaDni") REFERENCES "PersonaFisicas"("dni") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_personaJuridicaCuit_fkey" FOREIGN KEY ("personaJuridicaCuit") REFERENCES "PersonaJuridicas"("cuit") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complejos" ADD CONSTRAINT "Complejos_encargadoId_fkey" FOREIGN KEY ("encargadoId") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Complejos" ADD CONSTRAINT "Complejos_duenoId_fkey" FOREIGN KEY ("duenoId") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Turnos" ADD CONSTRAINT "Turnos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
