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

const INPUT_GROUP_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['role'],
};

@Component({
  selector: 'sn-input-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SnPart],
  hostDirectives: [SnPart],
  templateUrl: './input-group.html',
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => InputGroup) }],
  host: {
    class: 'sn-input-group',
    role: 'group',
    '[class]': 'snClassResolved()',
  },
})
export class InputGroup implements SnPartSource {
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    INPUT_GROUP_RESERVED_ATTRS[section] ?? [];

  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );
}
