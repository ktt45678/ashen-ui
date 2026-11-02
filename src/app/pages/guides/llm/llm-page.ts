import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-llm-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  templateUrl: './llm-page.html',
  styleUrl: './llm-page.scss',
})
export class LlmPage {}
