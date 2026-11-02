import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { resolve } from 'node:path';

// Deterministic paths from the project root (vitest's cwd). Resolving through
// require gets rewritten by vitest, which mangles a .json target.
export const collectionPath = resolve(process.cwd(), 'dist/ashen-ui/schematics/collection.json');
const ngCollectionPath = resolve(process.cwd(), 'node_modules/@schematics/angular/collection.json');

export function ashenRunner(): SchematicTestRunner {
  return new SchematicTestRunner('ashen-ui', collectionPath);
}

// A minimal but real standalone application workspace to run the schematics against.
export async function createAppTree(): Promise<UnitTestTree> {
  const runner = new SchematicTestRunner('@schematics/angular', ngCollectionPath);
  let tree = await runner.runSchematic(
    'workspace',
    { name: 'workspace', version: '22.0.0', newProjectRoot: 'projects' },
    Tree.empty(),
  );
  tree = await runner.runSchematic('application', { name: 'demo', style: 'css', routing: false }, tree);
  return tree;
}
