export function spliceToNew<T>(
  arrayLike: Iterable<T>,
  start: number,
  deleteCount: number,
  ...items: T[]
): Array<T> {
  const n = [...arrayLike]
  n.splice(start, deleteCount, ...items)
  return n
}
