import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  contentChildren,
  forwardRef,
  inject,
  input,
  model,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Icon } from 'ashen-ui/icon';
import {
  SnIconRegistry,
  IconTemplate,
  SN_PART_SOURCE,
  SnPart,
  resolveSnClass,
  snAnimated,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnStyle,
  SnPanelIntl,
  snNextId,
  snRenderGate,
  type SnShowHideAnimation,
} from 'ashen-ui/core';

const PANEL_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['data-sn-collapsed'],
  toggle: ['type', 'aria-expanded', 'aria-controls', 'aria-label'],
  content: ['id'],
};

@Component({
  selector: 'sn-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, Icon, SnPart],
  hostDirectives: [SnPart],
  templateUrl: './panel.html',
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => Panel) }],
  host: {
    class: 'sn-panel',
    '[class.sn-panel-animate]': '_animate()',
    '[class]': 'rootClassExtra()',
    '[attr.data-sn-collapsed]': 'collapsed() ? "" : null',
  },
})
export class Panel implements SnPartSource {
  protected readonly icons = inject(SnIconRegistry);

  protected readonly _animate = snRenderGate();
  readonly header = input('');
  readonly icon = input('');
  readonly toggleable = input(false, { transform: booleanAttribute });
  readonly collapsed = model(false);
  readonly expandLabel = input<string | undefined>(undefined);
  readonly collapseLabel = input<string | undefined>(undefined);
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    PANEL_RESERVED_ATTRS[section] ?? [];
  readonly animated = input(true, { transform: booleanAttribute });
  /**
   * `animated` AND-ed with the app-wide motion setting. Read this, never
   * `animated()` directly, or SN_ANIMATIONS_DISABLED and prefers-reduced-motion
   * cannot skip the exit animation.
   */
  readonly _animated = snAnimated(this.animated);
  readonly animation = input<SnShowHideAnimation | undefined>(undefined);

  private readonly intl = inject(SnPanelIntl);
  protected readonly iconTemplates = contentChildren(IconTemplate);

  protected readonly contentId = snNextId('sn-panel-content');

  protected readonly toggleIconTpl = computed(() =>
    this.iconTemplates().find((t) => t.snIcon() === 'toggle') ?? null,
  );

  protected readonly effectiveExpandLabel = computed(
    () => this.expandLabel() ?? this.intl.expand,
  );

  protected readonly effectiveCollapseLabel = computed(
    () => this.collapseLabel() ?? this.intl.collapse,
  );

  protected readonly toggleAriaLabel = computed(() =>
    this.collapsed() ? this.effectiveExpandLabel() : this.effectiveCollapseLabel(),
  );

  protected readonly rootClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly headerClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'header', false),
  );

  protected readonly iconClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'icon', false),
  );

  protected readonly titleClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'title', false),
  );

  protected readonly actionsClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'actions', false),
  );

  protected readonly toggleClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'toggle', false),
  );

  protected readonly contentClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'content', false),
  );

  protected toggle(): void {
    this.collapsed.set(!this.collapsed());
  }
}
