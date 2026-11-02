import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, take } from 'rxjs';
import { HeaderComponent } from './layout/header/header';
import { SidenavComponent } from './layout/sidenav/sidenav';
import { LayoutService } from './core/layout.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-root' },
  imports: [RouterOutlet, HeaderComponent, SidenavComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly layout = inject(LayoutService);

  constructor() {
    // Lift the boot guard once the first route has rendered; a double rAF lets host bindings paint.
    const router = inject(Router);
    const destroyRef = inject(DestroyRef);
    const layout = this.layout;
    router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        take(1),
        takeUntilDestroyed(destroyRef),
      )
      .subscribe(() => {
        requestAnimationFrame(() =>
          requestAnimationFrame(() =>
            document.documentElement.removeAttribute('data-sn-app-boot'),
          ),
        );
      });

    router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(destroyRef),
      )
      .subscribe(() => layout.closeNav());
  }
}
