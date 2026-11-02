import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { demoFiles, parsePage } from './lib/demo-sources.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const pagesDir = join(root, 'src', 'app', 'pages', 'components');
const outputFile = join(root, 'src', 'app', 'shared', 'doc-example', 'doc-snippets.generated.ts');
const decodeEntities = {
  '&lt;': '<',
  '&gt;': '>',
  '&amp;': '&',
  '&quot;': '"',
  '&#39;': "'",
  '&nbsp;': ' ',
  '&#64;': '@',
  '&#123;': '{',
  '&#125;': '}',
};

function decode(value) {
  return value.replace(/&lt;|&gt;|&amp;|&quot;|&#39;|&nbsp;|&#64;|&#123;|&#125;/g, (entity) => decodeEntities[entity]);
}

function dedent(value) {
  const lines = decode(value.replace(/\r\n/g, '\n')).split('\n');
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines.at(-1).trim()) lines.pop();
  const indents = lines.filter((line) => line.trim()).map((line) => line.match(/^\s*/)[0].length);
  const indent = indents.length ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(indent)).join('\n');
}

function componentDirectories() {
  return readdirSync(pagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function openingTagEnd(source, start) {
  let quote = '';
  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (character === quote) quote = '';
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (character === '>') return index;
  }
  return -1;
}

function docExamples(source, slug) {
  const examples = [];
  const start = /<doc-example\b/g;
  while (start.exec(source)) {
    const openingEnd = openingTagEnd(source, start.lastIndex);
    if (openingEnd === -1) throw new Error(`${slug}: doc-example opening tag is incomplete`);
    const attributes = source.slice(start.lastIndex, openingEnd);
    const end = source.indexOf('</doc-example>', openingEnd + 1);
    if (end === -1) throw new Error(`${slug}: doc-example has no closing tag`);
    const snippet = /\bsnippet="([^"]+)"/.exec(attributes)?.[1];
    if (!snippet) throw new Error(`${slug}: doc-example must declare a snippet key`);
    examples.push({ key: snippet, code: dedent(source.slice(openingEnd + 1, end)) });
    start.lastIndex = end + '</doc-example>'.length;
  }
  return examples;
}

function closingTemplateLiteral(source, start) {
  for (let index = start; index < source.length; index += 1) {
    if (source[index] === '\\') {
      index += 1;
      continue;
    }
    if (source[index] === '`') return index;
  }
  return -1;
}

function migratePage(slug) {
  const htmlFile = join(pagesDir, slug, `${slug}-page.html`);
  const tsFile = join(pagesDir, slug, `${slug}-page.ts`);
  let html = readFileSync(htmlFile, 'utf8');
  const props = new Set();
  html = html.replace(/\[code\]="([A-Za-z_$][\w$]*)"/g, (_, property) => {
    props.add(property);
    return `snippet="${slug}/${property}"`;
  });
  const occurrences = new Map();
  html = html.replace(/\bsnippet="([^"]+)"/g, (_, key) => {
    const occurrence = (occurrences.get(key) ?? 0) + 1;
    occurrences.set(key, occurrence);
    return `snippet="${occurrence === 1 ? key : `${key}-${occurrence}`}"`;
  });
  writeFileSync(htmlFile, html);

  let ts = readFileSync(tsFile, 'utf8');
  for (const property of props) {
    const uses = ts.match(new RegExp(`\\b${property}\\b`, 'g')) ?? [];
    if (uses.length !== 1) continue;
    const declaration = new RegExp(
      '^[\\t ]*(?:protected\\s+)?readonly\\s+' + property + '\\s*(?::[^=;]+)?=\\s*`',
      'm',
    ).exec(ts);
    if (!declaration || declaration.index === undefined) {
      throw new Error(`${slug}: unable to remove ${property}`);
    }
    const closing = closingTemplateLiteral(ts, declaration.index + declaration[0].length);
    if (closing === -1) throw new Error(`${slug}: unterminated ${property} template literal`);
    const end = ts.indexOf(';', closing);
    if (end === -1) throw new Error(`${slug}: missing semicolon after ${property}`);
    ts = ts.slice(0, declaration.index) + ts.slice(end + 1).replace(/^\r?\n/, '');
  }
  writeFileSync(tsFile, ts);
}

function collectSnippets() {
  const snippets = {};
  for (const slug of componentDirectories()) {
    const file = join(pagesDir, slug, `${slug}-page.html`);
    const page = parsePage(join(pagesDir, slug, `${slug}-page.ts`));
    const scssFile = join(pagesDir, slug, `${slug}-page.scss`);
    for (const example of docExamples(readFileSync(file, 'utf8'), slug)) {
      if (snippets[example.key] !== undefined) throw new Error(`duplicate snippet key: ${example.key}`);
      snippets[example.key] = demoFiles(example.code, page, scssFile);
    }
  }
  return snippets;
}

function output(snippets) {
  return [
    '/** One source file behind a documentation example. */',
    'export interface DocSnippetFile {',
    '  readonly name: string;',
    "  readonly lang: 'html' | 'ts' | 'scss';",
    '  readonly code: string;',
    '}',
    '',
    'export const DOC_SNIPPETS: Readonly<Record<string, readonly DocSnippetFile[]>> = ' +
      JSON.stringify(snippets, null, 2) +
      ';',
    '',
  ].join('\n');
}

if (process.argv.includes('--migrate')) {
  for (const slug of componentDirectories()) migratePage(slug);
}

const generated = output(collectSnippets());
if (process.argv.includes('--check')) {
  if (!existsSync(outputFile) || readFileSync(outputFile, 'utf8') !== generated) {
    throw new Error('generated documentation snippets are stale. Run pnpm docs:snippets.');
  }
} else {
  writeFileSync(outputFile, generated);
}

console.log(`generated ${Object.keys(collectSnippets()).length} documentation snippets`);
