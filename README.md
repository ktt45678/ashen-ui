# Ashen UI

Source for the [`ashen-ui`](https://www.npmjs.com/package/ashen-ui) Angular component library
and its docs app. The package README is `libs/ashen-ui/README.md`.

## Layout

- `libs/ashen-ui/` holds the library: one folder per entry point under `src/`, the shipped CSS
  under `src/styles/`, schematics and build scripts.
- `src/` holds the docs app, which imports the library the same way an app would.
- `e2e/` holds the Playwright specs that run against the docs app.
- `scripts/` holds the docs generators.

## Setup

Node 22.22.3+, 24.15.0+ or 26+, and pnpm 10.

```bash
pnpm install
pnpm start          # docs app on http://localhost:4200
```

## Checks

```bash
pnpm lint
pnpm test:lib       # theme check and library unit tests
pnpm e2e            # Playwright, starts the docs app on port 4301 if needed
pnpm verify:release # lint, docs check, unit tests, library and docs builds
```

After changing tokens, run `pnpm theme:generate`. After changing a demo or a public API, run
`pnpm docs:llm` and `pnpm docs:snippets`. `pnpm docs:check` fails when generated files are stale.

## Release

1. Set the version in `libs/ashen-ui/src/package.json` and add an entry to `CHANGELOG.md`.
2. `pnpm verify:release`, then `pnpm pack:lib` to review the package contents.
3. Log in with `npm login`, then run `pnpm publish:lib`. It runs `verify:release` again and
   publishes `dist/ashen-ui`.

## License

MIT
