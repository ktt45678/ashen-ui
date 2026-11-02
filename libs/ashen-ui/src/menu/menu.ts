import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewContainerRef,
  booleanAttribute,
  computed,
  contentChildren,
  forwardRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import {
  SN_PART_SOURCE,
  SnPart,
  resolveSnClass,
  snAnimationsDisabled,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnShowHideAnimation,
  type SnStyle,
} from 'ashen-ui/core';
import { SN_MENU } from './menu-token';
import { MenuItem } from './menu-item';

const MENU_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  panel: ['role'],
};

@Component({
  selector: 'sn-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SN_MENU,
      useFactory: (self: Menu) => ({
        close: () => self._requestClose(),
        isClosing: self._isClosing.asReadonly(),
      }),
      deps: [Menu],
    },
    { provide: SN_PART_SOURCE, useExisting: forwardRef(() => Menu) },
  ],
  imports: [SnPart],
  hostDirectives: [SnPart],
  templateUrl: './menu.html',
  host: {
    class: 'sn-menu-host',
    '[class]': 'snClassResolved()',
  },
})
export class Menu implements SnPartSource {
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();
  readonly animated = input(true, { transform: booleanAttribute });
  readonly animation = input<SnShowHideAnimation | undefined>(undefined);

  readonly reservedAttrs = (section: string): readonly string[] =>
    MENU_RESERVED_ATTRS[section] ?? [];

  /**
   * The host is a zero-size anchor and the panel lives in an overlay, so a bare
   * `snClass` still lands on the host to keep the `root` contract. Reach the
   * visible box with the `panel` section.
   */
  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly panelClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'panel', false),
  );

  readonly vcr = inject(ViewContainerRef);

  readonly _contentTpl = viewChild<TemplateRef<unknown>>('content');
  readonly _items = contentChildren(MenuItem);
  readonly _isClosing = signal(false);

  readonly _hostAnimated = signal<boolean | null>(null);
  readonly _hostAnimation = signal<SnShowHideAnimation | undefined>(undefined);
  private readonly _animationsOff = snAnimationsDisabled();
  /**
   * The menubar/trigger override wins over the local input, and the app-wide
   * motion setting overrides both, SN_ANIMATIONS_DISABLED and
   * prefers-reduced-motion must be able to skip the exit animation no matter
   * who supplied the value.
   */
  readonly _effAnimated = computed(
    () => (this._hostAnimated() ?? this.animated()) && !this._animationsOff(),
  );
  readonly _effAnimation = computed(() => this._hostAnimation() ?? this.animation());

  _requestClose: () => void = () => {};
}
