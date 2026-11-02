import { describe, it, expect, beforeEach } from 'vitest';
import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, RouterLink, RouterLinkActive, provideRouter } from '@angular/router';
import { TabNav } from './tab-nav';
import { TabLink } from './tab-link';

@Component({ template: '' })
class Blank {}

@Component({
  imports: [TabNav, TabLink, RouterLink, RouterLinkActive],
  template: `
    <nav snTabNav>
      <a snTabLink routerLink="/one" routerLinkActive>One</a>
      <a snTabLink routerLink="/two" routerLinkActive>Two</a>
    </nav>
  `,
})
class RouterHost {}

@Component({
  imports: [TabNav, TabLink],
  template: `
    <nav snTabNav [orientation]="orientation()">
      @for (tab of tabs; track tab; let i = $index) {
        <button type="button" snTabLink [active]="selected() === i" (click)="selected.set(i)">{{ tab }}</button>
      }
    </nav>
  `,
})
class ButtonHost {
  readonly tabs = ['General', 'Images', 'Videos'];
  readonly selected = signal(0);
  readonly orientation = signal<'horizontal' | 'vertical'>('horizontal');
}

const links = (root: HTMLElement) => [...root.querySelectorAll<HTMLElement>('.sn-tab-link')];

describe('TabNav', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: 'one', component: Blank },
          { path: 'two', component: Blank },
        ]),
      ],
    });
  });

  it('follows routerLinkActive when [active] is not bound', async () => {
    const fixture = TestBed.createComponent(RouterHost);
    await TestBed.inject(Router).navigateByUrl('/two');
    await fixture.whenStable();

    const [one, two] = links(fixture.nativeElement);
    expect(one.classList).not.toContain('sn-tab-link-active');
    expect(two.classList).toContain('sn-tab-link-active');
    expect(two.getAttribute('aria-current')).toBe('page');
    expect(one.hasAttribute('aria-current')).toBe(false);
  });

  it('uses [active] on buttons and marks the current one', async () => {
    const fixture = TestBed.createComponent(ButtonHost);
    await fixture.whenStable();

    links(fixture.nativeElement)[2].click();
    await fixture.whenStable();

    const all = links(fixture.nativeElement);
    expect(all.map((l) => l.classList.contains('sn-tab-link-active'))).toEqual([false, false, true]);
    expect(all[2].getAttribute('aria-current')).toBe('true');
  });

  it('shows the indicator only on horizontal bars', async () => {
    const fixture = TestBed.createComponent(ButtonHost);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('.sn-tab-nav-indicator')).not.toBeNull();

    fixture.componentInstance.orientation.set('vertical');
    await fixture.whenStable();
    expect(root.querySelector('.sn-tab-nav')!.classList).toContain('sn-tab-nav-vertical');
    expect(root.querySelector('.sn-tab-nav-indicator')).toBeNull();
  });

  it('hides the scroll buttons while the links fit', async () => {
    const fixture = TestBed.createComponent(ButtonHost);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.sn-tab-nav-scroll-btn')).toBeNull();
  });
});
