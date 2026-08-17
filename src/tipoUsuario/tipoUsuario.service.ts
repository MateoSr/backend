export interface TipoUsuario {
  id: number;
  descripcion: string;
}

const tiposUsuario: TipoUsuario[] = [
  {"id" : 0, "descripcion" : "Admin"},
  {"id" : 1, "descripcion" : "Cliente"},
  {"id" : 2, "descripcion" : "Dueño"},
  {"id" : 3, "descripcion" : "Encargado"},
]

async function getTiposUsuario(): Promise<TipoUsuario[]> {
  return tiposUsuario
};

async function getTipoUsuario(id: number): Promise<TipoUsuario | null> {
    const tipoUsuario= tiposUsuario.find(t => t.id === id)
    return tipoUsuario || null
}

export {
    getTiposUsuario,
    getTipoUsuario
}