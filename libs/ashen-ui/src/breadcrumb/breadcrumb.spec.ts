import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Dir } from '@angular/cdk/bidi';
import { Breadcrumb } from './breadcrumb';
import { BreadcrumbItem } from './breadcrumb-item';
import { provideSnIcons, provideSnIntl } from 'ashen-ui/core';

@Component({
  template: `
    <sn-breadcrumb>
      <sn-breadcrumb-item href="/">Home</sn-breadcrumb-item>
      <sn-breadcrumb-item href="/library">Library</sn-breadcrumb-item>
      <sn-breadcrumb-item>Current Page</sn-breadcrumb-item>
    </sn-breadcrumb>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Breadcrumb, BreadcrumbItem],
})
class BasicHost {}

@Component({
  template: `
    <sn-breadcrumb>
      <sn-breadcrumb-item href="/" icon="home">Home</sn-breadcrumb-item>
      <sn-breadcrumb-item>Current Page</sn-breadcrumb-item>
    </sn-breadcrumb>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Breadcrumb, BreadcrumbItem],
})
class WithIconHost {}

@Component({
  template: `
    <div dir="rtl">
      <sn-breadcrumb>
        <sn-breadcrumb-item href="/">Home</sn-breadcrumb-item>
        <sn-breadcrumb-item>Current Page</sn-breadcrumb-item>
      </sn-breadcrumb>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Dir, Breadcrumb, BreadcrumbItem],
})
class RtlHost {}

@Component({
  template: `
    <sn-breadcrumb label="Site Navigation">
      <sn-breadcrumb-item href="/">Home</sn-breadcrumb-item>
      <sn-breadcrumb-item>About</sn-breadcrumb-item>
    </sn-breadcrumb>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Breadcrumb, BreadcrumbItem],
})
class CustomLabelHost {}

@Component({
  template: `
    <sn-breadcrumb>
      <sn-breadcrumb-item href="/">Home</sn-breadcrumb-item>
      <sn-breadcrumb-item>Docs</sn-breadcrumb-item>
    </sn-breadcrumb>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Breadcrumb, BreadcrumbItem],
})
class TwoItemHost {}

@Component({
  template: `
    <sn-breadcrumb snClass="my-breadcrumb">
      <sn-breadcrumb-item href="/" [snClass]="{ link: 'my-link' }">Home</sn-breadcrumb-item>
      <sn-breadcrumb-item>Current</sn-breadcrumb-item>
    </sn-breadcrumb>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Breadcrumb, BreadcrumbItem],
})
class SnClassHost {}

@Component({
  template: `
    <sn-breadcrumb>
      <sn-breadcrumb-item>Only</sn-breadcrumb-item>
    </sn-breadcrumb>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Breadcrumb, BreadcrumbItem],
})
class SingleItemHost {}

@Component({
  template: `
    <sn-breadcrumb
      [snStyle]="{
        root: { outline: '1px solid red' },
        nav: { color: 'rgb(1, 2, 3)' },
        list: { color: 'rgb(4, 5, 6)' },
        item: { color: 'rgb(7, 8, 9)' },
        itemIcon: { color: 'rgb(10, 11, 12)' },
        separator: { color: 'rgb(13, 14, 15)' }
      }"
      [snAttrs]="{
        root: { 'data-testid': 'bc-root' },
        nav: { 'data-testid': 'bc-nav', 'aria-label': 'hijacked' },
        list: { 'data-testid': 'bc-list' },
        item: { 'data-testid': 'bc-item' },
        itemIcon: { 'data-testid': 'bc-item-icon', 'aria-hidden': 'false' },
        separator: { 'data-testid': 'bc-separator', 'aria-hidden': 'false' }
      }"
    >
      <sn-breadcrumb-item href="/" icon="home">Home</sn-breadcrumb-item>
      <sn-breadcrumb-item>Current</sn-breadcrumb-item>
    </sn-breadcrumb>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Breadcrumb, BreadcrumbItem],
})
class SnPartHost {}

