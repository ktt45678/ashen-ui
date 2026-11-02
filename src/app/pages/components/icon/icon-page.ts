import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SnIconRegistry } from 'ashen-ui/core';
import { Button } from 'ashen-ui/button';
import { Icon } from 'ashen-ui/icon';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-icon-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Button, Icon, DocExample, DocApi],
  templateUrl: './icon-page.html',
  styleUrl: './icon-page.scss',
})
export class IconPage {
  private readonly icons = inject(SnIconRegistry);

  /** Chosen from a control, so the name is never visible to the Tailwind scan. */
  protected readonly dynamicName = signal('rocket_launch');
  protected readonly dynamicChoices = ['rocket_launch', 'travel_explore', 'bolt', 'diamond'];
  protected readonly spriteNames = ['spark', 'orbit', 'stack'];

  constructor() {
    // Material Symbols is already loaded; the ligature set only changes how the name becomes a glyph.
    this.icons.registerSet('ms', {
      type: 'ligature',
      fontFamily: 'Material Symbols Outlined Variable',
    });
    this.icons.registerSet('demo', {
      type: 'svg',
      url: (name) => `icons/demo-sprite.svg#${name}`,
    });
  }

  // Kept out of the template: the entity decodes to `{{` before Angular parses interpolation.
  protected readonly codeDynamicName = '<sn-icon [icon]="row.iconName" />';
  protected readonly codeLigatureName = '<sn-icon>{{ row.iconName }}</sn-icon>';

  protected readonly iconNames = [
    'grid_view',
    'apps',
    'edit',
    'settings',
    'play_arrow',
    'pause',
    'volume_up',
    'language',
    'http',
    'keyboard',
    'schedule',
    'monitor_heart',
  ];

  protected readonly codeSets = `// Anywhere with an injector: bootstrap, an APP_INITIALIZER, a root component.
const icons = inject(SnIconRegistry);

// Material Symbols by ligature. The name is text, so a runtime name always resolves.
icons.registerSet('ms', {
  type: 'ligature',
  fontFamily: 'Material Symbols Outlined Variable',
});

// PrimeIcons, Font Awesome: a class whose ::before carries the codepoint.
icons.registerSet('pi', { type: 'class', classes: (n) => \`pi pi-\${n}\`, fontFamily: 'PrimeIcons' });
icons.registerSet('fa', { type: 'class', classes: (n) => \`fa-solid fa-\${n}\`, fontFamily: 'Font Awesome 6 Free' });

// A sprite, for marks no font provides.
icons.registerSet('brand', { type: 'svg', url: (n) => \`/brand.svg#\${n}\` });

// A subsetted Material Symbols build under its own @font-face name.
icons.setFontFamily('MS Subset');`;

  protected readonly codePlugin = `/* styles.css (app-level Tailwind entry) */
@import "tailwindcss";
@plugin "ashen-ui/styles/icons/icons.plugin.cjs";`;

  protected readonly codeLoadingFallback = `import { provideSnIcons } from 'ashen-ui/core';

provideSnIcons({ loadingFallback: 'placeholder' });

<sn-icon loadingFallback="text">settings</sn-icon>`;
}
