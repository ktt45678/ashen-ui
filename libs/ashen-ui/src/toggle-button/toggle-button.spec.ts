import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToggleButton } from './toggle-button';

@Component({
  template: `<button snToggleButton>Mute</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ToggleButton],
})
class DefaultHost {}

@Component({
  template: `<button snToggleButton [selected]="true">Muted</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ToggleButton],
})
class SelectedHost {}

@Component({
  template: `<button snToggleButton [disabled]="true">Mute</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ToggleButton],
})
class DisabledHost {}

@Component({
  template: `<button snToggleButton size="sm">Mute</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ToggleButton],
})
class SmallSizeHost {}

@Component({
  template: `<button snToggleButton size="lg">Mute</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ToggleButton],
})
class LargeSizeHost {}

@Component({
  template: `<button snToggleButton [(selected)]="val">Mute</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ToggleButton],
})
class TwoWayHost {
  readonly val = signal(false);
}

@Component({
  template: `<button snToggleButton [formControl]="ctrl">Mute</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ToggleButton, ReactiveFormsModule],
})
class ReactiveFormHost {
  ctrl = new FormControl(false);
}

@Component({
  template: `<button snToggleButton [formControl]="ctrl">Mute</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ToggleButton, ReactiveFormsModule],
})
class ReactiveFormDisabledHost {
  ctrl = new FormControl({ value: true, disabled: true });
}

@Component({
  template: `<button snToggleButton [(ngModel)]="val">Mute</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ToggleButton, FormsModule],
})
class NgModelHost {
  readonly val = signal(false);
}

@Component({
  template: `<button snToggleButton snClass="extra-cls">Mute</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ToggleButton],
})
class SnClassStringHost {}

@Component({
  template: `<button snToggleButton [snClass]="{ root: 'root-extra' }">Mute</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ToggleButton],
})
class SnClassObjectHost {}

@Component({
  template: `<button snToggleButton [snClass]="[{ root: 'first' }, { root: 'second' }]">Mute</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ToggleButton],
})
class SnClassArrayHost {}

@Component({
  template: `
    <button snToggleButton>
      <span class="sn-icon icon-ms" aria-hidden="true">mic</span>
      Mic on
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ToggleButton],
})
class WithIconHost {}

describe('ToggleButton', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('applies sn-toggle-button host class', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('sn-toggle-button');
  });

  it('sets type="button" on host', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.getAttribute('type')).toBe('button');
  });

  it('renders projected label text', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.textContent?.trim()).toBe('Mute');
  });

  it('applies sn-toggle-button-selected when selected=true', async () => {
    const fixture = TestBed.createComponent(SelectedHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('sn-toggle-button-selected');
  });

  it('does not apply sn-toggle-button-selected when unselected', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).not.toContain('sn-toggle-button-selected');
  });

  it('sets aria-pressed="true" when selected', async () => {
    const fixture = TestBed.createComponent(SelectedHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.getAttribute('aria-pressed')).toBe('true');
  });

  it('sets aria-pressed="false" when unselected', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.getAttribute('aria-pressed')).toBe('false');
  });

  it('sets native disabled attribute when disabled=true', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.hasAttribute('disabled')).toBe(true);
  });

  it('does not toggle when disabled and clicked', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.click();
    await fixture.whenStable();
    expect(btn.classList).not.toContain('sn-toggle-button-selected');
  });

  it('adds sn-toggle-button-sm for size="sm"', async () => {
    const fixture = TestBed.createComponent(SmallSizeHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('sn-toggle-button-sm');
  });

  it('adds sn-toggle-button-lg for size="lg"', async () => {
    const fixture = TestBed.createComponent(LargeSizeHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('sn-toggle-button-lg');
  });

  it('does not add size class for default md size', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).not.toContain('sn-toggle-button-sm');
    expect(btn.classList).not.toContain('sn-toggle-button-lg');
  });

  it('toggles selected on click', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.classList).not.toContain('sn-toggle-button-selected');
    btn.click();
    await fixture.whenStable();
    expect(btn.classList).toContain('sn-toggle-button-selected');
    expect(fixture.componentInstance.val()).toBe(true);
  });

  it('toggles off on second click', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    fixture.componentInstance.val.set(true);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe(false);
  });

  it('toggles on Space key', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe(true);
  });

  it('toggles on Enter key', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe(true);
  });

  it('does not toggle on other keys', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe(false);
  });

  it('does not toggle on Space when disabled', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await fixture.whenStable();
    expect(btn.classList).not.toContain('sn-toggle-button-selected');
  });

  it('marks form control touched on blur', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(fixture.componentInstance.ctrl.touched).toBe(true);
  });

  it('reflects FormControl value (true) in selected class', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    fixture.componentInstance.ctrl.setValue(true);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('sn-toggle-button-selected');
  });

  it('reflects FormControl value (false) - no selected class', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    fixture.componentInstance.ctrl.setValue(false);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.classList).not.toContain('sn-toggle-button-selected');
  });

  it('emits value to FormControl on click', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.ctrl.value).toBe(true);
  });

  it('applies disabled from FormControl.disable()', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    fixture.componentInstance.ctrl.disable();
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.hasAttribute('disabled')).toBe(true);
  });

  it('reflects initial disabled state from FormControl', async () => {
    const fixture = TestBed.createComponent(ReactiveFormDisabledHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.hasAttribute('disabled')).toBe(true);
  });

  it('re-enables when FormControl.enable() called', async () => {
    const fixture = TestBed.createComponent(ReactiveFormDisabledHost);
    await fixture.whenStable();
    fixture.componentInstance.ctrl.enable();
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.hasAttribute('disabled')).toBe(false);
  });

  it('reflects ngModel value in selected class', async () => {
    const fixture = TestBed.createComponent(NgModelHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.componentInstance.val.set(true);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('sn-toggle-button-selected');
  });

  it('updates ngModel value on click', async () => {
    const fixture = TestBed.createComponent(NgModelHost);
    fixture.detectChanges();
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe(true);
  });

  it('emits selectedChange on click', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe(true);
  });

  it('renders projected icon inside button', async () => {
    const fixture = TestBed.createComponent(WithIconHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('.sn-icon');
    expect(icon).toBeTruthy();
    expect(icon.textContent?.trim()).toBe('mic');
  });

  it('applies plain string snClass to host element', async () => {
    const fixture = TestBed.createComponent(SnClassStringHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('extra-cls');
    expect(btn.classList).toContain('sn-toggle-button');
  });

  it('applies SnClassMap root section to host element', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('root-extra');
  });

  it('merges SnClassMap array in order on root', async () => {
    const fixture = TestBed.createComponent(SnClassArrayHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('first');
    expect(btn.classList).toContain('second');
  });

  it('does not have sn-toggle-button-animate immediately after first render', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('sn-toggle-button-animate')).toBe(false);
  });

  it('adds sn-toggle-button-animate after two animation frames', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('sn-toggle-button-animate')).toBe(true);
  });
});
