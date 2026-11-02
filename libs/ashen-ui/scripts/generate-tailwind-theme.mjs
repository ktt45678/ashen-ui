// Usage: node scripts/generate-tailwind-theme.mjs [--check] (from libs/ashen-ui)
// Rewrites the `@theme inline` block in styles/tailwind.css from the token files.
// --check exits 1 if the block is out of date. Text outside the markers is kept.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const libRoot = resolve(scriptDir, '..');
const tokensDir = join(libRoot, 'src/styles/tokens');
const outFile = join(libRoot, 'src/styles/tailwind.css');

const BEGIN = '/* === GENERATED: theme bridge, do not edit by hand. ===';
const END = '/* === END GENERATED === */';

/**
 * Public Tailwind names that predate the generator. Keeping them is not
 * cosmetic: `bg-sn-panel` and `rounded-sn-button` are already in consumer
 * markup, and deriving them mechanically would rename them.
 */
const ALIASES = new Map([
  ['--sn-surface-canvas', 'canvas'],
  ['--sn-surface-panel', 'panel'],
  ['--sn-surface-elevated', 'elevated'],
  ['--sn-surface-overlay', 'overlay'],
  ['--sn-surface-hover', 'hover'],
  ['--sn-surface-glass', 'glass'],
  ['--sn-surface-grid', 'grid'],
  ['--sn-surface-tile', 'tile'],
  ['--sn-surface-tile-active', 'tile-active'],
  ['--sn-surface-tile-editing', 'tile-editing'],
  ['--sn-button-border-radius', 'button'],
  ['--sn-input-border-radius', 'input'],
  ['--sn-dialog-border-radius', 'dialog'],
  ['--sn-select-border-radius', 'select'],
  ['--sn-checkbox-border-radius', 'checkbox'],
  ['--sn-message-radius', 'message'],
]);

/** Tokens that are deliberately not bridged, with the reason. */
const SKIP = new Map([
  ['--sn-color-soft-alpha', 'a percentage used inside color-mix, not a colour'],
  ['--sn-focus-ring-applied-offset', 'derived internal; set --sn-focus-ring-style instead'],
  ['--sn-focus-ring-inset-offset', 'derived internal'],
  ['--sn-focus-ring-style', 'a keyword switch, not a value Tailwind can consume'],
  ['--sn-backdrop-filter', 'a filter shorthand; no Tailwind namespace accepts it'],
  ['--sn-motion-fast', 'a full animation shorthand; --ease-* takes a timing function only'],
  ['--sn-motion-base', 'a full animation shorthand'],
  ['--sn-motion-slow', 'a full animation shorthand'],
  ['--sn-disabled-opacity', 'a bare number; no Tailwind opacity namespace'],
  ['--sn-drawer-z-index', 'a bare number'],
  ['--sn-form-field-label-font-weight', 'covered by --font-weight-sn-*'],
  ['--sn-form-field-hint-font-weight', 'covered by --font-weight-sn-*'],
  ['--sn-form-field-error-font-weight', 'covered by --font-weight-sn-*'],
  ['--sn-dialog-title-font-weight', 'covered by --font-weight-sn-*'],
  ['--sn-drawer-title-font-weight', 'covered by --font-weight-sn-*'],
  ['--sn-menu-item-padding', 'a two-axis padding shorthand, not a reusable spacing scale value'],
]);

/** Tokens whose name ends in `-size` but which are type sizes, not lengths. */
const TEXT_SIZES = new Set(['--sn-label-size', '--sn-hint-size']);

/**
 * Route a token to a Tailwind theme namespace. Order matters: the first match
 * wins, so the specific patterns come before the generic colour fallback.
 * Returning null drops the token with no entry.
 */
