export function proximoId(array) {
  if (!array || array.length === 0) return 1; 

  const ultimo = array.at(-1); 
  return ultimo.id + 1;
}