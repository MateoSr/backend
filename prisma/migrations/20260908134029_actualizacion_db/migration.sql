-- CreateTable
CREATE TABLE "Provincias" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Provincias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Localidades" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigoPostal" TEXT NOT NULL,
    "provinciaId" INTEGER NOT NULL,

    CONSTRAINT "Localidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonaFisicas" (
    "dni" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "fechaNacimiento" DATE NOT NULL,

    CONSTRAINT "PersonaFisicas_pkey" PRIMARY KEY ("dni")
);

-- CreateTable
CREATE TABLE "PersonaJuridicas" (
    "cuit" TEXT NOT NULL,
    "razonSocial" TEXT NOT NULL,

    CONSTRAINT "PersonaJuridicas_pkey" PRIMARY KEY ("cuit")
);

-- CreateTable
CREATE TABLE "TipoUsuarios" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "TipoUsuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuarios" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tipoUsuarioId" INTEGER NOT NULL,
    "personaFisicaDni" TEXT,
    "personaJuridicaCuit" TEXT,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Complejos" (
    "id" SERIAL NOT NULL,
    "direccion" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "localidadId" INTEGER NOT NULL,
    "encargadoId" INTEGER NOT NULL,
    "duenoId" INTEGER NOT NULL,

    CONSTRAINT "Complejos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoCanchas" (
    "id" SERIAL NOT NULL,
    "deporte" TEXT NOT NULL,

    CONSTRAINT "TipoCanchas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Canchas" (
    "nro" INTEGER NOT NULL,
    "complejoId" INTEGER NOT NULL,
    "tipoCanchaId" INTEGER NOT NULL,

    CONSTRAINT "Canchas_pkey" PRIMARY KEY ("complejoId","nro")
);

-- CreateTable
CREATE TABLE "Horarios" (
    "complejoId" INTEGER NOT NULL,
    "nroDia" INTEGER NOT NULL,
    "horaApertura" TIME NOT NULL,
    "horaCierre" TIME NOT NULL,

    CONSTRAINT "Horarios_pkey" PRIMARY KEY ("complejoId","nroDia")
);

-- CreateTable
CREATE TABLE "Precios" (
    "precioBase" DECIMAL(18,2) NOT NULL,
    "precioAdicional" DECIMAL(18,2) NOT NULL,
    "precioSena" DECIMAL(18,2) NOT NULL,
    "fechaDesde" DATE NOT NULL,
    "complejoId" INTEGER NOT NULL,
    "canchaNro" INTEGER NOT NULL,

    CONSTRAINT "Precios_pkey" PRIMARY KEY ("complejoId","canchaNro","fechaDesde")
);

-- CreateTable
CREATE TABLE "TipoTurnos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "TipoTurnos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Turnos" (
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

    CONSTRAINT "Turnos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "Usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Complejos_encargadoId_key" ON "Complejos"("encargadoId");

-- AddForeignKey
ALTER TABLE "Localidades" ADD CONSTRAINT "Localidades_provinciaId_fkey" FOREIGN KEY ("provinciaId") REFERENCES "Provincias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_tipoUsuarioId_fkey" FOREIGN KEY ("tipoUsuarioId") REFERENCES "TipoUsuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_personaFisicaDni_fkey" FOREIGN KEY ("personaFisicaDni") REFERENCES "PersonaFisicas"("dni") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_personaJuridicaCuit_fkey" FOREIGN KEY ("personaJuridicaCuit") REFERENCES "PersonaJuridicas"("cuit") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complejos" ADD CONSTRAINT "Complejos_localidadId_fkey" FOREIGN KEY ("localidadId") REFERENCES "Localidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complejos" ADD CONSTRAINT "Complejos_encargadoId_fkey" FOREIGN KEY ("encargadoId") REFERENCES "Usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Complejos" ADD CONSTRAINT "Complejos_duenoId_fkey" FOREIGN KEY ("duenoId") REFERENCES "Usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Canchas" ADD CONSTRAINT "Canchas_complejoId_fkey" FOREIGN KEY ("complejoId") REFERENCES "Complejos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Canchas" ADD CONSTRAINT "Canchas_tipoCanchaId_fkey" FOREIGN KEY ("tipoCanchaId") REFERENCES "TipoCanchas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Horarios" ADD CONSTRAINT "Horarios_complejoId_fkey" FOREIGN KEY ("complejoId") REFERENCES "Complejos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Precios" ADD CONSTRAINT "Precios_complejoId_canchaNro_fkey" FOREIGN KEY ("complejoId", "canchaNro") REFERENCES "Canchas"("complejoId", "nro") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turnos" ADD CONSTRAINT "Turnos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Turnos" ADD CONSTRAINT "Turnos_tipoTurnoId_fkey" FOREIGN KEY ("tipoTurnoId") REFERENCES "TipoTurnos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Turnos" ADD CONSTRAINT "Turnos_complejoId_fkey" FOREIGN KEY ("complejoId") REFERENCES "Complejos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turnos" ADD CONSTRAINT "Turnos_complejoId_canchaNro_fkey" FOREIGN KEY ("complejoId", "canchaNro") REFERENCES "Canchas"("complejoId", "nro") ON DELETE NO ACTION ON UPDATE NO ACTION;
