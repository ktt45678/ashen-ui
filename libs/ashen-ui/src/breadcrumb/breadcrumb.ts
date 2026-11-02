import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  contentChildren,
  effect,
  inject,
  input,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IconTemplate,
  SnBreadcrumbIntl,
  SnIconRegistry,
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnStyle,
  resolveSnClass,
  snIsRtl,
} from 'ashen-ui/core';
import { BreadcrumbItem } from './breadcrumb-item';

const BREADCRUMB_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  nav: ['aria-label'],
  itemIcon: ['aria-hidden'],
  separator: ['aria-hidden'],
};

@Component({
  selector: 'sn-breadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, RouterLink, SnPart],
  hostDirectives: [SnPart],
  templateUrl: './breadcrumb.html',
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => Breadcrumb) }],
  host: {
    class: 'sn-breadcrumb',
    '[class]': 'rootClassExtra()',
  },
})
export class Breadcrumb implements SnPartSource {
  readonly label = input('');
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    BREADCRUMB_RESERVED_ATTRS[section] ?? [];

  protected readonly icons = inject(SnIconRegistry);
  private readonly intl = inject(SnBreadcrumbIntl);
  private readonly rtl = snIsRtl();

  protected readonly items = contentChildren(BreadcrumbItem);
  protected readonly iconTemplates = contentChildren(IconTemplate);

  protected readonly navLabel = computed(() => this.label() || this.intl.label);

  protected readonly separatorTpl = computed(() =>
    this.iconTemplates().find((t) => t.snIcon() === 'separator') ?? null,
  );

  // The separator points the way the trail reads, so it turns around in RTL.
  protected readonly separatorIcon = computed(() =>
    this.icons.resolve(this.rtl() ? 'chevron-left' : 'chevron-right'),
  );

  protected readonly rootClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly navClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'nav', false),
  );

  protected readonly listClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'list', false),
  );

  protected readonly itemClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'item', false),
  );

  protected readonly itemIconClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'itemIcon', false),
  );

  protected readonly separatorClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'separator', false),
  );

  constructor() {
    effect(() => {
      const allItems = this.items();
      allItems.forEach((item, i) => {
        item.isCurrent.set(i === allItems.length - 1);
      });
    });
  }
}
