import { prisma } from "../shared/prisma.js";
import { type User,type UserUpdate ,userSchema } from "./users.schema.js";
import bcrypt from "bcryptjs";
import {putPersonaFisica} from "../personaFisica/personaFisica.service.js";

export interface UserSalida extends User {
  id: number;

}



// Reemplazamos la interfaz local con el tipo retornado por Prisma o la adaptamos a tus necesidades
//export type UserSalida = Awaited<ReturnType<typeof prisma.usuario.findUniqueOrThrow>>;

async function getUserId(id: number) {
  const user = await prisma.usuario.findUnique({
    where: { id },
    include: {
      tipoUsuario: true 
    }
  });
  return user;
}

// Busca un usuario por su email
async function getUserEmail(email: string) {
  const user = await prisma.usuario.findFirst({
    where: { email },
    include: {
      tipoUsuario: true 
    }
  });
  return user;
}


async function postUser(user: User) {
  // Verificamos si el email ya existe en la DB
  const usuarioExistente = await getUserEmail(user.email);
  if (usuarioExistente) {
    throw new Error("El email ya se encuentra registrado");
  }

  // Validamos con Zod
  const datosValidados = userSchema.parse(user);
  
  const contraSegura = await bcrypt.hash(datosValidados.password, 10);
  // Mapeamos las propiedades al modelo de Prisma (usuario)
  const nuevoUsuario = await prisma.usuario.create({
    data: {
      email: datosValidados.email,
      telefono: datosValidados.telefono ?? null,
      password: contraSegura,
      tipoUsuarioId: (datosValidados as any).tipoUsuarioId ?? (datosValidados as any).tipoUsuarioId,
      personaFisicaDni: (datosValidados as any).personaFisicaDni ?? null,
      personaJuridicaCuit: (datosValidados as any).personaJuridicaCuit ?? null
    },
  });

  return nuevoUsuario;
}

async function getAllUsers() {
  return await prisma.usuario.findMany({include: { tipoUsuario: true }});
  
}

async function putUser(id: number, data: Partial<UserUpdate>) {

  const usuario = await getUserId(id);
  if (!usuario) {
    return null;
  }

  if (usuario.personaFisicaDni && (data.nombre || data.apellido || data.fechaNacimiento)) {
    await putPersonaFisica(usuario.personaFisicaDni, {
      nombre: data.nombre,
      apellido: data.apellido,
      fechaNacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento) : undefined
    });
  }

  // 3. Actualizar los campos propios de Usuario
  const usuarioActualizado = await prisma.usuario.update({
    where: { id: id },
    data: {
      ...(data.email && { email: data.email }),
      ...(data.telefono && { telefono: data.telefono })
    }
  });
    return usuarioActualizado;
  }

async function patchUserPassword(id: number, password: string): Promise<boolean> {
  const passwordSegura = await bcrypt.hash(password, 10);

  try {
    await prisma.usuario.update({
      where: { id },
      data: { password: passwordSegura },
    });
    return true;
  } catch (error) {
    return false;
  }
}

async function deleteUser(id: number): Promise<boolean> {
  try {
    await prisma.usuario.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
}

export {
  getUserId,
  postUser,
  getAllUsers,
  putUser,
  deleteUser,
  getUserEmail,
  patchUserPassword,
};