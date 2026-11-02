import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { type SnClass, SnColorPickerIntl, resolveSnClass } from 'ashen-ui/core';
import { InputText } from 'ashen-ui/input-text';
import { SN_COLOR_PICKER } from './color-picker-token';

export type ColorInputFormat = 'hex' | 'rgb';

@Component({
  selector: 'sn-color-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputText],
  templateUrl: './color-input.html',
  styleUrl: './color-input.scss',
  host: {
    class: 'sn-color-input',
    '[class]': 'rootClassExtra()',
  },
})
export class ColorInput {
  readonly format = input<ColorInputFormat>('hex');
  readonly snClass = input<SnClass>();

  protected readonly ctx = inject(SN_COLOR_PICKER);
  protected readonly intl = inject(SnColorPickerIntl);

  protected readonly hexDisplay = signal('');
  private syncPending = false;

  protected readonly rgb = computed(() => {
    const n = parseInt(this.ctx.hex().slice(1), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  });

  protected readonly rootClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );
  protected readonly fieldClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'field', false),
  );

  protected readonly effectiveHex = computed(() => {
    const a = this.ctx.alpha();
    const h = this.ctx.hex();
    return a < 1 ? h + Math.round(a * 255).toString(16).padStart(2, '0') : h;
  });

  protected onHexInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    if (/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(val)) {
      this.ctx.setHex(val);
    }
  }

  protected onHexBlur(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    if (!/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(val)) {
      (event.target as HTMLInputElement).value = this.effectiveHex();
    } else {
      this.ctx.setHex(val);
    }
  }

  protected onHexKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      const val = (event.target as HTMLInputElement).value;
      if (/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(val)) {
        this.ctx.setHex(val);
      } else {
        (event.target as HTMLInputElement).value = this.effectiveHex();
      }
    }
  }

  protected onRgbChange(channel: 'r' | 'g' | 'b', event: Event): void {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    const clamped = Math.min(255, Math.max(0, isNaN(val) ? 0 : val));
    const cur = this.rgb();
    this.ctx.setRgb(
      channel === 'r' ? clamped : cur.r,
      channel === 'g' ? clamped : cur.g,
      channel === 'b' ? clamped : cur.b,
    );
  }
}
