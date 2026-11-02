import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  computed,
  inject,
  input,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SnIconRegistry, type SnClass, SnColorPickerIntl, resolveSnClass } from 'ashen-ui/core';
import { Icon } from 'ashen-ui/icon';
import { SN_COLOR_PICKER } from './color-picker-token';

/** The EyeDropper API is not in the TypeScript DOM lib yet. */
interface EyeDropperWindow {
  EyeDropper: new () => { open(): Promise<{ sRGBHex: string }> };
}

@Component({
  selector: 'sn-color-eye-dropper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './color-eye-dropper.html',
  styleUrl: './color-eye-dropper.scss',
  host: {
    class: 'sn-color-eye-dropper',
    '[class]': 'rootClassExtra()',
  },
})
export class ColorEyeDropper {
  protected readonly icons = inject(SnIconRegistry);

  readonly snClass = input<SnClass>();

  protected readonly ctx = inject(SN_COLOR_PICKER);
  protected readonly intl = inject(SnColorPickerIntl);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly isSupported = computed(
    () => this.isBrowser && 'EyeDropper' in window,
  );

  protected readonly isDisabled = computed(
    () => !this.isSupported() || this.ctx.isDisabled(),
  );

  protected readonly label = computed(() => this.intl.eyeDropper);

  protected readonly rootClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected async pick(): Promise<void> {
    if (this.isDisabled()) return;
    try {
      const result = await new (window as unknown as EyeDropperWindow).EyeDropper().open();
      if (result?.sRGBHex) {
        this.ctx.setHex(result.sRGBHex);
      }
    } catch {
      // Closing the picker without a choice rejects; there is nothing to do.
    }
  }
}
