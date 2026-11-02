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

const CARD_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {};

@Component({
  selector: 'sn-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [SnPart],
  templateUrl: './card.html',
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => Card) }],
  host: {
    class: 'sn-card',
    '[class]': 'snClassResolved()',
  },
})
export class Card implements SnPartSource {
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    CARD_RESERVED_ATTRS[section] ?? [];

  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );
}
