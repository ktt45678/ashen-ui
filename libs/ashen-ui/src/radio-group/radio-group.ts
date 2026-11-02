import {
  ChangeDetectionStrategy,
  Component,
  ModelSignal,
  booleanAttribute,
  computed,
  contentChildren,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnStyle,
  resolveSnClass,
  snNextId,
} from 'ashen-ui/core';
import { SN_RADIO_GROUP } from './radio-group-token';
import { Radio } from './radio';

const RADIO_GROUP_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['role', 'aria-disabled'],
};

@Component({
  selector: 'sn-radio-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [SnPart],
  templateUrl: './radio-group.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroup),
      multi: true,
    },
    {
      provide: SN_RADIO_GROUP,
      useFactory: (self: RadioGroup) => self.context,
      deps: [RadioGroup],
    },
    { provide: SN_PART_SOURCE, useExisting: forwardRef(() => RadioGroup) },
  ],
  host: {
    class: 'sn-radio-group-wrapper',
    '[class.sn-radio-group-horizontal]': 'direction() === "horizontal"',
    '[class]': 'snClassResolved()',
    '[attr.role]': '"radiogroup"',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[attr.data-sn-orientation]': 'direction()',
  },
})
export class RadioGroup implements ControlValueAccessor, SnPartSource {
  readonly value: ModelSignal<unknown> = model<unknown>(undefined);
  readonly direction = input<'vertical' | 'horizontal'>('vertical');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly name = input<string>(snNextId('sn-radio-group'));
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    RADIO_GROUP_RESERVED_ATTRS[section] ?? [];

  protected readonly radios = contentChildren(Radio);

  private readonly disabledFromForms = signal(false);

  readonly isDisabled = computed(() => this.disabled() || this.disabledFromForms());

  private onChangeFn: (value: unknown) => void = () => {};
  private onTouchedFn: () => void = () => {};

  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  readonly context = {
    value: this.value,
    isDisabled: this.isDisabled,
    name: this.name,
    select: (v: unknown) => {
      if (this.isDisabled()) return;
      this.value.set(v);
      this.onChangeFn(v);
      this.onTouchedFn();
    },
    navigate: (fromRadio: Radio, direction: 1 | -1) => {
      const radios = this.radios();
      if (!radios.length) return;
      const fromIndex = radios.indexOf(fromRadio);
      if (fromIndex === -1) return;
      let idx = fromIndex;
      let steps = 0;
      do {
        idx = (idx + direction + radios.length) % radios.length;
        steps++;
      } while (radios[idx].isDisabled() && steps < radios.length);
      if (radios[idx].isDisabled()) return;
      this.context.select(radios[idx].value());
      radios[idx].focus();
    },
    getTabIndex: (radio: Radio) => {
      if (radio.isDisabled()) return -1;
      const radios = this.radios();
      const checkedEnabled = radios.find((r) => r.isChecked() && !r.isDisabled());
      if (checkedEnabled) return checkedEnabled === radio ? 0 : -1;
      const firstEnabled = radios.find((r) => !r.isDisabled());
      return firstEnabled === radio ? 0 : -1;
    },
    onTouched: () => this.onTouchedFn(),
  };

  writeValue(value: unknown): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabledFromForms.set(disabled);
  }
}
