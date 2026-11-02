export function classList(...inputs: Array<string | string[] | Record<string, boolean> | null | undefined>): string {
  const parts: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string') {
      if (input) parts.push(input);
    } else if (Array.isArray(input)) {
      parts.push(...input.filter(Boolean));
    } else {
      for (const [cls, active] of Object.entries(input)) {
        if (active && cls) parts.push(cls);
      }
    }
  }

  return parts.join(' ');
}
