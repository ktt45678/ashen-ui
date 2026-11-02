import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { type CodeLang, highlight } from './highlight';

/** A read-only source listing with a copy button. */
@Component({
  selector: 'doc-code-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'code-block' },
  template: `
    <button
      type="button"
      class="code-block-copy"
      [class.code-block-copy--done]="copied()"
      (click)="copy()"
      [attr.aria-label]="copied() ? 'Copied' : 'Copy code to clipboard'"
    >
      {{ copied() ? 'Copied' : 'Copy' }}
    </button>
    <pre class="code-block-pre"><code>@for (token of tokens(); track $index) {<span
      [class]="'tok tok-' + token.kind">{{ token.text }}</span>}</code></pre>
  `,
  styleUrl: './code-block.scss',
})
export class CodeBlock {
  readonly code = input.required<string>();
  readonly lang = input.required<CodeLang>();

  protected readonly tokens = computed(() => highlight(this.code(), this.lang()));
  protected readonly copied = signal(false);
  private timer?: ReturnType<typeof setTimeout>;

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
      this.copied.set(true);
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.copied.set(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }
}
