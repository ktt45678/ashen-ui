import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

export type TooltipVisibilityState = 'visible' | 'hiding' | 'hidden';
export type TooltipContainerPosition = 'top' | 'bottom' | 'left' | 'right';

@Component({
  selector: 'sn-tooltip-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  templateUrl: './tooltip-container.html',
  host: {
    class: 'sn-tooltip-container',
    '[class.sn-tooltip-visible]': 'visibility() === "visible"',
    '[class.sn-tooltip-hiding]': 'visibility() === "hiding"',
    '[class.sn-tooltip-top]': 'position() === "top"',
    '[class.sn-tooltip-bottom]': 'position() === "bottom"',
    '[class.sn-tooltip-left]': 'position() === "left"',
    '[class.sn-tooltip-right]': 'position() === "right"',
    '[attr.data-sn-open]': 'visibility() === "visible" ? "" : null',
    '[attr.data-sn-hiding]': 'visibility() === "hiding" ? "" : null',
    '[attr.data-sn-position]': 'position()',
    '[style.animation]': 'animationOverride()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class TooltipContainer {
  readonly tooltipId = signal('');
  readonly content = signal<string | TemplateRef<unknown>>('');
  readonly position = signal<TooltipContainerPosition>('top');
  readonly visibility = signal<TooltipVisibilityState>('hidden');
  readonly animationOverride = signal<string | null>(null);

  protected readonly template = computed(() => {
    const c = this.content();
    return c instanceof TemplateRef ? c : null;
  });

  onMouseEnter: () => void = () => {};
  onMouseLeave: () => void = () => {};
}
