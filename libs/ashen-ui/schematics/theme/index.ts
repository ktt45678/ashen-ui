import { Rule, SchematicContext, SchematicsException, Tree, strings } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ThemeOptions } from './schema';

export function theme(options: ThemeOptions): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const name = strings.dasherize(options.name ?? '');
    if (!name) {
      throw new SchematicsException('A theme name is required.');
    }

    const workspace = await getWorkspace(tree);
    const projectName = options.project ?? [...workspace.projects.keys()][0];
    const project = projectName ? workspace.projects.get(projectName) : undefined;
    if (!project) {
      throw new SchematicsException(`Could not find a project named "${projectName}" in the workspace.`);
    }

    const selector = options.extends ? `${options.extends}-${name}` : name;
    const sourceRoot = project.sourceRoot ?? join(project.root, 'src');
    const dir = options.path ?? 'styles/themes';
    const target = join(sourceRoot, dir, `${selector}.css`).replaceAll('\\', '/');
    if (tree.exists(target)) {
      throw new SchematicsException(`${target} already exists.`);
    }

    tree.create(target, options.extends ? derivedTheme(selector, options.extends) : fullTheme(selector));
    context.logger.info(
      `Created ${target}. Import it after the base stylesheet:\n` +
        `  @import './${dir}/${selector}.css';\n` +
        `Then set data-theme="${selector}" on the document root.`,
    );
    return tree;
  };
}

// The full contract: every token the dark theme overrides, so the theme carries
// explicit light/dark meaning rather than silently inheriting the light value.
function fullTheme(selector: string): string {
  const template = readFileSync(join(__dirname, '_template.css'), 'utf-8');
  return template.replace(/\[data-theme='[^']*'\]/, `[data-theme='${selector}']`);
}

// A derived theme inherits every token of its base (the base selector matches
// `<base>` and `<base>-*`) and overrides only the tokens it lists here.
function derivedTheme(selector: string, base: string): string {
  return (
    `/* @extends ${base} */\n` +
    `[data-theme='${selector}'] {\n` +
    `  /* Override only the tokens that differ from the ${base} theme. */\n` +
    `}\n`
  );
}
