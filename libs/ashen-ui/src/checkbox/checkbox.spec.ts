import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Checkbox } from './checkbox';
import { IconTemplate, SnIconRegistry } from 'ashen-ui/core';

@Component({
  template: `<sn-checkbox>Enable zoom</sn-checkbox>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Checkbox],
})
class DefaultHost {}

@Component({
  template: `<sn-checkbox [checked]="true">Checked</sn-checkbox>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Checkbox],
})
class CheckedHost {}

@Component({
  template: `<sn-checkbox [indeterminate]="true">Indeterminate</sn-checkbox>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Checkbox],
})
class IndeterminateHost {}

@Component({
  template: `<sn-checkbox [disabled]="true">Disabled</sn-checkbox>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Checkbox],
})
class DisabledHost {}

@Component({
  template: `<sn-checkbox size="sm">Small</sn-checkbox>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Checkbox],
})
class SmallSizeHost {}

@Component({
  template: `<sn-checkbox size="lg">Large</sn-checkbox>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Checkbox],
})
class LargeSizeHost {}

@Component({
  template: `<sn-checkbox [(checked)]="val">Toggle</sn-checkbox>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Checkbox],
})
class TwoWayHost {
  readonly val = signal(false);
}

@Component({
  template: `<sn-checkbox [formControl]="ctrl">React form</sn-checkbox>`,
  imports: [Checkbox, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'reactive' },
})
class ReactiveFormHost {
  ctrl = new FormControl(false);
}

@Component({
  template: `<sn-checkbox [formControl]="ctrl">Disabled form</sn-checkbox>`,
  imports: [Checkbox, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'reactive-disabled' },
})
class ReactiveFormDisabledHost {
  ctrl = new FormControl({ value: true, disabled: true });
}

@Component({
  template: `<sn-checkbox [(ngModel)]="val">ngModel</sn-checkbox>`,
  imports: [Checkbox, FormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'ngmodel' },
})
class NgModelHost {
  readonly val = signal(false);
}

@Component({
  template: `<sn-checkbox snClass="extra-cls">Label</sn-checkbox>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Checkbox],
})
class SnClassStringHost {}

@Component({
  template: `<sn-checkbox [snClass]="{ root: 'root-extra', box: 'box-extra', label: 'label-extra' }">Label</sn-checkbox>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Checkbox],
})
class SnClassObjectHost {}

@Component({
  template: `<sn-checkbox [snClass]="[{ root: 'first' }, { root: 'second' }]">Label</sn-checkbox>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Checkbox],
})
class SnClassArrayHost {}

@Component({
  template: `
    <sn-checkbox [checked]="true">
      <ng-template snIcon="check"><span class="custom-check">✓</span></ng-template>
      Label
    </sn-checkbox>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Checkbox, IconTemplate],
})
class CustomCheckIconHost {}

@Component({
  template: `
    <sn-checkbox [indeterminate]="true">
      <ng-template snIcon="indeterminate"><span class="custom-indeterminate">–</span></ng-template>
      Label
    </sn-checkbox>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Checkbox, IconTemplate],
})
class CustomIndeterminateIconHost {}

