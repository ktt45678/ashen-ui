let n = 0;

export function snNextId(prefix: string): string {
  return `${prefix}-${n++}`;
}
