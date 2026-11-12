-- CreateTable
CREATE TABLE "opinion" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_complejo" INTEGER NOT NULL,

    CONSTRAINT "opinion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "opinion" ADD CONSTRAINT "opinion_id_complejo_fkey" FOREIGN KEY ("id_complejo") REFERENCES "complejo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
