import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-getting-started-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  imports: [],
  templateUrl: './getting-started-page.html',
  styleUrl: './getting-started-page.scss',
})
export class GettingStartedPage {}
