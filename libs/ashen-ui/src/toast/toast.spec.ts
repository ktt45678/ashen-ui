import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { vi } from 'vitest';
import { Toast } from './toast';
import { ToastService } from './toast.service';
import { fakeRunningAnimations } from '../core/fake-animations.spec-helper';

const tick = (ms = 0) => new Promise<void>((r) => setTimeout(r, ms));

@Component({
  template: `<sn-toast />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Toast],
})
class BasicHost {}

@Component({
  template: `<sn-toast position="bottom-left" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Toast],
})
class BottomLeftHost {}

@Component({
  template: `<sn-toast position="top-left" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Toast],
})
class TopLeftHost {}

@Component({
  template: `<sn-toast position="bottom-right" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Toast],
})
class BottomRightHost {}

@Component({
  template: `
    <sn-toast
      [snStyle]="{
        root: { outline: '1px solid red' },
        item: { outline: '1px solid blue' },
        icon: { color: 'rgb(1, 2, 3)' },
        content: { color: 'rgb(4, 5, 6)' },
        summary: { color: 'rgb(7, 8, 9)' },
        detail: { color: 'rgb(10, 11, 12)' },
        closeButton: { color: 'rgb(13, 14, 15)' }
      }"
      [snAttrs]="{
        root: { 'data-testid': 'toast-root', 'aria-live': 'assertive' },
        item: { 'data-testid': 'toast-item', role: 'presentation' },
        icon: { 'data-testid': 'toast-icon' },
        content: { 'data-testid': 'toast-content' },
        summary: { 'data-testid': 'toast-summary' },
        detail: { 'data-testid': 'toast-detail' },
        closeButton: { 'data-testid': 'toast-close', 'aria-label': 'invalid label' }
      }"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Toast],
})
class SnPartToastHost {}

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(ToastService);
  });

  it('starts with an empty items signal', () => {
    expect(service.items()).toEqual([]);
  });

  it('show() adds a toast to the signal', () => {
    service.show({ summary: 'Hello' });
    expect(service.items().length).toBe(1);
    expect(service.items()[0].summary).toBe('Hello');
  });

  it('show() returns a unique id', () => {
    const id1 = service.show({ summary: 'First' });
    const id2 = service.show({ summary: 'Second' });
    expect(id1).toBeTruthy();
    expect(id2).toBeTruthy();
    expect(id1).not.toBe(id2);
  });

  it('show() defaults severity to info', () => {
    service.show({ summary: 'Test' });
    expect(service.items()[0].severity).toBe('info');
  });

  it('show() defaults life to 3000', () => {
    service.show({ summary: 'Test' });
    expect(service.items()[0].life).toBe(3000);
  });

  it('show() defaults closable to true', () => {
    service.show({ summary: 'Test' });
    expect(service.items()[0].closable).toBe(true);
  });

  it('show() defaults sticky to false', () => {
    service.show({ summary: 'Test' });
    expect(service.items()[0].sticky).toBe(false);
  });

  it('show() stores detail when provided', () => {
    service.show({ summary: 'S', detail: 'D' });
    expect(service.items()[0].detail).toBe('D');
  });

  it('show() stores undefined detail when omitted', () => {
    service.show({ summary: 'S' });
    expect(service.items()[0].detail).toBeUndefined();
  });

  it('multiple show() calls stack toasts', () => {
    service.show({ summary: 'A' });
    service.show({ summary: 'B' });
    service.show({ summary: 'C' });
    expect(service.items().length).toBe(3);
  });

  it('info() shortcut sets severity to info', () => {
    service.info('Info message');
    expect(service.items()[0].severity).toBe('info');
    expect(service.items()[0].summary).toBe('Info message');
  });

  it('success() shortcut sets severity to success', () => {
    service.success('Saved!');
    expect(service.items()[0].severity).toBe('success');
  });

  it('warn() shortcut sets severity to warning', () => {
    service.warn('Watch out');
    expect(service.items()[0].severity).toBe('warning');
  });

  it('error() shortcut sets severity to error', () => {
    service.error('Failed!');
    expect(service.items()[0].severity).toBe('error');
  });

  it('dismiss() with id sets that item state to hiding', () => {
    service._attachOutlet(() => () => undefined);
    const id = service.show({ summary: 'S' });
    service.dismiss(id);
    expect(service.items()[0].state).toBe('hiding');
  });

  it('dismiss() without id marks all items as hiding', () => {
    service._attachOutlet(() => () => undefined);
    service.show({ summary: 'A' });
    service.show({ summary: 'B' });
    service.dismiss();
    expect(service.items().length).toBe(2);
    expect(service.items().every((i) => i.state === 'hiding')).toBe(true);
  });

  it('dismiss() removes the items once the outlet reports the exit finished', () => {
    let finishExit!: () => void;
    let waitedFor: readonly string[] = [];
    service._attachOutlet((ids, done) => {
      waitedFor = ids;
      finishExit = done;
      return () => undefined;
    });
    const a = service.show({ summary: 'A' });
    const b = service.show({ summary: 'B' });
    service.dismiss();
    expect(waitedFor).toEqual([a, b]);
    expect(service.items().length).toBe(2);

    finishExit();
    expect(service.items().length).toBe(0);
  });

  it('_remove() removes the item from the signal', () => {
    const id = service.show({ summary: 'S' });
    service._remove(id);
    expect(service.items().length).toBe(0);
  });

  it('dismiss() on unknown id does not throw', () => {
    service.show({ summary: 'S' });
    expect(() => service.dismiss('no-such-id')).not.toThrow();
    // The existing toast should still be there (not hidden)
    expect(service.items()[0].state).not.toBe('hiding');
  });

  it('stacks identical toasts by default', () => {
    service.show({ summary: 'Save failed' });
    service.show({ summary: 'Save failed' });
    expect(service.items().length).toBe(2);
  });

  it('drops a toast identical to one on screen and returns the first id', () => {
    const first = service.show({ summary: 'Save failed', preventDuplicates: true });
    const second = service.show({ summary: 'Save failed', preventDuplicates: true });

    expect(service.items().length).toBe(1);
    expect(second).toBe(first);
  });

  it('treats severity, summary and detail together as the identity', () => {
    service.show({ summary: 'Save failed', detail: 'attempt 1', preventDuplicates: true });
    service.show({ summary: 'Save failed', detail: 'attempt 2', preventDuplicates: true });
    service.show({ summary: 'Save failed', severity: 'error', preventDuplicates: true });

    expect(service.items().length).toBe(3);
  });

  it('an explicit key collapses toasts whose text differs', () => {
    service.show({ summary: 'Save failed', detail: 'attempt 1', key: 'save', preventDuplicates: true });
    service.show({ summary: 'Save failed', detail: 'attempt 2', key: 'save', preventDuplicates: true });

    expect(service.items().length).toBe(1);
    expect(service.items()[0].detail).toBe('attempt 1');
  });

  it('lets a toast through once the matching one is on its way out', async () => {
    service.show({ summary: 'Save failed', preventDuplicates: true });
    service.dismiss();

    service.show({ summary: 'Save failed', preventDuplicates: true });

    expect(service.items().filter((i) => i.state !== 'hiding').length).toBe(1);
  });

  it('suppresses per call, leaving other toasts alone', () => {
    service.show({ summary: 'Save failed', preventDuplicates: true });
    service.show({ summary: 'Save failed', preventDuplicates: true });
    service.show({ summary: 'Loaded' });

    expect(service.items().length).toBe(2);
  });
});

describe('Toast outlet component', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(ToastService);
  });

  it('renders sn-toast host element', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toast');
    expect(el).toBeTruthy();
  });

  it('has sn-toast class on host', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toast');
    expect(el.classList).toContain('sn-toast');
  });

  it('has aria-live="polite" on the host', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toast');
    expect(el.getAttribute('aria-live')).toBe('polite');
  });

  it('has aria-atomic="false" on the host', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toast');
    expect(el.getAttribute('aria-atomic')).toBe('false');
  });

  it('renders no items when service has no toasts', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const items = fixture.nativeElement.querySelectorAll('.sn-toast-item');
    expect(items.length).toBe(0);
  });

  it('renders a toast item when service.show() is called', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    service.show({ summary: 'Hello' });
    await fixture.whenStable();
    const items = fixture.nativeElement.querySelectorAll('.sn-toast-item');
    expect(items.length).toBe(1);
  });

  it('renders the summary text', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    service.show({ summary: 'Grid saved' });
    await fixture.whenStable();
    const summary = fixture.nativeElement.querySelector('.sn-toast-summary');
    expect(summary?.textContent?.trim()).toBe('Grid saved');
  });

  it('renders detail text when provided', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    service.show({ summary: 'Done', detail: 'All files processed' });
    await fixture.whenStable();
    const detail = fixture.nativeElement.querySelector('.sn-toast-detail');
    expect(detail?.textContent?.trim()).toBe('All files processed');
  });

  it('does not render detail element when not provided', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    service.show({ summary: 'No detail' });
    await fixture.whenStable();
    const detail = fixture.nativeElement.querySelector('.sn-toast-detail');
    expect(detail).toBeNull();
  });

  it('applies severity class sn-toast-item--info for info', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    service.info('Info message');
    await fixture.whenStable();
    const item = fixture.nativeElement.querySelector('.sn-toast-item');
    expect(item.classList).toContain('sn-toast-item--info');
  });

  it('applies severity class sn-toast-item--success for success', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    service.success('Saved!');
    await fixture.whenStable();
    const item = fixture.nativeElement.querySelector('.sn-toast-item');
    expect(item.classList).toContain('sn-toast-item--success');
  });

  it('applies severity class sn-toast-item--warning for warning', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    service.warn('Watch out');
    await fixture.whenStable();
    const item = fixture.nativeElement.querySelector('.sn-toast-item');
    expect(item.classList).toContain('sn-toast-item--warning');
  });

  it('applies severity class sn-toast-item--error for error', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    service.error('Failed');
    await fixture.whenStable();
    const item = fixture.nativeElement.querySelector('.sn-toast-item');
    expect(item.classList).toContain('sn-toast-item--error');
  });

  it('has role="status" for info toast', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    service.info('Info');
    await fixture.whenStable();
    const item = fixture.nativeElement.querySelector('.sn-toast-item');
    expect(item.getAttribute('role')).toBe('status');
  });

  it('has role="status" for success toast', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    service.success('OK');
    await fixture.whenStable();
    const item = fixture.nativeElement.querySelector('.sn-toast-item');
    expect(item.getAttribute('role')).toBe('status');
  });

  it('has role="alert" for warning toast', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    service.warn('Watch out');
    await fixture.whenStable();
    const item = fixture.nativeElement.querySelector('.sn-toast-item');
    expect(item.getAttribute('role')).toBe('alert');
  });

  it('has role="alert" for error toast', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    service.error('Error!');
    await fixture.whenStable();
    const item = fixture.nativeElement.querySelector('.sn-toast-item');
    expect(item.getAttribute('role')).toBe('alert');
  });

  it('renders the severity icon as ligature text for info', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    service.info('Info');
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('.sn-toast-icon');
    expect(icon?.textContent?.trim()).toBe('info');
  });

  it('renders check_circle icon for success', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    service.success('Done');
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('.sn-toast-icon');
    expect(icon?.textContent?.trim()).toBe('check_circle');
  });

  it('renders warning icon for warning', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    service.warn('Warning');
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('.sn-toast-icon');
    expect(icon?.textContent?.trim()).toBe('warning');
  });

  it('renders error icon for error', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    service.error('Error');
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('.sn-toast-icon');
    expect(icon?.textContent?.trim()).toBe('error');
  });

  it('renders close button when closable (default)', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    service.show({ summary: 'Closable' });
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('.sn-toast-close');
    expect(btn).toBeTruthy();
  });

  it('does not render close button when closable is false', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    service.show({ summary: 'No close', closable: false });
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('.sn-toast-close');
    expect(btn).toBeNull();
  });

  it('close button has aria-label from intl.toastClose', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    service.show({ summary: 'Closable' });
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('.sn-toast-close');
    expect(btn.getAttribute('aria-label')).toBe('Close notification');
  });

  it('close button has type="button"', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    service.show({ summary: 'Closable' });
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-toast-close');
    expect(btn.getAttribute('type')).toBe('button');
  });

  it('clicking close button sets state to hiding', async () => {
    onTestFinished(fakeRunningAnimations(150));
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    service.show({ summary: 'Closable' });
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-toast-close');
    btn.click();
    await fixture.whenStable();
    expect(service.items()[0].state).toBe('hiding');
  });

  it('clicking close button removes item after exit duration', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    service.show({ summary: 'Closable', sticky: true });
    await fixture.whenStable();
    expect(service.items().length).toBe(1);
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-toast-close');
    btn.click();
    await fixture.whenStable();
    await tick(200);
    await fixture.whenStable();
    expect(service.items().length).toBe(0);
  });

  it('renders multiple stacked toasts', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    service.show({ summary: 'A' });
    service.show({ summary: 'B' });
    service.show({ summary: 'C' });
    await fixture.whenStable();
    const items = fixture.nativeElement.querySelectorAll('.sn-toast-item');
    expect(items.length).toBe(3);
  });

  it('auto-dismisses after life ms (non-sticky)', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    service.show({ summary: 'Auto', life: 50, sticky: false });
    await fixture.whenStable();
    await tick(300);
    await fixture.whenStable();
    expect(service.items().length).toBe(0);
  });

  it('sticky toast does not auto-dismiss', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    service.show({ summary: 'Sticky', life: 50, sticky: true });
    await fixture.whenStable();
    await tick(300);
    await fixture.whenStable();
    // Sticky toast should still be present
    expect(service.items().length).toBe(1);
  });

  it('does not consume toast lifetime while hovered', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    vi.useFakeTimers();
    try {
      service.show({ summary: 'Paused', life: 1000 });
      fixture.detectChanges();
      const item = fixture.nativeElement.querySelector('.sn-toast-item') as HTMLElement;

      vi.advanceTimersByTime(400);
      item.dispatchEvent(new MouseEvent('mouseenter'));
      vi.advanceTimersByTime(2000);
      expect(service.items()[0].state).not.toBe('hiding');

      item.dispatchEvent(new MouseEvent('mouseleave'));
      vi.advanceTimersByTime(599);
      expect(service.items()[0].state).not.toBe('hiding');

      vi.advanceTimersByTime(1);
      expect(service.items()[0].state).toBe('hiding');
    } finally {
      vi.useRealTimers();
    }
  });

  it('preserves remaining lifetime across repeated hover pauses', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    vi.useFakeTimers();
    try {
      service.show({ summary: 'Paused twice', life: 1000 });
      fixture.detectChanges();
      const item = fixture.nativeElement.querySelector('.sn-toast-item') as HTMLElement;

      vi.advanceTimersByTime(200);
      item.dispatchEvent(new MouseEvent('mouseenter'));
      vi.advanceTimersByTime(500);
      item.dispatchEvent(new MouseEvent('mouseleave'));
      vi.advanceTimersByTime(300);
      item.dispatchEvent(new MouseEvent('mouseenter'));
      vi.advanceTimersByTime(500);
      item.dispatchEvent(new MouseEvent('mouseleave'));

      vi.advanceTimersByTime(499);
      expect(service.items()[0].state).not.toBe('hiding');
      vi.advanceTimersByTime(1);
      expect(service.items()[0].state).toBe('hiding');
    } finally {
      vi.useRealTimers();
    }
  });

  it('applies sn-toast--top-right class (default)', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toast');
    expect(el.classList).toContain('sn-toast--top-right');
  });

  it('applies sn-toast--bottom-left class when position is bottom-left', async () => {
    const fixture = TestBed.createComponent(BottomLeftHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toast');
    expect(el.classList).toContain('sn-toast--bottom-left');
  });

  it('applies sn-toast--top-left class when position is top-left', async () => {
    const fixture = TestBed.createComponent(TopLeftHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toast');
    expect(el.classList).toContain('sn-toast--top-left');
  });

  it('applies sn-toast--bottom-right class when position is bottom-right', async () => {
    const fixture = TestBed.createComponent(BottomRightHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-toast');
    expect(el.classList).toContain('sn-toast--bottom-right');
  });

  it('dismiss(id) via service sets that item to hiding state in the DOM', async () => {
    onTestFinished(fakeRunningAnimations(150));
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const id = service.show({ summary: 'Dismiss me', sticky: true });
    await fixture.whenStable();
    service.dismiss(id);
    await fixture.whenStable();
    const item = fixture.nativeElement.querySelector('.sn-toast-item--hiding');
    expect(item).toBeTruthy();
  });

  it('sn-toast-content exists inside each toast item', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    service.show({ summary: 'S' });
    await fixture.whenStable();
    const content = fixture.nativeElement.querySelector('.sn-toast-content');
    expect(content).toBeTruthy();
  });

  it('applies snStyle and allowed snAttrs to the host and each toast section, keeping live-region, role and close-button semantics', async () => {
    const fixture = TestBed.createComponent(SnPartToastHost);
    await fixture.whenStable();
    service.show({ severity: 'error', summary: 'Boom', detail: 'It broke' });
    await fixture.whenStable();

    const host: HTMLElement = fixture.nativeElement.querySelector('sn-toast');
    const item: HTMLElement = fixture.nativeElement.querySelector('.sn-toast-item');
    const icon: HTMLElement = fixture.nativeElement.querySelector('.sn-toast-icon');
    const content: HTMLElement = fixture.nativeElement.querySelector('.sn-toast-content');
    const summary: HTMLElement = fixture.nativeElement.querySelector('.sn-toast-summary');
    const detail: HTMLElement = fixture.nativeElement.querySelector('.sn-toast-detail');
    const close: HTMLElement = fixture.nativeElement.querySelector('.sn-toast-close');

    expect(host.style.outline).toContain('red');
    expect(host.getAttribute('data-testid')).toBe('toast-root');
    // The live region keeps aria-live="polite", not the pass-through's value.
    expect(host.getAttribute('aria-live')).toBe('polite');

    expect(item.style.outline).toContain('blue');
    expect(item.getAttribute('data-testid')).toBe('toast-item');
    // error severity keeps its alert role.
    expect(item.getAttribute('role')).toBe('alert');

    expect(icon.style.color).toBe('rgb(1, 2, 3)');
    expect(icon.getAttribute('data-testid')).toBe('toast-icon');
    expect(content.style.color).toBe('rgb(4, 5, 6)');
    expect(content.getAttribute('data-testid')).toBe('toast-content');
    expect(summary.style.color).toBe('rgb(7, 8, 9)');
    expect(summary.getAttribute('data-testid')).toBe('toast-summary');
    expect(detail.style.color).toBe('rgb(10, 11, 12)');
    expect(detail.getAttribute('data-testid')).toBe('toast-detail');
    expect(close.style.color).toBe('rgb(13, 14, 15)');
    expect(close.getAttribute('data-testid')).toBe('toast-close');
    expect(close.getAttribute('type')).toBe('button');
    expect(close.getAttribute('aria-label')).not.toBe('invalid label');
  });
});

@Component({
  template: `<sn-toast [animated]="false" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Toast],
})
class NoAnimToastHost {}

