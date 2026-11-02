import { describe, expect, it } from 'vitest';
import { ashenRunner, createAppTree } from '../testing';

describe('ng-add', () => {
  it('registers provideAshenUI in the application config', async () => {
    const tree = await ashenRunner().runSchematic('ng-add', { project: 'demo' }, await createAppTree());
    const config = tree.readContent('projects/demo/src/app/app.config.ts');
    expect(config).toContain('provideAshenUI');
    expect(config).toContain('ashen-ui');
  });

  it('imports the base stylesheet into the global stylesheet', async () => {
    const tree = await ashenRunner().runSchematic('ng-add', { project: 'demo' }, await createAppTree());
    const styles = tree.readContent('projects/demo/src/styles.css');
    expect(styles).toContain("@import 'ashen-ui/styles/index.css';");
    expect(styles).not.toContain('tailwind.css');
  });

  it('adds the Tailwind bridge only when asked', async () => {
    const tree = await ashenRunner().runSchematic(
      'ng-add',
      { project: 'demo', tailwind: true },
      await createAppTree(),
    );
    const styles = tree.readContent('projects/demo/src/styles.css');
    expect(styles).toContain("@import 'ashen-ui/styles/tailwind.css';");
  });

  it('leaves the stylesheet untouched when styles is false', async () => {
    const tree = await ashenRunner().runSchematic(
      'ng-add',
      { project: 'demo', styles: false },
      await createAppTree(),
    );
    expect(tree.readContent('projects/demo/src/styles.css')).not.toContain('ashen-ui/styles');
  });

  it('is idempotent for the style import', async () => {
    const runner = ashenRunner();
    let tree = await runner.runSchematic('ng-add', { project: 'demo' }, await createAppTree());
    tree = await runner.runSchematic('ng-add', { project: 'demo' }, tree);
    const styles = tree.readContent('projects/demo/src/styles.css');
    const count = styles.split("@import 'ashen-ui/styles/index.css';").length - 1;
    expect(count).toBe(1);
  });

  it('does not touch index.html or styles for the boot guard unless asked', async () => {
    const tree = await ashenRunner().runSchematic('ng-add', { project: 'demo' }, await createAppTree());
    expect(tree.readContent('projects/demo/src/index.html')).not.toContain('data-sn-app-boot');
    expect(tree.readContent('projects/demo/src/styles.css')).not.toContain('data-sn-app-boot');
  });

  it('inserts the boot guard script and styles when asked', async () => {
    const tree = await ashenRunner().runSchematic(
      'ng-add',
      { project: 'demo', bootGuard: true },
      await createAppTree(),
    );
    const html = tree.readContent('projects/demo/src/index.html');
    expect(html).toContain("setAttribute('data-sn-app-boot', '')");
    const styles = tree.readContent('projects/demo/src/styles.css');
    expect(styles).toContain('html[data-sn-app-boot]');
  });

  it('is idempotent for the boot guard', async () => {
    const runner = ashenRunner();
    let tree = await runner.runSchematic('ng-add', { project: 'demo', bootGuard: true }, await createAppTree());
    const firstCount = tree.readContent('projects/demo/src/index.html').split('data-sn-app-boot').length - 1;

    tree = await runner.runSchematic('ng-add', { project: 'demo', bootGuard: true }, tree);
    const secondCount = tree.readContent('projects/demo/src/index.html').split('data-sn-app-boot').length - 1;

    expect(secondCount).toBe(firstCount);
  });
});
