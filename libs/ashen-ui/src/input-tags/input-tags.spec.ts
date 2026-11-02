import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { InputTags } from './input-tags';
import { FormField } from '../form-field/form-field';
import { FormFieldLabel } from '../form-field/form-field-label';
import { FormFieldHint } from '../form-field/form-field-hint';
import { FormFieldError } from '../form-field/form-field-error';
import { provideSnIntl } from '../core/sn-intl';

@Component({
  template: `<sn-input-tags />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputTags],
})
class DefaultHost {}

@Component({
  template: `<sn-input-tags [value]="tags()" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputTags],
})
class PresetTagsHost {
  readonly tags = signal(['angular', 'typescript']);
}

@Component({
  template: `<sn-input-tags [(value)]="tags" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputTags],
})
class TwoWayHost {
  readonly tags = signal<string[]>([]);
}

@Component({
  template: `<sn-input-tags [disabled]="true" [value]="tags()" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputTags],
})
class DisabledHost {
  readonly tags = signal(['existing']);
}

@Component({
  template: `<sn-input-tags [invalid]="true" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputTags],
})
class InvalidHost {}

@Component({
  template: `<sn-input-tags size="sm" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputTags],
})
class SmSizeHost {}

@Component({
  template: `<sn-input-tags size="lg" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputTags],
})
class LgSizeHost {}

@Component({
  template: `<sn-input-tags [formControl]="ctrl" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputTags, ReactiveFormsModule],
})
class ReactiveFormHost {
  ctrl = new FormControl<string[]>([]);
}

@Component({
  template: `<sn-input-tags [formControl]="ctrl" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputTags, ReactiveFormsModule],
})
class ReactiveFormDisabledHost {
  ctrl = new FormControl<string[]>({ value: ['tag1'], disabled: true });
}

@Component({
  template: `<sn-input-tags [formControl]="ctrl" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputTags, ReactiveFormsModule],
})
class ReactiveFormValidationHost {
  ctrl = new FormControl<string[]>([], Validators.required);
}

@Component({
  template: `<sn-input-tags [(ngModel)]="tags" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputTags, FormsModule],
})
class NgModelHost {
  readonly tags = signal<string[]>([]);
}

@Component({
  template: `
    <sn-form-field>
      <sn-label>Tags</sn-label>
      <sn-input-tags />
      <sn-hint>Press Enter or comma to add</sn-hint>
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputTags, FormField, FormFieldLabel, FormFieldHint],
})
class FormFieldHost {}

@Component({
  template: `
    <sn-form-field>
      <sn-label required>Tags</sn-label>
      <sn-input-tags [formControl]="ctrl" />
      @if (ctrl.touched && ctrl.invalid) {
        <sn-error>At least one tag is required</sn-error>
      }
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputTags, FormField, FormFieldLabel, FormFieldError, ReactiveFormsModule],
})
class FormFieldReactiveHost {
  ctrl = new FormControl<string[]>([], Validators.required);
}

@Component({
  template: `<sn-input-tags snClass="extra-cls" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputTags],
})
class SnClassStringHost {}

@Component({
  template: `<sn-input-tags [snClass]="{ root: 'root-x', chip: 'chip-x', input: 'input-x' }" [value]="tags()" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputTags],
})
class SnClassObjectHost {
  readonly tags = signal(['hello']);
}

@Component({
  template: `
    <sn-input-tags
      [value]="['x']"
      [snStyle]="{
        root: { outline: '1px solid red' },
        shell: { color: 'rgb(1, 2, 3)' },
        chip: { color: 'rgb(4, 5, 6)' },
        input: { color: 'rgb(7, 8, 9)' }
      }"
      [snAttrs]="{
        root: { 'data-testid': 'tags-root' },
        shell: { 'data-testid': 'tags-shell' },
        chip: { 'data-testid': 'tags-chip', tabindex: '5' },
        input: { 'data-testid': 'tags-input', disabled: true, id: 'hostile-id' }
      }"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputTags],
})
class SnPartHost {}

function getInternalInput(el: HTMLElement): HTMLInputElement {
  return el.querySelector('.sn-input-tags-field')!;
}

function getShell(el: HTMLElement): HTMLElement {
  return el.querySelector('.sn-input-tags-shell')!;
}

function getChips(el: HTMLElement): NodeListOf<Element> {
  return el.querySelectorAll('sn-chip');
}

