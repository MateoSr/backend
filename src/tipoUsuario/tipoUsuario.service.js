const tiposUsuario = [
  {"id" : 0, "descripcion" : "Admin"},
  {"id" : 1, "descripcion" : "Cliente"},
  {"id" : 2, "descripcion" : "Dueño"},
  {"id" : 3, "descripcion" : "Encargado"},
]

async function getTiposUsuario(){
  return tiposUsuario || null
};

async function getTipoUsuario(id){
    const tipoUsuario = tiposUsuario.find(tipoUsuario => tiposUsuario.id === Number(id))
    return tipoUsuario || null
}

export {
    getTiposUsuario,
    getTipoUsuario
}