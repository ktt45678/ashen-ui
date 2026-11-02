# Ashen UI

A standalone Angular component library: signal-based, zoneless-first, `OnPush` throughout, styled
through two-tier CSS custom properties rather than Sass.

## Install

```bash
ng add ashen-ui
```

This registers `provideAshenUI()` on your application config and, unless you pass `--no-styles`,
imports the library's stylesheet into your project's global styles. Pass `--tailwind` if your
project uses Tailwind CSS 4 and you want Ashen UI's components picked up by its content scanning.

Seventeen components (`Select`, `Menu`, `Tooltip`, `DialogService`, and others) render through the
Angular CDK overlay, so your application also needs its base stylesheet:

```css
@import '@angular/cdk/overlay-prebuilt.css';
@import 'ashen-ui/styles/index.css';
/* @import 'ashen-ui/styles/tailwind.css'; */
```

### Manual setup

If you skip `ng add`, wire it up yourself:

```ts
// app.config.ts
import { provideAshenUI } from 'ashen-ui';

export const appConfig: ApplicationConfig = {
  providers: [provideAshenUI()],
};
```

## Usage

Each component ships as its own entry point, so you only pay for what you import:

```ts
import { Button } from 'ashen-ui/button';

@Component({
  imports: [Button],
  template: `<button snButton color="primary">Save</button>`,
})
export class ExampleComponent {}
```

## Peer dependencies

```
@angular/core   ^22.0.0
@angular/common ^22.0.0
@angular/cdk    ^22.0.0
@angular/forms  ^22.0.0
@angular/router ^22.0.0
rxjs            ^7.8.0
```

Browser support follows Angular 22: Chrome, Edge and Firefox 119 and later, and Safari 17 and
later.

## Theming

Components read `--sn-*` custom properties in two tiers: global tokens (color, spacing, motion)
and per-component tokens that fall back to them. Override a token on `:root`, on a theme
attribute, or on a single element, without reaching into component internals. See the
theming guide in the docs app of the [repository](https://github.com/ktt45678/ashen-ui)
(`src/app/pages/guides/theming`) for the full token contract, and `ashen-ui:theme` /
`ashen-ui:theme-sync` (below) for scaffolding and updating a theme file.

## Avoiding a flash of unstyled content

Zoneless Angular paints a component's host element one frame before its host bindings (color
classes, `[attr.*]`) apply, which can flash default styling before the real one lands. `sn-form-field`
guards against this itself with a component-scoped `data-sn-boot` attribute, but an app-wide flash
needs an app-wide guard. In `index.html`, before the closing `</head>`:

```html
<script>
  document.documentElement.setAttribute('data-sn-app-boot', '');
  setTimeout(() => document.documentElement.removeAttribute('data-sn-app-boot'), 4000);
</script>
```

Remove the attribute yourself once the first route has rendered (the `setTimeout` above is only a
safety fallback), and hide the app for as long as it's set:

```css
html[data-sn-app-boot] { visibility: hidden; }
html[data-sn-app-boot] *, html[data-sn-app-boot] *::before, html[data-sn-app-boot] *::after {
  transition: none !important;
}
```

`ng add ashen-ui --boot-guard` inserts both snippets for you.

## Schematics

```bash
ng generate ashen-ui:theme my-theme     # scaffold a theme file from the token template
ng generate ashen-ui:theme-sync         # report and apply what an existing theme is missing
```

## License

MIT
