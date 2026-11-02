import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputGroup } from '../input-group/input-group';
import { InputNumber } from './input-number';
import { InputNumberStepper } from './input-number-stepper';

@Component({
  template: `
    <sn-input-group>
      <input snInputNumber #num="snInputNumber" [formControl]="ctrl" [min]="0" [max]="3" [step]="1" />
      <sn-input-number-stepper [for]="num" />
    </sn-input-group>
  `,
  imports: [InputGroup, InputNumber, InputNumberStepper, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
})
class StepperHost {
  readonly ctrl = new FormControl<number | null>(2);
}

describe('InputNumberStepper', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperHost],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  async function setup() {
    const fixture = TestBed.createComponent(StepperHost);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    return {
      fixture,
      host: fixture.componentInstance,
      input: root.querySelector('input') as HTMLInputElement,
      up: root.querySelector('.sn-input-number-stepper-up') as HTMLButtonElement,
      down: root.querySelector('.sn-input-number-stepper-down') as HTMLButtonElement,
    };
  }

  it('renders two buttons kept out of the tab order and the accessibility tree', async () => {
    const { up, down } = await setup();
    for (const button of [up, down]) {
      expect(button.type).toBe('button');
      expect(button.tabIndex).toBe(-1);
      expect(button.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('steps the value up and down and updates the form control', async () => {
    const { fixture, host, input, up, down } = await setup();

    up.click();
    await fixture.whenStable();
    expect(input.value).toBe('3');
    expect(Number(host.ctrl.value)).toBe(3);

    down.click();
    down.click();
    await fixture.whenStable();
    expect(input.value).toBe('1');
    expect(Number(host.ctrl.value)).toBe(1);
  });

  it('stops at max without emitting a value change', async () => {
    const { fixture, host, up } = await setup();
    up.click();
    await fixture.whenStable();

    const changes: unknown[] = [];
    host.ctrl.valueChanges.subscribe((value) => changes.push(value));
    up.click();
    await fixture.whenStable();

    expect(Number(host.ctrl.value)).toBe(3);
    expect(changes).toEqual([]);
  });

  it('does nothing while the control is disabled', async () => {
    const { fixture, host, up } = await setup();
    host.ctrl.disable();
    await fixture.whenStable();

    up.click();
    await fixture.whenStable();
    expect(Number(host.ctrl.value)).toBe(2);
  });

  it('keeps focus in the input when a button is pressed', async () => {
    const { up } = await setup();
    const mousedown = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    up.dispatchEvent(mousedown);
    expect(mousedown.defaultPrevented).toBe(true);
  });
});
