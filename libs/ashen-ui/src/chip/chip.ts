import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  contentChildren,
  forwardRef,
  inject,
  input,
  output,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnStyle,
  resolveSnClass,
} from 'ashen-ui/core';
import { SnChipIntl, SnIconRegistry } from 'ashen-ui/core';
import { IconTemplate } from 'ashen-ui/core';

const CHIP_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['tabindex'],
  icon: ['aria-hidden'],
  remove: ['type', 'aria-label'],
};

@Component({
  selector: 'sn-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, SnPart],
  hostDirectives: [SnPart],
  templateUrl: './chip.html',
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => Chip) }],
  host: {
    class: 'sn-chip',
    '[class.sn-chip--selected]': 'selected()',
    '[class.sn-chip--removable]': 'removable()',
    '[attr.tabindex]': '0',
    '(keydown)': 'onHostKeydown($event)',
    '[class]': 'snClassResolved()',
    '[attr.data-sn-selected]': 'selected() ? "" : null',
    '[attr.data-sn-removable]': 'removable() ? "" : null',
  },
})
export class Chip implements SnPartSource {
  protected readonly icons = inject(SnIconRegistry);

  readonly label = input('');
  readonly icon = input('');
  readonly removable = input(false, { transform: booleanAttribute });
  readonly selected = input(false, { transform: booleanAttribute });
  readonly removeAriaLabel = input<string | undefined>(undefined);
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    CHIP_RESERVED_ATTRS[section] ?? [];

  readonly removed = output<void>();

  private readonly intl = inject(SnChipIntl);
  protected readonly iconTemplates = contentChildren(IconTemplate);

  protected readonly removeIconTpl = computed(() =>
    this.iconTemplates().find((t) => t.snIcon() === 'remove') ??
    this.iconTemplates().find((t) => !t.snIcon()) ??
    null,
  );

  protected readonly effectiveRemoveLabel = computed(() =>
    this.removeAriaLabel() ?? this.intl.remove(this.label() || 'item'),
  );

  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly labelClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'label', false),
  );

  protected readonly iconClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'icon', false),
  );

  protected readonly removeClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'remove', false),
  );

  protected onRemoveClick(event: MouseEvent): void {
    event.stopPropagation();
    this.removed.emit();
  }

  protected onHostKeydown(event: KeyboardEvent): void {
    if (this.removable() && (event.key === 'Backspace' || event.key === 'Delete')) {
      event.preventDefault();
      this.removed.emit();
    }
  }
}
