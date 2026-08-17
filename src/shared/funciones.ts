export function proximoId<T extends { id: number }>(array: T[]): number {
  if (!array || array.length === 0) return 1;

  const ultimo = array.at(-1);
  return ultimo ? ultimo.id + 1 : 1;
}