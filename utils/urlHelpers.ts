export function parseListFromUrl(param?: string): number[] {
  if (!param) return [];

  const uniqueIds = new Set<number>();

  param.split(',').forEach((id) => {
    const value = Number(id);
    if (!Number.isFinite(value) || value <= 0) return; // ignore non-positive or non-numeric entries
    if (uniqueIds.has(value)) return; // skip duplicates to keep stable order
    uniqueIds.add(value);
  });

  return Array.from(uniqueIds);
}

export function serializeListToUrl(list: number[]): string {
  return encodeURIComponent(list.join(','));
}
