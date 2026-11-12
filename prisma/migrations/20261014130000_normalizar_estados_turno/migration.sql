-- Normaliza los valores de estado de los turnos existentes a la nomenclatura
-- unificada: Reservado, En curso, Finalizado, Cancelado.

UPDATE "turno" SET estado = 'Reservado'  WHERE UPPER(estado) = 'RESERVADO';
UPDATE "turno" SET estado = 'En curso'   WHERE UPPER(estado) = 'EN CURSO';
UPDATE "turno" SET estado = 'Cancelado'  WHERE UPPER(estado) = 'CANCELADO';
UPDATE "turno" SET estado = 'Finalizado' WHERE UPPER(estado) IN ('FINALIZADO', 'COMPLETADO');
