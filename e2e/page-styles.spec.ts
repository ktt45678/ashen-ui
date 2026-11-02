import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROUTES } from './support/pages';

/**
 * Every showcase page carries its own component stylesheet, and the page
 * markup is scoped by Angular's emulated encapsulation, so a missing
 * `styleUrl` compiles, renders, and smoke-tests clean. The page just falls
 * back to browser defaults: demo containers stop being flex columns and
 * shrink-wrap their content, which is how a component ends up looking broken
 * in the docs while every one of its own tests passes.
 */
test.describe('page styles', () => {
  test('every page component declares a stylesheet that exists', () => {
    const roots = ['src/app/pages/components', 'src/app/pages/guides'];
    const missing: string[] = [];

    for (const root of roots) {
      for (const dir of readdirSync(root, { withFileTypes: true })) {
        if (!dir.isDirectory()) continue;
        const files = readdirSync(join(root, dir.name));
        const ts = files.find((f) => f.endsWith('-page.ts'));
        if (!ts) continue;

        const source = readFileSync(join(root, dir.name, ts), 'utf8');
        const declared = /styleUrl:\s*'\.\/([^']+)'/.exec(source)?.[1];
        if (!declared) missing.push(`${dir.name}: no styleUrl`);
        else if (!files.includes(declared)) missing.push(`${dir.name}: ${declared} not found`);
      }
    }

    expect(missing, missing.join('\n')).toEqual([]);
  });

  test('component demos are laid out, not collapsed to content width', async ({ page }) => {
    await page.goto(ROUTES.inputMask);
    const stack = page.locator('.demo-stack').first();
    // `.demo-stack` is a flex column with a max-width in every page stylesheet.
    // Without one it is a bare block and the fields inside shrink-wrap: the
    // 212px-wide form field that made a correct notched outline look broken.
    expect(await stack.evaluate((el) => getComputedStyle(el).display)).toBe('flex');
    expect((await stack.boundingBox())!.width).toBeGreaterThan(300);
  });
});
