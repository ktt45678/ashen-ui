// Usage: node scripts/validate-theme.mjs [--check] (from libs/ashen-ui)
// Validates that a `[data-theme]` block defines every token the shipped dark theme overrides,
// and rewrites styles/themes/_template.css. --check exits 1 if invalid or stale.

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const libRoot = resolve(scriptDir, '..');
const tokensDir = join(libRoot, 'src/styles/tokens');
const componentsDir = join(libRoot, 'src/styles/components');
const themesDir = join(libRoot, 'src/styles/themes');
const templateFile = join(themesDir, '_template.css');

const check = process.argv.includes('--check');

/**
 * Extra directories to scan, as `--include <dir>` (repeatable, relative to the
 * workspace). Themes do not only live in the library: the showcase ships
 * `glass`, and library component CSS targets `[data-theme='glass']`, so it is
 * as load-bearing as `dark` and has to meet the same contract.
 */
const extraDirs = process.argv
  .map((arg, i) => (arg === '--include' ? process.argv[i + 1] : null))
  .filter((v) => v != null)
  .map((v) => resolve(libRoot, '../..', v));

/** Strip comments so a commented-out declaration never counts as defined. */
function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/**
 * Every block whose selector matches `test`, read by brace matching.
 *
 * A regex cannot do this: the token files nest blocks inside `@media`, and a
 * flat `\{([^{}]*)\}` silently truncates at the first inner brace, which is
 * how an earlier version of this script reported the dark theme as empty.
 */
