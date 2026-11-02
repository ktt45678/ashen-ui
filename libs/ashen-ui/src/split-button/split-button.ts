import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  input,
  output,
} from '@angular/core';
import {
  type SnClass,
  type SnAttrs,
  type SnPartSource,
  type SnStyle,
  resolveSnClass,
  SN_PART_SOURCE,
  SnPart,
  SnIconRegistry,
  SnSplitButtonIntl,
  snDefault,
} from 'ashen-ui/core';
import {
  Button,
  SN_BUTTON_DEFAULTS,
  type ButtonColor,
  type ButtonSize,
  type ButtonVariant,
} from 'ashen-ui/button';
import { Menu, MenuTrigger } from 'ashen-ui/menu';

const SPLIT_BUTTON_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: [],
};

@Component({
  selector: 'sn-split-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, MenuTrigger, SnPart],
  hostDirectives: [SnPart],
  templateUrl: './split-button.html',
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => SplitButton) }],
  host: {
    class: 'sn-split-button',
    '[class]': '_hostClass()',
  },
})
export class SplitButton implements SnPartSource {
  // Shares SN_BUTTON_DEFAULTS with `[snButton]`, so `size: 'sm'` applies to split buttons too.
  readonly variant = input<ButtonVariant>(snDefault(SN_BUTTON_DEFAULTS, 'variant', 'base'));
  readonly color = input<ButtonColor>(snDefault(SN_BUTTON_DEFAULTS, 'color', 'primary'));
  readonly size = input<ButtonSize>(snDefault(SN_BUTTON_DEFAULTS, 'size', 'md'));
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly icon = input('');
  readonly menuFor = input.required<Menu>();
  readonly dropdownAriaLabel = input<string>();
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    SPLIT_BUTTON_RESERVED_ATTRS[section] ?? [];

  readonly clicked = output<MouseEvent>();

  protected readonly _intl = inject(SnSplitButtonIntl);
  protected readonly icons = inject(SnIconRegistry);

  protected readonly _triggerAriaLabel = computed(
    () => this.dropdownAriaLabel() ?? this._intl.more,
  );

  protected readonly _hostClass = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );
}
