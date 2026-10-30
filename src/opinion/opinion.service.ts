import { prisma } from "../shared/prisma.js";

export async function postOpinion(id_complejo: number, descripcion: string) {
  const complejo = await prisma.complejo.findUnique({
    where: { id: id_complejo },
    select: { id: true },
  });

  if (!complejo) return null;

  return prisma.opinion.create({
    data: { descripcion, id_complejo },
  });
}