function dispatchKeydown(input: HTMLInputElement, key: string): void {
  input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

function typeInInput(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

describe('InputTags', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders host with sn-input-tags class', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement.querySelector('sn-input-tags');
    expect(host.classList).toContain('sn-input-tags');
  });

  it('renders the shell container with sn-input-tags-shell class', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    expect(getShell(fixture.nativeElement)).toBeTruthy();
  });

  it('provides an input for typing new tags', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    expect(getInternalInput(fixture.nativeElement)).toBeTruthy();
  });

  it('renders chips for preset tags', async () => {
    const fixture = TestBed.createComponent(PresetTagsHost);
    await fixture.whenStable();
    const chips = getChips(fixture.nativeElement);
    expect(chips.length).toBe(2);
  });

  it('shows placeholder when no tags', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const input = getInternalInput(fixture.nativeElement);
    expect(input.placeholder).toBe('Add tag');
  });

  it('hides placeholder when tags are present', async () => {
    const fixture = TestBed.createComponent(PresetTagsHost);
    await fixture.whenStable();
    const input = getInternalInput(fixture.nativeElement);
    expect(input.placeholder).toBe('');
  });

  it('adds a tag on Enter key', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const input = getInternalInput(fixture.nativeElement);
    typeInInput(input, 'newtag');
    await fixture.whenStable();
    dispatchKeydown(input, 'Enter');
    await fixture.whenStable();
    expect(getChips(fixture.nativeElement).length).toBe(1);
  });

  it('ignores Enter while an IME composition is in progress', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const input = getInternalInput(fixture.nativeElement);
    typeInInput(input, 'にほ');
    await fixture.whenStable();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', isComposing: true, bubbles: true }));
    await fixture.whenStable();
    expect(getChips(fixture.nativeElement).length).toBe(0);
  });

  it('adds a tag on comma key', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const input = getInternalInput(fixture.nativeElement);
    typeInInput(input, 'commaTrigger');
    await fixture.whenStable();
    dispatchKeydown(input, ',');
    await fixture.whenStable();
    expect(getChips(fixture.nativeElement).length).toBe(1);
  });

  it('clears the text input after adding a tag', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const input = getInternalInput(fixture.nativeElement);
    typeInInput(input, 'newtag');
    await fixture.whenStable();
    dispatchKeydown(input, 'Enter');
    await fixture.whenStable();
    expect(input.value).toBe('');
  });

  it('ignores empty string on Enter', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const input = getInternalInput(fixture.nativeElement);
    typeInInput(input, '   ');
    await fixture.whenStable();
    dispatchKeydown(input, 'Enter');
    await fixture.whenStable();
    expect(getChips(fixture.nativeElement).length).toBe(0);
  });

  it('ignores duplicate tags', async () => {
    const fixture = TestBed.createComponent(PresetTagsHost);
    await fixture.whenStable();
    const input = getInternalInput(fixture.nativeElement);
    typeInInput(input, 'angular');
    await fixture.whenStable();
    dispatchKeydown(input, 'Enter');
    await fixture.whenStable();
    expect(getChips(fixture.nativeElement).length).toBe(2);
  });

  it('trims whitespace when adding tag', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const input = getInternalInput(fixture.nativeElement);
    typeInInput(input, '  trimmed  ');
    await fixture.whenStable();
    dispatchKeydown(input, 'Enter');
    await fixture.whenStable();
    expect(fixture.componentInstance.tags()).toContain('trimmed');
  });

  it('adds pending text on blur', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const input = getInternalInput(fixture.nativeElement);
    typeInInput(input, 'blurtag');
    await fixture.whenStable();
    input.dispatchEvent(new Event('blur', { bubbles: true }));
    await fixture.whenStable();
    expect(getChips(fixture.nativeElement).length).toBe(1);
  });

  it('removes last tag on Backspace when input is empty', async () => {
    const fixture = TestBed.createComponent(PresetTagsHost);
    await fixture.whenStable();
    const input = getInternalInput(fixture.nativeElement);
    dispatchKeydown(input, 'Backspace');
    await fixture.whenStable();
    expect(getChips(fixture.nativeElement).length).toBe(1);
  });

  it('does not remove tags on Backspace when input has text', async () => {
    const fixture = TestBed.createComponent(PresetTagsHost);
    await fixture.whenStable();
    const input = getInternalInput(fixture.nativeElement);
    typeInInput(input, 'something');
    await fixture.whenStable();
    dispatchKeydown(input, 'Backspace');
    await fixture.whenStable();
    expect(getChips(fixture.nativeElement).length).toBe(2);
  });

  it('removes specific tag on chip remove click', async () => {
    const fixture = TestBed.createComponent(PresetTagsHost);
    await fixture.whenStable();
    const removeBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-chip-remove');
    removeBtn.click();
    await fixture.whenStable();
    expect(getChips(fixture.nativeElement).length).toBe(1);
  });

  it('prevents typing new tags when disabled', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    const input = getInternalInput(fixture.nativeElement);
    expect(input.disabled).toBe(true);
  });

  it('applies sn-input-tags--disabled class when disabled', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    const shell = getShell(fixture.nativeElement);
    expect(shell.classList).toContain('sn-input-tags--disabled');
  });

  it('does not add tags when disabled', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    const input = getInternalInput(fixture.nativeElement);
    typeInInput(input, 'blocked');
    await fixture.whenStable();
    dispatchKeydown(input, 'Enter');
    await fixture.whenStable();
    expect(getChips(fixture.nativeElement).length).toBe(1);
  });

  it('chips are not removable when disabled', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    const removeBtn = fixture.nativeElement.querySelector('.sn-chip-remove');
    expect(removeBtn).toBeNull();
  });

  it('applies sn-input-text-error class when invalid=true', async () => {
    const fixture = TestBed.createComponent(InvalidHost);
    await fixture.whenStable();
    const shell = getShell(fixture.nativeElement);
    expect(shell.classList).toContain('sn-input-text-error');
  });

  it('sets aria-invalid="true" on internal input when invalid', async () => {
    const fixture = TestBed.createComponent(InvalidHost);
    await fixture.whenStable();
    const input = getInternalInput(fixture.nativeElement);
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('applies sn-input-text-sm for size="sm"', async () => {
    const fixture = TestBed.createComponent(SmSizeHost);
    await fixture.whenStable();
    const shell = getShell(fixture.nativeElement);
    expect(shell.classList).toContain('sn-input-text-sm');
  });

  it('applies sn-input-text-lg for size="lg"', async () => {
    const fixture = TestBed.createComponent(LgSizeHost);
    await fixture.whenStable();
    const shell = getShell(fixture.nativeElement);
    expect(shell.classList).toContain('sn-input-text-lg');
  });

  it('reflects value model changes in chips', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    fixture.componentInstance.tags.set(['a', 'b', 'c']);
    await fixture.whenStable();
    expect(getChips(fixture.nativeElement).length).toBe(3);
  });

  it('updates value model when tag added', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const input = getInternalInput(fixture.nativeElement);
    typeInInput(input, 'newtag');
    await fixture.whenStable();
    dispatchKeydown(input, 'Enter');
    await fixture.whenStable();
    expect(fixture.componentInstance.tags()).toContain('newtag');
  });

  it('writes FormControl value (string[]) to chips', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    fixture.componentInstance.ctrl.setValue(['foo', 'bar']);
    await fixture.whenStable();
    expect(getChips(fixture.nativeElement).length).toBe(2);
  });

  it('emits string[] to FormControl when tag added', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    const input = getInternalInput(fixture.nativeElement);
    typeInInput(input, 'reactive');
    await fixture.whenStable();
    dispatchKeydown(input, 'Enter');
    await fixture.whenStable();
    expect(fixture.componentInstance.ctrl.value).toContain('reactive');
  });

  it('marks FormControl as touched on blur', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    const input = getInternalInput(fixture.nativeElement);
    input.dispatchEvent(new Event('blur', { bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.ctrl.touched).toBe(true);
  });

  it('disables input when FormControl is disabled', async () => {
    const fixture = TestBed.createComponent(ReactiveFormDisabledHost);
    await fixture.whenStable();
    const input = getInternalInput(fixture.nativeElement);
    expect(input.disabled).toBe(true);
  });

  it('applies setDisabledState via FormControl.disable()', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    fixture.componentInstance.ctrl.disable();
    await fixture.whenStable();
    const input = getInternalInput(fixture.nativeElement);
    expect(input.disabled).toBe(true);
  });

  it('re-enables when FormControl.enable() called', async () => {
    const fixture = TestBed.createComponent(ReactiveFormDisabledHost);
    await fixture.whenStable();
    fixture.componentInstance.ctrl.enable();
    await fixture.whenStable();
    const input = getInternalInput(fixture.nativeElement);
    expect(input.disabled).toBe(false);
  });

  it('applies error class after touch+invalid on reactive form', async () => {
    const fixture = TestBed.createComponent(ReactiveFormValidationHost);
    await fixture.whenStable();
    fixture.componentInstance.ctrl.markAsTouched();
    fixture.componentInstance.ctrl.updateValueAndValidity();
    await fixture.whenStable();
    const shell = getShell(fixture.nativeElement);
    expect(shell.classList).toContain('sn-input-text-error');
  });

  it('reflects ngModel value in chips', async () => {
    const fixture = TestBed.createComponent(NgModelHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.componentInstance.tags.set(['ng-tag']);
    await fixture.whenStable();
    expect(getChips(fixture.nativeElement).length).toBe(1);
  });

  it('updates ngModel on tag added', async () => {
    const fixture = TestBed.createComponent(NgModelHost);
    fixture.detectChanges();
    await fixture.whenStable();
    const input = getInternalInput(fixture.nativeElement);
    typeInInput(input, 'ngmodeltag');
    await fixture.whenStable();
    dispatchKeydown(input, 'Enter');
    await fixture.whenStable();
    expect(fixture.componentInstance.tags()).toContain('ngmodeltag');
  });

  it('links the input to its label via FormField', async () => {
    const fixture = TestBed.createComponent(FormFieldHost);
    await fixture.whenStable();
    const input = getInternalInput(fixture.nativeElement);
    expect(input.id).toMatch(/^sn-ff-ctrl/);
  });

  it('sets aria-describedby from FormField hint', async () => {
    const fixture = TestBed.createComponent(FormFieldHost);
    await fixture.whenStable();
    const input = getInternalInput(fixture.nativeElement);
    expect(input.getAttribute('aria-describedby')).toBeTruthy();
  });

  it('applies error class via FormField after reactive form touch+invalid', async () => {
    const fixture = TestBed.createComponent(FormFieldReactiveHost);
    await fixture.whenStable();
    fixture.componentInstance.ctrl.markAsTouched();
    fixture.componentInstance.ctrl.updateValueAndValidity();
    await fixture.whenStable();
    const shell = getShell(fixture.nativeElement);
    expect(shell.classList).toContain('sn-input-text-error');
  });

  it('applies string snClass to root host', async () => {
    const fixture = TestBed.createComponent(SnClassStringHost);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement.querySelector('sn-input-tags');
    expect(host.classList).toContain('extra-cls');
  });

  it('applies object snClass root section to host', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement.querySelector('sn-input-tags');
    expect(host.classList).toContain('root-x');
  });

  it('applies object snClass chip section to chip elements', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    const chip: HTMLElement = fixture.nativeElement.querySelector('sn-chip');
    expect(chip.classList).toContain('chip-x');
  });

  it('applies object snClass input section to the input element', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    const input = getInternalInput(fixture.nativeElement);
    expect(input.classList).toContain('input-x');
  });

  it('uses custom SnIntl addTag label via provideSnIntl', async () => {
    TestBed.overrideComponent(DefaultHost, {
      set: { providers: [provideSnIntl({ addTag: 'Add keyword' })] },
    });
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const input = getInternalInput(fixture.nativeElement);
    expect(input.placeholder).toBe('Add keyword');
  });

  it('applies snStyle and allowed snAttrs to named parts, forwarding the chip section into sn-chip', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const root: HTMLElement = el.querySelector('sn-input-tags')!;
    const shell = getShell(el);
    const chip: HTMLElement = el.querySelector('sn-chip')!;
    const input = getInternalInput(el);

    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('tags-root');

    expect(shell.style.color).toBe('rgb(1, 2, 3)');
    expect(shell.getAttribute('data-testid')).toBe('tags-shell');

    expect(chip.style.color).toBe('rgb(4, 5, 6)');
    expect(chip.getAttribute('data-testid')).toBe('tags-chip');
    // Chip reserves its own tabindex; the hostile override never lands.
    expect(chip.getAttribute('tabindex')).toBe('0');

    expect(input.style.color).toBe('rgb(7, 8, 9)');
    expect(input.getAttribute('data-testid')).toBe('tags-input');
    expect(input.disabled).toBe(false);
    expect(input.getAttribute('id')).toBeNull();
  });
});
