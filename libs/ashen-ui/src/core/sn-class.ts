export type SnClassValue = string | string[] | Record<string, boolean>;

export interface SnClassMap {
  [section: string]: SnClassValue;
}

export type SnClass = string | SnClassMap | SnClassMap[];

export function resolveSnClass(
  value: SnClass | undefined,
  section: string,
  isRoot: boolean,
): string {
  if (value == null) return '';

  if (typeof value === 'string') {
    return isRoot ? value : '';
  }

  const maps: SnClassMap[] = Array.isArray(value) ? value : [value];
  const parts: string[] = [];

  for (const map of maps) {
    const entry = map[section];
    if (entry == null) continue;

    if (typeof entry === 'string') {
      if (entry) parts.push(entry);
    } else if (Array.isArray(entry)) {
      parts.push(...entry.filter(Boolean));
    } else {
      for (const [cls, active] of Object.entries(entry)) {
        if (active && cls) parts.push(cls);
      }
    }
  }

  return parts.join(' ');
}
