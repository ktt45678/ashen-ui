// Usage: node scripts/generate-llm-docs.mjs
// Writes public/components/<slug>.md, public/llms.txt and public/llms-full.txt from the component pages.
// It targets the fixed page scaffold directly, so it needs no HTML parser dependency.

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const pagesDir = join(root, 'src', 'app', 'pages', 'components');
const routesFile = join(root, 'src', 'app', 'app.routes.ts');
const publicDir = join(root, 'public');
const compDir = join(publicDir, 'components');
const guidesDir = join(publicDir, 'guides');
const manifestFile = join(publicDir, 'llm-docs-manifest.json');
const snippetsFile = join(root, 'src', 'app', 'shared', 'doc-example', 'doc-snippets.generated.ts');
const apiFile = join(root, 'docs-data', 'component-api.json');

// Absolute site origin for the links in llms.txt. Empty produces root-relative
// links, which is the safe default until the deploy domain is known.
const configuredSite = (process.env.DOCS_SITE_URL ?? '').trim();
const SITE = configuredSite.replace(/\/+$/, '');

if (process.env.NODE_ENV === 'production' && !SITE) {
  throw new Error('DOCS_SITE_URL is required for production LLM documentation links.');
}

const ENTITIES = {
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

function decode(s) {
  return s.replace(/&lt;|&gt;|&amp;|&quot;|&#39;|&nbsp;|&#64;|&#123;|&#125;/g, (m) => ENTITIES[m]);
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, '');
}

/** Convert an inline HTML fragment to a single line of Markdown. */
function inline(html) {
  const s = html
    // Entities stay encoded until the final decode(), so `<sn-select>` inside <code> is not stripped as a tag.
    .replace(/<code>([\s\S]*?)<\/code>/g, (_, c) => '`' + stripTags(c) + '`')
    .replace(/<strong>([\s\S]*?)<\/strong>/g, '**$1**')
    .replace(/<em>([\s\S]*?)<\/em>/g, '*$1*')
    .replace(
      /<a\b[^>]*(?:routerLink|href)="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g,
      (_, href, t) => '[' + stripTags(t).trim() + '](' + href + ')',
    )
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/<[^>]+>/g, '');
  return decode(s).replace(/\s+/g, ' ').trim();
}

function cell(html) {
  return inline(html).replace(/\|/g, '\\|');
}

