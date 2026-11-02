// Usage: node scripts/generate-icon-codepoints.mjs <path-to.codepoints> (from libs/ashen-ui)
// Builds the Material Symbols name -> codepoint map for the Tailwind icon plugin.
// Source: a codepoints file with "<name> <hex>" per line. Underscores become dashes.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const libRoot = resolve(scriptDir, '..');

const source = process.argv[2];
if (!source) {
  throw new Error('Pass the Material Symbols .codepoints file, from the google/material-design-icons repo.');
}

const outFile = resolve(libRoot, 'src/styles/icons/material-symbols-outlined.codepoints.json');

const icons = readFileSync(source, 'utf8')
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const [name, code] = line.split(/\s+/);
    return { name: name.replaceAll('_', '-'), code };
  });

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(icons, null, 0) + '\n', 'utf8');

console.log(`Wrote ${icons.length} icon codepoints -> ${outFile}`);
