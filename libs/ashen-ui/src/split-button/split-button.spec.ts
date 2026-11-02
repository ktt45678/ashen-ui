import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SplitButton } from './split-button';
import { Menu } from 'ashen-ui/menu';
import { MenuItem } from 'ashen-ui/menu';
import { MenuSeparator } from 'ashen-ui/menu';

const tick = (ms = 0) => new Promise<void>((r) => setTimeout(r, ms));

@Component({
  template: `
    <sn-split-button [menuFor]="actions" (clicked)="clicks.push($event)">Save</sn-split-button>
    <sn-menu #actions>
      <button snMenuItem>Save as draft</button>
      <sn-menu-separator />
      <button snMenuItem>Discard</button>
    </sn-menu>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SplitButton, Menu, MenuItem, MenuSeparator],
})
class BasicHost {
  clicks: MouseEvent[] = [];
}

@Component({
  template: `
    <sn-split-button color="error" size="lg" variant="outlined" [menuFor]="m">Delete</sn-split-button>
    <sn-menu #m><button snMenuItem>Confirm</button></sn-menu>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SplitButton, Menu, MenuItem],
})
class VariantHost {}

@Component({
  template: `
    <sn-split-button [disabled]="true" [menuFor]="m">Save</sn-split-button>
    <sn-menu #m><button snMenuItem>Item</button></sn-menu>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SplitButton, Menu, MenuItem],
})
class DisabledHost {}

@Component({
  template: `
    <sn-split-button icon="save" [menuFor]="m">Save</sn-split-button>
    <sn-menu #m><button snMenuItem>Item</button></sn-menu>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SplitButton, Menu, MenuItem],
})
class WithIconHost {}

@Component({
  template: `
    <sn-split-button dropdownAriaLabel="Custom label" [menuFor]="m">Save</sn-split-button>
    <sn-menu #m><button snMenuItem>Item</button></sn-menu>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SplitButton, Menu, MenuItem],
})
class CustomAriaHost {}

@Component({
  template: `
    <sn-split-button [snClass]="'extra-root'" [menuFor]="m">Save</sn-split-button>
    <sn-menu #m><button snMenuItem>Item</button></sn-menu>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SplitButton, Menu, MenuItem],
})
class SnClassHost {}

@Component({
  template: `
    <sn-split-button
      [menuFor]="m"
      [snStyle]="{ root: { outline: '1px solid red' } }"
      [snAttrs]="{ root: { 'data-testid': 'sb-root', class: 'hostile-class' } }"
    >Save</sn-split-button>
    <sn-menu #m><button snMenuItem>Item</button></sn-menu>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SplitButton, Menu, MenuItem],
})
class SnPartHost {}

describe('SplitButton', () => {
  let overlayContainer: OverlayContainer;
  let overlayEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayEl = overlayContainer.getContainerElement();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function getPanel(): HTMLElement | null {
    return overlayEl.querySelector('[role="menu"]');
  }

  async function stable(fixture: ReturnType<typeof TestBed.createComponent<unknown>>) {
    await fixture.whenStable();
  }

  it('renders two child buttons', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await stable(fixture);
    const buttons = fixture.nativeElement.querySelectorAll('button[snButton], button.sn-button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it('main button has sn-split-button-main class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await stable(fixture);
    const main = fixture.nativeElement.querySelector('.sn-split-button-main');
    expect(main).toBeTruthy();
  });

  it('trigger button has sn-split-button-trigger class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await stable(fixture);
    const trigger = fixture.nativeElement.querySelector('.sn-split-button-trigger');
    expect(trigger).toBeTruthy();
  });

  it('projects content into main button', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await stable(fixture);
    const main = fixture.nativeElement.querySelector('.sn-split-button-main') as HTMLElement;
    expect(main.textContent?.trim()).toContain('Save');
  });

  it('main button click emits clicked output', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await stable(fixture);
    const main = fixture.nativeElement.querySelector('.sn-split-button-main') as HTMLElement;
    main.click();
    await stable(fixture);
    expect(fixture.componentInstance.clicks.length).toBe(1);
  });

  it('main button click does NOT open the menu', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await stable(fixture);
    const main = fixture.nativeElement.querySelector('.sn-split-button-main') as HTMLElement;
    main.click();
    await tick(10);
    await stable(fixture);
    expect(getPanel()).toBeNull();
  });

  it('trigger click opens the menu overlay', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await stable(fixture);
    const trigger = fixture.nativeElement.querySelector('.sn-split-button-trigger') as HTMLElement;
    trigger.click();
    await tick(10);
    await stable(fixture);
    expect(getPanel()).toBeTruthy();
  });

  it('trigger has aria-haspopup="menu"', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await stable(fixture);
    const trigger = fixture.nativeElement.querySelector('.sn-split-button-trigger') as HTMLElement;
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
  });

  it('trigger aria-expanded becomes "true" when open', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await stable(fixture);
    const trigger = fixture.nativeElement.querySelector('.sn-split-button-trigger') as HTMLElement;
    trigger.click();
    await tick(10);
    await stable(fixture);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('trigger has default SnIntl aria-label "More actions"', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await stable(fixture);
    const trigger = fixture.nativeElement.querySelector('.sn-split-button-trigger') as HTMLElement;
    expect(trigger.getAttribute('aria-label')).toBe('More actions');
  });

  it('dropdownAriaLabel input overrides the default aria-label', async () => {
    const fixture = TestBed.createComponent(CustomAriaHost);
    await stable(fixture);
    const trigger = fixture.nativeElement.querySelector('.sn-split-button-trigger') as HTMLElement;
    expect(trigger.getAttribute('aria-label')).toBe('Custom label');
  });

  it('disabled disables both buttons', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await stable(fixture);
    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    buttons.forEach((btn: HTMLButtonElement) => {
      expect(btn.hasAttribute('disabled')).toBe(true);
    });
  });

  it('disabled prevents menu from opening on trigger click', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await stable(fixture);
    const trigger = fixture.nativeElement.querySelector('.sn-split-button-trigger') as HTMLElement;
    trigger.click();
    await tick(10);
    await stable(fixture);
    expect(getPanel()).toBeNull();
  });

  it('color/size/variant inputs propagate to both buttons', async () => {
    const fixture = TestBed.createComponent(VariantHost);
    await stable(fixture);
    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLElement>;
    buttons.forEach((btn: HTMLElement) => {
      expect(btn.classList).toContain('sn-color-error');
      expect(btn.classList).toContain('sn-button-lg');
      expect(btn.classList).toContain('sn-outlined-button');
    });
  });

  it('icon input passes icon to main button', async () => {
    const fixture = TestBed.createComponent(WithIconHost);
    await stable(fixture);
    const main = fixture.nativeElement.querySelector('.sn-split-button-main') as HTMLElement;
    expect(main.querySelector('sn-icon, .sn-icon')).toBeTruthy();
  });

  it('snClass string merges onto host', async () => {
    const fixture = TestBed.createComponent(SnClassHost);
    await stable(fixture);
    const host = fixture.nativeElement.querySelector('sn-split-button') as HTMLElement;
    expect(host.classList).toContain('extra-root');
  });

  it('applies snStyle and allowed snAttrs to the host root without letting attrs smuggle a class', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await stable(fixture);
    const host = fixture.nativeElement.querySelector('sn-split-button') as HTMLElement;

    expect(host.style.outline).toContain('red');
    expect(host.getAttribute('data-testid')).toBe('sb-root');
    // class is always blocked by SnPart, whether or not it is a declared reserved attr.
    expect(host.classList).toContain('sn-split-button');
    expect(host.classList).not.toContain('hostile-class');
  });
});