@Component({
  template: `<sn-toast [animation]="{ enter: 'my-in 20ms ease-out', exit: 'my-out 40ms ease-in' }" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Toast],
})
class CustomAnimToastHost {}

describe('Toast animation inputs', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(ToastService);
  });

  it('animated=false removes dismissed toast from DOM immediately', async () => {
    const fix = TestBed.createComponent(NoAnimToastHost);
    await fix.whenStable();
    const id = service.show({ summary: 'Gone', sticky: true });
    await fix.whenStable();
    expect(fix.nativeElement.querySelector('.sn-toast-item')).toBeTruthy();
    const item = fix.nativeElement.querySelector('.sn-toast-item') as HTMLElement;
    expect(item.style.animation).toBe('none');
    service.dismiss(id);
    await fix.whenStable();
    await tick(10);
    await fix.whenStable();
    expect(fix.nativeElement.querySelector('.sn-toast-item')).toBeNull();
  });

  it('auto-dismisses with animated=false', async () => {
    const fix = TestBed.createComponent(NoAnimToastHost);
    await fix.whenStable();
    service.show({ summary: 'No animation', life: 30 });
    await fix.whenStable();
    await tick(80);
    await fix.whenStable();
    expect(service.items()).toHaveLength(0);
  });

  it('auto-dismisses when reduced motion disables animations', async () => {
    const matchMedia = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query.includes('reduce'),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as never;
    try {
      const fix = TestBed.createComponent(BasicHost);
      await fix.whenStable();
      service.show({ summary: 'Reduced motion', life: 30 });
      await fix.whenStable();
      await tick(80);
      await fix.whenStable();
      expect(service.items()).toHaveLength(0);
    } finally {
      window.matchMedia = matchMedia;
    }
  });

  it('auto-dismisses with a custom enter animation name', async () => {
    const fix = TestBed.createComponent(CustomAnimToastHost);
    await fix.whenStable();
    service.show({ summary: 'Custom enter', life: 30 });
    await fix.whenStable();
    await tick(100);
    await fix.whenStable();
    expect(service.items()).toHaveLength(0);
  });

  it('custom exit animation drives the removal timer (~40ms)', async () => {
    onTestFinished(fakeRunningAnimations(40));
    const fix = TestBed.createComponent(CustomAnimToastHost);
    await fix.whenStable();
    const id = service.show({ summary: 'Fading', sticky: true });
    await fix.whenStable();
    service.dismiss(id);
    await fix.whenStable();
    // Still present during animation
    expect(fix.nativeElement.querySelector('.sn-toast-item--hiding')).toBeTruthy();
    const hidingItem = fix.nativeElement.querySelector('.sn-toast-item--hiding') as HTMLElement;
    expect(hidingItem.style.animation).toContain('my-out');
    // Should be removed well before default 150ms
    await tick(80);
    await fix.whenStable();
    expect(fix.nativeElement.querySelector('.sn-toast-item')).toBeNull();
  });

  it('keeps a dismissed toast until its exit animation finishes', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    const id = service.show({ summary: 'Slow', sticky: true });
    await fix.whenStable();
    let finishAnimation!: () => void;
    const animation = {
      finished: new Promise<void>((resolve) => (finishAnimation = resolve)),
      currentTime: 0,
      effect: { getComputedTiming: () => ({ endTime: 10_000 }) },
    } as unknown as Animation;
    const item = fix.nativeElement.querySelector('.sn-toast-item') as HTMLElement;
    item.getAnimations = () => [animation];

    service.dismiss(id);
    await fix.whenStable();
    await tick(20);
    expect(service.items().length).toBe(1);

    finishAnimation();
    await tick();
    expect(service.items().length).toBe(0);
  });

  it('removes dismissed toasts at once when no outlet is rendered', () => {
    const id = service.show({ summary: 'Headless', sticky: true });
    service.dismiss(id);
    expect(service.items().length).toBe(0);
  });

  it('drops hiding toasts when the outlet is destroyed mid-exit', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    const id = service.show({ summary: 'Gone', sticky: true });
    await fix.whenStable();
    service.dismiss(id);
    fix.destroy();
    expect(service.items().length).toBe(0);
  });
});
