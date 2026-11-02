import { describe, expect, it } from 'vitest';
import { ashenRunner, createAppTree } from '../testing';

describe('theme', () => {
  it('scaffolds a full theme file from the token template', async () => {
    const tree = await ashenRunner().runSchematic('theme', { name: 'Ocean Blue', project: 'demo' }, await createAppTree());
    const path = 'projects/demo/src/styles/themes/ocean-blue.css';
    expect(tree.exists(path)).toBe(true);
    const css = tree.readContent(path);
    expect(css).toContain("[data-theme='ocean-blue']");
    expect(css).not.toContain('my-theme');
    // The full template lists every dark-overridden token.
    expect(css).toContain('--sn-color-primary');
  });

  it('scaffolds a derived theme that only overrides deltas', async () => {
    const tree = await ashenRunner().runSchematic('theme', { name: 'ocean', extends: 'dark', project: 'demo' }, await createAppTree());
    const path = 'projects/demo/src/styles/themes/dark-ocean.css';
    expect(tree.exists(path)).toBe(true);
    const css = tree.readContent(path);
    expect(css).toContain('/* @extends dark */');
    expect(css).toContain("[data-theme='dark-ocean']");
    // A delta theme inherits the rest, so it does not restate every token.
    expect(css).not.toContain('--sn-backdrop-filter');
  });

  it('refuses to overwrite an existing theme', async () => {
    const runner = ashenRunner();
    const tree = await runner.runSchematic('theme', { name: 'ocean', project: 'demo' }, await createAppTree());
    await expect(runner.runSchematic('theme', { name: 'ocean', project: 'demo' }, tree)).rejects.toThrow();
  });
});
