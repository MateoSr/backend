import { type Precio } from "./precio.schema.js";
import { prisma } from "../shared/prisma.js";

async function getPrecio(complejoId: number, canchaNro: number, fechaDesde: string | Date): Promise<Precio | null> {
  const precio = await prisma.precio.findUnique({
    where: {
      complejoId_canchaNro_fechaDesde: {
        complejoId,
        canchaNro,
        fechaDesde: typeof fechaDesde === "string" ? new Date(fechaDesde) : fechaDesde,
      },
    },
  });

  if (!precio) return null;

  return {
    id_complejo: precio.complejoId,
    nro_cancha: precio.canchaNro,
    fecha: precio.fechaDesde,
    precioBase: precio.precioBase.toNumber(),
    precioAdicional: precio.precioAdicional.toNumber(),
    precioSena: precio.precioSena.toNumber(),
  };
}
async function postPrecio(precio: Precio): Promise<Precio> {
  const nuevoPrecio = await prisma.precio.create({
    data: {
      complejoId: precio.id_complejo,
      canchaNro: precio.nro_cancha,
      fechaDesde:
        typeof precio.fecha === "string"
          ? new Date(precio.fecha)
          : precio.fecha,
      precioBase: precio.precioBase,
      precioAdicional: precio.precioAdicional,
      precioSena: precio.precioSena,
    },
  });

  // 3. Mapeamos la respuesta al tipo Precio
  return {
    precioBase: nuevoPrecio.precioBase.toNumber(),
    precioAdicional: nuevoPrecio.precioAdicional.toNumber(),
    precioSena: nuevoPrecio.precioSena.toNumber(),
    id_complejo: nuevoPrecio.complejoId,
    nro_cancha: nuevoPrecio.canchaNro,
    fecha: nuevoPrecio.fechaDesde,
  };
}

async function getAllPrecios(
  complejoId: number,
  canchaNro: number
): Promise<Precio[] | null> {
  const precios = await prisma.precio.findMany({
    where: {
      complejoId,
      canchaNro,
    },
  });

  if (!precios || precios.length === 0) return null;
  return precios.map((p) => ({
    precioBase: p.precioBase.toNumber(),
    precioAdicional: p.precioAdicional.toNumber(),
    precioSena: p.precioSena.toNumber(),
    id_complejo: p.complejoId,
    nro_cancha: p.canchaNro,
    fecha: p.fechaDesde,
  }));
}

export {
    getPrecio,
    postPrecio,
    getAllPrecios
}