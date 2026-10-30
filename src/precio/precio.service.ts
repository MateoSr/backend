import { type Precio,precioSchema } from "./precio.schema.js";
import { prisma } from "../shared/prisma.js";

// const precios: Precio[] = [
//   {
//     "id_complejo": 1,
//     "nro_cancha": 1,
//     "fechaDesde": "2023-01-01",
//     "precioBase": 5000,
//     "precioAdicional": 250,
//     "precioSeña": 1000
//   },
//   {
//     "id_complejo": 1,
//     "nro_cancha": 2,
//     "fechaDesde": "2023-01-01",
//     "precioBase": 6000,
//     "precioAdicional": 300,
//     "precioSeña": 1200
//   },
//   {
//     "id_complejo": 2,
//     "nro_cancha": 1,
//     "fechaDesde": "2023-01-01",
//     "precioBase": 7000,
//     "precioAdicional": 350,
//     "precioSeña": 1400
//   }
// ]

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
  const datosValidados = precioSchema.parse(precio);
  const nuevoPrecio = await prisma.precio.create({
    data: {
      complejoId: datosValidados.id_complejo,
      canchaNro: datosValidados.nro_cancha,
      fechaDesde:
        typeof datosValidados.fecha === "string"
          ? new Date(datosValidados.fecha)
          : datosValidados.fecha,
      precioBase: datosValidados.precioBase,
      precioAdicional: datosValidados.precioAdicional,
      precioSena: datosValidados.precioSena,
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