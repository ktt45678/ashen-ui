import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  booleanAttribute,
  computed,
  contentChildren,
  forwardRef,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FocusableOption } from '@angular/cdk/a11y';
import { Icon } from 'ashen-ui/icon';
import {
  SnIconRegistry,
  IconTemplate,
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnStyle,
  resolveSnClass,
  snNextId,
  snRenderGate,
} from 'ashen-ui/core';
import { SN_ACCORDION } from './accordion-token';

const EXPANSION_PANEL_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['data-sn-expanded'],
  button: ['type', 'id', 'aria-expanded', 'aria-controls', 'disabled'],
  content: ['id', 'role', 'aria-labelledby', 'inert'],
};

@Component({
  selector: 'sn-expansion-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, Icon, SnPart],
  hostDirectives: [SnPart],
  templateUrl: './expansion-panel.html',
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => ExpansionPanel) }],
  host: {
    class: 'sn-expansion-panel',
    '[class.sn-expansion-panel-animate]': '_animate()',
    '[class]': 'rootClassExtra()',
    '[attr.data-sn-expanded]': 'expanded() ? "" : null',
  },
})
export class ExpansionPanel implements FocusableOption, OnInit, OnDestroy, SnPartSource {
  protected readonly icons = inject(SnIconRegistry);

  protected readonly _animate = snRenderGate();
  readonly header = input('');
  readonly icon = input('');
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
  readonly expanded = model(false);
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    EXPANSION_PANEL_RESERVED_ATTRS[section] ?? [];

  get disabled(): boolean {
    return this.disabledInput();
  }

  private readonly accordion = inject(SN_ACCORDION, { optional: true });
  readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly iconTemplates = contentChildren(IconTemplate);
  protected readonly headerButton = viewChild<ElementRef<HTMLButtonElement>>('headerButton');

  protected readonly panelId = snNextId('sn-expansion-panel');
  protected readonly contentId = `${this.panelId}-content`;
  protected readonly headerId = `${this.panelId}-header`;

  protected readonly toggleIconTpl = computed(() =>
    this.iconTemplates().find((t) => t.snIcon() === 'toggle') ?? null,
  );

  protected readonly rootClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly headerClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'header', false),
  );

  protected readonly buttonClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'button', false),
  );

  protected readonly iconClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'icon', false),
  );

  protected readonly titleClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'title', false),
  );

  protected readonly toggleClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'toggle', false),
  );

  protected readonly contentClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'content', false),
  );

  focus(): void {
    this.headerButton()?.nativeElement.focus();
  }

  protected toggle(): void {
    if (this.disabled) return;
    const next = !this.expanded();
    if (next) {
      this.accordion?.requestExpand(this.panelId);
    }
    this.expanded.set(next);
  }

  ngOnInit(): void {
    if (this.expanded()) {
      this.accordion?.requestExpand(this.panelId);
    }
    this.accordion?.registerPanel(this.panelId, () => this.expanded.set(false));
  }

  ngOnDestroy(): void {
    this.accordion?.unregisterPanel(this.panelId);
  }
}
