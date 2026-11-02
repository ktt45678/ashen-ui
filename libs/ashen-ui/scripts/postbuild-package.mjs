import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..', '..');
const dist = join(root, 'dist', 'ashen-ui');
const packagePath = join(dist, 'package.json');
const requiredExports = {
  './styles/index.css': { default: './styles/index.css' },
  './styles/tailwind.css': { default: './styles/tailwind.css' },
  './styles/icons/icons.plugin.cjs': { default: './styles/icons/icons.plugin.cjs' },
  './styles/*': { default: './styles/*' },
};
const requiredFiles = [
  'styles/index.css',
  'styles/tailwind.css',
  'styles/icons/icons.plugin.cjs',
  'styles/icons/material-symbols-outlined.codepoints.json',
];

if (!existsSync(packagePath)) {
  throw new Error(`Built package manifest is missing: ${packagePath}`);
}

const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
packageJson.exports = { ...packageJson.exports, ...requiredExports };
writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);

const persistedPackageJson = JSON.parse(readFileSync(packagePath, 'utf8'));

for (const [subpath, expectedTarget] of Object.entries(requiredExports)) {
  const actualTarget = persistedPackageJson.exports?.[subpath];

  if (JSON.stringify(actualTarget) !== JSON.stringify(expectedTarget)) {
    throw new Error(`Built package export is missing or invalid: ${subpath}`);
  }
}

for (const relativePath of requiredFiles) {
  if (!existsSync(join(dist, relativePath))) {
    throw new Error(`Built package asset is missing: ${relativePath}`);
  }
}

// ng-packagr does not copy a README or LICENSE into the package.
const packageDocs = [
  [join(root, 'libs', 'ashen-ui', 'README.md'), 'README.md'],
  [join(root, 'LICENSE'), 'LICENSE'],
];
for (const [source, target] of packageDocs) {
  if (!existsSync(source)) {
    throw new Error(`Package file is missing: ${source}`);
  }
  copyFileSync(source, join(dist, target));
}

console.log(`package exports -> ${packagePath}`);
