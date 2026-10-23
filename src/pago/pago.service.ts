import crypto from "crypto";
import { prisma } from "../shared/prisma.js";
import { enviarEmailComprobanteReserva } from "../email/email.service.js";

const MP_API_BASE = "https://api.mercadopago.com";

function getAccessToken() {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) throw new Error("Falta MP_ACCESS_TOKEN en .env");
  return token;
}

function getWebhookSecret() {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) throw new Error("Falta MP_WEBHOOK_SECRET en .env");
  return secret;
}

function getFrontendPublicUrl() {
  const url = process.env.FRONTEND_PUBLIC_URL || "http://localhost:5173";
  return url.replace(/\/$/, "");
}

function validarFirmaWebhook(xSignature: string | undefined, xRequestId: string | undefined, dataId: string | undefined) {
  if (!xSignature || !xRequestId || !dataId) throw new Error("Headers de webhook incompletos");

  const secret = getWebhookSecret();
  const parts = xSignature.split(",");
  let ts = "";
  let v1 = "";
  for (const part of parts) {
    const [key, value] = part.trim().split("=");
    if (key === "ts") ts = value;
    if (key === "v1") v1 = value;
  }
  if (!ts || !v1) throw new Error("x-signature inválido");

  const manifest = `id:${dataId.toLowerCase()};request-id:${xRequestId};ts:${ts};`;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(manifest);
  const expected = hmac.digest("hex");
  
  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(v1, "utf8");
  if (
    expectedBuffer.length !== receivedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  ) {
    throw new Error("Firma de webhook inválida");
  }
}

async function haySolapamiento(
  complejoId: number,
  canchaNro: number,
  fechaInicio: Date,
  fechaFin: Date,
  excluirTurnoId?: number,
  excluirOrdenId?: number,
) {
  const turnoActivo = await prisma.turno.findFirst({
    where: {
      complejoId,
      canchaNro,
      estado: { notIn: ["Cancelado", "Cancelada"] },
      ...(excluirTurnoId ? { id: { not: excluirTurnoId } } : {}),
      AND: [{ fechaInicio: { lt: fechaFin } }, { fechaFin: { gt: fechaInicio } }],
    },
  });
  if (turnoActivo) return true;

  const ordenActiva = await prisma.ordenPago.findFirst({
    where: {
      complejoId,
      canchaNro,
      estado: "pendiente",
      ...(excluirOrdenId ? { id: { not: excluirOrdenId } } : {}),
      AND: [{ fechaInicio: { lt: fechaFin } }, { fechaFin: { gt: fechaInicio } }],
    },
  });
  return !!ordenActiva;
}

async function obtenerPrecioSeniaVigente(complejoId: number, canchaNro: number, fecha: Date) {
  const precio = await prisma.precio.findFirst({
    where: {
      complejoId,
      canchaNro,
      fechaDesde: { lte: fecha },
    },
    orderBy: { fechaDesde: "desc" },
  });
  if (!precio) throw new Error("No hay precio configurado para esta cancha");
  return Number(precio.precioSena);
}

export async function crearOrdenPago(payload: any, clienteId: number) {
  const { complejoId, canchaNro, fecha, horaInicio, duracion, tipoTurnoId } = payload;

  if (!complejoId || !canchaNro || !fecha || !horaInicio) throw new Error("Faltan datos para crear la orden");

  const duracionMin = Number(duracion || 60);
  const [h, m] = horaInicio.split(":").map(Number);
  const fechaBase = new Date(`${fecha}T00:00:00`);
  const inicio = new Date(fechaBase);
  inicio.setHours(h, m, 0, 0);
  const fin = new Date(inicio);
  fin.setMinutes(fin.getMinutes() + duracionMin);

  const ahora = new Date();
  if (inicio < ahora) throw new Error("No se pueden crear turnos para fechas u horarios pasados");

  const solapado = await haySolapamiento(Number(complejoId), Number(canchaNro), inicio, fin);
  if (solapado) throw new Error("Ese horario ya está reservado");

  const montoSenia = await obtenerPrecioSeniaVigente(Number(complejoId), Number(canchaNro), inicio);
  const externalReference = `ORDPAGO-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const turnoPendiente = await prisma.turno.create({
    data: {
      clienteId,
      tipoTurnoId: 1,
      complejoId: Number(complejoId),
      canchaNro: Number(canchaNro),
      fechaInicio: inicio,
      fechaFin: fin,
      estado: "Pendiente de pago",
    },
  });

  const orden = await prisma.ordenPago.create({
    data: {
      externalReference,
      clienteId,
      complejoId: Number(complejoId),
      canchaNro: Number(canchaNro),
      fechaInicio: inicio,
      fechaFin: fin,
      monto: montoSenia,
      estado: "pendiente",
      turnoId: turnoPendiente.id,
    },
  });

  const cliente = await prisma.usuario.findUnique({
    where: { id: clienteId },
    select: { email: true },
  });

  const resultadoUrl = `${getFrontendPublicUrl()}/pago/resultado?external_reference=${encodeURIComponent(externalReference)}`;

  const body = {
    type: "online",
    processing_mode: "manual",
    total_amount: montoSenia.toFixed(2),
    external_reference: externalReference,
    payer: { email: cliente?.email },
    items: [
      {
        title: `Seña reserva cancha ${canchaNro} - Complejo ${complejoId}`,
        quantity: 1,
        unit_price: montoSenia.toFixed(2),
      },
    ],
    config: {
      online: {
        success_url: resultadoUrl,
        failure_url: resultadoUrl,
        pending_url: resultadoUrl,
        auto_return: "all",
      },
    },
  };

  console.log("=== MP ORDER BODY ===");
  console.log(JSON.stringify(body));
  const res = await fetch(`${MP_API_BASE}/v1/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": externalReference,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("=== MP crear orden error STATUS ===", res.status);
    console.error("=== MP crear orden error BODY ===", err);
    await prisma.ordenPago.update({ where: { id: orden.id }, data: { estado: "cancelada", motivoRechazo: err.slice(0, 500) } });
    throw new Error("Error al crear la orden en Mercado Pago");
  }

  const mpOrder = await res.json();
  await prisma.ordenPago.update({
    where: { id: orden.id },
    data: { mpOrderId: mpOrder.id },
  });

  const checkoutUrl = mpOrder.checkout_url || mpOrder.checkout?.redirect_url || mpOrder.init_point;
  if (!checkoutUrl) throw new Error("No se obtuvo la URL de pago");

  return { checkoutUrl, externalReference, ordenId: orden.id };
}

