import { existsSync, readFileSync } from 'node:fs';
import ts from 'typescript';
import { libraryIndex, selectorMatches } from './library-index.mjs';

const SHOWCASE_ONLY = new Set(['DocExample', 'DocApi']);
const index = libraryIndex();

function identifiers(text) {
  return new Set(text.match(/[A-Za-z_$][\w$]*/g) ?? []);
}

/**
 * Identifiers in code only. Strings and comments are stripped first, so a
 * header like `'Imperative Dialog'` does not pull in the `Dialog` component.
 */
function codeIdentifiers(text) {
  return identifiers(
    text
      .replace(/\/\*[\s\S]*?\*\//g, ' ')
      .replace(/\/\/[^\n]*/g, ' ')
      .replace(/`(?:\\.|[^`\\])*`/g, ' ')
      .replace(/'(?:\\.|[^'\\])*'/g, ' ')
      .replace(/"(?:\\.|[^"\\])*"/g, ' '),
  );
}

function kebab(symbol) {
  return symbol
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

function decoratorCall(node, name) {
  if (!ts.canHaveDecorators(node)) return undefined;
  for (const item of ts.getDecorators(node) ?? []) {
    if (ts.isCallExpression(item.expression) && item.expression.expression.getText().trim() === name) {
      return item.expression;
    }
  }
  return undefined;
}

/**
 * Everything a showcase page declares, indexed so a single demo can pull out
 * just the members, types and child components that demo actually touches.
 */
export function parsePage(file) {
  const text = readFileSync(file, 'utf8');
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const imports = new Map();
  const members = new Map();
  const declarations = new Map();
  const children = new Map();
  let pageClass;

  for (const statement of source.statements) {
    if (ts.isImportDeclaration(statement) && statement.importClause?.namedBindings) {
      const from = statement.moduleSpecifier.getText(source).replace(/['"]/g, '');
      const bindings = statement.importClause.namedBindings;
      if (ts.isNamedImports(bindings)) {
        for (const element of bindings.elements) imports.set(element.name.text, from);
      }
      continue;
    }
    if (ts.isTypeAliasDeclaration(statement) || ts.isInterfaceDeclaration(statement)) {
      declarations.set(statement.name.text, sourceOf(statement, source));
      continue;
    }
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) {
          declarations.set(declaration.name.text, sourceOf(statement, source));
        }
      }
      continue;
    }
    if (!ts.isClassDeclaration(statement) || !statement.name) continue;
    const component = decoratorCall(statement, 'Component');
    const isPage = /templateUrl:\s*'\.\/[\w-]+-page\.html'/.test(statement.getText(source));
    if (isPage) {
      pageClass = statement;
      for (const declaration of statement.members) {
        if (!declaration.name || !ts.isIdentifier(declaration.name)) continue;
        if (/^(ts|scss|code)[A-Z]/.test(declaration.name.text)) continue;
        members.set(declaration.name.text, memberSource(declaration, source));
      }
    } else if (component) {
      children.set(statement.name.text, {
        symbol: statement.name.text,
        file: `${kebab(statement.name.text).replace(/-page$/, '')}.ts`,
        code: sourceOf(statement, source),
      });
    }
  }

  return { imports, members, declarations, children, pageClass, source, text };
}

function sourceOf(node, source) {
  const start = node.getStart(source, false);
  return source.text.slice(commentStart(source, node, start), node.end).trim();
}

function commentStart(source, node, fallback) {
  const ranges = ts.getLeadingCommentRanges(source.text, node.pos) ?? [];
  const doc = ranges.filter((range) => source.text.slice(range.pos, range.pos + 3) === '/**').at(-1);
  return doc ? doc.pos : fallback;
}

function memberSource(node, source) {
  const raw = sourceOf(node, source);
  // Drop showcase-only visibility so the snippet reads like app code.
  return raw.replace(/^protected\s+/, '').replace(/\n(\s*)protected\s+/g, '\n$1');
}

/** Members a demo needs, following references between them until it closes. */
function reachable(names, members) {
  const wanted = new Set();
  const queue = [...names];
  while (queue.length) {
    const name = queue.pop();
    if (wanted.has(name) || !members.has(name)) continue;
    wanted.add(name);
    for (const identifier of codeIdentifiers(members.get(name))) {
      if (members.has(identifier) && !wanted.has(identifier)) queue.push(identifier);
    }
  }
  return wanted;
}

function importLines(symbols, imports) {
  const byModule = new Map();
  for (const symbol of [...symbols].sort()) {
    const from = imports.get(symbol);
    if (!from || from.includes('shared/doc-')) continue;
    if (!byModule.has(from)) byModule.set(from, []);
    byModule.get(from).push(symbol);
  }
  const order = (module) =>
    module.startsWith('@angular/core') ? 0 : module.startsWith('@angular') ? 1 : module.startsWith('ashen-ui') ? 2 : 3;
  return [...byModule.entries()]
    .sort((a, b) => order(a[0]) - order(b[0]) || a[0].localeCompare(b[0]))
    .map(([module, names]) => `import { ${names.join(', ')} } from '${module}';`);
}

/** Re-indent a class member that was lifted out of its original nesting. */
function indent(code, spaces) {
  const lines = code.split('\n');
  const widths = lines.slice(1).filter((line) => line.trim()).map((line) => line.match(/^\s*/)[0].length);
  const shift = widths.length ? Math.min(...widths) : 0;
  const pad = ' '.repeat(spaces);
  return lines
    .map((line, position) => (line.trim() ? pad + (position === 0 ? line : line.slice(shift)) : line))
    .join('\n');
}

/** Top-level rules whose selector names a class the demo markup uses. */
function scssFor(html, scssFile) {
  if (!existsSync(scssFile)) return '';
  const sheet = readFileSync(scssFile, 'utf8');
  const classes = new Set(
    [...html.matchAll(/class="([^"]*)"/g)].flatMap((match) => match[1].split(/\s+/)).filter(Boolean),
  );
  const rules = [];
  let index = 0;
  while (index < sheet.length) {
    const open = sheet.indexOf('{', index);
    if (open === -1) break;
    const selector = sheet.slice(index, open).trim();
    let depth = 1;
    let cursor = open + 1;
    while (cursor < sheet.length && depth > 0) {
      if (sheet[cursor] === '{') depth += 1;
      else if (sheet[cursor] === '}') depth -= 1;
      cursor += 1;
    }
    const named = [...selector.matchAll(/\.([\w-]+)/g)].map((item) => item[1]);
    if (named.length && named.some((name) => classes.has(name))) {
      rules.push(dedentRule(`${selector} ${sheet.slice(open, cursor)}`));
    }
    index = cursor;
  }
  return rules.join('\n\n');
}

function dedentRule(rule) {
  const lines = rule.split(/\r?\n/);
  const indents = lines.slice(1).filter((line) => line.trim()).map((line) => line.match(/^\s*/)[0].length);
  const shift = indents.length ? Math.min(...indents) : 0;
  return [lines[0].trim(), ...lines.slice(1).map((line) => line.slice(shift))].join('\n').trim();
}

/**
 * The files a reader would have to write to reproduce one demo: its template,
 * the component that backs it, any child component it opens, and the few style
 * rules the markup leans on.
 */
export function demoFiles(html, page, scssFile) {
  const used = identifiers(html);
  const memberNames = [...page.members.keys()].filter((name) => used.has(name));
  const wanted = reachable(memberNames, page.members);

  const childSymbols = new Set();
  const declarationNames = new Set();
  const scan = (code) => {
    for (const identifier of codeIdentifiers(code)) {
      if (page.children.has(identifier)) childSymbols.add(identifier);
      if (page.declarations.has(identifier)) declarationNames.add(identifier);
    }
  };
  for (const name of wanted) scan(page.members.get(name));
  scan(html);

  const childCode = [...childSymbols].map((symbol) => page.children.get(symbol));
  const symbols = new Set();
  for (const [symbol, entry] of index) {
    if (!page.imports.has(symbol)) continue;
    if (selectorMatches(entry.selector, html)) symbols.add(symbol);
  }
  const referenced = new Set([
    ...[...wanted].flatMap((name) => [...codeIdentifiers(page.members.get(name))]),
    ...childCode.flatMap((child) => [...codeIdentifiers(child.code)]),
    ...[...declarationNames].flatMap((name) => [...codeIdentifiers(page.declarations.get(name))]),
  ]);
  for (const symbol of referenced) {
    if (page.imports.has(symbol) && !SHOWCASE_ONLY.has(symbol)) symbols.add(symbol);
  }
  // Directives are only imported when their selector is actually in the markup;
  // services, tokens and types come along because the class body names them.
  for (const symbol of [...symbols]) {
    const entry = index.get(symbol);
    if (entry?.selector && !selectorMatches(entry.selector, html) && !referenced.has(symbol)) symbols.delete(symbol);
  }
  if (wanted.size || childCode.length) symbols.add('Component');

  const declarationCode = [...declarationNames].map((name) => page.declarations.get(name));
  const body = [...wanted]
    .sort((a, b) => [...page.members.keys()].indexOf(a) - [...page.members.keys()].indexOf(b))
    .map((name) => indent(page.members.get(name), 2))
    .join('\n\n');

  // Angular's own directives carry no entry in the library index, so key them
  // off the bindings the markup actually uses.
  for (const [module, pattern] of [
    ['FormsModule', /\[\(ngModel\)\]|\bngModel\b/],
    ['ReactiveFormsModule', /\[formControl\]|\[formGroup\]|formControlName/],
    ['NgTemplateOutlet', /\*ngTemplateOutlet|\[ngTemplateOutlet\]/],
  ]) {
    if (pattern.test(html) && page.imports.has(module)) symbols.add(module);
  }

  const componentImports = [...symbols]
    .filter((symbol) => index.has(symbol) && index.get(symbol).selector)
    .sort();
  const extraImports = [...symbols].filter((symbol) => /^(FormsModule|ReactiveFormsModule|NgTemplateOutlet)$/.test(symbol));
  const declared = [...new Set([...componentImports, ...extraImports])].sort();

  const ts = [
    ...importLines(new Set([...symbols, 'Component']), new Map([...page.imports, ['Component', '@angular/core']])),
    ...childCode.map((child) => `import { ${child.symbol} } from './${child.file.replace(/\.ts$/, '')}';`),
    '',
    ...(declarationCode.length ? [declarationCode.join('\n\n'), ''] : []),
    '@Component({',
    "  selector: 'app-demo',",
    ...(declared.length ? [`  imports: [${declared.join(', ')}],`] : []),
    "  templateUrl: './demo.html',",
    '})',
    `export class Demo {${body ? `\n${body}\n` : ''}}`,
  ].join('\n');

  const files = [{ name: 'demo.html', lang: 'html', code: html }];
  files.push({ name: 'demo.ts', lang: 'ts', code: ts });
  const scss = scssFor(html, scssFile);
  if (scss) files.push({ name: 'demo.scss', lang: 'scss', code: scss });
  for (const child of childCode) files.push({ name: child.file, lang: 'ts', code: child.code });
  return files;
}