function classify(name) {
  let bare = name.replace(/^--sn-/, '');

  // Named control dimensions, matched before the generic dimension filter below.
  if (/^(control-height|icon-size|scrollbar-size)/.test(bare)) return ['spacing', bare];
  if (name === '--sn-menu-min-width') return ['spacing', bare];

  // Dimensions and shorthands no Tailwind namespace can consume. Checked early so they never fall through to `color`.
  if (/(padding|margin|gutter|spacing|gap|width|height|offset|track-|thumb-|min-|max-)/.test(bare)) return null;

  if (/(^|-)(border-)?radius($|-)/.test(bare)) {
    return ['radius', bare.replace(/-?(border-)?radius/, '').replace(/^-|-$/g, '')];
  }
  if (/^space-/.test(bare)) return ['spacing', bare.slice('space-'.length)];
  if (/^font-weight-/.test(bare)) return ['font-weight', bare.slice('font-weight-'.length)];
  if (/^font-/.test(bare)) return ['font', bare.slice('font-'.length)];
  if (/^leading-/.test(bare)) return ['leading', bare.slice('leading-'.length)];

  if (/^text-(2xs|xs|sm|md|lg|xl|2xl)$/.test(bare)) return ['text', bare.slice('text-'.length)];
  // e.g. --sn-button-font-size-lg -> --text-sn-button-lg
  const fontSize = bare.match(/^(.*?)-font-size(?:-(xs|sm|md|lg))?$/);
  if (fontSize) return ['text', [fontSize[1], fontSize[2]].filter(Boolean).join('-')];
  // Semantic type sizes end in `-size` but are font sizes, so route them before the dimension rule.
  if (TEXT_SIZES.has(name)) return ['text', bare.replace(/-size$/, '')];

  // e.g. --sn-checkbox-size-md -> --spacing-sn-checkbox-md. A length, not a colour.
  const sized = bare.match(/^(.*?)-size(?:-(xs|sm|md|lg))?$/);
  if (sized) return ['spacing', [sized[1], sized[2]].filter(Boolean).join('-')];

  if (/^shadow-/.test(bare)) return ['shadow', bare.slice('shadow-'.length)];
  if (/-shadow$/.test(bare)) return ['shadow', bare.replace(/-shadow$/, '')];

  // Everything left is a colour. Strip the token's own `color-` segment so
  // --sn-color-primary stays `bg-sn-primary`, not `bg-sn-color-primary`.
  bare = bare.replace(/^color-/, '');
  return ['color', bare];
}

function readTokens() {
  const seen = new Map();
  for (const file of readdirSync(tokensDir).filter((f) => f.endsWith('.css')).sort()) {
    const css = readFileSync(join(tokensDir, file), 'utf8');
    // Every `:root` block, not just the first. Theme blocks are skipped: they restate the same names.
    for (const root of css.matchAll(/^:root\s*\{([\s\S]*?)^\}/gm)) {
      for (const m of root[1].matchAll(/^\s*(--sn-[a-z0-9-]+)\s*:/gm)) {
        if (!seen.has(m[1])) seen.set(m[1], file);
      }
    }
  }
  return seen;
}

function build(tokens) {
  const groups = new Map();
  const skipped = [];

  for (const name of [...tokens.keys()].sort()) {
    if (SKIP.has(name)) {
      skipped.push([name, SKIP.get(name)]);
      continue;
    }
    const classified = classify(name);
    if (!classified) continue;
    const [ns, derived] = classified;
    const suffix = ALIASES.get(name) ?? derived;
    if (!suffix) continue;
    const key = `--${ns}-sn-${suffix}`;
    if (!groups.has(ns)) groups.set(ns, new Map());
    // First writer wins, so an alias is never clobbered by a derived name.
    if (!groups.get(ns).has(key)) groups.get(ns).set(key, name);
  }

  const order = ['color', 'radius', 'spacing', 'font', 'text', 'font-weight', 'leading', 'shadow'];
  const lines = [
    BEGIN,
    '   Run `node scripts/generate-tailwind-theme.mjs` after changing any token,',
    '   or `--check` in CI to fail on drift. Source: styles/tokens/*.css === */',
    '@theme inline {',
  ];

  for (const ns of order) {
    const entries = groups.get(ns);
    if (!entries) continue;
    lines.push(`  /* ── ${ns} ─────────────────────────────────────────── */`);
    const width = Math.max(...[...entries.keys()].map((k) => k.length));
    for (const [key, token] of entries) {
      lines.push(`  ${key}:${' '.repeat(width - key.length + 1)}var(${token});`);
    }
    lines.push('');
  }

  if (lines.at(-1) === '') lines.pop();
  lines.push('}');
  lines.push('');
  lines.push('/* Not bridged, deliberately:');
  for (const [name, why] of skipped) lines.push(`     ${name}: ${why}`);
  lines.push('   Reach these as plain custom properties: var(--sn-motion-base). */');
  lines.push(END);
  return lines.join('\n');
}

