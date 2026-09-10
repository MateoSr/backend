import { prisma } from "../shared/prisma.js";
import { type User, userSchema } from "./users.schema.js";
import bcrypt from "bcryptjs";

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
  return await prisma.usuario.findMany()
  
}

async function putUser(id: number, userNuevo: Partial<User>) {
  const datosValidados = userSchema.partial().parse(userNuevo);

  // Si envían una contraseña nueva, la hasheamos
  if (datosValidados.password) {
    datosValidados.password = await bcrypt.hash(datosValidados.password, 10);
  }

  // Mapeamos los campos a actualizar
  const updateData: Record<string, any> = { ...datosValidados };

  if ((datosValidados as any).id_tipoUsuario) {
    updateData.idTipoUsuario = (datosValidados as any).id_tipoUsuario;
    delete updateData.id_tipoUsuario;
  }

  try {
    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: updateData,
    });
    return usuarioActualizado;
  } catch (error) {
    // Si el ID no existe, Prisma lanza una excepción
    return null;
  }
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