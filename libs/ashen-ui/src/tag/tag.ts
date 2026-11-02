import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
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
} from 'ashen-ui/core';

const TAG_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  icon: ['aria-hidden'],
};

export type TagSeverity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

@Component({
  selector: 'sn-tag',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SnPart],
  hostDirectives: [SnPart],
  templateUrl: './tag.html',
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => Tag) }],
  host: {
    class: 'sn-tag',
    '[class.sn-tag-primary]': 'severity() === "primary"',
    '[class.sn-tag-secondary]': 'severity() === "secondary"',
    '[class.sn-tag-success]': 'severity() === "success"',
    '[class.sn-tag-error]': 'severity() === "error"',
    '[class.sn-tag-warning]': 'severity() === "warning"',
    '[class.sn-tag-info]': 'severity() === "info"',
    '[class]': 'snClassResolved()',
    '[attr.data-sn-severity]': 'severity()',
  },
})
export class Tag implements SnPartSource {
  readonly value = input('');
  readonly severity = input<TagSeverity>('primary');
  readonly icon = input('');
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    TAG_RESERVED_ATTRS[section] ?? [];

  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly iconClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'icon', false),
  );

  protected readonly labelClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'label', false),
  );
}
