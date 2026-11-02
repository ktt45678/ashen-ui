import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
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

const BADGE_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['role', 'aria-label'],
  pip: ['aria-hidden'],
};

export type BadgeColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

@Component({
  selector: 'sn-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SnPart],
  hostDirectives: [SnPart],
  templateUrl: './badge.html',
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => Badge) }],
  host: {
    class: 'sn-badge',
    '[class.sn-badge--dot]': 'dot()',
    '[class.sn-badge--overlay]': 'overlay()',
    '[class.sn-badge-primary]': 'color() === "primary"',
    '[class.sn-badge-secondary]': 'color() === "secondary"',
    '[class.sn-badge-success]': 'color() === "success"',
    '[class.sn-badge-error]': 'color() === "error"',
    '[class.sn-badge-warning]': 'color() === "warning"',
    '[class.sn-badge-info]': 'color() === "info"',
    '[attr.aria-label]': '!overlay() && value() ? value().toString() : null',
    '[attr.role]': '"status"',
    '[class]': 'snClassResolved()',
    '[attr.data-sn-severity]': 'color()',
    '[attr.data-sn-dot]': 'dot() ? "" : null',
    '[attr.data-sn-overlay]': 'overlay() ? "" : null',
  },
})
export class Badge implements SnPartSource {
  readonly value = input<string | number>('');
  readonly color = input<BadgeColor>('primary');
  readonly dot = input(false, { transform: booleanAttribute });
  readonly overlay = input(false, { transform: booleanAttribute });
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    BADGE_RESERVED_ATTRS[section] ?? [];

  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly pipClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'pip', false),
  );
}