describe('Breadcrumb', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders sn-breadcrumb host with sn-breadcrumb class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-breadcrumb');
    expect(el).not.toBeNull();
    expect(el.classList).toContain('sn-breadcrumb');
  });

  it('renders a nav element with role-appropriate aria-label', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const nav: HTMLElement = fixture.nativeElement.querySelector('nav');
    expect(nav).not.toBeNull();
    expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
  });

  it('uses custom label input for aria-label', async () => {
    const fixture = TestBed.createComponent(CustomLabelHost);
    await fixture.whenStable();
    const nav: HTMLElement = fixture.nativeElement.querySelector('nav');
    expect(nav.getAttribute('aria-label')).toBe('Site Navigation');
  });

  it('renders an ol list', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const ol: HTMLElement = fixture.nativeElement.querySelector('ol');
    expect(ol).not.toBeNull();
    expect(ol.classList).toContain('sn-breadcrumb-list');
  });

  it('renders one li per item', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const items: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('li');
    expect(items.length).toBe(3);
  });

  it('non-last items render an anchor link', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const links: NodeListOf<HTMLAnchorElement> = fixture.nativeElement.querySelectorAll('a.sn-breadcrumb-link');
    expect(links.length).toBe(2);
    expect(links[0].getAttribute('href')).toBe('/');
    expect(links[1].getAttribute('href')).toBe('/library');
  });

  it('last item renders a span, not an anchor', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const currentEl: HTMLElement = fixture.nativeElement.querySelector('.sn-breadcrumb-link--current');
    expect(currentEl).not.toBeNull();
    expect(currentEl.tagName.toLowerCase()).toBe('span');
  });

  it('last item has aria-current="page"', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const currentEl: HTMLElement = fixture.nativeElement.querySelector('[aria-current="page"]');
    expect(currentEl).not.toBeNull();
    expect(currentEl.textContent?.trim()).toContain('Current Page');
  });

  it('non-last items do not have aria-current', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const links: NodeListOf<HTMLAnchorElement> = fixture.nativeElement.querySelectorAll('a.sn-breadcrumb-link');
    links.forEach((link) => {
      expect(link.getAttribute('aria-current')).toBeNull();
    });
  });

  it('renders separators between items (n-1 separators for n items)', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const separators: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.sn-breadcrumb-separator');
    expect(separators.length).toBe(2);
  });

  it('points the separator forwards along the trail', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const separator: HTMLElement = fixture.nativeElement.querySelector('.sn-breadcrumb-separator');

    expect(separator.textContent!.trim()).toBe('chevron_right');
  });

  it('turns the separator around in rtl', async () => {
    const fixture = TestBed.createComponent(RtlHost);
    await fixture.whenStable();
    const separator: HTMLElement = fixture.nativeElement.querySelector('.sn-breadcrumb-separator');

    expect(separator.textContent!.trim()).toBe('chevron_left');
  });

  it('takes the separator glyph from the icon registry', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideSnIcons({ 'chevron-right': 'arrow_forward' })],
    });
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const separator: HTMLElement = fixture.nativeElement.querySelector('.sn-breadcrumb-separator');

    expect(separator.textContent!.trim()).toBe('arrow_forward');
  });

  it('separators are aria-hidden', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const separators: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.sn-breadcrumb-separator');
    separators.forEach((sep) => {
      expect(sep.getAttribute('aria-hidden')).toBe('true');
    });
  });

  it('no separator rendered after last item', async () => {
    const fixture = TestBed.createComponent(TwoItemHost);
    await fixture.whenStable();
    const listItems: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('li');
    const lastLi = listItems[listItems.length - 1];
    expect(lastLi.querySelector('.sn-breadcrumb-separator')).toBeNull();
  });

  it('renders icon span when icon input is set', async () => {
    const fixture = TestBed.createComponent(WithIconHost);
    await fixture.whenStable();
    const icon: HTMLElement = fixture.nativeElement.querySelector('.sn-breadcrumb-item-icon');
    expect(icon).not.toBeNull();
    expect(icon.textContent?.trim()).toBe('home');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
  });

  it('single item renders as current (no links, no separators)', async () => {
    const fixture = TestBed.createComponent(SingleItemHost);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('a').length).toBe(0);
    expect(fixture.nativeElement.querySelectorAll('.sn-breadcrumb-separator').length).toBe(0);
    const currentEl: HTMLElement = fixture.nativeElement.querySelector('[aria-current="page"]');
    expect(currentEl).not.toBeNull();
  });

  it('item with no href renders as current span (non-link)', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const spans: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('span.sn-breadcrumb-link');
    expect(spans.length).toBeGreaterThanOrEqual(1);
  });

  it('snClass string lands on breadcrumb root', async () => {
    const fixture = TestBed.createComponent(SnClassHost);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement.querySelector('sn-breadcrumb');
    expect(root.classList).toContain('my-breadcrumb');
  });

  it('snClass map section link lands on the anchor', async () => {
    const fixture = TestBed.createComponent(SnClassHost);
    await fixture.whenStable();
    const link: HTMLElement = fixture.nativeElement.querySelector('a.sn-breadcrumb-link');
    expect(link.classList).toContain('my-link');
  });

  it('uses SnIntl breadcrumb label as default aria-label', async () => {
    TestBed.overrideProvider(provideZonelessChangeDetection, {});
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const nav: HTMLElement = fixture.nativeElement.querySelector('nav');
    expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
  });

  it('SnIntl breadcrumb value can be overridden', async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideSnIntl({ breadcrumb: 'Navigation Trail' })],
    });
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const nav: HTMLElement = fixture.nativeElement.querySelector('nav');
    expect(nav.getAttribute('aria-label')).toBe('Navigation Trail');
  });

  it('renders label text inside links and current span', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const links: NodeListOf<HTMLAnchorElement> = fixture.nativeElement.querySelectorAll('a.sn-breadcrumb-link');
    const currentEl: HTMLElement = fixture.nativeElement.querySelector('.sn-breadcrumb-link--current');
    expect(links[0].textContent?.trim()).toBe('Home');
    expect(links[1].textContent?.trim()).toBe('Library');
    expect(currentEl.textContent?.trim()).toBe('Current Page');
  });

  it('sn-breadcrumb-item host has sn-breadcrumb-item class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const items: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('sn-breadcrumb-item');
    items.forEach((item) => {
      expect(item.classList).toContain('sn-breadcrumb-item');
    });
  });

  it('applies snStyle and allowed snAttrs to the container parts without replacing breadcrumb semantics', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const root: HTMLElement = el.querySelector('sn-breadcrumb')!;
    const nav: HTMLElement = el.querySelector('nav')!;
    const list: HTMLElement = el.querySelector('ol')!;
    const item: HTMLElement = el.querySelector('li')!;
    const itemIcon: HTMLElement = el.querySelector('.sn-breadcrumb-item-icon')!;
    const separator: HTMLElement = el.querySelector('.sn-breadcrumb-separator')!;

    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('bc-root');
    expect(nav.style.color).toBe('rgb(1, 2, 3)');
    expect(nav.getAttribute('data-testid')).toBe('bc-nav');
    // aria-label is library-owned, so the pass-through cannot replace it.
    expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
    expect(list.style.color).toBe('rgb(4, 5, 6)');
    expect(list.getAttribute('data-testid')).toBe('bc-list');
    expect(item.style.color).toBe('rgb(7, 8, 9)');
    expect(item.getAttribute('data-testid')).toBe('bc-item');
    expect(itemIcon.style.color).toBe('rgb(10, 11, 12)');
    expect(itemIcon.getAttribute('data-testid')).toBe('bc-item-icon');
    // aria-hidden is reserved on the icon and the separator.
    expect(itemIcon.getAttribute('aria-hidden')).toBe('true');
    expect(separator.style.color).toBe('rgb(13, 14, 15)');
    expect(separator.getAttribute('data-testid')).toBe('bc-separator');
    expect(separator.getAttribute('aria-hidden')).toBe('true');
  });
});
