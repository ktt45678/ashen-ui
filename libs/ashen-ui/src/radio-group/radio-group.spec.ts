import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Dir } from '@angular/cdk/bidi';
import { RadioGroup } from './radio-group';
import { Radio } from './radio';

@Component({
  template: `
    <sn-radio-group>
      <sn-radio value="a">Option A</sn-radio>
      <sn-radio value="b">Option B</sn-radio>
      <sn-radio value="c">Option C</sn-radio>
    </sn-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RadioGroup, Radio],
})
class DefaultHost {}

@Component({
  template: `
    <sn-radio-group direction="horizontal">
      <sn-radio value="x">X</sn-radio>
      <sn-radio value="y">Y</sn-radio>
    </sn-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RadioGroup, Radio],
})
class HorizontalHost {}

@Component({
  template: `
    <sn-radio-group [value]="'b'">
      <sn-radio value="a">A</sn-radio>
      <sn-radio value="b">B</sn-radio>
      <sn-radio value="c">C</sn-radio>
    </sn-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RadioGroup, Radio],
})
class PreselectedHost {}

@Component({
  template: `
    <sn-radio-group [disabled]="true">
      <sn-radio value="a">A</sn-radio>
      <sn-radio value="b">B</sn-radio>
    </sn-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RadioGroup, Radio],
})
class DisabledGroupHost {}

@Component({
  template: `
    <sn-radio-group>
      <sn-radio value="a">A</sn-radio>
      <sn-radio value="b" [disabled]="true">B (disabled)</sn-radio>
      <sn-radio value="c">C</sn-radio>
    </sn-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RadioGroup, Radio],
})
class DisabledRadioHost {}

@Component({
  template: `
    <div dir="rtl">
      <sn-radio-group [(value)]="val">
        <sn-radio value="a">A</sn-radio>
        <sn-radio value="b">B</sn-radio>
        <sn-radio value="c">C</sn-radio>
      </sn-radio-group>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Dir, RadioGroup, Radio],
})
class RtlHost {
  readonly val = signal<unknown>('a');
}

@Component({
  template: `
    <sn-radio-group [(value)]="val">
      <sn-radio value="a">A</sn-radio>
      <sn-radio value="b">B</sn-radio>
      <sn-radio value="c">C</sn-radio>
    </sn-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RadioGroup, Radio],
})
class TwoWayHost {
  readonly val = signal<unknown>('a');
}

@Component({
  template: `
    <sn-radio-group [formControl]="ctrl">
      <sn-radio value="x">X</sn-radio>
      <sn-radio value="y">Y</sn-radio>
      <sn-radio value="z">Z</sn-radio>
    </sn-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RadioGroup, Radio, ReactiveFormsModule],
})
class ReactiveFormHost {
  ctrl = new FormControl<unknown>('x');
}

@Component({
  template: `
    <sn-radio-group [formControl]="ctrl">
      <sn-radio value="x">X</sn-radio>
      <sn-radio value="y">Y</sn-radio>
    </sn-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RadioGroup, Radio, ReactiveFormsModule],
})
class ReactiveFormDisabledHost {
  ctrl = new FormControl({ value: 'x', disabled: true });
}

@Component({
  template: `
    <sn-radio-group [(ngModel)]="val">
      <sn-radio value="p">P</sn-radio>
      <sn-radio value="q">Q</sn-radio>
    </sn-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RadioGroup, Radio, FormsModule],
})
class NgModelHost {
  readonly val = signal<unknown>('p');
}

@Component({
  template: `
    <sn-radio-group snClass="extra-root">
      <sn-radio value="a">A</sn-radio>
    </sn-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RadioGroup, Radio],
})
class SnClassGroupHost {}

@Component({
  template: `
    <sn-radio-group>
      <sn-radio value="a" [snClass]="{ root: 'radio-root', circle: 'radio-circle', dot: 'radio-dot', label: 'radio-label' }">A</sn-radio>
    </sn-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RadioGroup, Radio],
})
class SnClassRadioHost {}

