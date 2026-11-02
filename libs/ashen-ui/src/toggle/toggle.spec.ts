import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Toggle } from './toggle';

@Component({
  template: `<sn-toggle>Zoom Effect</sn-toggle>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Toggle],
})
class DefaultHost {}

@Component({
  template: `<sn-toggle [checked]="true">Zoom Effect</sn-toggle>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Toggle],
})
class CheckedHost {}

@Component({
  template: `<sn-toggle [disabled]="true">Disabled</sn-toggle>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Toggle],
})
class DisabledHost {}

@Component({
  template: `<sn-toggle size="sm">Small</sn-toggle>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Toggle],
})
class SmallSizeHost {}

@Component({
  template: `<sn-toggle size="lg">Large</sn-toggle>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Toggle],
})
class LargeSizeHost {}

@Component({
  template: `<sn-toggle [(checked)]="val">Toggle</sn-toggle>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Toggle],
})
class TwoWayHost {
  readonly val = signal(false);
}

@Component({
  template: `<sn-toggle [formControl]="ctrl">React form</sn-toggle>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Toggle, ReactiveFormsModule],
})
class ReactiveFormHost {
  ctrl = new FormControl(false);
}

@Component({
  template: `<sn-toggle [formControl]="ctrl">Disabled form</sn-toggle>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Toggle, ReactiveFormsModule],
})
class ReactiveFormDisabledHost {
  ctrl = new FormControl({ value: true, disabled: true });
}

@Component({
  template: `<sn-toggle [(ngModel)]="val">ngModel</sn-toggle>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Toggle, FormsModule],
})
class NgModelHost {
  readonly val = signal(false);
}

@Component({
  template: `<sn-toggle snClass="extra-cls">Label</sn-toggle>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Toggle],
})
class SnClassStringHost {}

@Component({
  template: `<sn-toggle [snClass]="{ root: 'root-extra', track: 'track-extra', thumb: 'thumb-extra', label: 'label-extra' }">Label</sn-toggle>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Toggle],
})
class SnClassObjectHost {}

@Component({
  template: `<sn-toggle [snClass]="[{ root: 'first' }, { root: 'second' }]">Label</sn-toggle>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Toggle],
})
class SnClassArrayHost {}

