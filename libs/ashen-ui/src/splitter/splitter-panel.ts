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
import { SN_SPLITTER } from './splitter-token';

const SPLITTER_PANEL_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['id'],
};

@Component({
  selector: 'sn-splitter-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SnPart],
  hostDirectives: [SnPart],
  templateUrl: './splitter-panel.html',
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => SplitterPanel) }],
  host: {
    class: 'sn-splitter-panel',
    '[attr.id]': 'panelId()',
    '[class]': 'rootClassExtra()',
    '[style.flex-basis]': 'flexBasis()',
    '[style.order]': 'panelOrder()',
  },
})
export class SplitterPanel implements SnPartSource {
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    SPLITTER_PANEL_RESERVED_ATTRS[section] ?? [];

  protected readonly splitter = inject(SN_SPLITTER, { optional: true });

  protected readonly panelId = computed(() => {
    const ctx = this.splitter;
    if (!ctx || !ctx.isFirstPanel(this)) return null;
    return ctx.firstPanelId;
  });

  protected readonly rootClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly flexBasis = computed(() => {
    const ctx = this.splitter;
    if (!ctx || !ctx.isFirstPanel(this)) return null;
    return ctx.size() + '%';
  });

  protected readonly panelOrder = computed(() => {
    const ctx = this.splitter;
    if (!ctx) return null;
    return ctx.getPanelOrder(this);
  });
}