async function reembolsarOrdenMp(mpOrderId: string) {
  try {
    const res = await fetch(`${MP_API_BASE}/v1/orders/${mpOrderId}/refund`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "application/json",
      },
    });
    return res.ok;
  } catch (e) {
    console.error("Error al reembolsar orden MP:", e);
    return false;
  }
}

export async function procesarWebhook(req: any) {
  console.log("=== MP WEBHOOK RECEIVED ===", {
    headers: req.headers,
    query: req.query,
    body: req.body,
  });

  const xSignature = req.headers["x-signature"] as string | undefined;
  const xRequestId = req.headers["x-request-id"] as string | undefined;
  const dataId = (req.query["data.id"] as string) || (req.body?.data?.id as string);

  console.log("=== WEBHOOK PARSED ===", { xSignature, xRequestId, dataId });

  try {
    validarFirmaWebhook(xSignature, xRequestId, dataId);
  } catch (e) {
    console.error("=== WEBHOOK SIGNATURE ERROR ===", e instanceof Error ? e.message : String(e));
    throw e;
  }

  const res = await fetch(`${MP_API_BASE}/v1/orders/${dataId}`, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  if (!res.ok) throw new Error("No se pudo consultar la orden en Mercado Pago");
  const mpOrder = await res.json();

  const externalReference = mpOrder.external_reference;
  if (!externalReference) throw new Error("Orden sin external_reference");

  const orden = await prisma.ordenPago.findUnique({ where: { externalReference } });
  if (!orden) throw new Error("Orden no encontrada");
  if (orden.estado !== "pendiente") return { status: orden.estado };

  const status = (mpOrder.status || "").toLowerCase();
  const statusDetail = (mpOrder.status_detail || "").toLowerCase();

  if (status === "processed" || statusDetail === "accredited") {
    const solapado = await haySolapamiento(
      orden.complejoId,
      orden.canchaNro,
      orden.fechaInicio,
      orden.fechaFin,
      orden.turnoId ?? undefined,
      orden.id,
    );
    if (solapado) {
      if (orden.turnoId) {
        await prisma.turno.delete({ where: { id: orden.turnoId } }).catch(() => {});
      }
      await prisma.ordenPago.update({
        where: { id: orden.id },
        data: { estado: "reembolsada", motivoRechazo: "Horario ocupado al momento de la acreditación" },
      });
      if (orden.mpOrderId) await reembolsarOrdenMp(orden.mpOrderId);
      return { status: "reembolsada" };
    }

    if (orden.turnoId) {
      await prisma.turno.update({
        where: { id: orden.turnoId },
        data: { estado: "Reservado" },
      });
    }

    await prisma.ordenPago.update({
      where: { id: orden.id },
      data: { estado: "aprobada" },
    });

    try {
      if (orden.turnoId) {
        const turnoCompleto = await prisma.turno.findUnique({
          where: { id: orden.turnoId },
          include: {
            cliente: { include: { personaFisica: true, personaJuridica: true } },
            complejo: true,
            cancha: { include: { tipoCancha: true } },
          },
        });
        if (turnoCompleto) {
          void enviarEmailComprobanteReserva(turnoCompleto).catch((err) => console.error("Error enviando comprobante:", err));
        }
      }
    } catch (e) {
      console.error("Error preparando comprobante:", e);
    }

    return { status: "aprobada", turnoId: orden.turnoId };
  }

  if (status === "canceled" || status === "cancelled" || statusDetail.includes("cancel")) {
    if (orden.turnoId) await prisma.turno.delete({ where: { id: orden.turnoId } }).catch(() => {});
    await prisma.ordenPago.update({ where: { id: orden.id }, data: { estado: "cancelada" } });
    return { status: "cancelada" };
  }

  if (status === "expired") {
    if (orden.turnoId) await prisma.turno.delete({ where: { id: orden.turnoId } }).catch(() => {});
    await prisma.ordenPago.update({ where: { id: orden.id }, data: { estado: "expirada" } });
    return { status: "expirada" };
  }

  if (status === "failed") {
    if (orden.turnoId) await prisma.turno.delete({ where: { id: orden.turnoId } }).catch(() => {});
    await prisma.ordenPago.update({ where: { id: orden.id }, data: { estado: "rechazada", motivoRechazo: statusDetail } });
    return { status: "rechazada" };
  }

  return { status };
}

export async function obtenerEstadoOrden(externalReference: string, clienteId: number) {
  const orden = await prisma.ordenPago.findUnique({ where: { externalReference } });
  if (!orden) throw new Error("Orden no encontrada");
  if (orden.clienteId !== clienteId) throw new Error("No autorizado");
  return {
    estado: orden.estado,
    monto: Number(orden.monto),
    turnoId: orden.turnoId,
    motivoRechazo: orden.motivoRechazo,
  };
}
