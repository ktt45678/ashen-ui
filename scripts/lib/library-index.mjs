import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const here = dirname(fileURLToPath(import.meta.url));
const library = join(here, '..', '..', 'libs', 'ashen-ui', 'src');

function decoratorCall(node, name) {
  if (!ts.canHaveDecorators(node)) return undefined;
  for (const item of ts.getDecorators(node) ?? []) {
    if (!ts.isCallExpression(item.expression)) continue;
    if (item.expression.expression.getText().trim() === name) return item.expression;
  }
  return undefined;
}

function selectorOf(call, source) {
  const argument = call.arguments[0];
  if (!argument || !ts.isObjectLiteralExpression(argument)) return '';
  for (const item of argument.properties) {
    if (!ts.isPropertyAssignment(item)) continue;
    if (item.name.getText(source).replace(/['"]/g, '') !== 'selector') continue;
    if (ts.isStringLiteral(item.initializer)) return item.initializer.text;
  }
  return '';
}

/**
 * Every exported class in the library, mapped to the selector it answers to and
 * the entry point it ships from, so a generator can turn demo markup back into
 * the import list that markup needs.
 */
export function libraryIndex() {
  const symbols = new Map();
  for (const entry of readdirSync(library, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const entryPoint = `ashen-ui/${entry.name}`;
    const walk = (directory) => {
      for (const file of readdirSync(directory, { withFileTypes: true })) {
        const full = join(directory, file.name);
        if (file.isDirectory()) walk(full);
        else if (file.name.endsWith('.ts') && !file.name.endsWith('.spec.ts')) collect(full, entryPoint, symbols);
      }
    };
    walk(join(library, entry.name));
  }
  return symbols;
}

function collect(file, entryPoint, symbols) {
  const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  for (const statement of source.statements) {
    if (!ts.isClassDeclaration(statement) || !statement.name) continue;
    if (!statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) continue;
    const call = decoratorCall(statement, 'Component') ?? decoratorCall(statement, 'Directive');
    const symbol = statement.name.text;
    if (symbols.has(symbol)) continue;
    symbols.set(symbol, { symbol, entryPoint, selector: call ? selectorOf(call, source) : '' });
  }
}

/**
 * Does `html` use this selector? Each comma-separated part is matched on its
 * element name and on every attribute it requires, which covers `sn-dialog`,
 * `input[snInputText]` and bare `[snPrefix]` alike.
 */
export function selectorMatches(selector, html) {
  if (!selector) return false;
  return selector.split(',').some((part) => {
    const trimmed = part.trim();
    if (!trimmed) return false;
    const element = /^[a-zA-Z][\w-]*/.exec(trimmed)?.[0];
    const attrs = [...trimmed.matchAll(/\[([\w-]+)[^\]]*\]/g)].map((match) => match[1]);
    if (element && !new RegExp(`<${element}[\\s/>]`).test(html)) return false;
    return attrs.every((attr) => new RegExp(`[\\s[(]${attr}[\\s\\]=/>)]`).test(html));
  });
}

export function libraryEntryPoints() {
  return readdirSync(library, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(library, entry.name, 'index.ts')))
    .map((entry) => `ashen-ui/${entry.name}`);
}
