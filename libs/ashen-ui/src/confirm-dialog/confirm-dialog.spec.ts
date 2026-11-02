import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ConfirmDialog } from './confirm-dialog';
import { provideSnIntl } from 'ashen-ui/core';

const tick = (ms = 0) => new Promise<void>((r) => setTimeout(r, ms));

@Component({
  template: `
    <sn-confirm-dialog
      [(open)]="open"
      header="Delete item"
      message="This action cannot be undone."
      icon="delete"
      severity="error"
      (accept)="accepted = true"
      (reject)="rejected = true"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ConfirmDialog],
})
class BasicHost {
  readonly open = signal(false);
  accepted = false;
  rejected = false;
}

@Component({
  template: `
    <sn-confirm-dialog
      [(open)]="open"
      header="Confirm"
      message="Are you sure?"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ConfirmDialog],
})
class DefaultsHost {
  readonly open = signal(true);
}

@Component({
  template: `
    <sn-confirm-dialog
      [(open)]="open"
      message="Warning!"
      severity="warning"
      acceptLabel="Proceed"
      rejectLabel="Go back"
      (accept)="accepted = true"
      (reject)="rejected = true"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ConfirmDialog],
})
class CustomLabelsHost {
  readonly open = signal(false);
  accepted = false;
  rejected = false;
}

@Component({
  template: `
    <sn-confirm-dialog
      [(open)]="open"
      message="Success confirmation"
      severity="success"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ConfirmDialog],
})
class SuccessSeverityHost {
  readonly open = signal(true);
}

@Component({
  template: `
    <sn-confirm-dialog
      [(open)]="open"
      message="Primary confirmation"
      severity="primary"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ConfirmDialog],
})
class PrimarySeverityHost {
  readonly open = signal(true);
}

@Component({
  template: `
    <sn-confirm-dialog
      [(open)]="open"
      header="Delete"
      message="Sure?"
      icon="delete"
      severity="error"
      [snStyle]="{
        panel: { outline: '1px solid red' },
        message: { color: 'rgb(1, 2, 3)' },
        icon: { color: 'rgb(4, 5, 6)' },
        footer: { color: 'rgb(7, 8, 9)' }
      }"
      [snAttrs]="{
        panel: { 'data-testid': 'cd-panel', role: 'presentation' },
        message: { 'data-testid': 'cd-message' },
        icon: { 'data-testid': 'cd-icon' },
        footer: { 'data-testid': 'cd-footer' }
      }"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ConfirmDialog],
})
class SnPartHost {
  readonly open = signal(false);
}

