import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  contentChildren,
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
import { SN_TIMELINE } from './timeline-token';
import { TimelineItem } from './timeline-item';

@Component({
  selector: 'sn-timeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './timeline.html',
  imports: [SnPart],
  hostDirectives: [SnPart],
  providers: [
    {
      provide: SN_TIMELINE,
      useFactory: (self: Timeline) => self.context,
      deps: [Timeline],
    },
    { provide: SN_PART_SOURCE, useExisting: forwardRef(() => Timeline) },
  ],
  host: {
    class: 'sn-timeline',
    '[class]': 'rootClassExtra()',
  },
})
export class Timeline implements SnPartSource {
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  protected readonly items = contentChildren(TimelineItem);

  protected readonly rootClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  readonly context = {
    isLast: (item: unknown): Signal<boolean> =>
      computed(() => {
        const list = this.items();
        return list.length > 0 && list[list.length - 1] === item;
      }),
  };
}
