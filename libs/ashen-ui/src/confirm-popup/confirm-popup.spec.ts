import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ConfirmPopup } from './confirm-popup';
import { ConfirmPopupTrigger } from './confirm-popup-trigger';
import { provideSnIntl } from 'ashen-ui/core';
import { fakeRunningAnimations } from '../core/fake-animations.spec-helper';

const tick = (ms = 0) => new Promise<void>((r) => setTimeout(r, ms));

@Component({
  template: `
    <sn-confirm-popup
      message="Delete this tile?"
      icon="delete"
      severity="error"
      acceptLabel="Delete"
      (accept)="accepted = true"
      (reject)="rejected = true"
    >
      <button snConfirmPopupTrigger>Delete</button>
    </sn-confirm-popup>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ConfirmPopup, ConfirmPopupTrigger],
})
class BasicHost {
  accepted = false;
  rejected = false;
}

@Component({
  template: `
    <sn-confirm-popup
      [(open)]="open"
      message="Are you sure?"
    >
      <button snConfirmPopupTrigger>Open</button>
    </sn-confirm-popup>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ConfirmPopup, ConfirmPopupTrigger],
})
class ModelHost {
  readonly open = signal(false);
}

@Component({
  template: `
    <sn-confirm-popup
      message="Warning!"
      severity="warning"
      icon="warning"
      acceptLabel="Proceed"
      rejectLabel="Go back"
      (accept)="accepted = true"
      (reject)="rejected = true"
    >
      <button snConfirmPopupTrigger>Warn</button>
    </sn-confirm-popup>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ConfirmPopup, ConfirmPopupTrigger],
})
class CustomLabelsHost {
  accepted = false;
  rejected = false;
}

@Component({
  template: `
    <sn-confirm-popup message="Are you sure?" severity="primary">
      <button snConfirmPopupTrigger>Open</button>
    </sn-confirm-popup>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ConfirmPopup, ConfirmPopupTrigger],
})
class DefaultsHost {}

@Component({
  template: `
    <sn-confirm-popup message="Check success" severity="success">
      <button snConfirmPopupTrigger>Open</button>
    </sn-confirm-popup>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ConfirmPopup, ConfirmPopupTrigger],
})
class SuccessHost {}

@Component({
  template: `
    <sn-confirm-popup message="Top aligned" position="top">
      <button snConfirmPopupTrigger>Open</button>
    </sn-confirm-popup>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ConfirmPopup, ConfirmPopupTrigger],
})
class TopPositionHost {}

