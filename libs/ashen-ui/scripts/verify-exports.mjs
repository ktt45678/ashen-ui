// Usage: node scripts/verify-exports.mjs (after the library build)
// Resolves every subpath of the built exports map through Node's resolver, using a throwaway
// script inside dist/ashen-ui so bare `ashen-ui/...` specifiers self-reference the package.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..', '..');
const dist = join(root, 'dist', 'ashen-ui');
const packagePath = join(dist, 'package.json');

if (!existsSync(packagePath)) {
  throw new Error(`Built package manifest is missing: ${packagePath}`);
}

const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
const exportsMap = packageJson.exports ?? {};

function firstFileUnder(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      const found = firstFileUnder(full);
      if (found) return found;
    } else if (entry.isFile()) {
      return full;
    }
  }
  return null;
}

const specifiers = [];
for (const subpath of Object.keys(exportsMap)) {
  if (subpath.includes('*')) {
    const prefix = subpath.slice(0, subpath.indexOf('*'));
    const sample = firstFileUnder(join(dist, prefix));
    if (!sample) throw new Error(`No file found to test wildcard export: ${subpath}`);
    const relPath = relative(dist, sample).split(sep).join('/');
    specifiers.push(`ashen-ui/${relPath}`);
    continue;
  }
  specifiers.push(subpath === '.' ? 'ashen-ui' : `ashen-ui/${subpath.replace(/^\.\//, '')}`);
}

const resolverPath = join(dist, '__verify-exports-resolver.mjs');
const resolverSource = `
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const specifiers = ${JSON.stringify(specifiers)};
const failures = [];
for (const specifier of specifiers) {
  try {
    const resolved = import.meta.resolve(specifier);
    // import.meta.resolve only computes the exports-map mapping; it does not
    // check the target exists, which is exactly the failure mode this guards.
    if (resolved.startsWith('file:') && !existsSync(fileURLToPath(resolved))) {
      failures.push({ specifier, message: \`resolved target does not exist: \${resolved}\` });
    }
  } catch (error) {
    failures.push({ specifier, message: error.message });
  }
}
if (failures.length > 0) {
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}
`;
writeFileSync(resolverPath, resolverSource);

let failed = false;
try {
  execFileSync(process.execPath, [resolverPath], { stdio: 'inherit' });
} catch {
  failed = true;
} finally {
  rmSync(resolverPath, { force: true });
}

if (failed) process.exit(1);

console.log(`verified ${specifiers.length} exports resolve -> ${packagePath}`);
