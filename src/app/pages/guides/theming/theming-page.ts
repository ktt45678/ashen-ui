import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-theming-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  imports: [],
  templateUrl: './theming-page.html',
  styleUrl: './theming-page.scss',
})
export class ThemingPage {}