@Component({
  template: `
    <sn-confirm-popup
      message="Sure?"
      icon="delete"
      severity="error"
      [snStyle]="{
        root: { outline: '1px solid red' },
        panel: { color: 'rgb(10, 20, 30)' },
        message: { color: 'rgb(1, 2, 3)' },
        icon: { color: 'rgb(4, 5, 6)' },
        footer: { color: 'rgb(7, 8, 9)' }
      }"
      [snAttrs]="{
        root: { 'data-testid': 'cp-root' },
        panel: { 'data-testid': 'cp-panel', role: 'presentation' },
        message: { 'data-testid': 'cp-message' },
        icon: { 'data-testid': 'cp-icon' },
        footer: { 'data-testid': 'cp-footer' }
      }"
    >
      <button snConfirmPopupTrigger>Open</button>
    </sn-confirm-popup>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ConfirmPopup, ConfirmPopupTrigger],
})
class SnPartHost {}

describe('ConfirmPopup component', () => {
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

  function getPanelEl(): HTMLElement | null {
    return overlayEl.querySelector('[role="alertdialog"]');
  }

  async function openPopup(fixture: ReturnType<typeof TestBed.createComponent<BasicHost>>) {
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('[snConfirmPopupTrigger]') as HTMLElement;
    btn.click();
    await tick(10);
    await fixture.whenStable();
    return btn;
  }

  it('host has sn-confirm-popup class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const host = fixture.nativeElement.querySelector('sn-confirm-popup') as HTMLElement;
    expect(host.classList).toContain('sn-confirm-popup');
  });

  it('does not show panel initially', async () => {
    TestBed.createComponent(BasicHost);
    await tick(10);
    expect(getPanelEl()).toBeNull();
  });

  it('shows panel after trigger click', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    expect(getPanelEl()).toBeTruthy();
  });

  it('moves focus to the reject button when the popup opens', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    await tick(10);
    const reject = getPanelEl()?.querySelector('.sn-confirm-popup-footer button') as HTMLElement;
    expect(reject).toBeTruthy();
    expect(document.activeElement).toBe(reject);
  });

  it('panel has role="alertdialog"', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    expect(getPanelEl()?.getAttribute('role')).toBe('alertdialog');
  });

  it('panel has sn-confirm-popup-panel class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    expect(getPanelEl()?.classList).toContain('sn-confirm-popup-panel');
  });

  it('renders message text in the panel', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    const msg = getPanelEl()!.querySelector('.sn-confirm-popup-message');
    expect(msg?.textContent?.trim()).toBe('Delete this tile?');
  });

  it('renders icon in ligature mode', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    const icon = getPanelEl()!.querySelector('.sn-confirm-popup-icon');
    expect(icon?.textContent?.trim()).toBe('delete');
  });

  it('renders sn-confirm-popup-body wrapper', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    expect(getPanelEl()?.querySelector('.sn-confirm-popup-body')).toBeTruthy();
  });

  it('renders sn-confirm-popup-footer wrapper', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    expect(getPanelEl()?.querySelector('.sn-confirm-popup-footer')).toBeTruthy();
  });

  it('renders two buttons in the footer', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    const buttons = getPanelEl()!.querySelectorAll('.sn-confirm-popup-footer button');
    expect(buttons.length).toBe(2);
  });

  it('closes panel on second trigger click', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    const btn = await openPopup(fixture);
    btn.click();
    await tick(200);
    await fixture.whenStable();
    expect(getPanelEl()).toBeNull();
  });

  it('closes on Escape keydown event', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    const escEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    overlayEl.dispatchEvent(escEvent);
    await tick(200);
    await fixture.whenStable();
    expect(getPanelEl()).toBeNull();
  });

  it('does not emit reject on Escape (dismissal only)', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    const escEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    overlayEl.dispatchEvent(escEvent);
    await tick(200);
    await fixture.whenStable();
    expect(fixture.componentInstance.rejected).toBe(false);
  });

  it('does not emit accept on Escape', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    overlayEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await tick(200);
    await fixture.whenStable();
    expect(fixture.componentInstance.accepted).toBe(false);
  });

  it('emits accept when accept button is clicked', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    const footer = getPanelEl()!.querySelector('.sn-confirm-popup-footer')!;
    const buttons = footer.querySelectorAll('button');
    (buttons[buttons.length - 1] as HTMLButtonElement).click();
    await tick(10);
    await fixture.whenStable();
    expect(fixture.componentInstance.accepted).toBe(true);
  });

  it('does not emit reject when accept is clicked', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    const footer = getPanelEl()!.querySelector('.sn-confirm-popup-footer')!;
    const buttons = footer.querySelectorAll('button');
    (buttons[buttons.length - 1] as HTMLButtonElement).click();
    await tick(10);
    await fixture.whenStable();
    expect(fixture.componentInstance.rejected).toBe(false);
  });

  it('closes after accept button click', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    const footer = getPanelEl()!.querySelector('.sn-confirm-popup-footer')!;
    const buttons = footer.querySelectorAll('button');
    (buttons[buttons.length - 1] as HTMLButtonElement).click();
    await tick(200);
    await fixture.whenStable();
    expect(getPanelEl()).toBeNull();
  });

  it('emits reject when reject button is clicked', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    const footer = getPanelEl()!.querySelector('.sn-confirm-popup-footer')!;
    (footer.querySelectorAll('button')[0] as HTMLButtonElement).click();
    await tick(10);
    await fixture.whenStable();
    expect(fixture.componentInstance.rejected).toBe(true);
  });

  it('does not emit accept when reject is clicked', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    const footer = getPanelEl()!.querySelector('.sn-confirm-popup-footer')!;
    (footer.querySelectorAll('button')[0] as HTMLButtonElement).click();
    await tick(10);
    await fixture.whenStable();
    expect(fixture.componentInstance.accepted).toBe(false);
  });

  it('closes after reject button click', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    const footer = getPanelEl()!.querySelector('.sn-confirm-popup-footer')!;
    (footer.querySelectorAll('button')[0] as HTMLButtonElement).click();
    await tick(200);
    await fixture.whenStable();
    expect(getPanelEl()).toBeNull();
  });

  it('applies sn-confirm-popup-icon--error class for severity="error"', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    const icon = getPanelEl()!.querySelector('.sn-confirm-popup-icon');
    expect(icon?.classList).toContain('sn-confirm-popup-icon--error');
  });

  it('applies sn-confirm-popup-icon--warning class for severity="warning"', async () => {
    const fixture = TestBed.createComponent(CustomLabelsHost);
    await fixture.whenStable();
    (fixture.nativeElement.querySelector('[snConfirmPopupTrigger]') as HTMLElement).click();
    await tick(10);
    await fixture.whenStable();
    const icon = getPanelEl()!.querySelector('.sn-confirm-popup-icon');
    expect(icon?.classList).toContain('sn-confirm-popup-icon--warning');
  });

  it('applies sn-confirm-popup-icon--success class for severity="success"', async () => {
    const fixture = TestBed.createComponent(SuccessHost);
    await fixture.whenStable();
    (fixture.nativeElement.querySelector('[snConfirmPopupTrigger]') as HTMLElement).click();
    await tick(10);
    await fixture.whenStable();
    const icon = getPanelEl()!.querySelector('.sn-confirm-popup-icon');
    expect(icon?.classList).toContain('sn-confirm-popup-icon--success');
  });

  it('applies sn-confirm-popup-icon--primary class for severity="primary"', async () => {
    const fixture = TestBed.createComponent(DefaultsHost);
    await fixture.whenStable();
    (fixture.nativeElement.querySelector('[snConfirmPopupTrigger]') as HTMLElement).click();
    await tick(10);
    await fixture.whenStable();
    const icon = getPanelEl()!.querySelector('.sn-confirm-popup-icon');
    expect(icon?.classList).toContain('sn-confirm-popup-icon--primary');
  });

  it('accept button has sn-color-error class for severity="error"', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    const footer = getPanelEl()!.querySelector('.sn-confirm-popup-footer')!;
    const buttons = footer.querySelectorAll('button');
    const acceptBtn = buttons[buttons.length - 1];
    expect(acceptBtn.classList).toContain('sn-color-error');
  });

  it('reject button has sn-text-button class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    const footer = getPanelEl()!.querySelector('.sn-confirm-popup-footer')!;
    const rejectBtn = footer.querySelectorAll('button')[0];
    expect(rejectBtn.classList).toContain('sn-text-button');
  });

  it('uses SnIntl defaults for accept and reject labels', async () => {
    const fixture = TestBed.createComponent(DefaultsHost);
    await fixture.whenStable();
    (fixture.nativeElement.querySelector('[snConfirmPopupTrigger]') as HTMLElement).click();
    await tick(10);
    await fixture.whenStable();
    const footer = getPanelEl()!.querySelector('.sn-confirm-popup-footer')!;
    const buttons = footer.querySelectorAll('button');
    expect(buttons[0].textContent?.trim()).toBe('Cancel');
    expect(buttons[buttons.length - 1].textContent?.trim()).toBe('Yes');
  });

  it('uses custom acceptLabel over SnIntl', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    const footer = getPanelEl()!.querySelector('.sn-confirm-popup-footer')!;
    const buttons = footer.querySelectorAll('button');
    expect(buttons[buttons.length - 1].textContent?.trim()).toBe('Delete');
  });

  it('uses custom rejectLabel over SnIntl', async () => {
    const fixture = TestBed.createComponent(CustomLabelsHost);
    await fixture.whenStable();
    (fixture.nativeElement.querySelector('[snConfirmPopupTrigger]') as HTMLElement).click();
    await tick(10);
    await fixture.whenStable();
    const footer = getPanelEl()!.querySelector('.sn-confirm-popup-footer')!;
    const buttons = footer.querySelectorAll('button');
    expect(buttons[0].textContent?.trim()).toBe('Go back');
  });

  it('trigger has aria-haspopup="dialog"', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('[snConfirmPopupTrigger]') as HTMLElement;
    expect(btn.getAttribute('aria-haspopup')).toBe('dialog');
  });

  it('trigger has aria-expanded="false" initially', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('[snConfirmPopupTrigger]') as HTMLElement;
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('trigger has aria-expanded="true" when open', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    const btn = await openPopup(fixture);
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });

  it('trigger aria-expanded returns to "false" after close', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    const btn = await openPopup(fixture);
    btn.click();
    await tick(200);
    await fixture.whenStable();
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('trigger has aria-controls matching panel id', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    const btn = await openPopup(fixture);
    const controls = btn.getAttribute('aria-controls');
    expect(controls).toBeTruthy();
    const panel = getPanelEl();
    expect(panel?.getAttribute('id')).toBe(controls);
  });

  it('panel has aria-describedby pointing to the message element', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    const panel = getPanelEl()!;
    const describedBy = panel.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(panel.querySelector(`#${describedBy}`)).toBeTruthy();
  });

  it('CDK overlay has sn-confirm-popup-overlay-panel class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    expect(overlayEl.querySelector('.sn-confirm-popup-overlay-panel')).toBeTruthy();
  });

  it('overlay container has sn-confirm-popup-container class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    expect(overlayEl.querySelector('.sn-confirm-popup-container')).toBeTruthy();
  });

  it('overlay container has sn-confirm-popup-visible class when open', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    const container = overlayEl.querySelector('.sn-confirm-popup-container') as HTMLElement;
    expect(container?.classList).toContain('sn-confirm-popup-visible');
  });

  it('open model is false initially', async () => {
    const fixture = TestBed.createComponent(ModelHost);
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('open model becomes true after trigger click', async () => {
    const fixture = TestBed.createComponent(ModelHost);
    await fixture.whenStable();
    (fixture.nativeElement.querySelector('[snConfirmPopupTrigger]') as HTMLElement).click();
    await tick(10);
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(true);
  });

  it('open model becomes false after accept', async () => {
    const fixture = TestBed.createComponent(ModelHost);
    await fixture.whenStable();
    (fixture.nativeElement.querySelector('[snConfirmPopupTrigger]') as HTMLElement).click();
    await tick(10);
    await fixture.whenStable();
    const footer = getPanelEl()!.querySelector('.sn-confirm-popup-footer')!;
    const buttons = footer.querySelectorAll('button');
    (buttons[buttons.length - 1] as HTMLButtonElement).click();
    await tick(200);
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('open model becomes false after reject', async () => {
    const fixture = TestBed.createComponent(ModelHost);
    await fixture.whenStable();
    (fixture.nativeElement.querySelector('[snConfirmPopupTrigger]') as HTMLElement).click();
    await tick(10);
    await fixture.whenStable();
    const footer = getPanelEl()!.querySelector('.sn-confirm-popup-footer')!;
    (footer.querySelectorAll('button')[0] as HTMLButtonElement).click();
    await tick(200);
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('opens and closes when the bound open value changes from code', async () => {
    const fixture = TestBed.createComponent(ModelHost);
    await fixture.whenStable();

    fixture.componentInstance.open.set(true);
    await tick(10);
    await fixture.whenStable();
    expect(getPanelEl()).toBeTruthy();

    fixture.componentInstance.open.set(false);
    await fixture.whenStable();
    await tick(200);
    await fixture.whenStable();
    expect(getPanelEl()).toBeNull();
    expect(overlayEl.parentElement!.querySelector('.sn-confirm-popup-backdrop')).toBeNull();
  });

  it('can be reopened after closing', async () => {
    const fixture = TestBed.createComponent(ModelHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('[snConfirmPopupTrigger]') as HTMLElement;
    btn.click();
    await tick(10);
    await fixture.whenStable();
    const footer = getPanelEl()!.querySelector('.sn-confirm-popup-footer')!;
    (footer.querySelectorAll('button')[0] as HTMLButtonElement).click();
    await tick(200);
    await fixture.whenStable();
    expect(getPanelEl()).toBeNull();

    btn.click();
    await tick(10);
    await fixture.whenStable();
    expect(getPanelEl()).toBeTruthy();
  });

  it('opens when position=top', async () => {
    const fixture = TestBed.createComponent(TopPositionHost);
    await fixture.whenStable();
    (fixture.nativeElement.querySelector('[snConfirmPopupTrigger]') as HTMLElement).click();
    await tick(10);
    await fixture.whenStable();
    expect(getPanelEl()).toBeTruthy();
  });

  it('panel has a unique id attribute', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopup(fixture);
    expect(getPanelEl()?.getAttribute('id')).toBeTruthy();
  });

  it('forwards snStyle and allowed snAttrs to the overlay panel parts', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    (fixture.nativeElement.querySelector('[snConfirmPopupTrigger]') as HTMLElement).click();
    await tick(10);
    await fixture.whenStable();

    const root = overlayEl.querySelector('.sn-confirm-popup-container') as HTMLElement;
    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('cp-root');

    const panel = getPanelEl()!;
    expect(panel.style.color).toBe('rgb(10, 20, 30)');
    expect(panel.getAttribute('data-testid')).toBe('cp-panel');
    // panel keeps its reserved alertdialog role, not the pass-through value.
    expect(panel.getAttribute('role')).toBe('alertdialog');

    const message = panel.querySelector('.sn-confirm-popup-message') as HTMLElement;
    expect(message.style.color).toBe('rgb(1, 2, 3)');
    expect(message.getAttribute('data-testid')).toBe('cp-message');

    const icon = panel.querySelector('.sn-confirm-popup-icon') as HTMLElement;
    expect(icon.style.color).toBe('rgb(4, 5, 6)');
    expect(icon.getAttribute('data-testid')).toBe('cp-icon');

    const footer = panel.querySelector('.sn-confirm-popup-footer') as HTMLElement;
    expect(footer.style.color).toBe('rgb(7, 8, 9)');
    expect(footer.getAttribute('data-testid')).toBe('cp-footer');
  });
});

describe('ConfirmPopup - SnIntl overrides', () => {
  let overlayContainer: OverlayContainer;
  let overlayEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideSnIntl({ confirmAccept: 'OK', confirmReject: 'Nope' }),
      ],
    });
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayEl = overlayContainer.getContainerElement();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('overrides SnIntl defaults via provideSnIntl', async () => {
    const fixture = TestBed.createComponent(DefaultsHost);
    await fixture.whenStable();
    (fixture.nativeElement.querySelector('[snConfirmPopupTrigger]') as HTMLElement).click();
    await new Promise<void>((r) => setTimeout(r, 10));
    await fixture.whenStable();
    const footer = overlayEl.querySelector('.sn-confirm-popup-footer')!;
    const buttons = footer.querySelectorAll('button');
    expect(buttons[0].textContent?.trim()).toBe('Nope');
    expect(buttons[buttons.length - 1].textContent?.trim()).toBe('OK');
  });
});