/**
 * Names the bridge must always expose. Two groups, for two different failure
 * modes that are both silent without this:
 *   - PRE_GENERATOR: public names that predate the generator. A classifier
 *     change that renames one breaks `bg-sn-panel` in a consuming app with no
 *     error anywhere.
 *   - GAP_FAMILIES: the families §5.5 identified as missing. If a future
 *     classifier tweak drops one again, the bridge quietly re-becomes a subset.
 */
const PRE_GENERATOR = [
  '--color-sn-primary', '--color-sn-primary-soft', '--color-sn-secondary', '--color-sn-success',
  '--color-sn-error', '--color-sn-warning', '--color-sn-info', '--color-sn-text',
  '--color-sn-text-muted', '--color-sn-text-on-primary', '--color-sn-canvas', '--color-sn-panel',
  '--color-sn-elevated', '--color-sn-overlay', '--color-sn-hover', '--color-sn-glass',
  '--color-sn-border', '--color-sn-border-strong', '--color-sn-border-invalid',
  '--color-sn-input-bg', '--radius-sn-sm', '--radius-sn-md', '--radius-sn-lg', '--radius-sn-pill',
  '--radius-sn-tile', '--radius-sn-button', '--radius-sn-input', '--radius-sn-dialog',
  '--spacing-sn-1', '--spacing-sn-6', '--font-sn-display', '--font-sn-ui', '--font-sn-mono',
  '--text-sn-2xs', '--text-sn-sm', '--text-sn-2xl', '--shadow-sn-sm', '--shadow-sn-overlay',
];

const GAP_FAMILIES = [
  '--color-sn-input-placeholder', '--color-sn-select-panel-bg',
  '--color-sn-select-option-selected-bg', '--color-sn-disabled-bg', '--color-sn-focus-ring-color',
  '--color-sn-menu-bg', '--color-sn-scrollbar-thumb', '--color-sn-message-error-bg',
  '--spacing-sn-control-height-md', '--spacing-sn-icon-size-md', '--font-weight-sn-medium',
  '--leading-sn-tight', '--shadow-sn-modal',
  '--spacing-sn-menu-min-width',
];

function verify(block) {
  const missing = [...PRE_GENERATOR, ...GAP_FAMILIES].filter((n) => !block.includes(`${n}:`));
  if (missing.length) {
    console.error(
      'The generated bridge is missing names it must always expose:\n' +
        missing.map((n) => `  ${n}`).join('\n') +
        '\nA classify() change probably routed them to a different namespace or ' +
        'dropped them. Renaming a PRE_GENERATOR name silently breaks consumer markup.',
    );
    process.exit(1);
  }

  // --sn-motion-* are full `0.15s ease-in-out` shorthands, not timing functions,
  // so an --ease-* entry would generate broken utilities.
  const bad = [/--ease-sn-motion/, /--color-sn-motion/, /--color-sn-[a-z-]*(padding|margin)/];
  for (const re of bad) {
    if (re.test(block)) {
      console.error(`Generated bridge contains an unusable entry matching ${re}`);
      process.exit(1);
    }
  }
}

const tokens = readTokens();
const block = build(tokens);
verify(block);
const current = readFileSync(outFile, 'utf8');

const start = current.indexOf(BEGIN);
const stop = current.indexOf(END);
if (start === -1 || stop === -1) {
  console.error(`Markers not found in ${outFile}. Expected ${BEGIN.trim()} … ${END}`);
  process.exit(1);
}
const next = current.slice(0, start) + block + current.slice(stop + END.length);

if (process.argv.includes('--check')) {
  if (next !== current) {
    console.error(
      'styles/tailwind.css is out of date with styles/tokens/*.css.\n' +
        'Run: node scripts/generate-tailwind-theme.mjs',
    );
    process.exit(1);
  }
  console.log(`tailwind.css is up to date (${tokens.size} tokens scanned).`);
} else {
  writeFileSync(outFile, next);
  console.log(`Wrote ${outFile} from ${tokens.size} tokens.`);
}
