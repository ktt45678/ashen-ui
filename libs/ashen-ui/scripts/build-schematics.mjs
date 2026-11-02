// Usage: node scripts/build-schematics.mjs (run from libs/ashen-ui, after `ng build ashen-ui`)
// Compiles the schematics and copies their non-TS assets into dist. Every schematic in
// collection.json is built, and every schematic on disk must be declared there.
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..', '..');
const schematicsSrc = join(root, 'libs', 'ashen-ui', 'schematics');
const dist = join(root, 'dist', 'ashen-ui', 'schematics');
const manifestPath = join(root, 'libs', 'ashen-ui', 'src', 'package.json');

const collection = JSON.parse(readFileSync(join(schematicsSrc, 'collection.json'), 'utf8'));
const declared = Object.entries(collection.schematics ?? {});

if (declared.length === 0) {
  throw new Error('collection.json declares no schematics');
}

// "./ng-add/index#ngAdd" -> { dir: "ng-add", js: "ng-add/index.js" }
const resolveFactory = (name, factory) => {
  if (typeof factory !== 'string' || !factory.includes('#')) {
    throw new Error(`Schematic "${name}" has no "<path>#<export>" factory: ${factory}`);
  }

  const modulePath = factory.split('#')[0].replace(/^\.\//, '');
  return { dir: dirname(modulePath), js: `${modulePath}.js` };
};

// A directory holding an index.ts is a schematic, so it has to be registered.
const onDisk = readdirSync(schematicsSrc, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join(schematicsSrc, entry.name, 'index.ts')))
  .map((entry) => entry.name);

const registered = new Set(declared.map(([name, entry]) => resolveFactory(name, entry.factory).dir));
const unregistered = onDisk.filter((dir) => !registered.has(dir));

if (unregistered.length > 0) {
  throw new Error(
    `Schematics on disk but missing from collection.json: ${unregistered.join(', ')}`,
  );
}

execFileSync('pnpm', ['exec', 'tsc', '-p', join(schematicsSrc, 'tsconfig.json')], {
  stdio: 'inherit',
  cwd: root,
  shell: process.platform === 'win32',
});

for (const [name, entry] of declared) {
  const { dir, js } = resolveFactory(name, entry.factory);
  mkdirSync(join(dist, dir), { recursive: true });

  if (entry.schema) {
    const schema = entry.schema.replace(/^\.\//, '');

    if (!existsSync(join(schematicsSrc, schema))) {
      throw new Error(`Schematic "${name}" declares a missing schema: ${entry.schema}`);
    }

    cpSync(join(schematicsSrc, schema), join(dist, schema));
  }

  if (!existsSync(join(dist, js))) {
    throw new Error(`Schematic "${name}" did not compile to ${js}`);
  }
}

cpSync(join(schematicsSrc, 'collection.json'), join(dist, 'collection.json'));

// The theme schematic reads the token template from its own dist directory, so
// it stays in sync with the one the validator generates.
cpSync(
  join(root, 'libs', 'ashen-ui', 'src', 'styles', 'themes', '_template.css'),
  join(dist, 'theme', '_template.css'),
);

// The library dist is "type": "module", but the Angular CLI loads schematics as
// CommonJS. Scope this subtree back to CommonJS so the compiled .js files run.
writeFileSync(join(dist, 'package.json'), JSON.stringify({ type: 'commonjs' }, null, 2) + '\n');

// Without this field the CLI never discovers the collection, so every schematic
// is unreachable however well it compiled.
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

if (manifest.schematics !== './schematics/collection.json') {
  throw new Error(
    `libs/ashen-ui/src/package.json must set "schematics": "./schematics/collection.json", found ${manifest.schematics}`,
  );
}

console.log(`schematics -> ${dist} (${declared.map(([name]) => name).join(', ')})`);
