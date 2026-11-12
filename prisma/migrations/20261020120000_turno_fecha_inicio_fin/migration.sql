-- Migración: pasar Turno de fecha + horaInicio/horaFin a fechaInicio/fechaFin en UTC
-- Asume horas almacenadas como hora local Argentina (UTC-3) y fecha como fecha local

-- Agregar columnas nuevas
ALTER TABLE "turno" ADD COLUMN "fechaInicio" TIMESTAMPTZ;
ALTER TABLE "turno" ADD COLUMN "fechaFin" TIMESTAMPTZ;

-- Backfill: convertir fecha + hora (Argentina UTC-3) a UTC
UPDATE "turno"
SET 
  "fechaInicio" = ( ( ("fecha"::date) + ("horaInicio" || ':00')::interval ) AT TIME ZONE 'America/Argentina/Buenos_Aires' ) AT TIME ZONE 'UTC',
  "fechaFin"    = ( ( ("fecha"::date) + ("horaFin"    || ':00')::interval ) AT TIME ZONE 'America/Argentina/Buenos_Aires' ) AT TIME ZONE 'UTC';

-- Asegurar no nulos
ALTER TABLE "turno" ALTER COLUMN "fechaInicio" SET NOT NULL;
ALTER TABLE "turno" ALTER COLUMN "fechaFin" SET NOT NULL;

-- Eliminar columnas antiguas
ALTER TABLE "turno" DROP COLUMN "fecha";
ALTER TABLE "turno" DROP COLUMN "horaInicio";
ALTER TABLE "turno" DROP COLUMN "horaFin";