@Component({
  template: `
    <sn-confirm-popup message="Delete?" [animated]="false">
      <button snConfirmPopupTrigger>Delete</button>
    </sn-confirm-popup>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ConfirmPopup, ConfirmPopupTrigger],
})
class NoAnimConfirmPopupHost {}

@Component({
  template: `
    <sn-confirm-popup
      message="Delete?"
      [animation]="{ enter: 'my-in 40ms ease-out', exit: 'my-out 40ms ease-in' }"
    >
      <button snConfirmPopupTrigger>Delete</button>
    </sn-confirm-popup>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ConfirmPopup, ConfirmPopupTrigger],
})
class CustomAnimConfirmPopupHost {}

describe('ConfirmPopup animation inputs', () => {
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
    return overlayEl.querySelector('.sn-confirm-popup-panel');
  }

  it('animated=false suppresses the panel animation and closes immediately', async () => {
    const fix = TestBed.createComponent(NoAnimConfirmPopupHost);
    await fix.whenStable();
    const trigger = fix.nativeElement.querySelector('button') as HTMLElement;
    trigger.click();
    await tick(10);
    await fix.whenStable();
    const panel = getPanel()!;
    expect(panel.style.animation).toBe('none');
    trigger.click();
    await tick(10);
    await fix.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('custom enter/exit animations apply inline and drive the close timer', async () => {
    onTestFinished(fakeRunningAnimations(40));
    const fix = TestBed.createComponent(CustomAnimConfirmPopupHost);
    await fix.whenStable();
    const trigger = fix.nativeElement.querySelector('button') as HTMLElement;
    trigger.click();
    await tick(10);
    await fix.whenStable();
    expect(getPanel()!.style.animation).toContain('my-in');
    trigger.click();
    await tick(5);
    await fix.whenStable();
    expect(getPanel()!.style.animation).toContain('my-out');
    await tick(80);
    await fix.whenStable();
    expect(getPanel()).toBeNull();
  });
});
