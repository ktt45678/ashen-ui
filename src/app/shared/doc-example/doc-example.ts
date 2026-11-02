import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { CodeBlock } from '../code/code-block';
import { langOf } from '../code/highlight';
import { DOC_SNIPPETS, type DocSnippetFile } from './doc-snippets.generated';

/**
 * A documentation example: the live demo, then the source behind it.
 *
 * The source is generated from the demo itself (see scripts/lib/demo-sources),
 * so the tabs are the files a reader would actually write - the template, the
 * component, any child component it opens, and the style rules it leans on.
 */
@Component({
  selector: 'doc-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-example' },
  imports: [CodeBlock],
  templateUrl: './doc-example.html',
  styleUrl: './doc-example.scss',
})
export class DocExample {
  readonly heading = input('');
  readonly description = input('');
  readonly snippet = input('');

  protected readonly showCode = signal(false);
  protected readonly activeTab = signal(0);

  protected readonly files = computed<readonly DocSnippetFile[]>(() => DOC_SNIPPETS[this.snippet()] ?? []);
  protected readonly active = computed(() => this.files()[this.activeTab()] ?? this.files()[0]);
  protected readonly activeLang = computed(() => langOf(this.active()?.name ?? 'demo.html'));

  protected toggleCode(): void {
    this.showCode.update((open) => !open);
  }

  protected selectTab(index: number): void {
    this.activeTab.set(index);
  }
}
