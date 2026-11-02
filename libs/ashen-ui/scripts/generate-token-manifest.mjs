import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const libRoot = resolve(scriptDir, '..');
const tokensDir = join(libRoot, 'src/styles/tokens');
const componentsDir = join(libRoot, 'src/styles/components');
const outFile = join(libRoot, 'src/tokens/token-manifest.generated.ts');
const check = process.argv.includes('--check');

// The leading \s* matters: an indented declaration follows neither a line start nor ; or {.
const DECLARED = /(?:^\s*|[;{]\s*)(--sn-[a-z0-9-]+)\s*:/gm;
const CONSUMED = /var\(\s*(--sn-[a-z0-9-]+)\s*[,)]/g;

function names(css, pattern) {
  return [...css.matchAll(pattern)].map((match) => match[1]);
}

function readCssTokens(dir) {
  const tokens = new Set();
  for (const file of readdirSync(dir).filter((name) => name.endsWith('.css')).sort()) {
    for (const name of names(readFileSync(join(dir, file), 'utf8'), DECLARED)) tokens.add(name);
  }
  return [...tokens].sort();
}

// A component token counts whether it is declared or only named in a var() fallback.
function readCssTokenFile(file, declaredElsewhere) {
  const css = readFileSync(file, 'utf8');
  const tokens = new Set(names(css, DECLARED));
  for (const name of names(css, CONSUMED)) {
    if (!declaredElsewhere.has(name)) tokens.add(name);
  }
  return [...tokens].sort();
}

function allDeclared(dirs) {
  const declared = new Set();
  for (const dir of dirs) {
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir).filter((name) => name.endsWith('.css'))) {
      for (const name of names(readFileSync(join(dir, file), 'utf8'), DECLARED)) declared.add(name);
    }
  }
  return declared;
}

function interfaceName(file) {
  return `Sn${file.replace(/\.css$/, '').replace(/(^|[-_])(\w)/g, (_, __, letter) => letter.toUpperCase())}Tokens`;
}

function renderInterface(name, tokens) {
  const lines = [`export interface ${name} {`];
  for (const token of tokens) lines.push(`  '${token}': string | number;`);
  lines.push('}');
  return lines.join('\n');
}

const globalTokens = readCssTokens(tokensDir);
const declaredAnywhere = allDeclared([tokensDir, componentsDir]);
const components = existsSync(componentsDir)
  ? readdirSync(componentsDir)
      .filter((name) => name.endsWith('.css'))
      .sort()
      .map((file) => ({
        file,
        name: file.replace(/\.css$/, ''),
        interfaceName: interfaceName(file),
        tokens: readCssTokenFile(join(componentsDir, file), declaredAnywhere),
      }))
      .filter((component) => component.tokens.length > 0)
  : [];

const interfaces = [renderInterface('SnGlobalTokens', globalTokens)];
for (const component of components) {
  interfaces.push(renderInterface(component.interfaceName, component.tokens));
}

const componentMap = components.length
  ? [
      'export interface SnComponentTokenMap {',
      ...components.map((component) => `  '${component.name}': ${component.interfaceName};`),
      '}',
      '',
      'export type SnComponentName = keyof SnComponentTokenMap;',
      'export type SnComponentTokens<Name extends SnComponentName = SnComponentName> = SnComponentTokenMap[Name];',
    ].join('\n')
  : 'export interface SnComponentTokenMap {}\n\nexport type SnComponentName = never;\nexport type SnComponentTokens<Name extends SnComponentName = SnComponentName> = SnComponentTokenMap[Name];';

const componentNames = components.map((component) => `keyof ${component.interfaceName}`);
const output = [
  ...interfaces,
  '',
  componentMap,
  '',
  `export type SnTokenName = keyof SnGlobalTokens${componentNames.length ? ` | ${componentNames.join(' | ')}` : ''};`,
  'export type SnTokens<T extends SnTokenName = SnTokenName> = Partial<Record<T, string | number>>;',
  '',
].join('\n');

if (check) {
  const current = existsSync(outFile) ? readFileSync(outFile, 'utf8') : '';
  if (current !== output) {
    console.error('token-manifest.generated.ts is out of date. Run: node libs/ashen-ui/scripts/generate-token-manifest.mjs');
    process.exit(1);
  }
  console.log(`token manifest is up to date (${globalTokens.length} global tokens, ${components.length} component groups).`);
} else {
  writeFileSync(outFile, output);
  console.log(`Wrote ${outFile} (${globalTokens.length} global tokens, ${components.length} component groups).`);
}
