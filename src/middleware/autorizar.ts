export interface RequestAutenticado extends Request {
  usuario?: {
    id: number;
    email: string;
    rol: string; // 👈 Ej: "Administrador", "Dueño", "Cliente"
  };
}


export function autorizarPorNombre(...rolesPermitidos: string[]) {
  return (req: RequestAutenticado, res: Response, next: NextFunction) => {
    if (!req.usuario) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const tienePermiso = req.usuario.rol && rolesPermitidos.includes(req.usuario.rol);

    if (!tienePermiso) {
      return res.status(403).json({
        message: "Acceso denegado: Rol no autorizado"
      });
    }

    next();
  };
}