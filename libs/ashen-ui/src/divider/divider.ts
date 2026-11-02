import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  forwardRef,
  input,
} from '@angular/core';
import {
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnStyle,
  resolveSnClass,
} from 'ashen-ui/core';

const DIVIDER_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['role', 'aria-orientation'],
};

@Component({
  selector: 'sn-divider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SnPart],
  hostDirectives: [SnPart],
  templateUrl: './divider.html',
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => Divider) }],
  host: {
    class: 'sn-divider',
    '[class.sn-divider--vertical]': 'vertical()',
    '[class.sn-divider--labeled]': '!!label()',
    role: 'separator',
    '[attr.aria-orientation]': 'vertical() ? "vertical" : "horizontal"',
    '[class]': 'snClassResolved()',
    '[attr.data-sn-labeled]': 'label() ? "" : null',
  },
})
export class Divider implements SnPartSource {
  readonly label = input('');
  readonly vertical = input(false, { transform: booleanAttribute });
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    DIVIDER_RESERVED_ATTRS[section] ?? [];

  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly lineClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'line', false),
  );

  protected readonly labelClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'label', false),
  );
}
