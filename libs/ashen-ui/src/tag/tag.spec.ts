import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Tag } from './tag';

@Component({
  template: `<sn-tag value="Button" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tag],
})
class DefaultHost {}

@Component({
  template: `<sn-tag value="Widget" severity="info" icon="widgets" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tag],
})
class InfoIconHost {}

@Component({
  template: `<sn-tag value="Saved" severity="success" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tag],
})
class SuccessHost {}

@Component({
  template: `<sn-tag value="Overlap" severity="warning" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tag],
})
class WarningHost {}

@Component({
  template: `<sn-tag value="Invalid" severity="error" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tag],
})
class ErrorHost {}

@Component({
  template: `<sn-tag value="Cancel" severity="secondary" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tag],
})
class SecondaryHost {}

@Component({
  template: `<sn-tag icon="star" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tag],
})
class IconOnlyHost {}

@Component({
  template: `<sn-tag>projected</sn-tag>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tag],
})
class ProjectedHost {}

@Component({
  template: `
    <sn-tag
      value="Widget"
      icon="widgets"
      [snStyle]="{
        root: { outline: '1px solid red' },
        icon: { color: 'rgb(1, 2, 3)' },
        label: { color: 'rgb(4, 5, 6)' }
      }"
      [snAttrs]="{
        root: { 'data-testid': 'tag-root' },
        icon: { 'data-testid': 'tag-icon', 'aria-hidden': 'false' },
        label: { 'data-testid': 'tag-label' }
      }"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tag],
})
class SnPartHost {}

describe('Tag', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('applies sn-tag host class', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-tag');
    expect(el.classList).toContain('sn-tag');
  });

  it('applies sn-tag-primary class by default', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-tag');
    expect(el.classList).toContain('sn-tag-primary');
  });

  it('renders value text in sn-tag-label', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const label = fixture.nativeElement.querySelector('.sn-tag-label');
    expect(label).toBeTruthy();
    expect(label.textContent?.trim()).toBe('Button');
  });

  it('adds sn-tag-info for severity="info"', async () => {
    const fixture = TestBed.createComponent(InfoIconHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-tag');
    expect(el.classList).toContain('sn-tag-info');
  });

  it('adds sn-tag-success for severity="success"', async () => {
    const fixture = TestBed.createComponent(SuccessHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-tag');
    expect(el.classList).toContain('sn-tag-success');
  });

  it('adds sn-tag-warning for severity="warning"', async () => {
    const fixture = TestBed.createComponent(WarningHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-tag');
    expect(el.classList).toContain('sn-tag-warning');
  });

  it('adds sn-tag-error for severity="error"', async () => {
    const fixture = TestBed.createComponent(ErrorHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-tag');
    expect(el.classList).toContain('sn-tag-error');
  });

  it('adds sn-tag-secondary for severity="secondary"', async () => {
    const fixture = TestBed.createComponent(SecondaryHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-tag');
    expect(el.classList).toContain('sn-tag-secondary');
  });

  it('renders icon span when icon is provided', async () => {
    const fixture = TestBed.createComponent(InfoIconHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('.sn-tag-icon');
    expect(icon).toBeTruthy();
    expect(icon.textContent?.trim()).toBe('widgets');
  });

  it('does not render icon span when icon is empty', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('.sn-tag-icon');
    expect(icon).toBeNull();
  });

  it('renders icon-only tag (no value)', async () => {
    const fixture = TestBed.createComponent(IconOnlyHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('.sn-tag-icon');
    expect(icon).toBeTruthy();
    expect(icon.textContent?.trim()).toBe('star');
    const label = fixture.nativeElement.querySelector('.sn-tag-label');
    expect(label).toBeNull();
  });

  it('renders projected content', async () => {
    const fixture = TestBed.createComponent(ProjectedHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-tag');
    expect(el.textContent).toContain('projected');
  });

  it('applies snStyle and allowed snAttrs to named parts without replacing tag semantics', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const root: HTMLElement = el.querySelector('sn-tag')!;
    const icon: HTMLElement = el.querySelector('.sn-tag-icon')!;
    const label: HTMLElement = el.querySelector('.sn-tag-label')!;

    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('tag-root');
    expect(icon.style.color).toBe('rgb(1, 2, 3)');
    expect(icon.getAttribute('data-testid')).toBe('tag-icon');
    // aria-hidden is reserved on the icon, so the pass-through cannot flip it.
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(label.style.color).toBe('rgb(4, 5, 6)');
    expect(label.getAttribute('data-testid')).toBe('tag-label');
  });
});
