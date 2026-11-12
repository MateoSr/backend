/*
  Warnings:

  - You are about to drop the `Canchas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Complejos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Horarios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Localidades` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PersonaFisicas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PersonaJuridicas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Precios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Provincias` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TipoCanchas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TipoTurnos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TipoUsuarios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Turnos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Canchas" DROP CONSTRAINT "Canchas_complejoId_fkey";

-- DropForeignKey
ALTER TABLE "Canchas" DROP CONSTRAINT "Canchas_tipoCanchaId_fkey";

-- DropForeignKey
ALTER TABLE "Complejos" DROP CONSTRAINT "Complejos_duenoId_fkey";

-- DropForeignKey
ALTER TABLE "Complejos" DROP CONSTRAINT "Complejos_encargadoId_fkey";

-- DropForeignKey
ALTER TABLE "Complejos" DROP CONSTRAINT "Complejos_localidadId_fkey";

-- DropForeignKey
ALTER TABLE "Horarios" DROP CONSTRAINT "Horarios_complejoId_fkey";

-- DropForeignKey
ALTER TABLE "Localidades" DROP CONSTRAINT "Localidades_provinciaId_fkey";

-- DropForeignKey
ALTER TABLE "Precios" DROP CONSTRAINT "Precios_complejoId_canchaNro_fkey";

-- DropForeignKey
ALTER TABLE "Turnos" DROP CONSTRAINT "Turnos_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "Turnos" DROP CONSTRAINT "Turnos_complejoId_canchaNro_fkey";

-- DropForeignKey
ALTER TABLE "Turnos" DROP CONSTRAINT "Turnos_complejoId_fkey";

-- DropForeignKey
ALTER TABLE "Turnos" DROP CONSTRAINT "Turnos_tipoTurnoId_fkey";

-- DropForeignKey
ALTER TABLE "usuario" DROP CONSTRAINT "usuario_personaFisicaDni_fkey";

-- DropForeignKey
ALTER TABLE "usuario" DROP CONSTRAINT "usuario_personaJuridicaCuit_fkey";

-- DropForeignKey
ALTER TABLE "usuario" DROP CONSTRAINT "usuario_tipoUsuarioId_fkey";

-- DropTable
DROP TABLE "Canchas";

-- DropTable
DROP TABLE "Complejos";

-- DropTable
DROP TABLE "Horarios";

-- DropTable
DROP TABLE "Localidades";

-- DropTable
DROP TABLE "PersonaFisicas";

-- DropTable
DROP TABLE "PersonaJuridicas";

-- DropTable
DROP TABLE "Precios";

-- DropTable
DROP TABLE "Provincias";

-- DropTable
DROP TABLE "TipoCanchas";

-- DropTable
DROP TABLE "TipoTurnos";

-- DropTable
DROP TABLE "TipoUsuarios";

-- DropTable
DROP TABLE "Turnos";

-- CreateTable
CREATE TABLE "provincia" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "provincia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "localidad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigoPostal" TEXT NOT NULL,
    "provinciaId" INTEGER NOT NULL,

    CONSTRAINT "localidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personaFisica" (
    "dni" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "fechaNacimiento" DATE NOT NULL,

    CONSTRAINT "personaFisica_pkey" PRIMARY KEY ("dni")
);

-- CreateTable
CREATE TABLE "personaJuridica" (
    "cuit" TEXT NOT NULL,
    "razonSocial" TEXT NOT NULL,

    CONSTRAINT "personaJuridica_pkey" PRIMARY KEY ("cuit")
);

-- CreateTable
CREATE TABLE "tipoUsuario" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "tipoUsuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complejo" (
    "id" SERIAL NOT NULL,
    "direccion" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "localidadId" INTEGER NOT NULL,
    "encargadoId" INTEGER NOT NULL,
    "duenoId" INTEGER NOT NULL,

    CONSTRAINT "complejo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipoCancha" (
    "id" SERIAL NOT NULL,
    "deporte" TEXT NOT NULL,

    CONSTRAINT "tipoCancha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cancha" (
    "nro" INTEGER NOT NULL,
    "complejoId" INTEGER NOT NULL,
    "tipoCanchaId" INTEGER NOT NULL,

    CONSTRAINT "cancha_pkey" PRIMARY KEY ("complejoId","nro")
);

-- CreateTable
CREATE TABLE "horario" (
    "complejoId" INTEGER NOT NULL,
    "nroDia" INTEGER NOT NULL,
    "horaApertura" TIME NOT NULL,
    "horaCierre" TIME NOT NULL,

    CONSTRAINT "horario_pkey" PRIMARY KEY ("complejoId","nroDia")
);

-- CreateTable
CREATE TABLE "precio" (
    "precioBase" DECIMAL(18,2) NOT NULL,
    "precioAdicional" DECIMAL(18,2) NOT NULL,
    "precioSena" DECIMAL(18,2) NOT NULL,
    "fechaDesde" DATE NOT NULL,
    "complejoId" INTEGER NOT NULL,
    "canchaNro" INTEGER NOT NULL,

    CONSTRAINT "precio_pkey" PRIMARY KEY ("complejoId","canchaNro","fechaDesde")
);

-- CreateTable
CREATE TABLE "tipoTurno" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "tipoTurno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turno" (
    "id" SERIAL NOT NULL,
    "horaInicio" TIME NOT NULL,
    "horaFin" TIME NOT NULL,
    "estado" TEXT NOT NULL,
    "motivoCancelacion" TEXT,
    "fecha" DATE NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "tipoTurnoId" INTEGER NOT NULL,
    "complejoId" INTEGER NOT NULL,
    "canchaNro" INTEGER NOT NULL,

    CONSTRAINT "turno_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "complejo_encargadoId_key" ON "complejo"("encargadoId");

-- AddForeignKey
ALTER TABLE "localidad" ADD CONSTRAINT "localidad_provinciaId_fkey" FOREIGN KEY ("provinciaId") REFERENCES "provincia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_tipoUsuarioId_fkey" FOREIGN KEY ("tipoUsuarioId") REFERENCES "tipoUsuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_personaFisicaDni_fkey" FOREIGN KEY ("personaFisicaDni") REFERENCES "personaFisica"("dni") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_personaJuridicaCuit_fkey" FOREIGN KEY ("personaJuridicaCuit") REFERENCES "personaJuridica"("cuit") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complejo" ADD CONSTRAINT "complejo_localidadId_fkey" FOREIGN KEY ("localidadId") REFERENCES "localidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complejo" ADD CONSTRAINT "complejo_encargadoId_fkey" FOREIGN KEY ("encargadoId") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "complejo" ADD CONSTRAINT "complejo_duenoId_fkey" FOREIGN KEY ("duenoId") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cancha" ADD CONSTRAINT "cancha_complejoId_fkey" FOREIGN KEY ("complejoId") REFERENCES "complejo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cancha" ADD CONSTRAINT "cancha_tipoCanchaId_fkey" FOREIGN KEY ("tipoCanchaId") REFERENCES "tipoCancha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horario" ADD CONSTRAINT "horario_complejoId_fkey" FOREIGN KEY ("complejoId") REFERENCES "complejo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "precio" ADD CONSTRAINT "precio_complejoId_canchaNro_fkey" FOREIGN KEY ("complejoId", "canchaNro") REFERENCES "cancha"("complejoId", "nro") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turno" ADD CONSTRAINT "turno_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "turno" ADD CONSTRAINT "turno_tipoTurnoId_fkey" FOREIGN KEY ("tipoTurnoId") REFERENCES "tipoTurno"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "turno" ADD CONSTRAINT "turno_complejoId_fkey" FOREIGN KEY ("complejoId") REFERENCES "complejo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turno" ADD CONSTRAINT "turno_complejoId_canchaNro_fkey" FOREIGN KEY ("complejoId", "canchaNro") REFERENCES "cancha"("complejoId", "nro") ON DELETE NO ACTION ON UPDATE NO ACTION;