@Component({
  template: `
    <sn-checkbox
      [checked]="true"
      [snStyle]="{
        root: { outline: '1px solid red' },
        box: { color: 'rgb(1, 2, 3)' },
        icon: { color: 'rgb(4, 5, 6)' },
        label: { color: 'rgb(7, 8, 9)' }
      }"
      [snAttrs]="{
        root: { 'data-testid': 'cb-root', role: 'button', tabindex: '5' },
        box: { 'data-testid': 'cb-box', 'aria-hidden': 'false' },
        icon: { 'data-testid': 'cb-icon', 'aria-hidden': 'false' },
        label: { 'data-testid': 'cb-label' }
      }"
    >
      Part checkbox
    </sn-checkbox>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Checkbox],
})
class SnPartHost {}

describe('Checkbox', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('applies sn-checkbox-wrapper host class', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    expect(el.classList).toContain('sn-checkbox-wrapper');
  });

  it('renders sn-checkbox-box inner span', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const box = fixture.nativeElement.querySelector('.sn-checkbox-box');
    expect(box).toBeTruthy();
  });

  it('renders sn-checkbox-label inner span', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const label = fixture.nativeElement.querySelector('.sn-checkbox-label');
    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Enable zoom');
  });

  it('has role="checkbox" on host', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    expect(el.getAttribute('role')).toBe('checkbox');
  });

  it('has tabindex="0" when enabled', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    expect(el.getAttribute('tabindex')).toBe('0');
  });

  it('applies sn-checkbox-checked when checked=true', async () => {
    const fixture = TestBed.createComponent(CheckedHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    expect(el.classList).toContain('sn-checkbox-checked');
  });

  it('does not apply sn-checkbox-checked when unchecked', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    expect(el.classList).not.toContain('sn-checkbox-checked');
  });

  it('sets aria-checked="true" when checked', async () => {
    const fixture = TestBed.createComponent(CheckedHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    expect(el.getAttribute('aria-checked')).toBe('true');
  });

  it('sets aria-checked="false" when unchecked', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    expect(el.getAttribute('aria-checked')).toBe('false');
  });

  it('renders check icon when checked', async () => {
    const fixture = TestBed.createComponent(CheckedHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('.sn-checkbox-box .sn-icon');
    expect(icon).toBeTruthy();
    expect(icon.textContent.trim()).toBe('check');
  });

  it('renders no icon when unchecked', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('.sn-checkbox-box .sn-icon');
    expect(icon).toBeNull();
  });

  it('applies sn-checkbox-indeterminate when indeterminate=true', async () => {
    const fixture = TestBed.createComponent(IndeterminateHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    expect(el.classList).toContain('sn-checkbox-indeterminate');
  });

  it('draws the indeterminate glyph from the icon registry', async () => {
    TestBed.inject(SnIconRegistry).alias('indeterminate', 'horizontal_rule');
    const fixture = TestBed.createComponent(IndeterminateHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('.sn-checkbox-box .sn-icon');
    expect(icon.textContent.trim()).toBe('horizontal_rule');
  });

  it('sets aria-checked="mixed" when indeterminate', async () => {
    const fixture = TestBed.createComponent(IndeterminateHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    expect(el.getAttribute('aria-checked')).toBe('mixed');
  });

  it('click clears indeterminate and checks the box', async () => {
    const fixture = TestBed.createComponent(IndeterminateHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    el.click();
    await fixture.whenStable();
    expect(el.getAttribute('aria-checked')).toBe('true');
    expect(el.classList).toContain('sn-checkbox-checked');
    expect(el.classList).not.toContain('sn-checkbox-indeterminate');
  });

  it('renders remove icon when indeterminate', async () => {
    const fixture = TestBed.createComponent(IndeterminateHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('.sn-checkbox-box .sn-icon');
    expect(icon).toBeTruthy();
    expect(icon.textContent.trim()).toBe('remove');
  });

  it('applies sn-checkbox-disabled when disabled=true', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    expect(el.classList).toContain('sn-checkbox-disabled');
  });

  it('sets tabindex="-1" when disabled', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    expect(el.getAttribute('tabindex')).toBe('-1');
  });

  it('sets aria-disabled="true" when disabled', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    expect(el.getAttribute('aria-disabled')).toBe('true');
  });

  it('does not toggle when disabled and clicked', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    el.click();
    await fixture.whenStable();
    expect(el.classList).not.toContain('sn-checkbox-checked');
  });

  it('applies sn-checkbox-box-sm for size="sm"', async () => {
    const fixture = TestBed.createComponent(SmallSizeHost);
    await fixture.whenStable();
    const box: HTMLElement = fixture.nativeElement.querySelector('.sn-checkbox-box');
    expect(box.classList).toContain('sn-checkbox-box-sm');
  });

  it('applies sn-checkbox-box-lg for size="lg"', async () => {
    const fixture = TestBed.createComponent(LargeSizeHost);
    await fixture.whenStable();
    const box: HTMLElement = fixture.nativeElement.querySelector('.sn-checkbox-box');
    expect(box.classList).toContain('sn-checkbox-box-lg');
  });

  it('does not apply size modifier for default medium size', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const box: HTMLElement = fixture.nativeElement.querySelector('.sn-checkbox-box');
    expect(box.classList).not.toContain('sn-checkbox-box-sm');
    expect(box.classList).not.toContain('sn-checkbox-box-lg');
  });

  it('toggles checked on click', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    expect(el.classList).not.toContain('sn-checkbox-checked');
    el.click();
    await fixture.whenStable();
    expect(el.classList).toContain('sn-checkbox-checked');
    expect(fixture.componentInstance.val()).toBe(true);
  });

  it('toggles off on second click', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    fixture.componentInstance.val.set(true);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    el.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe(false);
  });

  it('toggles on Space key', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe(true);
  });

  it('toggles on Enter key', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe(true);
  });

  it('does not toggle on other keys', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe(false);
  });

  it('does not toggle on Space when disabled', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await fixture.whenStable();
    expect(el.classList).not.toContain('sn-checkbox-checked');
  });

  it('reflects FormControl value (true) in host class', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    fixture.componentInstance.ctrl.setValue(true);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    expect(el.classList).toContain('sn-checkbox-checked');
  });

  it('reflects FormControl value (false) - no checked class', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    fixture.componentInstance.ctrl.setValue(false);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    expect(el.classList).not.toContain('sn-checkbox-checked');
  });

  it('emits value to FormControl on click', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    el.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.ctrl.value).toBe(true);
  });

  it('marks FormControl as touched on blur', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    el.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(fixture.componentInstance.ctrl.touched).toBe(true);
  });

  it('applies disabled from FormControl.disable()', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    fixture.componentInstance.ctrl.disable();
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    expect(el.classList).toContain('sn-checkbox-disabled');
    expect(el.getAttribute('tabindex')).toBe('-1');
  });

  it('reflects initial disabled state from FormControl', async () => {
    const fixture = TestBed.createComponent(ReactiveFormDisabledHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    expect(el.classList).toContain('sn-checkbox-disabled');
  });

  it('re-enables when FormControl.enable() called', async () => {
    const fixture = TestBed.createComponent(ReactiveFormDisabledHost);
    await fixture.whenStable();
    fixture.componentInstance.ctrl.enable();
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    expect(el.classList).not.toContain('sn-checkbox-disabled');
  });

  it('reflects ngModel value in host class', async () => {
    const fixture = TestBed.createComponent(NgModelHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.componentInstance.val.set(true);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    expect(el.classList).toContain('sn-checkbox-checked');
  });

  it('updates ngModel value on click', async () => {
    const fixture = TestBed.createComponent(NgModelHost);
    fixture.detectChanges();
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    el.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe(true);
  });

  it('applies plain string snClass to root element', async () => {
    const fixture = TestBed.createComponent(SnClassStringHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    expect(el.classList).toContain('extra-cls');
  });

  it('applies object map root section to host', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    expect(el.classList).toContain('root-extra');
  });

  it('applies object map box section to box element', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    const box: HTMLElement = fixture.nativeElement.querySelector('.sn-checkbox-box');
    expect(box.classList).toContain('box-extra');
  });

  it('applies object map label section to label element', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    const label: HTMLElement = fixture.nativeElement.querySelector('.sn-checkbox-label');
    expect(label.classList).toContain('label-extra');
  });

  it('merges array of snClass maps on root', async () => {
    const fixture = TestBed.createComponent(SnClassArrayHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    expect(el.classList).toContain('first');
    expect(el.classList).toContain('second');
  });

  it('renders custom check icon template when provided', async () => {
    const fixture = TestBed.createComponent(CustomCheckIconHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('.custom-check');
    expect(icon).toBeTruthy();
    expect(icon.textContent.trim()).toBe('✓');
  });

  it('hides default check icon when custom template provided', async () => {
    const fixture = TestBed.createComponent(CustomCheckIconHost);
    await fixture.whenStable();
    const defaultIcon = fixture.nativeElement.querySelector('.sn-checkbox-box .sn-icon');
    expect(defaultIcon).toBeNull();
  });

  it('renders custom indeterminate icon template when provided', async () => {
    const fixture = TestBed.createComponent(CustomIndeterminateIconHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('.custom-indeterminate');
    expect(icon).toBeTruthy();
    expect(icon.textContent.trim()).toBe('–');
  });

  it('does not have sn-checkbox-animate immediately after first render', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    expect(el.classList.contains('sn-checkbox-animate')).toBe(false);
  });

  it('adds sn-checkbox-animate after two animation frames', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-checkbox');
    expect(el.classList.contains('sn-checkbox-animate')).toBe(true);
  });

  it('applies snStyle and allowed snAttrs to named parts without replacing checkbox semantics', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const root: HTMLElement = el.querySelector('sn-checkbox')!;
    const box: HTMLElement = el.querySelector('.sn-checkbox-box')!;
    const icon: HTMLElement = el.querySelector('.sn-checkbox-box .sn-icon')!;
    const label: HTMLElement = el.querySelector('.sn-checkbox-label')!;

    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('cb-root');
    // Role and tabindex stay checkbox-owned, not the pass-through's values.
    expect(root.getAttribute('role')).toBe('checkbox');
    expect(root.getAttribute('tabindex')).toBe('0');

    expect(box.style.color).toBe('rgb(1, 2, 3)');
    expect(box.getAttribute('data-testid')).toBe('cb-box');
    expect(box.getAttribute('aria-hidden')).toBe('true');

    expect(icon.style.color).toBe('rgb(4, 5, 6)');
    expect(icon.getAttribute('data-testid')).toBe('cb-icon');
    expect(icon.getAttribute('aria-hidden')).toBe('true');

    expect(label.style.color).toBe('rgb(7, 8, 9)');
    expect(label.getAttribute('data-testid')).toBe('cb-label');
  });
});
