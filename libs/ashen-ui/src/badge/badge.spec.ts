import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Badge } from './badge';

@Component({
  template: `<sn-badge value="3" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Badge],
})
class DefaultHost {}

@Component({
  template: `<sn-badge value="12" color="error" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Badge],
})
class ErrorColorHost {}

@Component({
  template: `<sn-badge value="new" color="success" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Badge],
})
class SuccessColorHost {}

@Component({
  template: `<sn-badge dot color="warning" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Badge],
})
class DotWarningHost {}

@Component({
  template: `<sn-badge dot />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Badge],
})
class DotHost {}

@Component({
  template: `<sn-badge [value]="value()" [color]="'primary'" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Badge],
})
class DynamicValueHost {
  readonly value = signal<string | number>(5);
}

@Component({
  template: `<sn-badge value="2" color="error" overlay><span class="child">X</span></sn-badge>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Badge],
})
class OverlayHost {}

@Component({
  template: `<sn-badge value="1" color="secondary" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Badge],
})
class SecondaryColorHost {}

@Component({
  template: `<sn-badge value="1" color="info" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Badge],
})
class InfoColorHost {}

@Component({
  template: `<sn-badge dot color="success" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Badge],
})
class DotSuccessHost {}

@Component({
  template: `
    <sn-badge
      value="3"
      color="error"
      [snStyle]="{ root: { outline: '1px solid red' }, pip: { color: 'rgb(1, 2, 3)' } }"
      [snAttrs]="{
        root: { 'data-testid': 'badge-root', role: 'presentation', 'aria-label': 'hijacked' },
        pip: { 'data-testid': 'badge-pip', 'aria-hidden': 'true' }
      }"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Badge],
})
class SnPartHost {}

describe('Badge', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('applies sn-badge host class', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-badge');
    expect(el.classList).toContain('sn-badge');
  });

  it('applies sn-badge-primary class by default', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-badge');
    expect(el.classList).toContain('sn-badge-primary');
  });

  it('renders value text in the pip', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const pip = fixture.nativeElement.querySelector('.sn-badge-pip');
    expect(pip).toBeTruthy();
    expect(pip.textContent?.trim()).toBe('3');
  });

  it('adds sn-badge-error for color="error"', async () => {
    const fixture = TestBed.createComponent(ErrorColorHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-badge');
    expect(el.classList).toContain('sn-badge-error');
  });

  it('adds sn-badge-success for color="success"', async () => {
    const fixture = TestBed.createComponent(SuccessColorHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-badge');
    expect(el.classList).toContain('sn-badge-success');
  });

  it('adds sn-badge-secondary for color="secondary"', async () => {
    const fixture = TestBed.createComponent(SecondaryColorHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-badge');
    expect(el.classList).toContain('sn-badge-secondary');
  });

  it('adds sn-badge-info for color="info"', async () => {
    const fixture = TestBed.createComponent(InfoColorHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-badge');
    expect(el.classList).toContain('sn-badge-info');
  });

  it('adds sn-badge-warning for dot+warning', async () => {
    const fixture = TestBed.createComponent(DotWarningHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-badge');
    expect(el.classList).toContain('sn-badge-warning');
  });

  it('adds sn-badge--dot class when dot=true', async () => {
    const fixture = TestBed.createComponent(DotHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-badge');
    expect(el.classList).toContain('sn-badge--dot');
  });

  it('renders empty pip when dot=true', async () => {
    const fixture = TestBed.createComponent(DotSuccessHost);
    await fixture.whenStable();
    const pip = fixture.nativeElement.querySelector('.sn-badge-pip');
    expect(pip).toBeTruthy();
    expect(pip.textContent?.trim()).toBe('');
  });

  it('does not add sn-badge--dot when dot=false', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-badge');
    expect(el.classList).not.toContain('sn-badge--dot');
  });

  it('updates pip text when value changes', async () => {
    const fixture = TestBed.createComponent(DynamicValueHost);
    await fixture.whenStable();
    fixture.componentInstance.value.set(99);
    await fixture.whenStable();
    const pip = fixture.nativeElement.querySelector('.sn-badge-pip');
    expect(pip.textContent?.trim()).toBe('99');
  });

  it('adds sn-badge--overlay class when overlay=true', async () => {
    const fixture = TestBed.createComponent(OverlayHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-badge');
    expect(el.classList).toContain('sn-badge--overlay');
  });

  it('renders the projected child in overlay mode', async () => {
    const fixture = TestBed.createComponent(OverlayHost);
    await fixture.whenStable();
    const child = fixture.nativeElement.querySelector('.child');
    expect(child).toBeTruthy();
    expect(child.textContent?.trim()).toBe('X');
  });

  it('renders an anchored pip in overlay mode', async () => {
    const fixture = TestBed.createComponent(OverlayHost);
    await fixture.whenStable();
    const pip = fixture.nativeElement.querySelector('.sn-badge-pip--anchored');
    expect(pip).toBeTruthy();
    expect(pip.textContent?.trim()).toBe('2');
  });

  it('does not add sn-badge--overlay by default', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-badge');
    expect(el.classList).not.toContain('sn-badge--overlay');
  });

  it('sets role="status" on the host', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-badge');
    expect(el.getAttribute('role')).toBe('status');
  });

  it('sets aria-label from value on standalone badge', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-badge');
    expect(el.getAttribute('aria-label')).toBe('3');
  });

  it('applies snStyle and allowed snAttrs to named parts without replacing badge semantics', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const root: HTMLElement = el.querySelector('sn-badge')!;
    const pip: HTMLElement = el.querySelector('.sn-badge-pip')!;

    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('badge-root');
    // role and aria-label are library-owned, so the pass-through cannot replace them.
    expect(root.getAttribute('role')).toBe('status');
    expect(root.getAttribute('aria-label')).toBe('3');
    expect(pip.style.color).toBe('rgb(1, 2, 3)');
    expect(pip.getAttribute('data-testid')).toBe('badge-pip');
    // aria-hidden is reserved on the pip, so the pass-through leaves the plain pip without it.
    expect(pip.getAttribute('aria-hidden')).toBeNull();
  });
});
