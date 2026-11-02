import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  contentChildren,
  forwardRef,
  input,
  numberAttribute,
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
import { SN_METER_GROUP } from './meter-group-token';
import { Meter } from './meter';

@Component({
  selector: 'sn-meter-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SnPart],
  hostDirectives: [SnPart],
  templateUrl: './meter-group.html',
  providers: [
    {
      provide: SN_METER_GROUP,
      useFactory: (self: MeterGroup) => ({ max: self.max }),
      deps: [MeterGroup],
    },
    { provide: SN_PART_SOURCE, useExisting: forwardRef(() => MeterGroup) },
  ],
  host: {
    class: 'sn-meter-group',
    '[class]': 'snClassResolved()',
    '[attr.aria-label]': 'label() || null',
  },
})
export class MeterGroup implements SnPartSource {
  readonly max = input(100, { transform: numberAttribute });
  readonly showLegend = input(true, { transform: booleanAttribute });
  readonly label = input('');
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] => {
    if (section === 'root') return ['aria-label'];
    if (section === 'bar') return ['role'];
    return [];
  };

  protected readonly meters = contentChildren(Meter);

  protected readonly total = computed(() =>
    this.meters().reduce((sum, m) => sum + m.value(), 0),
  );

  protected readonly firstUnit = computed(() => this.meters()[0]?.unit() ?? '%');

  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly barClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'bar', false),
  );

  protected readonly legendClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'legend', false),
  );
}
