import { ApplicationRef, Component, inject, provideZonelessChangeDetection, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Location } from '@angular/common';
import { provideLocationMocks, SpyLocation } from '@angular/common/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ScrollLock } from 'ashen-ui/core';
import { DialogService } from './dialog.service';
import { SnDialogRef } from './dialog-ref';
import { SN_DIALOG_DATA } from './dialog-config';

const tick = (ms = 0) => new Promise<void>((r) => setTimeout(r, ms));

interface Payload {
  name?: string;
}

@Component({
  selector: 'test-dialog-content',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <p class="content">Hello {{ data?.name }}</p>
    <button class="content-close" type="button" (click)="ref.close('done')">Close</button>
  `,
})
class TestContent {
  readonly ref = inject<SnDialogRef<string>>(SnDialogRef);
  readonly data = inject(SN_DIALOG_DATA) as Payload | null;
}

@Component({ changeDetection: ChangeDetectionStrategy.Eager,
 template: '' })
class Host {}

describe('DialogService', () => {
  let overlayContainer: OverlayContainer;
  let overlayEl: HTMLElement;
  let service: DialogService;
  let fixture: ReturnType<typeof TestBed.createComponent<Host>>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideLocationMocks()],
    });
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayEl = overlayContainer.getContainerElement();
    service = TestBed.inject(DialogService);
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  async function flush() {
    TestBed.inject(ApplicationRef).tick();
    await tick(10);
    await fixture.whenStable();
  }

  function panel(): HTMLElement | null {
    return overlayEl.querySelector('.sn-dialog-panel');
  }

  function escapeOn(el: Element) {
    const event = new KeyboardEvent('keydown', { bubbles: true });
    Object.defineProperty(event, 'keyCode', { get: () => 27 });
    el.dispatchEvent(event);
  }

  it('renders the opened component inside the overlay', async () => {
    service.open<TestContent>(TestContent, { data: { name: 'Ann' }, header: 'Greeting' });
    await flush();

    expect(panel()).toBeTruthy();
    expect(overlayEl.querySelector('.content')?.textContent).toContain('Ann');
    expect(overlayEl.querySelector('.sn-dialog-title')?.textContent).toContain('Greeting');
  });

  it('applies configured classes to the header, title and body', async () => {
    service.open<TestContent>(TestContent, {
      header: 'Greeting',
      headerClass: 'dialog-header-test',
      titleClass: 'dialog-title-test',
      bodyClass: ['dialog-body-test', 'dialog-body-extra'],
    });
    await flush();

    expect(overlayEl.querySelector('.sn-dialog-header')?.classList.contains('dialog-header-test')).toBe(true);
    expect(overlayEl.querySelector('.sn-dialog-title')?.classList.contains('dialog-title-test')).toBe(true);
    const body = overlayEl.querySelector('.sn-dialog-body')!;
    expect(body.classList.contains('sn-dialog-body')).toBe(true);
    expect(body.classList.contains('dialog-body-test')).toBe(true);
    expect(body.classList.contains('dialog-body-extra')).toBe(true);
  });

  it('honors an explicit width without the size preset cap', async () => {
    service.open<TestContent>(TestContent, { width: '1024px' });
    await flush();

    const el = panel()!;
    expect(el.classList.contains('sn-dialog-panel--custom-width')).toBe(true);
    expect(el.style.width).toBe('1024px');
    expect(el.style.maxWidth).toBe('');
  });

  it('applies width and maxWidth independently when both are set', async () => {
    service.open<TestContent>(TestContent, { width: '1024px', maxWidth: '90rem' });
    await flush();

    const el = panel()!;
    expect(el.style.width).toBe('1024px');
    expect(el.style.maxWidth).toBe('90rem');
    expect(el.classList.contains('sn-dialog-panel--custom-width')).toBe(true);
  });

  it('omits the custom-width class and inline sizing when width is not set', async () => {
    service.open<TestContent>(TestContent);
    await flush();

    const el = panel()!;
    expect(el.classList.contains('sn-dialog-panel--custom-width')).toBe(false);
    expect(el.style.width).toBe('');
    expect(el.style.maxWidth).toBe('');
  });

  it('applies height and maxHeight independently', async () => {
    service.open<TestContent>(TestContent, { height: '600px', maxHeight: '80vh' });
    await flush();

    const el = panel()!;
    expect(el.style.height).toBe('600px');
    expect(el.style.maxHeight).toBe('80vh');
  });

  it('marks the container fullscreen when configured', async () => {
    service.open<TestContent>(TestContent, { fullscreen: true });
    await flush();

    const container = overlayEl.querySelector('.sn-dialog-container');
    expect(container?.classList.contains('sn-dialog-container--fullscreen')).toBe(true);
  });

  it('adds the compact class only for density "compact"', async () => {
    service.open<TestContent>(TestContent, { density: 'compact' });
    await flush();

    expect(panel()!.classList.contains('sn-dialog-panel--compact')).toBe(true);
  });

  it('marks the panel untitled only when there is no header text', async () => {
    const first = service.open<TestContent>(TestContent);
    await flush();
    expect(panel()!.classList.contains('sn-dialog-panel--untitled')).toBe(true);
    expect(overlayEl.querySelector('.sn-dialog-close-button')).not.toBeNull();

    first.close();
    await tick(200);
    service.open<TestContent>(TestContent, { header: 'Title' });
    await flush();
    expect(panel()!.classList.contains('sn-dialog-panel--untitled')).toBe(false);
  });

  it('omits fullscreen and compact classes by default', async () => {
    service.open<TestContent>(TestContent);
    await flush();

    const container = overlayEl.querySelector('.sn-dialog-container');
    expect(container?.classList.contains('sn-dialog-container--fullscreen')).toBe(false);
    expect(panel()!.classList.contains('sn-dialog-panel--compact')).toBe(false);
  });

  it('injects SN_DIALOG_DATA and exposes the component instance on the ref', async () => {
    const ref = service.open<TestContent>(TestContent, { data: { name: 'Bea' } });
    await flush();

    expect(ref.componentInstance).toBeInstanceOf(TestContent);
    expect(ref.componentInstance?.data).toEqual({ name: 'Bea' });
  });

  it('afterOpened emits once after first render', async () => {
    const ref = service.open<TestContent>(TestContent);
    let opened = 0;
    ref.afterOpened().subscribe(() => (opened += 1));
    await flush();

    expect(opened).toBe(1);
  });

  it('close(result) resolves afterClosed and removes the dialog', async () => {
    const ref = service.open<TestContent, string>(TestContent);
    await flush();

    let result: string | undefined = 'unset';
    ref.afterClosed().subscribe((r) => (result = r));
    ref.close('accepted');
    await tick(200);

    expect(result).toBe('accepted');
    expect(panel()).toBeNull();
  });

  it('closing from inside the component works (ref injected)', async () => {
    const ref = service.open<TestContent, string>(TestContent);
    await flush();

    let result: string | undefined;
    ref.afterClosed().subscribe((r) => (result = r));
    (overlayEl.querySelector('.content-close') as HTMLElement).click();
    await tick(200);

    expect(result).toBe('done');
    expect(panel()).toBeNull();
  });

  it('backdrop (mask) click closes by default', async () => {
    service.open<TestContent>(TestContent);
    await flush();

    (overlayEl.querySelector('.sn-dialog-mask') as HTMLElement).click();
    await tick(200);

    expect(panel()).toBeNull();
  });

  it('disableClose blocks backdrop click and Escape', async () => {
    service.open<TestContent>(TestContent, { disableClose: true });
    await flush();

    (overlayEl.querySelector('.sn-dialog-mask') as HTMLElement).click();
    escapeOn(panel()!);
    await tick(200);

    expect(panel()).toBeTruthy();
  });

  it('Escape closes by default', async () => {
    service.open<TestContent>(TestContent);
    await flush();

    escapeOn(panel()!);
    await tick(200);

    expect(panel()).toBeNull();
  });

  it('reports the dismiss result when closed without one', async () => {
    const ref = service.open<TestContent, string>(TestContent);
    await flush();

    let saved: string | undefined;
    ref.setDismissResult(() => saved);
    saved = 'created';
    let result: string | undefined;
    ref.afterClosed().subscribe((r) => (result = r));
    escapeOn(panel()!);
    await tick(200);

    expect(result).toBe('created');
  });

  it('applies the close guard to every close reason', async () => {
    const reasons: string[] = [];
    const ref = service.open<TestContent, string>(TestContent, {
      header: 'Guarded',
      canClose: (result, reason) => {
        reasons.push(reason);
        return result === 'cleanup';
      },
    });
    await flush();

    ref.close('value');
    (overlayEl.querySelector('.sn-dialog-close-button') as HTMLElement).click();
    (overlayEl.querySelector('.sn-dialog-mask') as HTMLElement).click();
    escapeOn(panel()!);
    ref.close();
    await tick(20);

    expect(panel()).toBeTruthy();
    expect(reasons).toEqual(['result', 'close-button', 'backdrop', 'escape', 'programmatic']);

    ref.close('cleanup');
    await tick(200);
    expect(panel()).toBeNull();
  });

  it('supports Promise and Observable close guards', async () => {
    let promiseAttempts = 0;
    const promiseRef = service.open<TestContent>(TestContent, {
      canClose: () => Promise.resolve(++promiseAttempts > 1),
    });
    await flush();
    promiseRef.close();
    await tick(20);
    expect(panel()).toBeTruthy();
    promiseRef.close(undefined, 'programmatic');
    await tick(200);
    expect(panel()).toBeNull();

    const observableRef = service.open<TestContent>(TestContent, {
      canClose: () => of(true),
    });
    await flush();
    observableRef.close();
    await tick(200);
    expect(panel()).toBeNull();
  });

  it('finalizes once when navigation disposes an overlay during a pending guard', async () => {
    const scrollLock = TestBed.inject(ScrollLock);
    const unlockSpy = vi.spyOn(scrollLock, 'unlock');
    const ref = service.open<TestContent>(TestContent, {
      canClose: () => new Promise<boolean>(() => {}),
    });
    let closed = 0;
    ref.afterClosed().subscribe(() => (closed += 1));
    await flush();

    ref.close();
    (TestBed.inject(Location) as SpyLocation).simulateUrlPop('/next');
    await tick(20);

    expect(panel()).toBeNull();
    expect(unlockSpy).toHaveBeenCalledTimes(1);
    expect(closed).toBe(1);
  });

  it('closes on a router-style URL change with the navigation reason', async () => {
    const reasons: string[] = [];
    const ref = service.open<TestContent>(TestContent, {
      canClose: (_result, reason) => {
        reasons.push(reason);
        return true;
      },
    });
    await flush();

    TestBed.inject(Location).go('/next');
    await tick(200);

    expect(panel()).toBeNull();
    expect(reasons).toEqual(['navigation']);
    expect(ref.componentInstance).toBeDefined();
  });

  it('stays open on URL changes when closeOnNavigation is false', async () => {
    service.open<TestContent>(TestContent, { closeOnNavigation: false });
    await flush();

    const location = TestBed.inject(Location) as SpyLocation;
    location.go('/next');
    location.simulateUrlPop('/back');
    await tick(200);

    expect(panel()).not.toBeNull();
  });

  it('keeps nested close routing, backdrop isolation, focus restoration, and scroll locking', async () => {
    const scrollLock = TestBed.inject(ScrollLock);
    const lockSpy = vi.spyOn(scrollLock, 'lock');
    const unlockSpy = vi.spyOn(scrollLock, 'unlock');

    const first = service.open<TestContent>(TestContent, { header: 'First' });
    await flush();
    const firstButton = overlayEl.querySelector('.content-close') as HTMLButtonElement;
    firstButton.focus();

    service.open<TestContent>(TestContent, { header: 'Second' });
    await flush();
    const secondButton = overlayEl.querySelectorAll<HTMLButtonElement>('.content-close')[1];
    secondButton.focus();

    service.open<TestContent>(TestContent, { header: 'Third' });
    await flush();

    expect(Array.from(overlayEl.querySelectorAll('.sn-dialog-title')).map((node) => node.textContent?.trim())).toEqual([
      'First',
      'Second',
      'Third',
    ]);
    expect(lockSpy).toHaveBeenCalledTimes(3);

    escapeOn(overlayEl.querySelectorAll('.sn-dialog-panel')[2]);
    await tick(200);
    expect(overlayEl.querySelectorAll('.sn-dialog-panel')).toHaveLength(2);
    expect(document.activeElement).toBe(secondButton);

    const masks = overlayEl.querySelectorAll<HTMLElement>('.sn-dialog-mask');
    masks[masks.length - 1].click();
    await tick(200);
    expect(overlayEl.querySelectorAll('.sn-dialog-panel')).toHaveLength(1);
    expect(document.activeElement).toBe(firstButton);
    expect(unlockSpy).toHaveBeenCalledTimes(2);

    first.close();
    await tick(200);
    expect(overlayEl.querySelectorAll('.sn-dialog-panel')).toHaveLength(0);
    expect(unlockSpy).toHaveBeenCalledTimes(3);
  });

  it('installs a focus trap on open (autoFocus default)', async () => {
    service.open<TestContent>(TestContent);
    await flush();

    // CDK inserts focus-trap anchor elements around the trapped region.
    expect(overlayEl.querySelector('.cdk-focus-trap-anchor')).toBeTruthy();
  });

  it('does not install a focus trap when autoFocus is false', async () => {
    service.open<TestContent>(TestContent, { autoFocus: false });
    await flush();

    expect(overlayEl.querySelector('.cdk-focus-trap-anchor')).toBeNull();
  });

  it('hides the header when there is no header text and closable is false', async () => {
    service.open<TestContent>(TestContent, { closable: false });
    await flush();

    expect(overlayEl.querySelector('.sn-dialog-header')).toBeNull();
  });

  it('confirm() resolves true when accepted', async () => {
    let value: boolean | undefined;
    service.confirm({ message: 'Proceed?' }).subscribe((v) => (value = v));
    await flush();

    const buttons = overlayEl.querySelectorAll('.sn-dialog-confirm-actions button');
    (buttons[1] as HTMLElement).click(); // accept
    await tick(200);

    expect(value).toBe(true);
    expect(panel()).toBeNull();
  });

  it('confirm() resolves false when rejected', async () => {
    let value: boolean | undefined;
    service.confirm({ message: 'Proceed?' }).subscribe((v) => (value = v));
    await flush();

    const buttons = overlayEl.querySelectorAll('.sn-dialog-confirm-actions button');
    (buttons[0] as HTMLElement).click(); // reject
    await tick(200);

    expect(value).toBe(false);
  });

  it('confirm() marks the reject button as the initial focus target', async () => {
    service.confirm({ message: 'Proceed?' }).subscribe();
    await flush();

    const buttons = overlayEl.querySelectorAll('.sn-dialog-confirm-actions button');
    expect(buttons[0].hasAttribute('cdkFocusInitial')).toBe(true);
    expect(buttons[1].hasAttribute('cdkFocusInitial')).toBe(false);
  });

  it('confirm() applies the reject variant and button size', async () => {
    service.confirm({ message: 'Proceed?', rejectVariant: 'text', buttonSize: 'sm' }).subscribe();
    await flush();

    const buttons = overlayEl.querySelectorAll('.sn-dialog-confirm-actions button');
    expect(buttons[0].classList).toContain('sn-text-button');
    expect(buttons[0].classList).toContain('sn-button-sm');
    expect(buttons[1].classList).toContain('sn-button-sm');
  });

  it('confirm() applies an explicit width', async () => {
    service.confirm({ message: 'Proceed?', width: '500px' }).subscribe();
    await flush();

    expect((panel() as HTMLElement).style.width).toBe('500px');
  });

  it('confirm() renders the message as HTML only when html is set', async () => {
    service.confirm({ message: 'Delete <strong>Family</strong>?', html: true }).subscribe();
    await flush();

    expect(overlayEl.querySelector('.sn-confirm-dialog-message strong')?.textContent).toBe('Family');
  });
});
