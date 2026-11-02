import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService, Theme, Direction } from '../../core/theme.service';
import { LayoutService } from '../../core/layout.service';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-header' },
  templateUrl: './header.html',
  styleUrl: './header.scss',
  imports: [RouterLink],
})
export class HeaderComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly layout = inject(LayoutService);

  protected readonly themes: { value: Theme; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'glass', label: 'Glass' },
  ];

  protected readonly directions: { value: Direction; label: string }[] = [
    { value: 'ltr', label: 'LTR' },
    { value: 'rtl', label: 'RTL' },
  ];
}
