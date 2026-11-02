import { ChangeDetectionStrategy, Component, computed, forwardRef, input } from '@angular/core';
import {
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnStyle,
  resolveSnClass,
} from 'ashen-ui/core';

const CARD_TITLE_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {};

@Component({
  selector: 'sn-card-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [SnPart],
  templateUrl: './card-title.html',
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => CardTitle) }],
  host: {
    class: 'sn-card-title',
    '[class]': 'snClassResolved()',
  },
})
export class CardTitle implements SnPartSource {
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    CARD_TITLE_RESERVED_ATTRS[section] ?? [];

  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );
}
