import { describe, expect, it } from 'vitest';
import { ashenRunner, createAppTree } from '../testing';

const THEME = 'projects/demo/src/styles/themes/brand.css';

async function withTheme(css: string) {
  const tree = await createAppTree();
  tree.create(THEME, css);
  return tree;
}

// A theme that satisfies the contract, built from the generated template so it
// cannot drift from whatever the library currently requires.
async function completeTheme(extra = ''): Promise<string> {
  const tree = await ashenRunner().runSchematic('theme', { name: 'brand', project: 'demo' }, await createAppTree());
  const css = tree.readContent('projects/demo/src/styles/themes/brand.css').replace(/: ;/g, ': red;');
  return extra ? css.replace(/\}\s*$/, `${extra}\n}\n`) : css;
}

describe('theme-sync', () => {
  it('reports a complete theme as up to date and writes nothing', async () => {
    const runner = ashenRunner();
    const messages: string[] = [];
    runner.logger.subscribe((entry) => messages.push(entry.message));
    const tree = await runner.runSchematic('theme-sync', { file: THEME, apply: true }, await withTheme(await completeTheme()));
    expect(messages.join('\n')).toContain('up to date');
    expect(tree.readContent(THEME)).toBe(await completeTheme());
  });

  it('flags a token the library no longer defines and suggests the nearest name', async () => {
    const runner = ashenRunner();
    const messages: string[] = [];
    runner.logger.subscribe((entry) => messages.push(entry.message));
    await runner.runSchematic(
      'theme-sync',
      { file: THEME },
      await withTheme(await completeTheme('  --sn-input-border: rgba(255, 255, 255, 0.3);')),
    );
    const log = messages.join('\n');
    expect(log).toContain('--sn-input-border');
    expect(log).toContain('--sn-input-text-border');
  });

  it('does not write without --apply', async () => {
    const before = await completeTheme('  --sn-input-border: red;');
    const tree = await ashenRunner().runSchematic('theme-sync', { file: THEME }, await withTheme(before));
    expect(tree.readContent(THEME)).toBe(before);
  });

  it('removes a stale token and moves a component token into a block that reaches it', async () => {
    const tree = await ashenRunner().runSchematic(
      'theme-sync',
      { file: THEME, apply: true },
      await withTheme(
        await completeTheme('  --sn-input-border: red;\n  --sn-input-text-border: rgba(255, 255, 255, 0.3);'),
      ),
    );
    const css = tree.readContent(THEME);
    expect(css).not.toContain('--sn-input-border:');
    expect(css).toContain("[data-theme='brand'] .sn-input-text {");
    expect(css).toContain('--sn-input-text-border: rgba(255, 255, 255, 0.3);');
  });

  it('leaves a component token alone when it is already scoped to its element', async () => {
    const scoped = `${await completeTheme()}\n[data-theme='brand'] .sn-input-text { --sn-input-text-border: red; }\n`;
    const runner = ashenRunner();
    const messages: string[] = [];
    runner.logger.subscribe((entry) => messages.push(entry.message));
    await runner.runSchematic('theme-sync', { file: THEME }, await withTheme(scoped));
    expect(messages.join('\n')).toContain('up to date');
  });

  it('adds a contract token that is missing, with the dark value for reference', async () => {
    const css = (await completeTheme()).replace(/^\s*--sn-border:.*$/m, '');
    const runner = ashenRunner();
    const tree = await runner.runSchematic('theme-sync', { file: THEME, apply: true }, await withTheme(css));
    expect(tree.readContent(THEME)).toMatch(/--sn-border: ; \/\* dark: .+ \*\//);
  });

  it('fails under --check when the theme is out of date', async () => {
    await expect(
      ashenRunner().runSchematic(
        'theme-sync',
        { file: THEME, check: true },
        await withTheme(await completeTheme('  --sn-input-border: red;')),
      ),
    ).rejects.toThrow(/out of date/);
  });
});
