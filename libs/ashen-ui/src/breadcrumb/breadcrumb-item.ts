import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  input,
  signal,
  viewChild,
} from '@angular/core';
import type { Params, UrlTree } from '@angular/router';
import { type SnClass, resolveSnClass } from 'ashen-ui/core';

@Component({
  selector: 'sn-breadcrumb-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './breadcrumb-item.html',
  host: {
    class: 'sn-breadcrumb-item',
    '[class]': 'rootClassExtra()',
  },
})
export class BreadcrumbItem {
  readonly href = input<string | null>(null);
  /** Router navigation target. Wins over `href` and needs `provideRouter`. */
  readonly routerLink = input<string | readonly unknown[] | UrlTree | null>(null);
  readonly queryParams = input<Params | null>(null);
  readonly fragment = input<string | undefined>(undefined);
  readonly icon = input('');
  readonly snClass = input<SnClass>();

  readonly isCurrent = signal(false);

  private readonly contentTpl = viewChild<TemplateRef<unknown>>('contentTemplate');

  readonly rootClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  readonly linkClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'link', false),
  );

  getContentTemplate(): TemplateRef<unknown> | null {
    return this.contentTpl() ?? null;
  }
}
