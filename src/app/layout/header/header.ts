import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'ashen-ui/button';
import { Icon } from 'ashen-ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from 'ashen-ui/popover';
import { ThemeService, Theme, Direction } from '../../core/theme.service';
import { LayoutService } from '../../core/layout.service';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-header' },
  templateUrl: './header.html',
  styleUrl: './header.scss',
  imports: [RouterLink, Button, Icon, Popover, PopoverTrigger, PopoverContent],
})
export class HeaderComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly layout = inject(LayoutService);

  protected readonly themes: { value: Theme; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: 'light_mode' },
    { value: 'dark', label: 'Dark', icon: 'dark_mode' },
    { value: 'glass', label: 'Glass', icon: 'blur_on' },
  ];

  protected readonly directions: { value: Direction; label: string }[] = [
    { value: 'ltr', label: 'LTR' },
    { value: 'rtl', label: 'RTL' },
  ];
}
