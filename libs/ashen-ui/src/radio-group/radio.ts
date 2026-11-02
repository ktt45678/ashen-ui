import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
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
  snInlineStep,
  snIsRtl,
  snRenderGate,
} from 'ashen-ui/core';
import { SN_RADIO_GROUP } from './radio-group-token';

const RADIO_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['role', 'aria-checked', 'aria-disabled', 'tabindex'],
  circle: ['aria-hidden'],
};

@Component({
  selector: 'sn-radio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SnPart],
  hostDirectives: [SnPart],
  templateUrl: './radio.html',
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => Radio) }],
  host: {
    class: 'sn-radio-button-wrapper',
    '[class.sn-radio-button-checked]': 'isChecked()',
    '[class.sn-radio-button-disabled]': 'isDisabled()',
    '[class.sn-radio-button-animate]': '_animate()',
    '[class]': 'snClassResolved()',
    '[attr.role]': '"radio"',
    '[attr.aria-checked]': 'isChecked()',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[attr.tabindex]': 'tabIndex()',
    '(click)': 'onHostClick()',
    '(keydown)': 'onHostKeydown($event)',
    '(blur)': 'onHostBlur()',
  },
})
export class Radio implements SnPartSource {
  readonly value = input.required<unknown>();
  readonly _animate = snRenderGate();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    RADIO_RESERVED_ATTRS[section] ?? [];

  protected readonly group = inject(SN_RADIO_GROUP);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly rtl = snIsRtl();

  readonly isChecked = computed(() => this.group.value() === this.value());
  readonly isDisabled = computed(() => this.group.isDisabled() || this.disabled());

  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly circleClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'circle', false),
  );

  protected readonly dotClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'dot', false),
  );

  protected readonly labelClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'label', false),
  );

  readonly tabIndex = computed(() => this.group.getTabIndex(this));

  protected onHostClick(): void {
    if (this.isDisabled()) return;
    this.group.select(this.value());
  }

  protected onHostKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;
    if (event.key === ' ') {
      event.preventDefault();
      this.group.select(this.value());
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.group.navigate(this, 1);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.group.navigate(this, -1);
      return;
    }
    // The horizontal arrows follow the reading direction; the vertical ones
    // above never do, whichever way the group is laid out.
    const step = snInlineStep(event.key, this.rtl());
    if (step !== 0) {
      event.preventDefault();
      this.group.navigate(this, step);
    }
  }

  protected onHostBlur(): void {
    this.group.onTouched();
  }

  focus(): void {
    this.elementRef.nativeElement.focus();
  }
}
