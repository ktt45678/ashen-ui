import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Code samples live here rather than inline in the template: an HTML file
 * cannot carry `{{` (Angular parses it as interpolation, and the `&#123;&#123;`
 * escape decodes back to `{{` before the template parser runs), which every
 * nested provider literal would otherwise hit.
 */
@Component({
  selector: 'app-configuration-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  imports: [],
  templateUrl: './configuration-page.html',
  styleUrl: './configuration-page.scss',
})
export class ConfigurationPage {
  readonly codeIcons = `import { provideAshenUI } from 'ashen-ui';

provideAshenUI({
  icons: {
    close: 'cancel',
    'sort-ascending': 'arrow_drop_up',
    'sort-descending': 'arrow_drop_down',
    loadingFallback: 'placeholder',
  },
});

// Or on its own, without the rest of provideAshenUI:
import { provideSnIcons } from 'ashen-ui/core';

provideSnIcons({ close: 'cancel', loadingFallback: 'placeholder' });`;

  readonly codeIconsRuntime = `import { SnIconRegistry } from 'ashen-ui/core';

export class ThemeSwitcher {
  private readonly icons = inject(SnIconRegistry);

  useOutlined() {
    // Components re-render: the glyph map is a signal.
    this.icons.aliasAll({ close: 'close', check: 'check' });
  }
}`;

  readonly codeProvide = `// app.config.ts
import { provideAshenUI, SnTouchedErrorStateMatcher } from 'ashen-ui';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideAshenUI({
      defaults: {
        button: { size: 'sm' },
        input: { size: 'sm' },
        dialog: { size: 'lg' },
        toast: { life: 5000 },
        tooltip: { showDelay: 0 },
        table: { striped: true, stickyHeader: true },
      },
      animations: 'reduced-motion',
      errorStateMatcher: SnTouchedErrorStateMatcher,
    }),
  ],
};`;

  readonly codeToken = `import { SN_BUTTON_DEFAULTS } from 'ashen-ui/button';

// Only the buttons inside this component are small.
@Component({
  selector: 'app-toolbar',
  providers: [{ provide: SN_BUTTON_DEFAULTS, useValue: { size: 'sm' } }],
  template: \`
    <button snButton>Save</button>
    <button snButton variant="text">Cancel</button>
  \`,
  imports: [Button],
})
export class Toolbar {}`;

  readonly codeRoute = `// A section of the app that runs on a denser scale.
export const adminRoutes: Routes = [
  {
    path: 'admin',
    providers: [provideAshenUI({ defaults: { input: { size: 'sm' } } })],
    loadChildren: () => import('./admin/routes').then((m) => m.routes),
  },
];`;

  readonly codeOverride = `<!-- The default is 'sm'; this one button is not. -->
<button snButton size="lg">Publish</button>`;

  readonly codeMotion = `import { provideSnAnimations, SN_ANIMATIONS_DISABLED } from 'ashen-ui/core';

// Equivalent to provideAshenUI({ animations: … }).
provideSnAnimations('disabled');

// Or set the token directly, most often in a test, so overlay teardown
// is synchronous and specs stop waiting out exit animations.
{ provide: SN_ANIMATIONS_DISABLED, useValue: true }`;

  readonly codeMatcher = `import {
  SnErrorStateMatcher,
  SnImmediateErrorStateMatcher,
} from 'ashen-ui/core';

// Scope a policy to one form rather than the whole app.
@Component({
  providers: [
    { provide: SnErrorStateMatcher, useClass: SnImmediateErrorStateMatcher },
  ],
})
export class SeededEditForm {}`;

  readonly codeIntl = `import { provideSnIntl } from 'ashen-ui/core';

providers: [
  provideSnIntl({
    common:    { close: 'Đóng', next: 'Tiếp', previous: 'Trước' },
    paginator: { first: 'Trang đầu', last: 'Trang cuối', rowsPerPage: 'Số dòng' },
    confirm:   { accept: 'Đồng ý', reject: 'Huỷ' },
  }),
]`;

  readonly codeIntlLocale = `import { provideSnIntlLocale } from 'ashen-ui/core';

providers: [
  // Month and weekday names derive from Intl.DateTimeFormat.
  provideSnIntlLocale('fr-FR', {
    // Everything else still needs translating.
    datePicker: { label: 'Choisir une date' },
  }),
]`;

  readonly codeIntlInject = `import { SnPaginatorIntl } from 'ashen-ui/core';

@Injectable()
export class RuntimePaginatorIntl extends SnPaginatorIntl {
  // …swap the strings when the user changes language.
}

providers: [{ provide: SnPaginatorIntl, useClass: RuntimePaginatorIntl }]`;

  readonly codeCustomMatcher = `import { Injectable } from '@angular/core';
import { SnErrorStateMatcher } from 'ashen-ui/core';
import type { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';

@Injectable()
export class OnSubmitErrorStateMatcher extends SnErrorStateMatcher {
  override isErrorState(
    control: AbstractControl | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean {
    return !!control?.invalid && !!form?.submitted;
  }
}`;
}
