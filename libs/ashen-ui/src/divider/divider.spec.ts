import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Divider } from './divider';

@Component({
  template: `<sn-divider />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Divider],
})
class PlainHost {}

@Component({
  template: `<sn-divider label="Visual Appearance" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Divider],
})
class LabeledHost {}

@Component({
  template: `<sn-divider vertical />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Divider],
})
class VerticalHost {}

@Component({
  template: `<sn-divider [vertical]="false" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Divider],
})
class HorizontalHost {}

@Component({
  template: `
    <sn-divider
      label="Visual Appearance"
      [snStyle]="{
        root: { outline: '1px solid red' },
        line: { color: 'rgb(1, 2, 3)' },
        label: { color: 'rgb(4, 5, 6)' }
      }"
      [snAttrs]="{
        root: { 'data-testid': 'divider-root', role: 'presentation', 'aria-orientation': 'vertical' },
        line: { 'data-testid': 'divider-line' },
        label: { 'data-testid': 'divider-label' }
      }"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Divider],
})
class SnPartHost {}

describe('Divider', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders with sn-divider class', async () => {
    const fixture = TestBed.createComponent(PlainHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-divider');
    expect(el.classList).toContain('sn-divider');
  });

  it('has role="separator"', async () => {
    const fixture = TestBed.createComponent(PlainHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-divider');
    expect(el.getAttribute('role')).toBe('separator');
  });

  it('has aria-orientation="horizontal" by default', async () => {
    const fixture = TestBed.createComponent(PlainHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-divider');
    expect(el.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('renders two sn-divider-line spans for plain horizontal', async () => {
    const fixture = TestBed.createComponent(PlainHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-divider');
    const lines = el.querySelectorAll('.sn-divider-line');
    expect(lines.length).toBe(2);
  });

  it('does not render sn-divider-label for plain divider', async () => {
    const fixture = TestBed.createComponent(PlainHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-divider');
    expect(el.querySelector('.sn-divider-label')).toBeNull();
  });

  it('renders sn-divider-label when label is set', async () => {
    const fixture = TestBed.createComponent(LabeledHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-divider');
    const label = el.querySelector('.sn-divider-label');
    expect(label).toBeTruthy();
    expect(label?.textContent?.trim()).toBe('Visual Appearance');
  });

  it('adds sn-divider--labeled class when label is set', async () => {
    const fixture = TestBed.createComponent(LabeledHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-divider');
    expect(el.classList).toContain('sn-divider--labeled');
  });

  it('renders two lines plus a label for labeled divider', async () => {
    const fixture = TestBed.createComponent(LabeledHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-divider');
    expect(el.querySelectorAll('.sn-divider-line').length).toBe(2);
    expect(el.querySelector('.sn-divider-label')).toBeTruthy();
  });

  it('adds sn-divider--vertical class for vertical', async () => {
    const fixture = TestBed.createComponent(VerticalHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-divider');
    expect(el.classList).toContain('sn-divider--vertical');
  });

  it('has aria-orientation="vertical" for vertical', async () => {
    const fixture = TestBed.createComponent(VerticalHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-divider');
    expect(el.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('renders no child elements for vertical divider', async () => {
    const fixture = TestBed.createComponent(VerticalHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-divider');
    expect(el.children.length).toBe(0);
  });

  it('does not add sn-divider--vertical for horizontal', async () => {
    const fixture = TestBed.createComponent(HorizontalHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-divider');
    expect(el.classList).not.toContain('sn-divider--vertical');
  });

  it('applies snStyle and allowed snAttrs to named parts without replacing divider semantics', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const root: HTMLElement = el.querySelector('sn-divider')!;
    const line: HTMLElement = el.querySelector('.sn-divider-line')!;
    const label: HTMLElement = el.querySelector('.sn-divider-label')!;

    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('divider-root');
    // role and aria-orientation are library-owned, so the pass-through cannot replace them.
    expect(root.getAttribute('role')).toBe('separator');
    expect(root.getAttribute('aria-orientation')).toBe('horizontal');
    expect(line.style.color).toBe('rgb(1, 2, 3)');
    expect(line.getAttribute('data-testid')).toBe('divider-line');
    expect(label.style.color).toBe('rgb(4, 5, 6)');
    expect(label.getAttribute('data-testid')).toBe('divider-label');
  });
});
