// Reads the token layout out of the installed package's own stylesheets, so it
// can never disagree with the version an app has: no generated metadata, no
// second copy to keep in step.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface TokenLayout {
  /** Declared in styles/tokens, or on :root anywhere. A theme block reaches these. */
  readonly inherited: ReadonlySet<string>;
  /** Declared on a component element -> the selectors that declare it. */
  readonly owned: ReadonlyMap<string, readonly string[]>;
  /** Every token the library defines or names in a var() fallback. */
  readonly known: ReadonlySet<string>;
  /** Tokens the shipped dark theme overrides: the light/dark contract. */
  readonly contract: ReadonlyMap<string, string>;
}

export interface Declaration {
  readonly token: string;
  readonly value: string;
  readonly line: number;
  readonly selector: string;
}

const strip = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, '');

/**
 * Every rule, by brace matching.
 *
 * A flat regex cannot do this: the token files nest blocks inside `@media`, and
 * `\{([^{}]*)\}` silently truncates at the first inner brace.
 */
/**
 * The selector text before a `{`, normalised to one line.
 *
 * Taking only its last line truncates a grouped selector written across
 * several, which is how `.sn-paginator, .sn-paginator-jump-panel,
 * .sn-paginator-rows-panel` came back as only the third of the three.
 */
function selectorBefore(css: string, brace: number): string {
  const start = Math.max(css.lastIndexOf('}', brace - 1), css.lastIndexOf('{', brace - 1)) + 1;
  const text = css.slice(start, brace);
  return text.slice(text.lastIndexOf(';') + 1).split(/\s+/).join(' ').trim();
}

export function rules(css: string): Array<{ selector: string; body: string }> {
  const out: Array<{ selector: string; body: string }> = [];
  for (let i = 0; i < css.length; i++) {
    if (css[i] !== '{') continue;
    const selector = selectorBefore(css, i);
    let depth = 1;
    let j = i + 1;
    for (; j < css.length && depth > 0; j++) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}') depth--;
    }
    out.push({ selector, body: css.slice(i + 1, j - 1) });
  }
  return out;
}

function cssFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith('.css') && !name.startsWith('_'))
    .map((name) => readFileSync(join(dir, name), 'utf-8'));
}

export function readTokenLayout(stylesDir: string): TokenLayout {
  const tokenFiles = cssFiles(join(stylesDir, 'tokens'));
  const componentFiles = cssFiles(join(stylesDir, 'components'));

  const inherited = new Set<string>();
  const owned = new Map<string, string[]>();
  const known = new Set<string>();
  const contract = new Map<string, string>();

  const note = (css: string): void => {
    for (const [, token] of strip(css).matchAll(/(--sn-[\w-]+)\s*:/g)) known.add(token);
    for (const [, token] of strip(css).matchAll(/var\(\s*(--sn-[\w-]+)\s*[,)]/g)) known.add(token);
  };

  for (const css of tokenFiles) {
    note(css);
    for (const [, token] of strip(css).matchAll(/(--sn-[\w-]+)\s*:/g)) inherited.add(token);
    for (const { selector, body } of rules(strip(css))) {
      if (!/\[data-theme[|~^$*]?=['"]?dark['"]?\]/.test(selector)) continue;
      for (const [, token, value] of body.matchAll(/(--sn-[\w-]+)\s*:\s*([^;]+);/g)) {
        if (!contract.has(token)) contract.set(token, value.trim());
      }
    }
  }

  // A component file declaring on :root is deliberate: those tokens are meant to
  // be themeable, because the component's own element would shadow them.
  for (const css of componentFiles) {
    note(css);
    for (const { selector, body } of rules(strip(css))) {
      if (selector.startsWith('@') || selector.includes('{')) continue;
      const tokens = [...body.matchAll(/(--sn-[\w-]+)\s*:/g)].map((match) => match[1]);
      if (!tokens.length) continue;
      for (const token of tokens) {
        if (/(^|,)\s*:root\s*$/.test(selector) || selector === ':root') {
          inherited.add(token);
          continue;
        }
        const list = owned.get(token) ?? [];
        for (const part of selector.split(',').map((s) => s.trim())) {
          if (part && !list.includes(part)) list.push(part);
        }
        owned.set(token, list);
      }
    }
  }

  for (const token of inherited) owned.delete(token);
  return { inherited, owned, known, contract };
}

/** Blank out comments but keep every newline, so line numbers stay true. */
function blankComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, ' '));
}

/** Every `--sn-*` declaration in a theme file, with the rule it sits in. */
export function readThemeDeclarations(source: string): Declaration[] {
  const css = blankComments(source);
  const out: Declaration[] = [];
  const stack: string[] = [];
  let selector = '';
  let pending = '';
  let line = 1;

  for (let i = 0; i < css.length; i++) {
    const char = css[i];
    if (char === '\n') line++;
    if (char === '{') {
      stack.push(pending.slice(pending.lastIndexOf(';') + 1).split(/\s+/).join(' ').trim());
      selector = stack[stack.length - 1];
      pending = '';
      continue;
    }
    if (char === '}') {
      stack.pop();
      selector = stack[stack.length - 1] ?? '';
      pending = '';
      continue;
    }
    if (char === ';') {
      const match = /(--sn-[\w-]+)\s*:\s*([^;]*)$/.exec(pending);
      if (match) out.push({ token: match[1], value: match[2].trim(), line, selector });
      pending = '';
      continue;
    }
    pending += char;
  }
  return out;
}
