import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Chip } from './chip';
import { provideSnIntl } from 'ashen-ui/core';
import { IconTemplate } from 'ashen-ui/core';

@Component({
  template: `<sn-chip label="Streaming" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Chip],
})
class DefaultHost {}

@Component({
  template: `<sn-chip label="Streaming" icon="videocam" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Chip],
})
class WithIconHost {}

@Component({
  template: `<sn-chip label="deploy" removable />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Chip],
})
class RemovableHost {}

@Component({
  template: `<sn-chip label="deploy" [removable]="true" (removed)="onRemoved()" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Chip],
})
class RemovableHandlerHost {
  removed = false;
  onRemoved(): void { this.removed = true; }
}

@Component({
  template: `<sn-chip label="Active" [selected]="selected()" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Chip],
})
class SelectableHost {
  readonly selected = signal(false);
}

@Component({
  template: `<sn-chip>projected label</sn-chip>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Chip],
})
class ProjectedHost {}

@Component({
  template: `<sn-chip label="macros" [removable]="true" (removed)="removed = true" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Chip],
})
class KeyboardRemoveHost {
  removed = false;
}

@Component({
  template: `<sn-chip label="Tag" snClass="my-extra-class" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Chip],
})
class SnClassStringHost {}

@Component({
  template: `<sn-chip label="Tag" [snClass]="{ root: 'root-extra', label: 'label-extra' }" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Chip],
})
class SnClassObjectHost {}

@Component({
  template: `<sn-chip label="Tag" [snClass]="[{ root: 'first' }, { root: 'second' }]" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Chip],
})
class SnClassArrayHost {}

@Component({
  template: `
    <sn-chip label="Tag" removable>
      <ng-template snIcon="remove"><span class="custom-remove-icon">X</span></ng-template>
    </sn-chip>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Chip, IconTemplate],
})
class CustomRemoveIconHost {}

@Component({
  template: `<sn-chip label="Release" removable />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Chip],
})
class IntlDefaultHost {}

@Component({
  template: `<sn-chip label="Release" removable />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Chip],
})
class IntlOverrideHost {}

@Component({
  template: `<sn-chip label="Release" removable removeAriaLabel="Custom remove label" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Chip],
})
class InstanceInputOverrideHost {}

