import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChildren,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';
import { IconTemplate, type SnClass, resolveSnClass, snNextId } from 'ashen-ui/core';
import { SN_TABS } from './tabs-token';

@Component({
  selector: 'sn-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './tab.html',
  host: {
    class: 'sn-tab',
    '[class]': 'rootClassExtra()',
  },
})
export class Tab implements FocusableOption, OnInit, OnDestroy {
  readonly label = input('');
  readonly icon = input('');
  /**
   * A stable identity for this tab, so `sn-tabs` can be driven by
   * `[(value)]` instead of by position. Leave it off and the tab is
   * reachable by index only.
   */
  readonly value = input<unknown>(undefined);
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
  readonly snClass = input<SnClass>();

  get disabled(): boolean {
    return this.disabledInput();
  }

  readonly tabId = snNextId('sn-tab');
  readonly buttonId = `${this.tabId}-btn`;
  readonly panelId = `${this.tabId}-panel`;

  protected readonly tabs = inject(SN_TABS);
  protected readonly iconTemplates = contentChildren(IconTemplate);
  protected readonly contentTpl = viewChild<TemplateRef<unknown>>('contentTemplate');

  protected readonly labelIconTpl = computed(() =>
    this.iconTemplates().find((t) => t.snIcon() === 'label') ?? null,
  );

  readonly rootClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  readonly buttonClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'tab', false),
  );

  readonly iconClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'icon', false),
  );

  readonly labelClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'label', false),
  );

  focus(): void {
    this.tabs.focusTab(this.tabId);
  }

  getContentTemplate(): TemplateRef<unknown> | null {
    return this.contentTpl() ?? null;
  }

  ngOnInit(): void {
    this.tabs.registerTab(this.tabId, this.buttonId);
  }

  ngOnDestroy(): void {
    this.tabs.unregisterTab(this.tabId);
  }
}
