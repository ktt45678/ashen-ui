import { defineConfig } from 'vitest/config';

// The schematics run in Node (SchematicTestRunner), not the browser, so they
// need their own config rather than the library's jsdom unit-test target.
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['libs/ashen-ui/schematics/**/*.spec.ts'],
  },
});
