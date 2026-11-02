import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  chain,
  noop,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addRootProvider } from '@schematics/angular/utility';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { ProjectType } from '@schematics/angular/utility/workspace-models';
import { posix } from 'node:path';
import { NgAddOptions } from './schema';

const STYLE_IMPORT = "@import 'ashen-ui/styles/index.css';";
const TAILWIND_IMPORT = "@import 'ashen-ui/styles/tailwind.css';";

const BOOT_GUARD_ATTR = 'data-sn-app-boot';
const BOOT_GUARD_SCRIPT = `  <script>
    document.documentElement.setAttribute('${BOOT_GUARD_ATTR}', '');
    setTimeout(function () {
      document.documentElement.removeAttribute('${BOOT_GUARD_ATTR}');
    }, 4000);
  </script>
`;
const BOOT_GUARD_CSS = `
html[${BOOT_GUARD_ATTR}] { visibility: hidden; }
html[${BOOT_GUARD_ATTR}] *, html[${BOOT_GUARD_ATTR}] *::before, html[${BOOT_GUARD_ATTR}] *::after {
  transition: none !important;
}
`;

export function ngAdd(options: NgAddOptions): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const workspace = await getWorkspace(tree);
    const projectName = options.project ?? [...workspace.projects.keys()][0];
    const project = projectName ? workspace.projects.get(projectName) : undefined;
    if (!project) {
      throw new SchematicsException(`Could not find a project named "${projectName}" in the workspace.`);
    }
    if (project.extensions.projectType !== ProjectType.Application) {
      throw new SchematicsException(
        `ng-add targets an application. "${projectName}" is a ${project.extensions.projectType}.`,
      );
    }

    // The peer dep is real at runtime, so schedule an install once the files land.
    context.addTask(new NodePackageInstallTask());

    return chain([
      addRootProvider(projectName, ({ code, external }) => code`${external('provideAshenUI', 'ashen-ui')}()`),
      options.styles ? importStyles(projectName, options.tailwind) : noop(),
      options.bootGuard ? insertBootGuard(projectName) : noop(),
    ]);
  };
}

async function findStylesheet(tree: Tree, projectName: string): Promise<string | undefined> {
  const workspace = await getWorkspace(tree);
  const project = workspace.projects.get(projectName)!;
  const build = project.targets.get('build');
  const styles = (build?.options?.['styles'] as (string | { input: string })[] | undefined) ?? [];
  const stylesheet = styles
    .map((entry) => (typeof entry === 'string' ? entry : entry.input))
    .find((path) => /\.(css|scss|sass|less)$/.test(path));
  return stylesheet && tree.exists(stylesheet) ? stylesheet : undefined;
}

function importStyles(projectName: string, tailwind: boolean): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const stylesheet = await findStylesheet(tree, projectName);
    if (!stylesheet) {
      context.logger.warn(
        `No global stylesheet found for "${projectName}". Add these imports manually:\n  ${STYLE_IMPORT}` +
          (tailwind ? `\n  ${TAILWIND_IMPORT}` : ''),
      );
      return;
    }

    const imports = tailwind ? [STYLE_IMPORT, TAILWIND_IMPORT] : [STYLE_IMPORT];
    const current = tree.read(stylesheet)!.toString('utf-8');
    const missing = imports.filter((line) => !current.includes(line));
    if (missing.length === 0) return;

    tree.overwrite(stylesheet, insertImports(current, missing));
    context.logger.info(`Imported Ashen UI styles into ${posix.basename(stylesheet)}.`);
  };
}

function insertBootGuard(projectName: string): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const workspace = await getWorkspace(tree);
    const project = workspace.projects.get(projectName)!;
    const build = project.targets.get('build');
    // The Vite-based application builder locates index.html by convention
    // (sourceRoot/index.html) rather than an explicit build option.
    const explicitIndex = build?.options?.['index'] as string | undefined;
    const conventionalIndex = project.sourceRoot ? posix.join(project.sourceRoot, 'index.html') : undefined;
    const indexPath = explicitIndex ?? conventionalIndex;

    if (!indexPath || !tree.exists(indexPath)) {
      context.logger.warn(`No index.html found for "${projectName}". Add the boot guard manually.`);
      return;
    }

    const html = tree.read(indexPath)!.toString('utf-8');
    if (!html.includes(BOOT_GUARD_ATTR) && html.includes('</head>')) {
      tree.overwrite(indexPath, html.replace('</head>', `${BOOT_GUARD_SCRIPT}</head>`));
      context.logger.info(`Inserted the boot guard script into ${posix.basename(indexPath)}.`);
    }

    const stylesheet = await findStylesheet(tree, projectName);
    if (!stylesheet) {
      context.logger.warn(`No global stylesheet found for "${projectName}". Add the boot guard CSS manually.`);
      return;
    }

    const current = tree.read(stylesheet)!.toString('utf-8');
    if (!current.includes(BOOT_GUARD_ATTR)) {
      tree.overwrite(stylesheet, `${current}\n${BOOT_GUARD_CSS}`);
      context.logger.info(`Appended the boot guard styles to ${posix.basename(stylesheet)}.`);
    }
  };
}

// @import must precede ordinary rules, so land the new lines after any leading
// @charset, @layer statement, @import or comment rather than at column zero.
function insertImports(source: string, importsToAdd: string[]): string {
  const lines = source.split('\n');
  let cursor = 0;
  let inComment = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (inComment) {
      cursor = i + 1;
      if (line.includes('*/')) inComment = false;
      continue;
    }
    if (line === '' || line.startsWith('@charset') || line.startsWith('@import') || /^@layer[^{]*;$/.test(line)) {
      cursor = i + 1;
      continue;
    }
    if (line.startsWith('/*')) {
      cursor = i + 1;
      if (!line.includes('*/')) inComment = true;
      continue;
    }
    break;
  }
  lines.splice(cursor, 0, ...importsToAdd);
  return lines.join('\n');
}
