import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnDestroy,
  Signal,
  booleanAttribute,
  computed,
  contentChildren,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { FocusableOption, FocusKeyManager } from '@angular/cdk/a11y';
import { DOWN_ARROW, END, HOME, UP_ARROW } from '@angular/cdk/keycodes';
import {
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnStyle,
  resolveSnClass,
} from 'ashen-ui/core';
import { SN_ACCORDION } from './accordion-token';
import { ExpansionPanel } from './expansion-panel';

@Component({
  selector: 'sn-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './accordion.html',
  imports: [SnPart],
  hostDirectives: [SnPart],
  providers: [
    {
      provide: SN_ACCORDION,
      useFactory: (self: Accordion) => self.context,
      deps: [Accordion],
    },
    { provide: SN_PART_SOURCE, useExisting: forwardRef(() => Accordion) },
  ],
  host: {
    class: 'sn-accordion',
    '[class]': 'rootClassExtra()',
    '(keydown)': 'onKeydown($event)',
    '(focusin)': 'onFocusIn($event)',
  },
})
export class Accordion implements OnDestroy, SnPartSource {
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  private readonly injector = inject(Injector);
  protected readonly panels = contentChildren(ExpansionPanel);
  private readonly focusablePanels: Signal<readonly FocusableOption[]> = computed(
    () => this.panels() as unknown as FocusableOption[],
  );

  private readonly panelCollapseMap = new Map<string, () => void>();
  private keyManager!: FocusKeyManager<FocusableOption>;

  protected readonly rootClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  readonly context = {
    multiple: this.multiple,
    requestExpand: (panelId: string) => {
      if (!this.multiple()) {
        for (const [id, collapse] of this.panelCollapseMap) {
          if (id !== panelId) collapse();
        }
      }
    },
    registerPanel: (panelId: string, collapse: () => void) => {
      this.panelCollapseMap.set(panelId, collapse);
    },
    unregisterPanel: (panelId: string) => {
      this.panelCollapseMap.delete(panelId);
    },
  };

  constructor() {
    this.keyManager = new FocusKeyManager<FocusableOption>(this.focusablePanels, this.injector)
      .withWrap()
      .withHomeAndEnd();
  }

  protected onFocusIn(event: FocusEvent): void {
    const target = event.target as Node;
    const idx = this.panels().findIndex((p) => p._el.nativeElement.contains(target));
    if (idx >= 0) {
      this.keyManager.updateActiveItem(idx);
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (!this.keyManager) return;
    const key = event.keyCode;
    if (key === UP_ARROW || key === DOWN_ARROW || key === HOME || key === END) {
      event.preventDefault();
      this.keyManager.onKeydown(event);
    }
  }

  ngOnDestroy(): void {
    this.panelCollapseMap.clear();
  }
}