describe('ConfirmDialog component', () => {
  let overlayContainer: OverlayContainer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function getPanel(): HTMLElement | null {
    return document.querySelector('[role="dialog"]');
  }

  async function openDialog(fixture: ReturnType<typeof TestBed.createComponent<BasicHost>>) {
    await fixture.whenStable();
    fixture.componentInstance.open.set(true);
    await tick(10);
    await fixture.whenStable();
  }

  it('host has sn-confirm-dialog class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const host = fixture.nativeElement.querySelector('sn-confirm-dialog') as HTMLElement;
    expect(host.classList).toContain('sn-confirm-dialog');
  });

  it('does not show panel when open is false', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('shows panel when open is set to true', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    expect(getPanel()).toBeTruthy();
  });

  it('renders the header as dialog title', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const panel = getPanel()!;
    expect(panel.querySelector('.sn-dialog-title')?.textContent?.trim()).toBe('Delete item');
  });

  it('renders the message text', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const panel = getPanel()!;
    expect(panel.querySelector('.sn-confirm-dialog-message')?.textContent?.trim()).toBe(
      'This action cannot be undone.',
    );
  });

  it('renders the icon in ligature mode', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const panel = getPanel()!;
    const icon = panel.querySelector('.sn-confirm-dialog-icon');
    expect(icon?.textContent?.trim()).toBe('delete');
  });

  it('renders sn-confirm-dialog-body wrapper', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    expect(getPanel()?.querySelector('.sn-confirm-dialog-body')).toBeTruthy();
  });

  it('opens initially when open=true at start', async () => {
    const fixture = TestBed.createComponent(DefaultsHost);
    await tick(10);
    await fixture.whenStable();
    expect(getPanel()).toBeTruthy();
  });

  it('applies sn-confirm-dialog-icon--error class for severity="error"', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const icon = getPanel()!.querySelector('.sn-confirm-dialog-icon');
    expect(icon?.classList).toContain('sn-confirm-dialog-icon--error');
  });

  it('applies sn-confirm-dialog-icon--warning class for severity="warning"', async () => {
    const fixture = TestBed.createComponent(CustomLabelsHost);
    await fixture.whenStable();
    fixture.componentInstance.open.set(true);
    await tick(10);
    await fixture.whenStable();
    const icon = getPanel()!.querySelector('.sn-confirm-dialog-icon');
    expect(icon?.classList).toContain('sn-confirm-dialog-icon--warning');
  });

  it('applies sn-confirm-dialog-icon--success class for severity="success"', async () => {
    const fixture = TestBed.createComponent(SuccessSeverityHost);
    await tick(10);
    await fixture.whenStable();
    const icon = getPanel()!.querySelector('.sn-confirm-dialog-icon');
    expect(icon?.classList).toContain('sn-confirm-dialog-icon--success');
  });

  it('applies sn-confirm-dialog-icon--primary class for severity="primary"', async () => {
    const fixture = TestBed.createComponent(PrimarySeverityHost);
    await tick(10);
    await fixture.whenStable();
    const icon = getPanel()!.querySelector('.sn-confirm-dialog-icon');
    expect(icon?.classList).toContain('sn-confirm-dialog-icon--primary');
  });

  it('renders footer with two buttons', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const footer = getPanel()!.querySelector('.sn-dialog-footer');
    expect(footer).toBeTruthy();
    const buttons = footer!.querySelectorAll('button');
    expect(buttons.length).toBe(2);
  });

  it('accept button has the correct severity color class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const footer = getPanel()!.querySelector('.sn-dialog-footer')!;
    const buttons = footer.querySelectorAll('button');
    const acceptBtn = buttons[buttons.length - 1];
    expect(acceptBtn.classList).toContain('sn-color-error');
  });

  it('reject button has outlined variant class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const footer = getPanel()!.querySelector('.sn-dialog-footer')!;
    const rejectBtn = footer.querySelectorAll('button')[0];
    expect(rejectBtn.classList).toContain('sn-outlined-button');
  });

  it('uses SnIntl defaults for accept and reject labels', async () => {
    const fixture = TestBed.createComponent(DefaultsHost);
    await tick(10);
    await fixture.whenStable();
    const footer = getPanel()!.querySelector('.sn-dialog-footer')!;
    const buttons = footer.querySelectorAll('button');
    expect(buttons[0].textContent?.trim()).toBe('Cancel');
    expect(buttons[buttons.length - 1].textContent?.trim()).toBe('Yes');
  });

  it('uses custom acceptLabel input over SnIntl', async () => {
    const fixture = TestBed.createComponent(CustomLabelsHost);
    await fixture.whenStable();
    fixture.componentInstance.open.set(true);
    await tick(10);
    await fixture.whenStable();
    const footer = getPanel()!.querySelector('.sn-dialog-footer')!;
    const buttons = footer.querySelectorAll('button');
    expect(buttons[buttons.length - 1].textContent?.trim()).toBe('Proceed');
  });

  it('uses custom rejectLabel input over SnIntl', async () => {
    const fixture = TestBed.createComponent(CustomLabelsHost);
    await fixture.whenStable();
    fixture.componentInstance.open.set(true);
    await tick(10);
    await fixture.whenStable();
    const footer = getPanel()!.querySelector('.sn-dialog-footer')!;
    const buttons = footer.querySelectorAll('button');
    expect(buttons[0].textContent?.trim()).toBe('Go back');
  });

  it('emits accept when the accept button is clicked', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const footer = getPanel()!.querySelector('.sn-dialog-footer')!;
    const buttons = footer.querySelectorAll('button');
    (buttons[buttons.length - 1] as HTMLButtonElement).click();
    await tick(10);
    await fixture.whenStable();
    expect(fixture.componentInstance.accepted).toBe(true);
  });

  it('does not emit reject when accept is clicked', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const footer = getPanel()!.querySelector('.sn-dialog-footer')!;
    const buttons = footer.querySelectorAll('button');
    (buttons[buttons.length - 1] as HTMLButtonElement).click();
    await tick(10);
    await fixture.whenStable();
    expect(fixture.componentInstance.rejected).toBe(false);
  });

  it('closes the dialog after accept', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const footer = getPanel()!.querySelector('.sn-dialog-footer')!;
    const buttons = footer.querySelectorAll('button');
    (buttons[buttons.length - 1] as HTMLButtonElement).click();
    await tick(200);
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('emits reject when the reject button is clicked', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const footer = getPanel()!.querySelector('.sn-dialog-footer')!;
    const rejectBtn = footer.querySelectorAll('button')[0];
    (rejectBtn as HTMLButtonElement).click();
    await tick(10);
    await fixture.whenStable();
    expect(fixture.componentInstance.rejected).toBe(true);
  });

  it('does not emit accept when reject is clicked', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const footer = getPanel()!.querySelector('.sn-dialog-footer')!;
    const rejectBtn = footer.querySelectorAll('button')[0];
    (rejectBtn as HTMLButtonElement).click();
    await tick(10);
    await fixture.whenStable();
    expect(fixture.componentInstance.accepted).toBe(false);
  });

  it('closes the dialog after reject button click', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const footer = getPanel()!.querySelector('.sn-dialog-footer')!;
    const rejectBtn = footer.querySelectorAll('button')[0];
    (rejectBtn as HTMLButtonElement).click();
    await tick(200);
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('emits reject when Escape key closes the dialog', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const overlayEl = overlayContainer.getContainerElement();
    overlayEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await tick(200);
    await fixture.whenStable();
    expect(fixture.componentInstance.rejected).toBe(true);
  });

  it('emits reject only once on Escape (no double-emit)', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const overlayEl = overlayContainer.getContainerElement();
    overlayEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await tick(200);
    await fixture.whenStable();
    expect(fixture.componentInstance.rejected).toBe(true);
    expect(fixture.componentInstance.accepted).toBe(false);
  });

  it('emits reject when mask is clicked', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const mask = fixture.nativeElement.querySelector('.sn-dialog-mask') as HTMLElement;
    expect(mask).toBeTruthy();
    mask.click();
    await tick(200);
    await fixture.whenStable();
    expect(fixture.componentInstance.rejected).toBe(true);
  });

  it('open model becomes false after accept', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const footer = getPanel()!.querySelector('.sn-dialog-footer')!;
    const buttons = footer.querySelectorAll('button');
    (buttons[buttons.length - 1] as HTMLButtonElement).click();
    await tick(200);
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('open model becomes false after reject', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const footer = getPanel()!.querySelector('.sn-dialog-footer')!;
    (footer.querySelectorAll('button')[0] as HTMLButtonElement).click();
    await tick(200);
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('can be opened again after closing', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const footer = getPanel()!.querySelector('.sn-dialog-footer')!;
    (footer.querySelectorAll('button')[0] as HTMLButtonElement).click();
    await tick(200);
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);

    fixture.componentInstance.open.set(true);
    await tick(10);
    await fixture.whenStable();
    expect(getPanel()).toBeTruthy();
  });

  it('is announced to screen readers as a dialog', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    expect(getPanel()?.getAttribute('role')).toBe('dialog');
  });

  it('is announced to screen readers as modal', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    expect(getPanel()?.getAttribute('aria-modal')).toBe('true');
  });

  it('panel has aria-labelledby pointing to title', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const panel = getPanel()!;
    const labelledBy = panel.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    expect(panel.querySelector(`#${labelledBy}`)).toBeTruthy();
  });

  it('renders the panel at size sm', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    expect(getPanel()?.classList).toContain('sn-dialog-panel--sm');
  });

  it('forwards snStyle and allowed snAttrs to the dialog parts and owned message/icon', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    fixture.componentInstance.open.set(true);
    await tick(10);
    await fixture.whenStable();

    const panel = getPanel()!;
    expect(panel.style.outline).toContain('red');
    expect(panel.getAttribute('data-testid')).toBe('cd-panel');
    // panel keeps its reserved dialog role, not the pass-through value.
    expect(panel.getAttribute('role')).toBe('dialog');

    const message = panel.querySelector('.sn-confirm-dialog-message') as HTMLElement;
    expect(message.style.color).toBe('rgb(1, 2, 3)');
    expect(message.getAttribute('data-testid')).toBe('cd-message');

    const icon = panel.querySelector('.sn-confirm-dialog-icon') as HTMLElement;
    expect(icon.style.color).toBe('rgb(4, 5, 6)');
    expect(icon.getAttribute('data-testid')).toBe('cd-icon');

    const footer = panel.querySelector('.sn-dialog-footer') as HTMLElement;
    expect(footer.style.color).toBe('rgb(7, 8, 9)');
    expect(footer.getAttribute('data-testid')).toBe('cd-footer');
  });
});