@Component({
  template: `
    <sn-radio-group
      [disabled]="true"
      [snStyle]="{ outline: '1px solid red' }"
      [snAttrs]="{ 'data-testid': 'group-root', role: 'button', 'aria-disabled': 'false' }"
    >
      <sn-radio value="a">A</sn-radio>
    </sn-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RadioGroup, Radio],
})
class SnPartGroupHost {}

@Component({
  template: `
    <sn-radio-group>
      <sn-radio
        value="a"
        [snStyle]="{
          root: { outline: '1px solid red' },
          circle: { color: 'rgb(1, 2, 3)' },
          dot: { color: 'rgb(4, 5, 6)' },
          label: { color: 'rgb(7, 8, 9)' }
        }"
        [snAttrs]="{
          root: { 'data-testid': 'radio-root', role: 'button', tabindex: '5' },
          circle: { 'data-testid': 'radio-circle', 'aria-hidden': 'false' },
          dot: { 'data-testid': 'radio-dot' },
          label: { 'data-testid': 'radio-label' }
        }"
      >A</sn-radio>
    </sn-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RadioGroup, Radio],
})
class SnPartRadioHost {}

function getGroup(fixture: ComponentFixture<unknown>): HTMLElement {
  return fixture.nativeElement.querySelector('sn-radio-group');
}

function getRadios(fixture: ComponentFixture<unknown>): HTMLElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll('sn-radio'));
}

