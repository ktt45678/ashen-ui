import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { SN_METER_GROUP } from './meter-group-token';

const DEFAULT_COLORS = [
  'var(--sn-color-primary)',
  'var(--sn-color-info)',
  'var(--sn-color-warning)',
  'var(--sn-color-success)',
  'var(--sn-color-error)',
];

@Component({
  selector: 'sn-meter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  host: { class: 'sn-meter' },
})
export class Meter {
  readonly value = input(0, { transform: numberAttribute });
  readonly label = input('');
  readonly color = input<string | undefined>(undefined);
  readonly unit = input('%');

  private readonly group = inject(SN_METER_GROUP);

  readonly pct = computed(() => {
    const max = this.group.max();
    if (max <= 0) return 0;
    return Math.min(Math.max(this.value() / max, 0), 1) * 100;
  });

  readonly effectiveColor = (index: number): string =>
    this.color() ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length];
}
