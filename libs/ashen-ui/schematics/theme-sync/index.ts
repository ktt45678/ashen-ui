import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { join } from 'node:path';
import { Declaration, TokenLayout, readThemeDeclarations, readTokenLayout } from '../tokens';
import { ThemeSyncOptions } from './schema';

interface Plan {
  /** The library no longer defines this token. */
  readonly remove: Array<Declaration & { nearest: string[] }>;
  /** Real token, but set where it cannot reach the element that declares it. */
  readonly move: Array<Declaration & { owners: readonly string[] }>;
  /** Required by the light/dark contract and absent. */
  readonly add: Array<{ token: string; darkValue: string }>;
}

const THEME_SELECTOR = /\[data-theme[|~^$*]?=['"]?([\w-]+)['"]?\]/;

export function themeSync(options: ThemeSyncOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const path = (options.file ?? '').replace(/^\.?\//, '');
    if (!tree.exists(path)) {
      throw new SchematicsException(`No theme file at ${path}.`);
    }

    const source = tree.readText(path);
    const layout = readTokenLayout(join(__dirname, '..', '..', 'styles'));
    if (!layout.contract.size) {
      throw new SchematicsException(
        'Could not read the Ashen UI token stylesheets. Is the ashen-ui package installed?',
      );
    }

    const declarations = readThemeDeclarations(source);
    const themeName = THEME_SELECTOR.exec(source)?.[1];
    if (!themeName) {
      throw new SchematicsException(`${path} has no [data-theme='…'] block.`);
    }

    const plan = buildPlan(declarations, layout);
    report(context, path, plan);

    const stale = plan.remove.length + plan.move.length + plan.add.length;
    if (options.check && stale) {
      throw new SchematicsException(`${path} is out of date with the installed ashen-ui.`);
    }
    if (!stale || !options.apply) {
      if (stale) context.logger.info('\nRe-run with --apply to write these changes.');
      return tree;
    }

    tree.overwrite(path, rewrite(source, plan, themeName));
    context.logger.info(`\nUpdated ${path}. Review the diff: values are never rewritten, only moved.`);
    return tree;
  };
}

function buildPlan(declarations: Declaration[], layout: TokenLayout): Plan {
  const plan: Plan = { remove: [], move: [], add: [] };
  const seen = new Set<string>();

  for (const declaration of declarations) {
    if (!THEME_SELECTOR.test(declaration.selector) && declaration.selector !== ':root') continue;
    seen.add(declaration.token);

    if (!layout.known.has(declaration.token)) {
      plan.remove.push({ ...declaration, nearest: nearest(declaration.token, layout.known) });
      continue;
    }

    const owners = layout.owned.get(declaration.token);
    if (owners && !owners.some((owner) => reaches(declaration.selector, owner))) {
      plan.move.push({ ...declaration, owners });
    }
  }

  for (const [token, darkValue] of layout.contract) {
    if (!seen.has(token)) plan.add.push({ token, darkValue });
  }
  return plan;
}

/**
 * A component token is only settable from a rule that matches the element
 * declaring it: a declaration on the element beats a value inherited from an
 * ancestor, whatever the specificity and whatever the layer. So the theme's
 * selector has to name that element too.
 */
function reaches(themeSelector: string, owner: string): boolean {
  const classes = owner.match(/\.[\w-]+/g) ?? [];
  if (!classes.length) return true;
  return classes.every((name) => themeSelector.includes(name));
}

function nearest(token: string, known: ReadonlySet<string>): string[] {
  const parts = token.replace(/^--sn-/, '').split('-');
  return [...known]
    .map((candidate) => {
      const other = candidate.replace(/^--sn-/, '').split('-');
      const shared = parts.filter((part) => other.includes(part)).length;
      return { candidate, score: shared / Math.max(parts.length, other.length) };
    })
    .filter((entry) => entry.score >= 0.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.candidate);
}

function report(context: SchematicContext, path: string, plan: Plan): void {
  const { logger } = context;
  if (!plan.remove.length && !plan.move.length && !plan.add.length) {
    logger.info(`${path} is up to date with the installed ashen-ui.`);
    return;
  }

  if (plan.remove.length) {
    logger.info(`\nRemove ${plan.remove.length} token(s) the library no longer defines:`);
    for (const entry of plan.remove) {
      const hint = entry.nearest.length ? `  (did you mean ${entry.nearest.join(', ')}?)` : '';
      logger.info(`  line ${entry.line}  ${entry.token}${hint}`);
    }
  }

  if (plan.move.length) {
    logger.info(`\nMove ${plan.move.length} token(s) into a block that reaches the element declaring them:`);
    for (const entry of plan.move) {
      logger.info(`  line ${entry.line}  ${entry.token}  ->  declared on ${entry.owners.join(', ')}`);
    }
    logger.info('  Set where they are now, these silently do nothing.');
  }

  if (plan.add.length) {
    logger.info(`\nAdd ${plan.add.length} token(s) the light/dark contract requires:`);
    for (const entry of plan.add) logger.info(`  ${entry.token}  /* dark: ${entry.darkValue} */`);
    logger.info('  Each is added with an empty value to fill in; left out, it inherits the light value.');
  }
}

function rewrite(source: string, plan: Plan, themeName: string): string {
  const drop = new Set([...plan.remove, ...plan.move].map((entry) => entry.line));
  const lines = source.split('\n');
  const kept = lines.filter((_, index) => !drop.has(index + 1));

  const additions: string[] = [];
  if (plan.add.length) {
    additions.push('', `/* Added by ashen-ui:theme-sync. Give each one a value. */`);
    additions.push(`[data-theme='${themeName}'] {`);
    for (const entry of plan.add) additions.push(`  ${entry.token}: ; /* dark: ${entry.darkValue} */`);
    additions.push('}');
  }

  // One block per owning selector, because a component token is only settable
  // on the element that declares it.
  const byOwner = new Map<string, Array<Declaration>>();
  for (const entry of plan.move) {
    const owner = entry.owners[0];
    byOwner.set(owner, [...(byOwner.get(owner) ?? []), entry]);
  }
  for (const [owner, entries] of byOwner) {
    additions.push('', `/* Moved by ashen-ui:theme-sync: declared on ${owner}, so set there. */`);
    additions.push(`[data-theme='${themeName}'] ${owner} {`);
    for (const entry of entries) additions.push(`  ${entry.token}: ${entry.value};`);
    additions.push('}');
  }

  const body = kept.join('\n').replace(/\n+$/, '\n');
  return additions.length ? `${body}${additions.join('\n')}\n` : body;
}
