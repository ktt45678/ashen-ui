import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Breadcrumb } from './breadcrumb';
import { BreadcrumbItem } from './breadcrumb-item';

@Component({
  template: `
    <sn-breadcrumb>
      <sn-breadcrumb-item [routerLink]="['/library', 'books']" [queryParams]="{ page: 2 }">Library</sn-breadcrumb-item>
      <sn-breadcrumb-item routerLink="/current">Current</sn-breadcrumb-item>
    </sn-breadcrumb>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Breadcrumb, BreadcrumbItem],
})
class RouterLinkHost {}

describe('Breadcrumb routerLink', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    });
  });

  it('renders a router-managed anchor with the resolved href', async () => {
    const fix = TestBed.createComponent(RouterLinkHost);
    await fix.whenStable();
    const link = fix.nativeElement.querySelector('a.sn-breadcrumb-link') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/library/books?page=2');
  });

  it('keeps the last item as plain current text', async () => {
    const fix = TestBed.createComponent(RouterLinkHost);
    await fix.whenStable();
    expect(fix.nativeElement.querySelectorAll('a.sn-breadcrumb-link').length).toBe(1);
    expect(fix.nativeElement.querySelector('[aria-current="page"]').textContent).toContain('Current');
  });
});
