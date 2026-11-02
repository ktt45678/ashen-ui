import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Button } from './button';
import { IconTemplate } from 'ashen-ui/core';

@Component({
  template: `<button snButton>Save</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button],
})
class DefaultHost {}

@Component({
  template: `<button snButton variant="raised">Raised</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button],
})
class RaisedHost {}

@Component({
  template: `<button snButton variant="outlined">Outlined</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button],
})
class OutlinedHost {}

@Component({
  template: `<button snButton variant="text">Text</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button],
})
class TextHost {}

@Component({
  template: `<button snButton variant="icon" icon="settings" aria-label="Settings"></button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button],
})
class IconVariantHost {}

@Component({
  template: `<button snButton variant="icon-filled" color="error" icon="delete" aria-label="Delete"></button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button],
})
class FilledIconVariantHost {}

@Component({
  template: `<button snButton variant="icon-outlined" color="secondary" icon="edit" aria-label="Edit"></button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button],
})
class OutlinedIconVariantHost {}

@Component({
  template: `<button snButton variant="icon-text" color="secondary" icon="more_horiz" aria-label="More"></button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button],
})
class TextIconVariantHost {}

@Component({
  template: `<button snButton color="error">Delete</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button],
})
class ErrorColorHost {}

@Component({
  template: `<button snButton color="secondary">Cancel</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button],
})
class SecondaryColorHost {}

@Component({
  template: `<button snButton color="success">Apply</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button],
})
class SuccessColorHost {}

@Component({
  template: `<button snButton color="warning">Reset</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button],
})
class WarningColorHost {}

@Component({
  template: `<button snButton color="info">Info</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button],
})
class InfoColorHost {}

@Component({
  template: `<button snButton color="none">None</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button],
})
class NoneColorHost {}

@Component({
  template: `<button snButton size="xs">Tiny</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button],
})
class ExtraSmallHost {}

@Component({
  template: `<button snButton shape="pill">Rounded</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button],
})
class PillHost {}

@Component({
  template: `
    <button snButton shape="pill" variant="outlined" icon="close" iconOnly aria-label="Close"></button>
    <button snButton shape="pill" icon="add">Add</button>
    <button snButton variant="icon" icon="close" iconOnly aria-label="Close"></button>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button],
})
class IconOnlyHost {}

@Component({
  template: `<button snButton variant="icon" size="xs" icon="close"></button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button],
})
class ExtraSmallIconHost {}

@Component({
  template: `<button snButton size="sm">Small</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button],
})
class SmallHost {}

@Component({
  template: `<button snButton size="lg">Large</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button],
})
class LargeHost {}

@Component({
  template: `<button snButton [disabled]="disabled()">Save</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button],
})
class DisabledHost {
  readonly disabled = signal(false);
}

@Component({
  template: `<button snButton [loading]="loading()">Saving</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button],
})
class LoadingHost {
  readonly loading = signal(false);
}

@Component({
  template: `<button snButton icon="add">With icon</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button],
})
class WithIconHost {}

@Component({
  template: `<button snButton icon="add" iconPosition="end">End icon</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button],
})
class EndIconHost {}

@Component({
  template: `<a snButton href="#">Link button</a>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button],
})
class AnchorHost {}

@Component({
  template: `<button snButton [snTokens]="{ '--sn-button-bg': 'var(--brand-accent)' }">Save</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button],
})
class TokensHost {}