function findBlocks(css, test) {
  const out = [];
  for (let i = 0; i < css.length; i++) {
    if (css[i] !== '{') continue;
    const selector = css.slice(css.lastIndexOf('}', i - 1) + 1, i).trim().split('\n').pop().trim();
    if (!test(selector)) continue;

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

// Match a `[data-theme='name']` selector, including the `|=` operator the
// composable base themes use so a derived selector inherits them.
const THEME_SELECTOR = /\[data-theme[|~^$*]?=['"]?([\w-]+)['"]?\]/;
const THEME_SELECTOR_G = new RegExp(THEME_SELECTOR, 'g');

// Every `--sn-*` the library defines. Anything else in a theme is a typo.
const knownTokens = new Set();
for (const dir of [tokensDir, componentsDir]) {
  for (const file of existsSync(dir) ? readdirSync(dir) : []) {
    if (!file.endsWith('.css') || file.startsWith('_')) continue;
    const css = stripComments(readFileSync(join(dir, file), 'utf8'));
    for (const [, token] of css.matchAll(/(--sn-[\w-]+)\s*:/g)) knownTokens.add(token);
  }
}

const sources = [];
for (const dir of [tokensDir, themesDir, ...extraDirs]) {
  if (!existsSync(dir)) continue;
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.css') || file.startsWith('_')) continue;
    sources.push({
      file: `${dir.split(/[/\\]/).slice(-2).join('/')}/${file}`,
      css: stripComments(readFileSync(join(dir, file), 'utf8')),
    });
  }
}

const themes = new Map(); // name -> { tokens: Set, values: Map, file }
for (const { file, css } of sources) {
  for (const { selector, body } of findBlocks(css, (s) => s.includes('[data-theme'))) {
    const name = THEME_SELECTOR.exec(selector)?.[1];
    if (!name) continue;
    const entry = themes.get(name) ?? { tokens: new Set(), values: new Map(), file };
    for (const [, token, value] of body.matchAll(/(--sn-[\w-]+)\s*:\s*([^;]+);/g)) {
      entry.tokens.add(token);
      if (!entry.values.has(token)) entry.values.set(token, value.trim());
    }
    themes.set(name, entry);
  }
}

const baseline = themes.get('dark');
if (!baseline) {
  console.error('validate-theme: no [data-theme="dark"] block found; cannot derive the contract.');
  process.exit(1);
}

const contract = [...baseline.tokens].sort();

const rootValues = new Map();
for (const { css } of sources) {
  for (const { body } of findBlocks(css, (selector) => selector === ':root')) {
    for (const [, token, value] of body.matchAll(/(--sn-[\w-]+)\s*:\s*([^;]+);/g)) {
      rootValues.set(token, value.trim());
    }
  }
}

const darkValues = new Map([...rootValues, ...baseline.values]);
const contrastPairs = [];
let contrastFailed = false;

function splitColorArguments(value) {
  const [channelValue, alphaFromSlash] = value.split('/').map((part) => part.trim());
  const commaSeparated = channelValue.includes(',');
  const parts = channelValue
    .split(commaSeparated ? ',' : ' ')
    .map((part) => part.trim())
    .filter(Boolean);
  const alpha = alphaFromSlash ?? (commaSeparated && parts.length === 4 ? parts.pop() : undefined);
  return { channels: parts, alpha };
}

function parseChannel(value) {
  const number = Number.parseFloat(value);
  if (!Number.isFinite(number)) return null;
  return value.endsWith('%') ? (number / 100) * 255 : number;
}

function parseAlpha(value) {
  if (value == null || value === '') return 1;
  const number = Number.parseFloat(value);
  if (!Number.isFinite(number)) return null;
  return value.endsWith('%') ? number / 100 : number;
}

function parseHexColor(value) {
  const match = /^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.exec(value);
  if (!match) return null;
  const hex = match[1];
  const pair = (index) => Number.parseInt(hex.slice(index, index + 2), 16);
  if (hex.length <= 4) {
    return {
      red: Number.parseInt(hex[0] + hex[0], 16),
      green: Number.parseInt(hex[1] + hex[1], 16),
      blue: Number.parseInt(hex[2] + hex[2], 16),
      alpha: hex.length === 4 ? Number.parseInt(hex[3] + hex[3], 16) / 255 : 1,
    };
  }
  return {
    red: pair(0),
    green: pair(2),
    blue: pair(4),
    alpha: hex.length === 8 ? pair(6) / 255 : 1,
  };
}

function hueToRgb(first, second, hue) {
  let adjusted = hue;
  if (adjusted < 0) adjusted += 1;
  if (adjusted > 1) adjusted -= 1;
  if (adjusted < 1 / 6) return first + (second - first) * 6 * adjusted;
  if (adjusted < 1 / 2) return second;
  if (adjusted < 2 / 3) return first + (second - first) * (2 / 3 - adjusted) * 6;
  return first;
}

function parseHslColor(value) {
  const match = /^hsla?\((.*)\)$/i.exec(value);
  if (!match) return null;
  const { channels, alpha: alphaValue } = splitColorArguments(match[1]);
  if (channels.length !== 3) return null;
  const hue = Number.parseFloat(channels[0]);
  const saturation = Number.parseFloat(channels[1]) / 100;
  const lightness = Number.parseFloat(channels[2]) / 100;
  const alpha = parseAlpha(alphaValue);
  if (![hue, saturation, lightness, alpha].every(Number.isFinite)) return null;
  const normalizedHue = ((hue % 360) + 360) % 360 / 360;
  if (saturation === 0) {
    const gray = lightness * 255;
    return { red: gray, green: gray, blue: gray, alpha };
  }
  const second = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
  const first = 2 * lightness - second;
  return {
    red: hueToRgb(first, second, normalizedHue + 1 / 3) * 255,
    green: hueToRgb(first, second, normalizedHue) * 255,
    blue: hueToRgb(first, second, normalizedHue - 1 / 3) * 255,
    alpha,
  };
}

function parseRgbColor(value) {
  const match = /^rgba?\((.*)\)$/i.exec(value);
  if (!match) return null;
  const { channels, alpha: alphaValue } = splitColorArguments(match[1]);
  if (channels.length !== 3) return null;
  const [red, green, blue] = channels.map(parseChannel);
  const alpha = parseAlpha(alphaValue);
  if (![red, green, blue, alpha].every(Number.isFinite)) return null;
  return { red, green, blue, alpha };
}

function resolveColor(token, seen = new Set()) {
  if (seen.has(token)) return { error: `cyclic reference at ${token}` };
  const value = darkValues.get(token);
  if (!value) return { error: `missing declaration for ${token}` };
  const reference = /^var\(\s*(--sn-[\w-]+)\s*(?:,\s*(.+))?\)$/s.exec(value);
  if (reference) {
    const [, referencedToken, fallback] = reference;
    if (darkValues.has(referencedToken)) {
      return resolveColor(referencedToken, new Set([...seen, token]));
    }
    if (fallback) return parseColorValue(fallback.trim());
    return { error: `${token} references undeclared ${referencedToken}` };
  }
  return parseColorValue(value);
}

function parseColorValue(value) {
  const color = parseHexColor(value) ?? parseRgbColor(value) ?? parseHslColor(value);
  if (!color) {
    return { error: `unsupported color value "${value}"` };
  }
  const channels = [color.red, color.green, color.blue, color.alpha];
  if (channels.some((channel) => channel < 0 || channel > 255) || color.alpha > 1) {
    return { error: `out-of-range color value "${value}"` };
  }
  return { color };
}

function composite(foreground, background) {
  const alpha = foreground.alpha + background.alpha * (1 - foreground.alpha);
  if (alpha === 0) return { red: 0, green: 0, blue: 0, alpha: 0 };
  return {
    red: (foreground.red * foreground.alpha + background.red * background.alpha * (1 - foreground.alpha)) / alpha,
    green: (foreground.green * foreground.alpha + background.green * background.alpha * (1 - foreground.alpha)) / alpha,
    blue: (foreground.blue * foreground.alpha + background.blue * background.alpha * (1 - foreground.alpha)) / alpha,
    alpha,
  };
}

function luminance(color) {
  const channel = (value) => {
    const normalized = value / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(color.red) + 0.7152 * channel(color.green) + 0.0722 * channel(color.blue);
}

function contrastRatio(foreground, background) {
  const resolvedForeground = foreground.alpha < 1 ? composite(foreground, background) : foreground;
  const light = Math.max(luminance(resolvedForeground), luminance(background));
  const dark = Math.min(luminance(resolvedForeground), luminance(background));
  return (light + 0.05) / (dark + 0.05);
}

function requireContrast(foregroundToken, backgroundToken, minimum, label = `${foregroundToken} on ${backgroundToken}`) {
  contrastPairs.push(label);
  const foreground = resolveColor(foregroundToken);
  const background = resolveColor(backgroundToken);
  if (foreground.error || background.error) {
    contrastFailed = true;
    console.error(
      `\nvalidate-theme: dark contrast pair "${label}" cannot be evaluated.\n  ${foreground.error ?? background.error}`,
    );
    return;
  }
  if (background.color.alpha < 1) {
    contrastFailed = true;
    console.error(
      `\nvalidate-theme: dark contrast pair "${label}" uses a transparent background token.\n  Required backgrounds must resolve to opaque colors.`,
    );
    return;
  }
  const ratio = contrastRatio(foreground.color, background.color);
  if (ratio < minimum) {
    contrastFailed = true;
    console.error(
      `\nvalidate-theme: dark contrast pair "${label}" is ${ratio.toFixed(2)}:1; requires ${minimum}:1.\n  Keep this pair readable without relying on opacity or a surrounding surface.`,
    );
  }
}

for (const role of ['primary', 'secondary', 'success', 'error', 'warning', 'info']) {
  const textToken = darkValues.has(`--sn-text-on-${role}`) ? `--sn-text-on-${role}` : '--sn-text-on-primary';
  for (const state of ['solid', 'solid-hover', 'solid-active']) {
    requireContrast(textToken, `--sn-color-${role}-${state}`, 4.5);
  }
  for (const surface of ['canvas', 'panel', 'elevated']) {
    requireContrast(`--sn-color-${role}`, `--sn-surface-${surface}`, 4.5);
  }
}

for (const textToken of ['--sn-text', '--sn-text-muted', '--sn-text-subtle']) {
  for (const surfaceToken of ['--sn-surface-canvas', '--sn-surface-panel', '--sn-surface-elevated', '--sn-input-bg']) {
    requireContrast(textToken, surfaceToken, 4.5);
  }
}

for (const borderToken of ['--sn-border-strong', '--sn-border-focus']) {
  for (const surfaceToken of ['--sn-surface-panel', '--sn-input-bg']) {
    requireContrast(borderToken, surfaceToken, 3);
  }
}

let failed = contrastFailed;
for (const [name, entry] of themes) {
  if (name === 'dark') continue;

  // A derived theme inherits its base, so it only has to declare valid overrides.
  const base = /^(light|dark)-/.exec(name)?.[1];
  if (base) {
    const unknown = [...entry.tokens].filter((t) => !knownTokens.has(t));
    if (unknown.length) {
      failed = true;
      console.error(
        `\nvalidate-theme: derived theme "${name}" (${entry.file}) sets ${unknown.length} token(s) that match no known token.` +
          `\n  A derived theme inherits "${base}" and lists only overrides, so these are likely typos:\n` +
          unknown.map((t) => `    ${t}`).join('\n'),
      );
    }
    continue;
  }

  const missing = contract.filter((t) => !entry.tokens.has(t));
  if (missing.length) {
    failed = true;
    console.error(
      `\nvalidate-theme: theme "${name}" (${entry.file}) is missing ${missing.length} required token(s).` +
        `\n  Each one silently falls back to the light value from :root.\n` +
        missing.map((t) => `    ${t}`).join('\n'),
    );
  }
}

// Component CSS must react to tokens, not to a theme name. `dark` is exempt because the library ships it.
{
  const offenders = [];
  for (const file of existsSync(componentsDir) ? readdirSync(componentsDir) : []) {
    if (!file.endsWith('.css')) continue;
    const css = stripComments(readFileSync(join(componentsDir, file), 'utf8'));
    for (const [, name] of css.matchAll(THEME_SELECTOR_G)) {
      if (name !== 'dark') offenders.push(`    ${file}: [data-theme='${name}']`);
    }
  }
  if (offenders.length) {
    failed = true;
    console.error(
      `\nvalidate-theme: library component CSS references ${offenders.length} app-defined theme(s).` +
        `\n  Components react to tokens, not to theme names; only 'dark' ships with the library.\n` +
        offenders.join('\n'),
    );
  }
}

const template = `/* Starting point for a new Ashen UI theme. GENERATED, do not edit by hand.
   Regenerate with: node scripts/validate-theme.mjs

   Copy this file, rename the selector, and give every token a value. Each one
   is listed because the built-in dark theme overrides it, which means it
   carries light/dark meaning: leave one out and it silently inherits the light
   value from :root.

   Values shown in comments are the dark theme's, for reference.

   Then add your theme to the validator's reach by placing it in
   styles/themes/, and \`pnpm theme:check\` will hold it to this contract. */

[data-theme='my-theme'] {
${contract.map((t) => `  ${t}: ; /* dark: ${baseline.values.get(t)} */`).join('\n')}
}
`;

if (check) {
  const current = existsSync(templateFile) ? readFileSync(templateFile, 'utf8') : '';
  if (current !== template) {
    console.error(
      `\nvalidate-theme: styles/themes/_template.css is out of date (${contract.length} tokens in the contract).` +
        `\n  Run: node scripts/validate-theme.mjs`,
    );
    failed = true;
  }
  if (!failed) {
    console.log(
      `theme contract and dark contrast satisfied (${contract.length} tokens, ${contrastPairs.length} contrast pairs, ${themes.size} theme(s) checked).`,
    );
  }
  process.exit(failed ? 1 : 0);
}

mkdirSync(themesDir, { recursive: true });
writeFileSync(templateFile, template);
console.log(
  `theme contract: ${contract.length} tokens; ${themes.size} theme(s) checked; template written.`,
);
process.exit(failed ? 1 : 0);
