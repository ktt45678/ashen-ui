import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const library = join(root, 'libs', 'ashen-ui', 'src');
const routesFile = join(root, 'src', 'app', 'app.routes.ts');
const outputDirectory = join(root, 'docs-data');
const outputFile = join(outputDirectory, 'component-api.json');
const appOutputFile = join(root, 'src', 'app', 'shared', 'doc-api', 'component-api.generated.ts');
const intlDirectory = join(library, 'core', 'intl');

function text(node, source) {
  return node ? node.getText(source).replace(/\s+/g, ' ').trim() : '';
}

function decorators(node) {
  return ts.canHaveDecorators(node) ? ts.getDecorators(node) ?? [] : [];
}

function decorator(node, source, name) {
  return decorators(node).find((item) => text(item.expression, source).startsWith(`${name}(`));
}

function property(object, source, name) {
  if (!object || !ts.isObjectLiteralExpression(object)) return undefined;
  return object.properties.find(
    (item) => ts.isPropertyAssignment(item) && text(item.name, source).replace(/['"]/g, '') === name,
  );
}

function literal(node, source) {
  if (!node) return null;
  if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.getText(source);
  if (node.kind === ts.SyntaxKind.TrueKeyword || node.kind === ts.SyntaxKind.FalseKeyword) return node.getText(source);
  if (node.kind === ts.SyntaxKind.NullKeyword || ts.isIdentifier(node) && node.text === 'undefined') return node.getText(source);
  return null;
}

function callName(expression, source) {
  if (!ts.isCallExpression(expression)) return '';
  if (ts.isPropertyAccessExpression(expression.expression)) return text(expression.expression, source);
  return text(expression.expression, source);
}

function member(source, node) {
  if (!node.initializer || !ts.isCallExpression(node.initializer)) return null;
  const call = callName(node.initializer, source);
  const category = call.startsWith('input') ? 'inputs' : call.startsWith('model') ? 'models' : call === 'output' ? 'outputs' : '';
  if (!category || !node.name || !ts.isIdentifier(node.name)) return null;
  const options = node.initializer.arguments.find((argument) => ts.isObjectLiteralExpression(argument));
  const alias = property(options, source, 'alias');
  const binding = alias && ts.isPropertyAssignment(alias) ? literal(alias.initializer, source)?.replace(/['"]/g, '') : null;
  const required = call.endsWith('.required');
  const first = node.initializer.arguments[0];
  return {
    category,
    name: node.name.text,
    bindingName: binding ?? node.name.text,
    type: node.type
      ? text(node.type, source)
      : node.initializer.typeArguments?.[0]
        ? text(node.initializer.typeArguments[0], source)
        : inferredType(options, first, source),
    required,
    default: required || category === 'outputs' ? null : literal(first, source),
    description: ts.displayPartsToString(ts.getJSDocCommentsAndTags(node).flatMap((item) => item.comment ? [{ text: typeof item.comment === 'string' ? item.comment : '' }] : [])),
  };
}

/**
 * Untyped `input(...)` calls are still readable: the coercion transform names
 * the type outright, and otherwise the default value gives it away. Left as
 * `unknown`, these were the only rows in the tables that said nothing.
 */
function inferredType(options, first, source) {
  const transform = property(options, source, 'transform');
  if (transform && ts.isPropertyAssignment(transform)) {
    const name = text(transform.initializer, source);
    if (name.includes('booleanAttribute')) return 'boolean';
    if (name.includes('numberAttribute')) return 'number';
  }
  if (!first) return 'unknown';
  if (first.kind === ts.SyntaxKind.TrueKeyword || first.kind === ts.SyntaxKind.FalseKeyword) return 'boolean';
  if (ts.isNumericLiteral(first)) return 'number';
  if (ts.isStringLiteral(first)) return 'string';
  if (ts.isArrayLiteralExpression(first)) return 'unknown[]';
  return 'unknown';
}

/**
 * Every exported string-literal union in the library, keyed by name, so a table
 * can show `'fixed' | 'dynamic'` instead of a bare `SnSubscriptSizing`.
 * A doc comment on a constituent becomes that value's description.
 */
function unionTypes() {
  const types = {};
  const walk = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const full = join(directory, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts')) collectUnions(full, types);
    }
  };
  walk(library);
  return types;
}

/**
 * The doc comment written above a constituent, which TypeScript parks in the
 * trivia before the `|` rather than on the node, so read the raw gap instead.
 */
function constituentDescription(source, from, to) {
  const doc = [...source.text.slice(from, to).matchAll(/\/\*\*([\s\S]*?)\*\//g)].at(-1)?.[1];
  if (!doc) return '';
  return doc
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*\*\s?/, '').trim())
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function collectUnions(file, types) {
  const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  for (const statement of source.statements) {
    if (!ts.isTypeAliasDeclaration(statement)) continue;
    if (!statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) continue;
    const node = statement.type;
    const constituents = ts.isUnionTypeNode(node) ? [...node.types] : [node];
    let cursor = node.pos;
    const values = [];
    for (const item of constituents) {
      const start = item.getStart(source);
      const description = constituentDescription(source, cursor, start);
      cursor = item.end;
      if (!ts.isLiteralTypeNode(item) || !ts.isStringLiteral(item.literal)) continue;
      values.push({ value: item.literal.text, description });
    }
    if (values.length < 2) continue;
    // A union split across several files keeps the richest description set.
    const existing = types[statement.name.text];
    const described = values.filter((item) => item.description).length;
    if (existing && existing.values.filter((item) => item.description).length >= described) continue;
    types[statement.name.text] = { name: statement.name.text, values };
  }
}

function selector(source, classNode) {
  const item = decorator(classNode, source, 'Component') ?? decorator(classNode, source, 'Directive');
  if (!item || !ts.isCallExpression(item.expression)) return undefined;
  const argument = item.expression.arguments[0];
  const entry = property(argument, source, 'selector');
  return entry && ts.isPropertyAssignment(entry) ? literal(entry.initializer, source)?.replace(/['"]/g, '') : undefined;
}

function parseFile(file) {
  const sourceText = readFileSync(file, 'utf8');
  const source = ts.createSourceFile(file, sourceText, ts.ScriptTarget.Latest, true);
  const surfaces = [];
  for (const statement of source.statements) {
    if (!ts.isClassDeclaration(statement) || !statement.name) continue;
    const component = decorator(statement, source, 'Component');
    const directive = decorator(statement, source, 'Directive');
    if (!component && !directive) continue;
    const surface = {
      symbol: statement.name.text,
      kind: component ? 'component' : 'directive',
      selector: selector(source, statement),
      inputs: [],
      models: [],
      outputs: [],
    };
    for (const declaration of statement.members) {
      if (!ts.isPropertyDeclaration(declaration)) continue;
      const extracted = member(source, declaration);
      if (extracted) surface[extracted.category].push(extracted);
    }
    surfaces.push(surface);
  }
  return surfaces;
}

function routes() {
  const source = readFileSync(routesFile, 'utf8');
  return [...source.matchAll(/path:\s*'components\/([^']+)'/g)].map((item) => item[1]);
}

function sourceFiles(slug) {
  const directory = join(library, slug);
  if (!existsSync(directory)) return [];
  return readdirSync(directory)
    .filter((file) => file.endsWith('.ts') && !file.endsWith('.spec.ts') && !file.endsWith('.d.ts'))
    .map((file) => join(directory, file));
}

const globalTokenNames = (() => {
  const directory = join(library, 'styles', 'tokens');
  const names = new Set();
  if (!existsSync(directory)) return names;
  for (const file of readdirSync(directory).filter((entry) => entry.endsWith('.css'))) {
    for (const match of readFileSync(join(directory, file), 'utf8').matchAll(/(--sn-[\w-]+)\s*:/g)) names.add(match[1]);
  }
  return names;
})();

/**
 * Tokens a component declares under a part's own prefix, such as `--sn-tab-link-*`
 * in tab-nav.css. Overrides of another component's or a global token are skipped.
 */
function ownDeclaredTokens(slug, slugs) {
  const file = join(library, 'styles', 'components', `${slug}.css`);
  if (!existsSync(file)) return [];
  const others = slugs.filter((other) => other !== slug).map((other) => `--sn-${other}-`);
  return [...readFileSync(file, 'utf8').matchAll(/(--sn-[\w-]+)\s*:/g)]
    .map((match) => match[1])
    .filter((name) => !globalTokenNames.has(name) && !others.some((prefix) => name.startsWith(prefix)));
}

function tokenEntries(slug, slugs) {
  const tokenPattern = new RegExp(`--sn-${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-[\\w-]+`, 'g');
  const ownTokens = new Set(ownDeclaredTokens(slug, slugs));
  const directories = [join(library, 'styles', 'components'), join(library, 'styles', 'tokens')];
  const values = new Map();
  for (const directory of directories) {
    if (!existsSync(directory)) continue;
    for (const file of readdirSync(directory).filter((entry) => entry.endsWith('.css'))) {
      const source = readFileSync(join(directory, file), 'utf8');
      const ownHere = file === `${slug}.css` && directory.endsWith('components') ? [...ownTokens] : [];
      const names = new Set([...(source.match(tokenPattern) ?? []), ...ownHere]);
      for (const name of [...names].filter((token) => !token.endsWith('-'))) {
        const declaration = new RegExp(`${escapeRegExp(name)}\\s*:\\s*([^;]+);`).exec(source);
        const value = declaration?.[1] ?? fallbackDefault(source, name);
        if (value === null) {
          if (!values.has(name)) values.set(name, { name, default: null, source: null });
          continue;
        }
        const entry = {
          name,
          default: value.replace(/\s+/g, ' ').trim(),
          source: directory.endsWith('components') ? 'component' : 'global',
        };
        if (!values.has(name) || entry.source === 'component') values.set(name, entry);
      }
    }
  }
  return [...values.values()].sort((left, right) => left.name.localeCompare(right.name));
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Tokens used only as `var(--sn-x, value)` take `value` as their default.
function fallbackDefault(source, name) {
  const start = new RegExp(`var\\(\\s*${escapeRegExp(name)}\\s*,\\s*`).exec(source);
  if (!start) return null;
  const from = start.index + start[0].length;
  let depth = 0;
  for (let index = from; index < source.length; index++) {
    if (source[index] === '(') depth++;
    else if (source[index] === ')' && depth-- === 0) return source.slice(from, index);
  }
  return null;
}

function intlRegistry() {
  const registry = new Map();
  for (const file of readdirSync(intlDirectory).filter((entry) => entry.endsWith('.ts') && !entry.endsWith('.spec.ts'))) {
    const sourceText = readFileSync(join(intlDirectory, file), 'utf8');
    const source = ts.createSourceFile(file, sourceText, ts.ScriptTarget.Latest, true);
    for (const statement of source.statements) {
      if (!ts.isClassDeclaration(statement) || !statement.name || !/^Sn.+Intl$/.test(statement.name.text)) continue;
      const rows = [];
      for (const declaration of statement.members) {
        if (!ts.isPropertyDeclaration(declaration) || !declaration.name || !ts.isIdentifier(declaration.name)) continue;
        const value = literal(declaration.initializer, source);
        if (value !== null) rows.push({ key: declaration.name.text, englishDefault: value.replace(/^['"]|['"]$/g, '') });
      }
      registry.set(statement.name.text, rows);
    }
  }
  return registry;
}

function intlEntries(files, registry) {
  const classes = new Set(files.flatMap((file) => readFileSync(file, 'utf8').match(/\bSn[A-Za-z0-9]+Intl\b/g) ?? []));
  return [...classes].flatMap((name) => (registry.get(name) ?? []).map((item) => ({
    group: name.replace(/^Sn|Intl$/g, '').replace(/[A-Z]/g, (letter, index) => (index ? '-' : '') + letter.toLowerCase()),
    ...item,
  })));
}

function migratePage(slug) {
  const directory = join(root, 'src', 'app', 'pages', 'components', slug);
  const htmlFile = join(directory, `${slug}-page.html`);
  const tsFile = join(directory, `${slug}-page.ts`);
  let html = readFileSync(htmlFile, 'utf8');
  html = html.replace(/<section class="page-section">([\s\S]*?)<\/section>/g, (section, body) => {
    const heading = /<h2\b[^>]*>([\s\S]*?)<\/h2>/.exec(body)?.[1]?.replace(/<[^>]+>/g, '').trim();
    if (heading === 'API') {
      return `<section class="page-section">\n      <h2>API</h2>\n      <doc-api slug="${slug}" section="api" />\n    </section>`;
    }
    if (heading === 'Theming') {
      return `<section class="page-section">\n      <h2>Theming</h2>\n      <doc-api slug="${slug}" section="theming" />\n    </section>`;
    }
    return section;
  });
  writeFileSync(htmlFile, html);

  let page = readFileSync(tsFile, 'utf8');
  if (!page.includes("doc-api/doc-api")) {
    const exampleImport = /import \{ DocExample \} from '([^']+)';/.exec(page);
    if (!exampleImport) throw new Error(`${slug}: DocExample import not found`);
    page = page.replace(exampleImport[0], `${exampleImport[0]}\nimport { DocApi } from '${exampleImport[1].replace('doc-example/doc-example', 'doc-api/doc-api')}';`);
  }
  page = page.replace(/imports:\s*\[([\s\S]*?)\]/g, (_, imports) => {
    if (/\bDocApi\b/.test(imports)) return `imports: [${imports}]`;
    const normalized = imports.trimEnd().replace(/,\s*$/, '');
    return `imports: [${normalized}, DocApi]`;
  });
  page = page.replace(/,\s*,\s*DocApi\]/g, ', DocApi]');
  writeFileSync(tsFile, page);
}

const registry = intlRegistry();
const allUnions = unionTypes();

// Only the unions a page actually mentions, so each record stays self-contained.
function referencedTypes(surfaces) {
  const referenced = {};
  for (const surface of surfaces) {
    for (const member of [...surface.inputs, ...surface.models, ...surface.outputs]) {
      for (const name of member.type.match(/[A-Za-z_$][\w$]*/g) ?? []) {
        if (allUnions[name]) referenced[name] = allUnions[name];
      }
    }
  }
  return referenced;
}

const slugs = routes();
const data = Object.fromEntries(
  slugs.map((slug) => {
    const files = sourceFiles(slug);
    const surfaces = files.flatMap(parseFile);
    return [
      slug,
      {
        slug,
        importPath: `ashen-ui/${slug}`,
        surfaces,
        types: referencedTypes(surfaces),
        tokens: tokenEntries(slug, slugs),
        intl: intlEntries(files, registry),
      },
    ];
  }),
);

if (process.argv.includes('--migrate')) {
  for (const slug of routes()) migratePage(slug);
}

mkdirSync(outputDirectory, { recursive: true });
mkdirSync(dirname(appOutputFile), { recursive: true });
const json = JSON.stringify(data, null, 2) + '\n';
const appSource = `export const COMPONENT_API = ${JSON.stringify(data, null, 2)} as const;\n`;
// The JSON is an ignored build input for the LLM docs, so only the committed file is checked.
writeFileSync(outputFile, json);
if (process.argv.includes('--check')) {
  if (!existsSync(appOutputFile) || readFileSync(appOutputFile, 'utf8') !== appSource) {
    throw new Error('generated component API data is stale. Run pnpm docs:api.');
  }
} else {
  writeFileSync(appOutputFile, appSource);
}
console.log(`generated source API data for ${Object.keys(data).length} component pages`);
