import {
  ChangeDetectionStrategy,
  Component,
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
} from 'ashen-ui/core';
import { SN_TIMELINE } from './timeline-token';

const TIMELINE_ITEM_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['role'],
};

@Component({
  selector: 'sn-timeline-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './timeline-item.html',
  imports: [SnPart],
  hostDirectives: [SnPart],
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => TimelineItem) }],
  host: {
    role: 'listitem',
    class: 'sn-timeline-item',
    '[class.sn-timeline-item--last]': 'isLast()',
    '[class]': 'rootClassExtra()',
    '[attr.data-sn-last]': 'isLast() ? "" : null',
  },
})
export class TimelineItem implements SnPartSource {
  readonly icon = input('');
  readonly color = input('');
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    TIMELINE_ITEM_RESERVED_ATTRS[section] ?? [];

  protected readonly timeline = inject(SN_TIMELINE, { optional: true });

  protected readonly isLast = computed(
    () => this.timeline?.isLast(this)() ?? false,
  );

  protected readonly markerColor = computed(
    () => this.color() || 'var(--sn-color-primary)',
  );

  protected readonly hasIcon = computed(() => !!this.icon());

  protected readonly rootClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly markerClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'marker', false),
  );

  protected readonly contentClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'content', false),
  );
}