function mdTable(inner) {
  const headers = [...inner.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/g)].map((m) => cell(m[1]));
  if (!headers.length) return '';
  const rows = [];
  for (const tr of inner.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)) {
    const tds = [...tr[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map((m) => cell(m[1]));
    if (tds.length) rows.push(tds);
  }
  const line = (cells) => '| ' + cells.join(' | ') + ' |';
  const out = [line(headers), '| ' + headers.map(() => '---').join(' | ') + ' |'];
  for (const r of rows) out.push(line(headers.map((_, i) => r[i] ?? '')));
  return out.join('\n');
}

function snippet(tsSrc, prop) {
  const declaration = new RegExp(
    '\\b(?:protected\\s+)?readonly\\s+' + prop + '\\s*(?::[^=;]+)?=\\s*`',
  ).exec(tsSrc);
  if (!declaration || declaration.index === undefined) return null;

  let value = '';
  for (let index = declaration.index + declaration[0].length; index < tsSrc.length; index += 1) {
    const character = tsSrc[index];
    if (character === '\\') {
      value += character + (tsSrc[index + 1] ?? '');
      index += 1;
      continue;
    }
    if (character === '`') {
      return value.replace(/\\`/g, '`').replace(/\\\\/g, '\\');
    }
    value += character;
  }
  return null;
}

function attr(tag, name) {
  const m = tag.match(new RegExp(name + '="([^"]*)"'));
  return m ? m[1] : null;
}

function generatedSnippets() {
  const source = readFileSync(snippetsFile, 'utf8');
  const json = source.match(/=\s*([\s\S]*);\s*$/)?.[1];
  if (!json) throw new Error('generated documentation snippets are malformed. Run pnpm docs:snippets.');
  return JSON.parse(json);
}

function generatedApi() {
  if (!existsSync(apiFile)) throw new Error('generated component API data is missing. Run pnpm docs:api.');
  return JSON.parse(readFileSync(apiFile, 'utf8'));
}

function apiTable(headers, rows) {
  const cell = (value) => String(value ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\s+/g, ' ')
    .trim();
  const line = (cells) => '| ' + cells.map(cell).join(' | ') + ' |';
  return [line(headers), line(headers.map(() => '---')), ...rows.map(line)].join('\n');
}

function renderSourceApi(api) {
  if (!api?.surfaces.length) return 'Source API metadata is not available for this entry point.';
  const out = [];
  for (const surface of api.surfaces) {
    out.push(`### ${surface.symbol}`);
    if (surface.selector) out.push('`' + surface.selector + '`');
    for (const [heading, members] of [
      ['Inputs', surface.inputs],
      ['Models', surface.models],
      ['Outputs', surface.outputs],
    ]) {
      if (!members.length) continue;
      const headers = heading === 'Outputs' ? ['Name', 'Type'] : ['Name', 'Type', 'Default'];
      const rows = members.map((member) => heading === 'Outputs'
        ? ['`' + member.bindingName + '`', '`' + member.type + '`']
        : ['`' + member.bindingName + '`', '`' + member.type + '`', '`' + (member.default ?? (member.required ? 'required' : 'undefined')) + '`']);
      out.push('#### ' + heading, apiTable(headers, rows));
    }
  }
  if (api.intl?.length) {
    out.push('### Built-in text', apiTable(
      ['Group', 'Key', 'English default'],
      api.intl.map((item) => ['`' + item.group + '`', '`' + item.key + '`', item.englishDefault]),
    ));
  }
  return out.join('\n\n');
}

function renderSourceTokens(api) {
  if (!api?.tokens.length) return 'No component-prefixed tokens are defined for this entry point.';
  return apiTable(
    ['Token', 'Default', 'Source'],
    api.tokens.map((token) => ['`' + token.name + '`', '`' + (token.default ?? 'unset') + '`', token.source]),
  );
}

function validateMarkdown(markdown, route, errors) {
  if ((markdown.match(/^```/gm) ?? []).length % 2) {
    errors.push(`${route}: unclosed Markdown fence`);
  }
  const lines = markdown.split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    if (!/^\|.*\|$/.test(lines[index])) continue;
    if (!/^\|(?:\s*:?-{3,}:?\s*\|)+$/.test(lines[index + 1] ?? '')) {
      errors.push(`${route}: malformed Markdown table at line ${index + 1}`);
    }
    while (/^\|.*\|$/.test(lines[index + 1] ?? '')) index += 1;
  }
}

function renderDoc(tag, tsSrc, snippets, warnings, slug) {
  const heading = attr(tag, 'heading');
  const description = attr(tag, 'description');
  const parts = [];
  if (heading) parts.push('### ' + decode(heading));
  if (description) parts.push(decode(description));
  const snippetKey = attr(tag, 'snippet');
  if (snippetKey) {
    const files = snippets[snippetKey];
    if (files === undefined) {
      warnings.push(`${slug}: snippet "${snippetKey}" not found in generated documentation snippets`);
    } else {
      // Every file behind the demo, so a reader gets the whole example and not
      // just its template.
      for (const file of files) {
        const lang = file.lang === 'ts' ? 'typescript' : file.lang;
        const label = files.length > 1 ? `<!-- ${file.name} -->\n` : '';
        parts.push(label + '```' + lang + '\n' + file.code.replace(/\s+$/, '') + '\n```');
      }
    }
  }
  return parts.join('\n\n');
}

function renderPre(inner, tsSrc, errors, slug) {
  const source = decode(stripTags(inner)).trim();
  const binding = /^\{\{\s*([A-Za-z_$][\w$]*)\s*\}\}$/.exec(source);
  const code = binding ? snippet(tsSrc, binding[1]) : source;
  if (code == null) {
    errors.push(`${slug}: code block binding "${binding[1]}" not found in .ts`);
    return '';
  }
  return '```\n' + code.replace(/\s+$/, '') + '\n```';
}

function renderSection(body, tsSrc, snippets, errors, slug) {
  body = body.replace(/<!--[\s\S]*?-->/g, '');
  const patterns = [
    { kind: 'h3', re: /<h3\b[^>]*>([\s\S]*?)<\/h3>/ },
    { kind: 'h4', re: /<h4\b[^>]*>([\s\S]*?)<\/h4>/ },
    { kind: 'table', re: /<table\b[^>]*>([\s\S]*?)<\/table>/ },
    { kind: 'pre', re: /<pre\b[^>]*>\s*<code\b[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/ },
    { kind: 'ul', re: /<ul\b[^>]*>([\s\S]*?)<\/ul>/ },
    { kind: 'doc', re: /<doc-example\b[^>]*>/ },
    { kind: 'p', re: /<p\b[^>]*>([\s\S]*?)<\/p>/ },
  ];
  const out = [];
  let pos = 0;
  while (pos < body.length) {
    const rest = body.slice(pos);
    let best = null;
    for (const p of patterns) {
      const m = p.re.exec(rest);
      if (m && (!best || m.index < best.m.index)) best = { p, m };
    }
    if (!best) break;
    const abs = pos + best.m.index;
    switch (best.p.kind) {
      case 'doc': {
        const md = renderDoc(best.m[0], tsSrc, snippets, errors, slug);
        if (md) out.push(md);
        const end = body.indexOf('</doc-example>', abs);
        pos = end === -1 ? abs + best.m[0].length : end + '</doc-example>'.length;
        break;
      }
      case 'table': {
        const t = mdTable(best.m[1]);
        if (t) out.push(t);
        pos = abs + best.m[0].length;
        break;
      }
      case 'pre': {
        const code = renderPre(best.m[1], tsSrc, errors, slug);
        if (code) out.push(code);
        pos = abs + best.m[0].length;
        break;
      }
      case 'ul': {
        const items = [...best.m[1].matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)]
          .map((m) => '- ' + inline(m[1]))
          .filter((l) => l !== '- ');
        if (items.length) out.push(items.join('\n'));
        pos = abs + best.m[0].length;
        break;
      }
      case 'h3':
      case 'h4': {
        out.push('### ' + inline(best.m[1]));
        pos = abs + best.m[0].length;
        break;
      }
      default: {
        const text = inline(best.m[1]);
        if (text) out.push(text);
        pos = abs + best.m[0].length;
      }
    }
  }
  return out.join('\n\n');
}

function pageFile(item, extension) {
  const directory = item.kind === 'guide' ? join(root, 'src', 'app', 'pages', 'guides') : pagesDir;
  return join(directory, item.slug, `${item.slug}-page.${extension}`);
}

function buildPageMd(item, snippets, api, errors) {
  let html;
  try {
    html = readFileSync(pageFile(item, 'html'), 'utf8');
  } catch {
    errors.push(`${item.route}: page template not found`);
    return null;
  }
  let tsSrc;
  try {
    tsSrc = readFileSync(pageFile(item, 'ts'), 'utf8');
  } catch {
    tsSrc = '';
  }

  const headEnd = html.indexOf('<section');
  const head = headEnd === -1 ? html : html.slice(0, headEnd);
  const h1 = (head.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/) || [])[1];
  const subtitle = (head.match(/<p\b[^>]*class="(?:page-subtitle|page-lead)"[^>]*>([\s\S]*?)<\/p>/) || [])[1];
  if (!h1) errors.push(`${item.route}: expected page h1`);
  if (!subtitle) errors.push(`${item.route}: expected page subtitle`);

  const out = ['# ' + (h1 ? inline(h1) : item.title)];
  if (subtitle) out.push('> ' + inline(subtitle));

  const sections = [...html.matchAll(/<section\b[^>]*class="(?:page-section|doc-section)"[^>]*>([\s\S]*?)<\/section>/g)];
  if (!sections.length) errors.push(`${item.route}: expected at least one documentation section`);
  for (const sec of sections) {
    const innerHtml = sec[1];
    const h2m = innerHtml.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/);
    const h2 = h2m ? inline(h2m[1]) : '';
    const body = h2m ? innerHtml.slice(innerHtml.indexOf(h2m[0]) + h2m[0].length) : innerHtml;
    const rendered = h2 === 'API'
      ? renderSourceApi(api[item.slug])
      : h2 === 'Theming'
        ? renderSourceTokens(api[item.slug])
        : renderSection(body, tsSrc, snippets, errors, item.route);
    if (h2) out.push('## ' + h2);
    if (rendered) out.push(rendered);
  }
  const markdown = out.join('\n\n') + '\n';
  if (markdown.trim().length <= ('# ' + item.title).length) {
    errors.push(`${item.route}: generated Markdown is empty`);
  }
  validateMarkdown(markdown, item.route, errors);
  return { markdown, subtitle: subtitle ? inline(subtitle) : '' };
}

function parseRoutes() {
  const src = readFileSync(routesFile, 'utf8');
  const pages = [];
  let group = 'Components';
  let slug = null;
  for (const ln of src.split(/\r?\n/)) {
    const g = ln.match(/──+\s*(.+?)\s*──+/);
    if (g) {
      group = g[1].replace(/\s+components$/i, '').trim();
      continue;
    }
    const p = ln.match(/path:\s*'(components|guides)\/([^']+)'/);
    if (p) {
      slug = { kind: p[1] === 'guides' ? 'guide' : 'component', value: p[2] };
      continue;
    }
    const t = ln.match(/title:\s*'([^']+)'/);
    if (t && slug) {
      pages.push({
        kind: slug.kind,
        slug: slug.value,
        route: `${slug.kind === 'guide' ? 'guides' : 'components'}/${slug.value}`,
        title: t[1].replace(/\s*\|\s*Ashen UI\s*$/, '').trim(),
        group: slug.kind === 'guide' ? 'Guides' : group,
      });
      slug = null;
    }
  }
  return pages;
}

mkdirSync(compDir, { recursive: true });
mkdirSync(guidesDir, { recursive: true });

const pages = parseRoutes();
const snippets = generatedSnippets();
const api = generatedApi();
const grouped = new Map();
const fullParts = [];
const errors = [];
const docs = [];
const seenRoutes = new Set();

for (const page of pages) {
  if (seenRoutes.has(page.route)) {
    errors.push(`${page.route}: duplicate documentation route`);
    continue;
  }
  seenRoutes.add(page.route);
  const built = buildPageMd(page, snippets, api, errors);
  if (!built) continue;
  const file = `${page.slug}.md`;
  const doc = {
    ...page,
    file: `${page.kind === 'guide' ? 'guides' : 'components'}/${file}`,
    subtitle: built.subtitle,
    markdown: built.markdown,
  };
  docs.push(doc);
  if (!grouped.has(doc.group)) grouped.set(doc.group, []);
  grouped.get(doc.group).push(doc);
  fullParts.push(built.markdown.trim());
}

if (errors.length || docs.length !== pages.length) {
  throw new Error(['LLM documentation generation failed:', ...errors.map((error) => `- ${error}`)].join('\n'));
}

for (const doc of docs) {
  writeFileSync(join(publicDir, doc.file), doc.markdown);
}

const previousManifest = existsSync(manifestFile)
  ? JSON.parse(readFileSync(manifestFile, 'utf8'))
  : { files: [] };
const currentFiles = new Set(docs.map((doc) => doc.file));
for (const file of previousManifest.files ?? []) {
  if (!currentFiles.has(file)) rmSync(join(publicDir, file), { force: true });
}

const idx = [
  '# Ashen UI',
  '',
  '> Angular 22 component library. Standalone, signal based, zoneless, themed with CSS custom properties. Append .md to any component path for its Markdown source.',
  '',
];
for (const [group, list] of grouped) {
  idx.push('## ' + group);
  for (const doc of list) {
    idx.push(`- [${doc.title}](${SITE}/${doc.file}): ${doc.subtitle}`);
  }
  idx.push('');
}
writeFileSync(join(publicDir, 'llms.txt'), idx.join('\n'));

const full = [
  '# Ashen UI - full component documentation',
  '',
  'Generated from the Ashen UI showcase. Each section below is one component.',
  '',
  fullParts.join('\n\n---\n\n'),
  '',
].join('\n');
writeFileSync(join(publicDir, 'llms-full.txt'), full);
writeFileSync(manifestFile, JSON.stringify({ files: [...currentFiles].sort() }, null, 2) + '\n');

console.log(`generated ${docs.length} LLM docs + llms.txt + llms-full.txt -> public/`);