@Component({
  template: `
    <sn-toggle
      [checked]="true"
      [snStyle]="{
        root: { outline: '1px solid red' },
        track: { color: 'rgb(1, 2, 3)' },
        thumb: { color: 'rgb(4, 5, 6)' },
        label: { color: 'rgb(7, 8, 9)' }
      }"
      [snAttrs]="{
        root: { 'data-testid': 'tg-root', role: 'button', tabindex: '5' },
        track: { 'data-testid': 'tg-track', 'aria-hidden': 'false' },
        thumb: { 'data-testid': 'tg-thumb' },
        label: { 'data-testid': 'tg-label' }
      }"
    >
      Part toggle
    </sn-toggle>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Toggle],
})
class SnPartHost {}

describe('Toggle', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('applies sn-toggle-wrapper host class', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    expect(el.classList).toContain('sn-toggle-wrapper');
  });

  it('renders sn-toggle-track inner span', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const track = fixture.nativeElement.querySelector('.sn-toggle-track');
    expect(track).toBeTruthy();
  });

  it('renders sn-toggle-thumb inside track', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const thumb = fixture.nativeElement.querySelector('.sn-toggle-track .sn-toggle-thumb');
    expect(thumb).toBeTruthy();
  });

  it('renders sn-toggle-label with projected content', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const label = fixture.nativeElement.querySelector('.sn-toggle-label');
    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Zoom Effect');
  });

  it('has role="switch" on host', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    expect(el.getAttribute('role')).toBe('switch');
  });

  it('has tabindex="0" when enabled', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    expect(el.getAttribute('tabindex')).toBe('0');
  });

  it('applies sn-toggle-checked when checked=true', async () => {
    const fixture = TestBed.createComponent(CheckedHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    expect(el.classList).toContain('sn-toggle-checked');
  });

  it('does not apply sn-toggle-checked when unchecked', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    expect(el.classList).not.toContain('sn-toggle-checked');
  });

  it('sets aria-checked="true" when checked', async () => {
    const fixture = TestBed.createComponent(CheckedHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    expect(el.getAttribute('aria-checked')).toBe('true');
  });

  it('sets aria-checked="false" when unchecked', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    expect(el.getAttribute('aria-checked')).toBe('false');
  });

  it('applies sn-toggle-disabled when disabled=true', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    expect(el.classList).toContain('sn-toggle-disabled');
  });

  it('sets tabindex="-1" when disabled', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    expect(el.getAttribute('tabindex')).toBe('-1');
  });

  it('sets aria-disabled="true" when disabled', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    expect(el.getAttribute('aria-disabled')).toBe('true');
  });

  it('does not toggle when disabled and clicked', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    el.click();
    await fixture.whenStable();
    expect(el.classList).not.toContain('sn-toggle-checked');
  });

  it('applies sn-toggle-track-sm for size="sm"', async () => {
    const fixture = TestBed.createComponent(SmallSizeHost);
    await fixture.whenStable();
    const track: HTMLElement = fixture.nativeElement.querySelector('.sn-toggle-track');
    expect(track.classList).toContain('sn-toggle-track-sm');
  });

  it('applies sn-toggle-track-lg for size="lg"', async () => {
    const fixture = TestBed.createComponent(LargeSizeHost);
    await fixture.whenStable();
    const track: HTMLElement = fixture.nativeElement.querySelector('.sn-toggle-track');
    expect(track.classList).toContain('sn-toggle-track-lg');
  });

  it('does not apply size modifier for default medium size', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const track: HTMLElement = fixture.nativeElement.querySelector('.sn-toggle-track');
    expect(track.classList).not.toContain('sn-toggle-track-sm');
    expect(track.classList).not.toContain('sn-toggle-track-lg');
  });

  it('toggles checked on click', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    expect(el.classList).not.toContain('sn-toggle-checked');
    el.click();
    await fixture.whenStable();
    expect(el.classList).toContain('sn-toggle-checked');
    expect(fixture.componentInstance.val()).toBe(true);
  });

  it('toggles off on second click', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    fixture.componentInstance.val.set(true);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    el.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe(false);
  });

  it('toggles on Space key', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe(true);
  });

  it('toggles on Enter key', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe(true);
  });

  it('does not toggle on other keys', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe(false);
  });

  it('does not toggle on Space when disabled', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await fixture.whenStable();
    expect(el.classList).not.toContain('sn-toggle-checked');
  });

  it('marks form control touched on blur', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    el.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(fixture.componentInstance.ctrl.touched).toBe(true);
  });

  it('reflects FormControl value (true) in host class', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    fixture.componentInstance.ctrl.setValue(true);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    expect(el.classList).toContain('sn-toggle-checked');
  });

  it('reflects FormControl value (false) - no checked class', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    fixture.componentInstance.ctrl.setValue(false);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    expect(el.classList).not.toContain('sn-toggle-checked');
  });

  it('emits value to FormControl on click', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    el.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.ctrl.value).toBe(true);
  });

  it('applies disabled from FormControl.disable()', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    fixture.componentInstance.ctrl.disable();
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    expect(el.classList).toContain('sn-toggle-disabled');
    expect(el.getAttribute('tabindex')).toBe('-1');
  });

  it('reflects initial disabled state from FormControl', async () => {
    const fixture = TestBed.createComponent(ReactiveFormDisabledHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    expect(el.classList).toContain('sn-toggle-disabled');
  });

  it('re-enables when FormControl.enable() called', async () => {
    const fixture = TestBed.createComponent(ReactiveFormDisabledHost);
    await fixture.whenStable();
    fixture.componentInstance.ctrl.enable();
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    expect(el.classList).not.toContain('sn-toggle-disabled');
  });

  it('reflects ngModel value in host class', async () => {
    const fixture = TestBed.createComponent(NgModelHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.componentInstance.val.set(true);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    expect(el.classList).toContain('sn-toggle-checked');
  });

  it('updates ngModel value on click', async () => {
    const fixture = TestBed.createComponent(NgModelHost);
    fixture.detectChanges();
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    el.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe(true);
  });

  it('applies plain string snClass to root element', async () => {
    const fixture = TestBed.createComponent(SnClassStringHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    expect(el.classList).toContain('extra-cls');
  });

  it('applies object map root section to host', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    expect(el.classList).toContain('root-extra');
  });

  it('applies object map track section to track element', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    const track: HTMLElement = fixture.nativeElement.querySelector('.sn-toggle-track');
    expect(track.classList).toContain('track-extra');
  });

  it('applies object map thumb section to thumb element', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    const thumb: HTMLElement = fixture.nativeElement.querySelector('.sn-toggle-thumb');
    expect(thumb.classList).toContain('thumb-extra');
  });

  it('applies object map label section to label element', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    const label: HTMLElement = fixture.nativeElement.querySelector('.sn-toggle-label');
    expect(label.classList).toContain('label-extra');
  });

  it('merges array of snClass maps on root', async () => {
    const fixture = TestBed.createComponent(SnClassArrayHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toggle');
    expect(el.classList).toContain('first');
    expect(el.classList).toContain('second');
  });

  it('applies snStyle and allowed snAttrs to named parts without replacing toggle semantics', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const root: HTMLElement = el.querySelector('sn-toggle')!;
    const track: HTMLElement = el.querySelector('.sn-toggle-track')!;
    const thumb: HTMLElement = el.querySelector('.sn-toggle-thumb')!;
    const label: HTMLElement = el.querySelector('.sn-toggle-label')!;

    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('tg-root');
    // Role and tabindex stay toggle-owned, not the pass-through's values.
    expect(root.getAttribute('role')).toBe('switch');
    expect(root.getAttribute('tabindex')).toBe('0');

    expect(track.style.color).toBe('rgb(1, 2, 3)');
    expect(track.getAttribute('data-testid')).toBe('tg-track');
    expect(track.getAttribute('aria-hidden')).toBe('true');

    expect(thumb.style.color).toBe('rgb(4, 5, 6)');
    expect(thumb.getAttribute('data-testid')).toBe('tg-thumb');

    expect(label.style.color).toBe('rgb(7, 8, 9)');
    expect(label.getAttribute('data-testid')).toBe('tg-label');
  });
});