describe('Button', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('applies sn-button host class', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('sn-button');
  });

  it('renders projected label text', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.textContent?.trim()).toBe('Save');
  });

  it('adds sn-raised-button for variant="raised"', async () => {
    const fixture = TestBed.createComponent(RaisedHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('sn-raised-button');
  });

  it('adds sn-outlined-button for variant="outlined"', async () => {
    const fixture = TestBed.createComponent(OutlinedHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('sn-outlined-button');
  });

  it('adds sn-text-button for variant="text"', async () => {
    const fixture = TestBed.createComponent(TextHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('sn-text-button');
  });

  it('adds sn-icon-button for variant="icon"', async () => {
    const fixture = TestBed.createComponent(IconVariantHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('sn-icon-button');
  });

  it('renders icon span inside icon variant', async () => {
    const fixture = TestBed.createComponent(IconVariantHost);
    await fixture.whenStable();
    const span: HTMLSpanElement = fixture.nativeElement.querySelector('.sn-icon');
    expect(span).toBeTruthy();
    expect(span.textContent?.trim()).toBe('settings');
  });

  it('adds the filled icon class and preserves semantic color', async () => {
    const fixture = TestBed.createComponent(FilledIconVariantHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('sn-icon-button');
    expect(btn.classList).toContain('sn-icon-filled-button');
    expect(btn.classList).toContain('sn-color-error');
  });

  it('adds the outlined icon classes', async () => {
    const fixture = TestBed.createComponent(OutlinedIconVariantHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('sn-icon-button');
    expect(btn.classList).toContain('sn-outlined-button');
  });

  it('adds the text icon classes', async () => {
    const fixture = TestBed.createComponent(TextIconVariantHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('sn-icon-button');
    expect(btn.classList).toContain('sn-text-button');
  });

  it('adds sn-color-error for color="error"', async () => {
    const fixture = TestBed.createComponent(ErrorColorHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('sn-color-error');
  });

  it('adds sn-color-secondary for color="secondary"', async () => {
    const fixture = TestBed.createComponent(SecondaryColorHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('sn-color-secondary');
  });

  it('adds sn-color-success for color="success"', async () => {
    const fixture = TestBed.createComponent(SuccessColorHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('sn-color-success');
  });

  it('adds sn-color-warning for color="warning"', async () => {
    const fixture = TestBed.createComponent(WarningColorHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('sn-color-warning');
  });

  it('adds sn-color-info for color="info"', async () => {
    const fixture = TestBed.createComponent(InfoColorHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('sn-color-info');
  });

  it('adds sn-color-none for color="none"', async () => {
    const fixture = TestBed.createComponent(NoneColorHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('sn-color-none');
  });

  it('does not add a color class for default primary color', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).not.toContain('sn-color-primary');
    expect(btn.classList).not.toContain('sn-color-secondary');
  });

  it('adds sn-button-xs for size="xs"', async () => {
    const fixture = TestBed.createComponent(ExtraSmallHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('sn-button-xs');
    expect(btn.getAttribute('data-sn-size')).toBe('xs');
  });

  it('sizes an xs icon button to the xs control height', async () => {
    const fixture = TestBed.createComponent(ExtraSmallIconHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('sn-icon-button');
    expect(btn.classList).toContain('sn-button-xs');
  });

  it('adds sn-button-pill for shape="pill"', async () => {
    const fixture = TestBed.createComponent(PillHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('sn-button-pill');
    expect(btn.getAttribute('data-sn-shape')).toBe('pill');
  });

  it('adds sn-button-icon-only only when iconOnly is set on a non-icon variant', async () => {
    const fixture = TestBed.createComponent(IconOnlyHost);
    await fixture.whenStable();
    const [iconOnly, labelled, iconVariant] = fixture.nativeElement.querySelectorAll('button');
    expect(iconOnly.classList).toContain('sn-button-icon-only');
    expect(labelled.classList).not.toContain('sn-button-icon-only');
    expect(iconVariant.classList).not.toContain('sn-button-icon-only');
  });

  it('leaves the corners alone for the default shape', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).not.toContain('sn-button-pill');
    expect(btn.getAttribute('data-sn-shape')).toBe('default');
  });

  it('adds sn-button-sm for size="sm"', async () => {
    const fixture = TestBed.createComponent(SmallHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('sn-button-sm');
  });

  it('adds sn-button-lg for size="lg"', async () => {
    const fixture = TestBed.createComponent(LargeHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('sn-button-lg');
  });

  it('does not add size class for default md size', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).not.toContain('sn-button-sm');
    expect(btn.classList).not.toContain('sn-button-lg');
  });

  it('sets native disabled attribute when disabled=true', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    fixture.componentInstance.disabled.set(true);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.hasAttribute('disabled')).toBe(true);
  });

  it('removes native disabled attribute when disabled=false', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    fixture.componentInstance.disabled.set(false);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.hasAttribute('disabled')).toBe(false);
  });

  it('sets disabled and aria-busy when loading=true', async () => {
    const fixture = TestBed.createComponent(LoadingHost);
    fixture.componentInstance.loading.set(true);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.hasAttribute('disabled')).toBe(true);
    expect(btn.getAttribute('aria-busy')).toBe('true');
  });

  it('shows spinner icon when loading=true', async () => {
    const fixture = TestBed.createComponent(LoadingHost);
    fixture.componentInstance.loading.set(true);
    await fixture.whenStable();
    const spinner = fixture.nativeElement.querySelector('.sn-icon.sn-spin');
    expect(spinner).toBeTruthy();
    expect(spinner.textContent?.trim()).toBe('progress_activity');
  });

  it('removes aria-busy when loading=false', async () => {
    const fixture = TestBed.createComponent(LoadingHost);
    fixture.componentInstance.loading.set(false);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.getAttribute('aria-busy')).toBeNull();
  });

  it('renders icon span at start by default', async () => {
    const fixture = TestBed.createComponent(WithIconHost);
    await fixture.whenStable();
    const children = Array.from(
      fixture.nativeElement.querySelector('button').childNodes,
    ).filter((n) => (n as Node).nodeType === Node.ELEMENT_NODE);
    const first = children[0] as HTMLElement;
    expect(first.classList).toContain('sn-icon');
    expect(first.textContent?.trim()).toBe('add');
  });

  it('renders icon span at end when iconPosition="end"', async () => {
    const fixture = TestBed.createComponent(EndIconHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    const spans = Array.from(btn.querySelectorAll('.sn-icon'));
    expect(spans.length).toBe(1);
    // The icon should be after the text node
    const last = btn.lastElementChild as HTMLElement;
    expect(last.classList).toContain('sn-icon');
    expect(last.textContent?.trim()).toBe('add');
  });

  it('applies sn-button to anchor element', async () => {
    const fixture = TestBed.createComponent(AnchorHost);
    await fixture.whenStable();
    const a: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(a.classList).toContain('sn-button');
  });

  it('applies plain string snClass to host element', async () => {
    @Component({
      template: `<button snButton snClass="my-utility">Save</button>`,
      imports: [Button],
    })
    class SnClassStringHost {}

    const fixture = TestBed.createComponent(SnClassStringHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('my-utility');
    expect(btn.classList).toContain('sn-button');
  });

  it('applies SnClassMap root section to host element', async () => {
    @Component({
      template: `<button snButton [snClass]="{ root: 'map-class' }">Save</button>`,
      imports: [Button],
    })
    class SnClassMapHost {}

    const fixture = TestBed.createComponent(SnClassMapHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('map-class');
  });

  it('applies snTokens through the Button API', async () => {
    const fixture = TestBed.createComponent(TokensHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.style.getPropertyValue('--sn-button-bg')).toBe('var(--brand-accent)');
  });

  it('merges SnClassMap array in order on root', async () => {
    @Component({
      template: `<button snButton [snClass]="[{ root: 'first' }, { root: 'second' }]">Save</button>`,
      imports: [Button],
    })
    class SnClassArrayHost {}

    const fixture = TestBed.createComponent(SnClassArrayHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('first');
    expect(btn.classList).toContain('second');
  });

  it('renders custom icon template instead of default font icon', async () => {
    @Component({
      template: `
        <button snButton icon="add">
          <ng-template snIcon><svg class="custom-svg" /></ng-template>
          Save
        </button>
      `,
      imports: [Button, IconTemplate],
    })
    class CustomIconHost {}

    const fixture = TestBed.createComponent(CustomIconHost);
    await fixture.whenStable();
    const svg = fixture.nativeElement.querySelector('.custom-svg');
    expect(svg).toBeTruthy();
  });

  it('hides default sn-icon span when custom icon template is provided', async () => {
    @Component({
      template: `
        <button snButton icon="add">
          <ng-template snIcon><svg class="custom-svg" /></ng-template>
          Save
        </button>
      `,
      imports: [Button, IconTemplate],
    })
    class CustomIconHideDefaultHost {}

    const fixture = TestBed.createComponent(CustomIconHideDefaultHost);
    await fixture.whenStable();
    const defaultIcon = fixture.nativeElement.querySelector('.sn-icon.icon-ms');
    expect(defaultIcon).toBeNull();
  });

  it('does not have sn-button-animate immediately after first render', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('sn-button-animate')).toBe(false);
  });

  it('adds sn-button-animate after two animation frames', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.classList.contains('sn-button-animate')).toBe(true);
  });
});
