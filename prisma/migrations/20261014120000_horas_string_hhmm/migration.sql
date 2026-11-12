-- Convierte las horas de tipo TIME a VARCHAR(5) en formato HH:mm, sin fecha.

ALTER TABLE "horario" ALTER COLUMN "horaApertura" TYPE VARCHAR(5) USING to_char("horaApertura", 'HH24:MI');
ALTER TABLE "horario" ALTER COLUMN "horaCierre"   TYPE VARCHAR(5) USING to_char("horaCierre",   'HH24:MI');
ALTER TABLE "turno"   ALTER COLUMN "horaInicio"   TYPE VARCHAR(5) USING to_char("horaInicio",   'HH24:MI');
ALTER TABLE "turno"   ALTER COLUMN "horaFin"      TYPE VARCHAR(5) USING to_char("horaFin",      'HH24:MI');