describe('RadioGroup + Radio', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('applies sn-radio-group-wrapper class on group host', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    expect(getGroup(fixture).classList).toContain('sn-radio-group-wrapper');
  });

  it('has role="radiogroup" on group host', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    expect(getGroup(fixture).getAttribute('role')).toBe('radiogroup');
  });

  it('does not apply sn-radio-group-horizontal by default', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    expect(getGroup(fixture).classList).not.toContain('sn-radio-group-horizontal');
  });

  it('applies sn-radio-group-horizontal when direction="horizontal"', async () => {
    const fixture = TestBed.createComponent(HorizontalHost);
    await fixture.whenStable();
    expect(getGroup(fixture).classList).toContain('sn-radio-group-horizontal');
  });

  it('applies sn-radio-button-wrapper class on each radio', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const radios = getRadios(fixture);
    radios.forEach((r) => expect(r.classList).toContain('sn-radio-button-wrapper'));
  });

  it('has role="radio" on each radio', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const radios = getRadios(fixture);
    radios.forEach((r) => expect(r.getAttribute('role')).toBe('radio'));
  });

  it('renders circle and dot spans', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const circle = fixture.nativeElement.querySelector('.sn-radio-button-circle');
    const dot = fixture.nativeElement.querySelector('.sn-radio-button-dot');
    expect(circle).toBeTruthy();
    expect(dot).toBeTruthy();
  });

  it('renders label span with projected content', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const labels = fixture.nativeElement.querySelectorAll('.sn-radio-button-label');
    expect(labels.length).toBe(3);
    expect(labels[0].textContent).toContain('Option A');
  });

  it('sets aria-checked="false" on unchecked radios', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const radios = getRadios(fixture);
    radios.forEach((r) => expect(r.getAttribute('aria-checked')).toBe('false'));
  });

  it('applies sn-radio-button-checked when radio matches group value', async () => {
    const fixture = TestBed.createComponent(PreselectedHost);
    await fixture.whenStable();
    const radios = getRadios(fixture);
    expect(radios[0].classList).not.toContain('sn-radio-button-checked');
    expect(radios[1].classList).toContain('sn-radio-button-checked');
    expect(radios[2].classList).not.toContain('sn-radio-button-checked');
  });

  it('sets aria-checked="true" on the checked radio', async () => {
    const fixture = TestBed.createComponent(PreselectedHost);
    await fixture.whenStable();
    const radios = getRadios(fixture);
    expect(radios[1].getAttribute('aria-checked')).toBe('true');
  });

  it('clicking a radio selects it', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const radios = getRadios(fixture);
    radios[1].click();
    await fixture.whenStable();
    expect(radios[1].classList).toContain('sn-radio-button-checked');
    expect(radios[0].classList).not.toContain('sn-radio-button-checked');
  });

  it('two-way [(value)] updates parent signal on click', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const radios = getRadios(fixture);
    radios[1].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe('b');
  });

  it('clicking a selected radio does not deselect it', async () => {
    const fixture = TestBed.createComponent(PreselectedHost);
    await fixture.whenStable();
    const radios = getRadios(fixture);
    radios[1].click();
    await fixture.whenStable();
    expect(radios[1].classList).toContain('sn-radio-button-checked');
  });

  it('Space key selects the focused radio', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const radios = getRadios(fixture);
    radios[0].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await fixture.whenStable();
    expect(radios[0].classList).toContain('sn-radio-button-checked');
  });

  it('ArrowDown moves selection to next radio', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const radios = getRadios(fixture);
    radios[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe('b');
    expect(radios[1].classList).toContain('sn-radio-button-checked');
  });

  it('ArrowRight moves selection to next radio', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const radios = getRadios(fixture);
    radios[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe('b');
  });

  it('ArrowLeft moves selection to the NEXT radio in rtl', async () => {
    const fixture = TestBed.createComponent(RtlHost);
    await fixture.whenStable();
    const radios = getRadios(fixture);

    radios[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await fixture.whenStable();

    expect(fixture.componentInstance.val()).toBe('b');
  });

  it('ArrowDown still moves selection forwards in rtl', async () => {
    const fixture = TestBed.createComponent(RtlHost);
    await fixture.whenStable();
    const radios = getRadios(fixture);

    radios[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await fixture.whenStable();

    expect(fixture.componentInstance.val()).toBe('b');
  });

  it('ArrowUp moves selection to previous radio', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    fixture.componentInstance.val.set('b');
    await fixture.whenStable();
    const radios = getRadios(fixture);
    radios[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe('a');
  });

  it('ArrowLeft moves selection to previous radio', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    fixture.componentInstance.val.set('b');
    await fixture.whenStable();
    const radios = getRadios(fixture);
    radios[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe('a');
  });

  it('ArrowDown wraps from last to first', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    fixture.componentInstance.val.set('c');
    await fixture.whenStable();
    const radios = getRadios(fixture);
    radios[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe('a');
  });

  it('ArrowUp wraps from first to last', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    fixture.componentInstance.val.set('a');
    await fixture.whenStable();
    const radios = getRadios(fixture);
    radios[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe('c');
  });

  it('ArrowDown skips disabled radios', async () => {
    const fixture = TestBed.createComponent(DisabledRadioHost);
    await fixture.whenStable();
    const radios = getRadios(fixture);
    radios[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await fixture.whenStable();
    const group = getGroup(fixture);
    expect(group.querySelector('sn-radio:nth-child(3)')?.classList).toContain('sn-radio-button-checked');
  });

  it('first enabled radio has tabindex="0" when nothing checked', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const radios = getRadios(fixture);
    expect(radios[0].getAttribute('tabindex')).toBe('0');
    expect(radios[1].getAttribute('tabindex')).toBe('-1');
    expect(radios[2].getAttribute('tabindex')).toBe('-1');
  });

  it('checked radio has tabindex="0"', async () => {
    const fixture = TestBed.createComponent(PreselectedHost);
    await fixture.whenStable();
    const radios = getRadios(fixture);
    expect(radios[0].getAttribute('tabindex')).toBe('-1');
    expect(radios[1].getAttribute('tabindex')).toBe('0');
    expect(radios[2].getAttribute('tabindex')).toBe('-1');
  });

  it('tabindex moves to newly selected radio', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const radios = getRadios(fixture);
    expect(radios[0].getAttribute('tabindex')).toBe('0');
    radios[2].click();
    await fixture.whenStable();
    expect(radios[0].getAttribute('tabindex')).toBe('-1');
    expect(radios[2].getAttribute('tabindex')).toBe('0');
  });

  it('applies aria-disabled="true" on disabled group', async () => {
    const fixture = TestBed.createComponent(DisabledGroupHost);
    await fixture.whenStable();
    expect(getGroup(fixture).getAttribute('aria-disabled')).toBe('true');
  });

  it('applies sn-radio-button-disabled to all radios in disabled group', async () => {
    const fixture = TestBed.createComponent(DisabledGroupHost);
    await fixture.whenStable();
    const radios = getRadios(fixture);
    radios.forEach((r) => expect(r.classList).toContain('sn-radio-button-disabled'));
  });

  it('disabled group radios are not selectable', async () => {
    const fixture = TestBed.createComponent(DisabledGroupHost);
    await fixture.whenStable();
    const radios = getRadios(fixture);
    radios[0].click();
    await fixture.whenStable();
    radios.forEach((r) => expect(r.classList).not.toContain('sn-radio-button-checked'));
  });

  it('disabled group radios have tabindex="-1"', async () => {
    const fixture = TestBed.createComponent(DisabledGroupHost);
    await fixture.whenStable();
    const radios = getRadios(fixture);
    radios.forEach((r) => expect(r.getAttribute('tabindex')).toBe('-1'));
  });

  it('applies sn-radio-button-disabled to disabled radio only', async () => {
    const fixture = TestBed.createComponent(DisabledRadioHost);
    await fixture.whenStable();
    const radios = getRadios(fixture);
    expect(radios[0].classList).not.toContain('sn-radio-button-disabled');
    expect(radios[1].classList).toContain('sn-radio-button-disabled');
    expect(radios[2].classList).not.toContain('sn-radio-button-disabled');
  });

  it('disabled radio is not selectable on click', async () => {
    const fixture = TestBed.createComponent(DisabledRadioHost);
    await fixture.whenStable();
    const radios = getRadios(fixture);
    radios[1].click();
    await fixture.whenStable();
    expect(radios[1].classList).not.toContain('sn-radio-button-checked');
  });

  it('reflects FormControl initial value in aria-checked', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    const radios = getRadios(fixture);
    expect(radios[0].getAttribute('aria-checked')).toBe('true');
    expect(radios[1].getAttribute('aria-checked')).toBe('false');
  });

  it('updates FormControl value when radio clicked', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    const radios = getRadios(fixture);
    radios[1].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.ctrl.value).toBe('y');
  });

  it('reflects new FormControl value set programmatically', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    fixture.componentInstance.ctrl.setValue('z');
    await fixture.whenStable();
    const radios = getRadios(fixture);
    expect(radios[2].classList).toContain('sn-radio-button-checked');
  });

  it('marks FormControl as touched on radio blur', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    const radios = getRadios(fixture);
    radios[0].dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(fixture.componentInstance.ctrl.touched).toBe(true);
  });

  it('setDisabledState disables group via FormControl.disable()', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    fixture.componentInstance.ctrl.disable();
    await fixture.whenStable();
    const group = getGroup(fixture);
    expect(group.getAttribute('aria-disabled')).toBe('true');
  });

  it('reflects initial disabled state from FormControl', async () => {
    const fixture = TestBed.createComponent(ReactiveFormDisabledHost);
    await fixture.whenStable();
    const group = getGroup(fixture);
    expect(group.getAttribute('aria-disabled')).toBe('true');
  });

  it('re-enables when FormControl.enable() called', async () => {
    const fixture = TestBed.createComponent(ReactiveFormDisabledHost);
    await fixture.whenStable();
    fixture.componentInstance.ctrl.enable();
    await fixture.whenStable();
    const group = getGroup(fixture);
    expect(group.getAttribute('aria-disabled')).toBeNull();
  });

  it('reflects ngModel initial value', async () => {
    const fixture = TestBed.createComponent(NgModelHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    const radios = getRadios(fixture);
    expect(radios[0].classList).toContain('sn-radio-button-checked');
  });

  it('updates ngModel on radio click', async () => {
    const fixture = TestBed.createComponent(NgModelHost);
    fixture.detectChanges();
    await fixture.whenStable();
    const radios = getRadios(fixture);
    radios[1].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe('q');
  });

  it('applies plain string snClass to group root', async () => {
    const fixture = TestBed.createComponent(SnClassGroupHost);
    await fixture.whenStable();
    expect(getGroup(fixture).classList).toContain('extra-root');
  });

  it('applies snClass root section to radio host', async () => {
    const fixture = TestBed.createComponent(SnClassRadioHost);
    await fixture.whenStable();
    const radio = getRadios(fixture)[0];
    expect(radio.classList).toContain('radio-root');
  });

  it('applies snClass circle section to circle element', async () => {
    const fixture = TestBed.createComponent(SnClassRadioHost);
    await fixture.whenStable();
    const circle = fixture.nativeElement.querySelector('.sn-radio-button-circle');
    expect(circle.classList).toContain('radio-circle');
  });

  it('applies snClass dot section to dot element', async () => {
    const fixture = TestBed.createComponent(SnClassRadioHost);
    await fixture.whenStable();
    const dot = fixture.nativeElement.querySelector('.sn-radio-button-dot');
    expect(dot.classList).toContain('radio-dot');
  });

  it('applies snClass label section to label element', async () => {
    const fixture = TestBed.createComponent(SnClassRadioHost);
    await fixture.whenStable();
    const label = fixture.nativeElement.querySelector('.sn-radio-button-label');
    expect(label.classList).toContain('radio-label');
  });

  it('does not have sn-radio-button-animate immediately after first render', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    fixture.detectChanges();
    const radio: HTMLElement = fixture.nativeElement.querySelector('sn-radio');
    expect(radio.classList.contains('sn-radio-button-animate')).toBe(false);
  });

  it('adds sn-radio-button-animate after two animation frames', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    await fixture.whenStable();
    const radio: HTMLElement = fixture.nativeElement.querySelector('sn-radio');
    expect(radio.classList.contains('sn-radio-button-animate')).toBe(true);
  });

  it('applies snStyle and allowed snAttrs to the group root without replacing group semantics', async () => {
    const fixture = TestBed.createComponent(SnPartGroupHost);
    await fixture.whenStable();
    const group = getGroup(fixture);

    expect(group.style.outline).toContain('red');
    expect(group.getAttribute('data-testid')).toBe('group-root');
    // Role and the disabled aria-disabled value stay group-owned.
    expect(group.getAttribute('role')).toBe('radiogroup');
    expect(group.getAttribute('aria-disabled')).toBe('true');
  });

  it('applies snStyle and allowed snAttrs to named radio parts without replacing radio semantics', async () => {
    const fixture = TestBed.createComponent(SnPartRadioHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const root: HTMLElement = el.querySelector('sn-radio')!;
    const circle: HTMLElement = el.querySelector('.sn-radio-button-circle')!;
    const dot: HTMLElement = el.querySelector('.sn-radio-button-dot')!;
    const label: HTMLElement = el.querySelector('.sn-radio-button-label')!;

    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('radio-root');
    // Role and tabindex stay radio-owned, not the pass-through's values.
    expect(root.getAttribute('role')).toBe('radio');
    expect(root.getAttribute('tabindex')).toBe('0');

    expect(circle.style.color).toBe('rgb(1, 2, 3)');
    expect(circle.getAttribute('data-testid')).toBe('radio-circle');
    expect(circle.getAttribute('aria-hidden')).toBe('true');

    expect(dot.style.color).toBe('rgb(4, 5, 6)');
    expect(dot.getAttribute('data-testid')).toBe('radio-dot');

    expect(label.style.color).toBe('rgb(7, 8, 9)');
    expect(label.getAttribute('data-testid')).toBe('radio-label');
  });
});