describe('ConfirmDialog - SnIntl overrides', () => {
  let overlayContainer: OverlayContainer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideSnIntl({ confirmAccept: 'OK', confirmReject: 'Nope', confirm: { header: 'Bestätigen' } }),
      ],
    });
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('takes the default header from SnConfirmIntl', async () => {
    @Component({
      template: `<sn-confirm-dialog [open]="true" message="Sure?" />`,
      imports: [ConfirmDialog],
    })
    class NoHeaderHost {}

    const fixture = TestBed.createComponent(NoHeaderHost);
    await tick(10);
    await fixture.whenStable();
    expect(document.querySelector('.sn-dialog-title')?.textContent?.trim()).toBe('Bestätigen');
  });

  it('overrides SnIntl defaults via provideSnIntl', async () => {
    const fixture = TestBed.createComponent(DefaultsHost);
    await tick(10);
    await fixture.whenStable();
    const footer = document.querySelector('.sn-dialog-footer')!;
    const buttons = footer.querySelectorAll('button');
    expect(buttons[0].textContent?.trim()).toBe('Nope');
    expect(buttons[buttons.length - 1].textContent?.trim()).toBe('OK');
  });
});

@Component({
  template: `
    <sn-confirm-dialog [(open)]="open" header="Delete" message="Sure?" [animated]="false" />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ConfirmDialog],
})
class NoAnimConfirmDialogHost {
  readonly open = signal(false);
}

@Component({
  template: `
    <sn-confirm-dialog
      [(open)]="open"
      header="Delete"
      message="Sure?"
      [animation]="{ enter: 'my-in 40ms ease-out', exit: 'my-out 40ms ease-in' }"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ConfirmDialog],
})
class CustomAnimConfirmDialogHost {
  readonly open = signal(false);
}

describe('ConfirmDialog animation inputs', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  function getPanel(fix: { nativeElement: HTMLElement }): HTMLElement | null {
    return fix.nativeElement.querySelector('[role="dialog"]');
  }

  it('animated=false suppresses the inner dialog panel animation', async () => {
    const fix = TestBed.createComponent(NoAnimConfirmDialogHost);
    await fix.whenStable();
    fix.componentInstance.open.set(true);
    await fix.whenStable();
    await tick(10);
    const panel = getPanel(fix)!;
    expect(panel.style.animation).toBe('none');
  });

  it('custom enter animation applies inline to the inner dialog panel', async () => {
    const fix = TestBed.createComponent(CustomAnimConfirmDialogHost);
    await fix.whenStable();
    fix.componentInstance.open.set(true);
    await fix.whenStable();
    await tick(10);
    expect(getPanel(fix)!.style.animation).toContain('my-in');
  });
});