@Component({
  template: `
    <sn-chip
      label="Parts"
      icon="star"
      removable
      [snStyle]="{
        root: { outline: '1px solid red' },
        icon: { color: 'rgb(1, 2, 3)' },
        label: { color: 'rgb(4, 5, 6)' },
        remove: { color: 'rgb(7, 8, 9)' }
      }"
      [snAttrs]="{
        root: { 'data-testid': 'chip-root', tabindex: '5' },
        icon: { 'data-testid': 'chip-icon', 'aria-hidden': 'false' },
        label: { 'data-testid': 'chip-label' },
        remove: { 'data-testid': 'chip-remove', 'aria-label': 'invalid label' }
      }"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Chip],
})
class SnPartHost {}

describe('Chip', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('applies sn-chip host class', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-chip');
    expect(el.classList).toContain('sn-chip');
  });

  it('renders label in sn-chip-label', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const label = fixture.nativeElement.querySelector('.sn-chip-label');
    expect(label).toBeTruthy();
    expect(label.textContent?.trim()).toBe('Streaming');
  });

  it('has tabindex=0 for keyboard access', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-chip');
    expect(el.getAttribute('tabindex')).toBe('0');
  });

  it('renders icon span when icon is provided', async () => {
    const fixture = TestBed.createComponent(WithIconHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('.sn-chip-icon');
    expect(icon).toBeTruthy();
    expect(icon.textContent?.trim()).toBe('videocam');
  });

  it('does not render icon span when no icon', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('.sn-chip-icon');
    expect(icon).toBeNull();
  });

  it('adds sn-chip--removable class when removable=true', async () => {
    const fixture = TestBed.createComponent(RemovableHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-chip');
    expect(el.classList).toContain('sn-chip--removable');
  });

  it('renders sn-chip-remove button when removable=true', async () => {
    const fixture = TestBed.createComponent(RemovableHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('.sn-chip-remove');
    expect(btn).toBeTruthy();
  });

  it('sn-chip-remove button has accessible aria-label via SnIntl default', async () => {
    const fixture = TestBed.createComponent(RemovableHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-chip-remove');
    expect(btn.getAttribute('aria-label')).toBe('Remove deploy');
  });

  it('does not render remove button when removable=false', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('.sn-chip-remove');
    expect(btn).toBeNull();
  });

  it('emits removed when remove button clicked', async () => {
    const fixture = TestBed.createComponent(RemovableHandlerHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-chip-remove');
    btn.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.removed).toBe(true);
  });

  it('adds sn-chip--selected class when selected=true', async () => {
    const fixture = TestBed.createComponent(SelectableHost);
    fixture.componentInstance.selected.set(true);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-chip');
    expect(el.classList).toContain('sn-chip--selected');
  });

  it('removes sn-chip--selected class when selected=false', async () => {
    const fixture = TestBed.createComponent(SelectableHost);
    fixture.componentInstance.selected.set(false);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-chip');
    expect(el.classList).not.toContain('sn-chip--selected');
  });

  it('emits removed when Backspace pressed on removable chip', async () => {
    const fixture = TestBed.createComponent(KeyboardRemoveHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-chip');
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.removed).toBe(true);
  });

  it('emits removed when Delete pressed on removable chip', async () => {
    const fixture = TestBed.createComponent(KeyboardRemoveHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-chip');
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.removed).toBe(true);
  });

  it('does not emit removed on other key presses', async () => {
    const fixture = TestBed.createComponent(KeyboardRemoveHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-chip');
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.removed).toBe(false);
  });

  it('renders projected label content', async () => {
    const fixture = TestBed.createComponent(ProjectedHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-chip');
    expect(el.textContent).toContain('projected label');
  });

  describe('snClass', () => {
    it('applies plain string to root element', async () => {
      const fixture = TestBed.createComponent(SnClassStringHost);
      await fixture.whenStable();
      const el: HTMLElement = fixture.nativeElement.querySelector('sn-chip');
      expect(el.classList).toContain('my-extra-class');
    });

    it('applies object map root section to host', async () => {
      const fixture = TestBed.createComponent(SnClassObjectHost);
      await fixture.whenStable();
      const el: HTMLElement = fixture.nativeElement.querySelector('sn-chip');
      expect(el.classList).toContain('root-extra');
    });

    it('applies object map label section to label element', async () => {
      const fixture = TestBed.createComponent(SnClassObjectHost);
      await fixture.whenStable();
      const labelEl: HTMLElement = fixture.nativeElement.querySelector('.sn-chip-label');
      expect(labelEl.classList).toContain('label-extra');
    });

    it('merges array of maps in order on root', async () => {
      const fixture = TestBed.createComponent(SnClassArrayHost);
      await fixture.whenStable();
      const el: HTMLElement = fixture.nativeElement.querySelector('sn-chip');
      expect(el.classList).toContain('first');
      expect(el.classList).toContain('second');
    });
  });

  describe('snIcon template override', () => {
    it('renders custom remove icon template instead of default close icon', async () => {
      const fixture = TestBed.createComponent(CustomRemoveIconHost);
      await fixture.whenStable();
      const customIcon = fixture.nativeElement.querySelector('.custom-remove-icon');
      expect(customIcon).toBeTruthy();
      expect(customIcon.textContent?.trim()).toBe('X');
    });

    it('hides default close icon when custom remove template is provided', async () => {
      const fixture = TestBed.createComponent(CustomRemoveIconHost);
      await fixture.whenStable();
      const removeBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-chip-remove');
      const defaultIcon = removeBtn.querySelector('.sn-icon');
      expect(defaultIcon).toBeNull();
    });
  });

  describe('SnIntl', () => {
    it('uses English default remove label from SnIntl', async () => {
      const fixture = TestBed.createComponent(IntlDefaultHost);
      await fixture.whenStable();
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-chip-remove');
      expect(btn.getAttribute('aria-label')).toBe('Remove Release');
    });

    it('provideSnIntl override is not used for removeChip (method override not in test)', async () => {
      TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          provideSnIntl({ close: 'Fermer' }),
        ],
      });
      const fixture = TestBed.createComponent(IntlOverrideHost);
      await fixture.whenStable();
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-chip-remove');
      expect(btn.getAttribute('aria-label')).toBe('Remove Release');
    });

    it('instance removeAriaLabel input wins over SnIntl', async () => {
      const fixture = TestBed.createComponent(InstanceInputOverrideHost);
      await fixture.whenStable();
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-chip-remove');
      expect(btn.getAttribute('aria-label')).toBe('Custom remove label');
    });
  });

  it('applies snStyle and allowed snAttrs to named parts without replacing chip semantics', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const root: HTMLElement = el.querySelector('sn-chip')!;
    const icon: HTMLElement = el.querySelector('.sn-chip-icon')!;
    const label: HTMLElement = el.querySelector('.sn-chip-label')!;
    const remove: HTMLElement = el.querySelector('.sn-chip-remove')!;

    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('chip-root');
    // The host stays keyboard-reachable at tabindex 0, not the pass-through's value.
    expect(root.getAttribute('tabindex')).toBe('0');
    expect(icon.style.color).toBe('rgb(1, 2, 3)');
    expect(icon.getAttribute('data-testid')).toBe('chip-icon');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(label.style.color).toBe('rgb(4, 5, 6)');
    expect(label.getAttribute('data-testid')).toBe('chip-label');
    expect(remove.style.color).toBe('rgb(7, 8, 9)');
    expect(remove.getAttribute('data-testid')).toBe('chip-remove');
    expect(remove.getAttribute('aria-label')).not.toBe('invalid label');
  });
});
