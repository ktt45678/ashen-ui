export type TokenKind =
  | 'plain'
  | 'comment'
  | 'string'
  | 'keyword'
  | 'literal'
  | 'number'
  | 'type'
  | 'tag'
  | 'attr'
  | 'binding'
  | 'property'
  | 'punct';

export interface Token {
  readonly text: string;
  readonly kind: TokenKind;
}

export type CodeLang = 'html' | 'ts' | 'scss';

const KEYWORDS =
  /^(?:import|export|from|as|const|let|var|function|class|extends|implements|interface|type|enum|return|if|else|for|of|in|while|switch|case|break|continue|new|this|super|async|await|yield|try|catch|finally|throw|typeof|instanceof|readonly|private|protected|public|static|get|set|declare|satisfies|keyof|void)$/;
const LITERALS = /^(?:true|false|null|undefined)$/;

/**
 * Ordered rules per language. First match at the cursor wins, so a comment rule
 * placed before the string rule keeps `// it's fine` from opening a string.
 */
const RULES: Record<CodeLang, readonly (readonly [TokenKind, RegExp])[]> = {
  ts: [
    ['comment', /^\/\*[\s\S]*?\*\/|^\/\/[^\n]*/],
    ['string', /^`(?:\\[\s\S]|[^`\\])*`|^'(?:\\[\s\S]|[^'\\\n])*'|^"(?:\\[\s\S]|[^"\\\n])*"/],
    ['number', /^\d[\w.]*/],
    ['type', /^@?[A-Z][\w$]*/],
    ['plain', /^[a-z_$][\w$]*/],
    ['punct', /^[^\w\s$]+/],
  ],
  html: [
    ['comment', /^<!--[\s\S]*?-->/],
    ['binding', /^\{\{[\s\S]*?\}\}|^@[a-z]+/],
    ['string', /^"[^"]*"|^'[^']*'/],
    ['tag', /^<\/?[\w-]+|^\/?>/],
    ['attr', /^[@*#([][\w.\-$()[\]]*\]?\)?|^[\w-]+(?==)/],
    ['punct', /^[^\w\s<>"']+/],
    ['plain', /^[\w-]+/],
  ],
  scss: [
    ['comment', /^\/\*[\s\S]*?\*\/|^\/\/[^\n]*/],
    ['string', /^"[^"]*"|^'[^']*'/],
    ['binding', /^--[\w-]+|^\$[\w-]+/],
    ['property', /^[a-z-]+(?=\s*:)/],
    ['type', /^[.#&][\w-]+|^:{1,2}[\w-]+/],
    ['number', /^\d[\w%.]*/],
    ['punct', /^[^\w\s$]+/],
    ['plain', /^[\w-]+/],
  ],
};

/**
 * Splits source into classified tokens. The viewer renders these as elements
 * rather than as markup, so nothing in a snippet can reach the DOM as HTML.
 */
export function highlight(code: string, lang: CodeLang): readonly Token[] {
  const rules = RULES[lang];
  const tokens: Token[] = [];
  let rest = code;

  const push = (text: string, kind: TokenKind) => {
    const last = tokens.at(-1);
    if (last && last.kind === kind) tokens[tokens.length - 1] = { text: last.text + text, kind };
    else tokens.push({ text, kind });
  };

  // Quotes and attribute names only mean something between `<` and `>`;
  // outside a tag they are ordinary prose, as in "doesn't take the click".
  let inTag = false;

  while (rest) {
    const space = /^\s+/.exec(rest);
    if (space) {
      push(space[0], 'plain');
      rest = rest.slice(space[0].length);
      continue;
    }
    let matched = false;
    for (const [kind, pattern] of rules) {
      if (lang === 'html' && !inTag && (kind === 'string' || kind === 'attr')) continue;
      const found = pattern.exec(rest);
      if (!found) continue;
      const text = found[0];
      if (lang === 'html' && kind === 'tag') inTag = text.startsWith('<');
      let resolved: TokenKind = kind;
      if (lang === 'ts' && kind === 'plain') {
        if (KEYWORDS.test(text)) resolved = 'keyword';
        else if (LITERALS.test(text)) resolved = 'literal';
      }
      push(text, resolved);
      rest = rest.slice(text.length);
      matched = true;
      break;
    }
    if (!matched) {
      push(rest[0], 'plain');
      rest = rest.slice(1);
    }
  }
  return tokens;
}

export function langOf(fileName: string): CodeLang {
  if (fileName.endsWith('.ts')) return 'ts';
  if (fileName.endsWith('.scss') || fileName.endsWith('.css')) return 'scss';
  return 'html';
}
