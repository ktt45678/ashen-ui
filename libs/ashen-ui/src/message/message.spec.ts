import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Message } from './message';

@Component({
  template: `<sn-message>Info text</sn-message>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Message],
})
class DefaultHost {}

@Component({
  template: `<sn-message severity="success">Saved</sn-message>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Message],
})
class SuccessHost {}

@Component({
  template: `<sn-message severity="warning">Warning text</sn-message>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Message],
})
class WarningHost {}

@Component({
  template: `<sn-message severity="error">Error text</sn-message>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Message],
})
class ErrorHost {}

@Component({
  template: `<sn-message [closable]="true" (closed)="onClosed()">Closable message</sn-message>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Message],
})
class ClosableHost {
  closedCalled = false;
  onClosed(): void {
    this.closedCalled = true;
  }
}

@Component({
  template: `<sn-message icon="star">Custom icon</sn-message>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Message],
})
class CustomIconHost {}

@Component({
  template: `<sn-message severity="error" simple [closable]="true">Simple text</sn-message>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Message],
})
class SimpleHost {}

@Component({
  template: `<sn-message [severity]="severity()">Dynamic severity</sn-message>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Message],
})
class DynamicSeverityHost {
  readonly severity = signal<'info' | 'success' | 'warning' | 'error'>('info');
}

@Component({
  template: `<sn-message [snClass]="'extra-cls'">SnClass test</sn-message>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Message],
})
class SnClassHost {}

@Component({
  template: `<sn-message severity="error" [closable]="true" (closed)="onClosed()">Close then hide</sn-message>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Message],
})
class CloseHideHost {
  closedEmitted = false;
  onClosed(): void {
    this.closedEmitted = true;
  }
}

@Component({
  template: `
    <sn-message
      severity="error"
      [closable]="true"
      [snStyle]="{
        root: { outline: '1px solid red' },
        icon: { color: 'rgb(1, 2, 3)' },
        content: { color: 'rgb(4, 5, 6)' },
        closeButton: { color: 'rgb(7, 8, 9)' }
      }"
      [snAttrs]="{
        root: { 'data-testid': 'msg-root', role: 'presentation' },
        icon: { 'data-testid': 'msg-icon' },
        content: { 'data-testid': 'msg-content' },
        closeButton: { 'data-testid': 'msg-close', 'aria-label': 'invalid label' }
      }"
    >
      Part message
    </sn-message>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Message],
})
class SnPartHost {}

describe('Message', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('applies sn-message host class', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-message');
    expect(el.classList).toContain('sn-message');
  });

  it('defaults severity to info with sn-message--info class', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-message');
    expect(el.classList).toContain('sn-message--info');
  });

  it('applies sn-message--success class for success severity', async () => {
    const fixture = TestBed.createComponent(SuccessHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-message');
    expect(el.classList).toContain('sn-message--success');
  });

  it('applies sn-message--warning class for warning severity', async () => {
    const fixture = TestBed.createComponent(WarningHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-message');
    expect(el.classList).toContain('sn-message--warning');
  });

  it('applies sn-message--error class for error severity', async () => {
    const fixture = TestBed.createComponent(ErrorHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-message');
    expect(el.classList).toContain('sn-message--error');
  });

  it('has role="status" for info severity', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-message');
    expect(el.getAttribute('role')).toBe('status');
  });

  it('has role="status" for success severity', async () => {
    const fixture = TestBed.createComponent(SuccessHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-message');
    expect(el.getAttribute('role')).toBe('status');
  });

  it('has role="alert" for warning severity', async () => {
    const fixture = TestBed.createComponent(WarningHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-message');
    expect(el.getAttribute('role')).toBe('alert');
  });

  it('has role="alert" for error severity', async () => {
    const fixture = TestBed.createComponent(ErrorHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-message');
    expect(el.getAttribute('role')).toBe('alert');
  });

  it('renders the icon element', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('.sn-message-icon');
    expect(icon).toBeTruthy();
  });

  it('renders the content element', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const content = fixture.nativeElement.querySelector('.sn-message-content');
    expect(content).toBeTruthy();
  });

  it('projects content into sn-message-content', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const content = fixture.nativeElement.querySelector('.sn-message-content');
    expect(content.textContent?.trim()).toBe('Info text');
  });

  it('does not render close button when closable is false', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('.sn-message-close');
    expect(btn).toBeNull();
  });

  it('renders close button when closable is true', async () => {
    const fixture = TestBed.createComponent(ClosableHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('.sn-message-close');
    expect(btn).toBeTruthy();
  });

  it('close button has aria-label from SnIntl.messageClose', async () => {
    const fixture = TestBed.createComponent(ClosableHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('.sn-message-close');
    expect(btn.getAttribute('aria-label')).toBe('Close message');
  });

  it('emits closed event when close button is clicked', async () => {
    const fixture = TestBed.createComponent(ClosableHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-message-close');
    btn.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.closedCalled).toBe(true);
  });

  it('hides content after close button is clicked', async () => {
    const fixture = TestBed.createComponent(CloseHideHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-message');
    expect(el.classList).not.toContain('sn-message--hidden');
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-message-close');
    btn.click();
    await fixture.whenStable();
    expect(el.classList).toContain('sn-message--hidden');
  });

  it('emits closed when close is clicked', async () => {
    const fixture = TestBed.createComponent(CloseHideHost);
    await fixture.whenStable();
    fixture.nativeElement.querySelector('.sn-message-close').click();
    await fixture.whenStable();
    expect(fixture.componentInstance.closedEmitted).toBe(true);
  });

  it('uses custom icon input instead of severity default', async () => {
    const fixture = TestBed.createComponent(CustomIconHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('sn-icon');
    expect(icon.textContent?.trim()).toBe('star');
  });

  it('uses severity icon for info by default', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('sn-icon');
    expect(icon.textContent?.trim()).toBe('info');
  });

  it('uses check_circle icon for success', async () => {
    const fixture = TestBed.createComponent(SuccessHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('sn-icon');
    expect(icon.textContent?.trim()).toBe('check_circle');
  });

  it('uses warning icon for warning severity', async () => {
    const fixture = TestBed.createComponent(WarningHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('sn-icon');
    expect(icon.textContent?.trim()).toBe('warning');
  });

  it('uses error icon for error severity', async () => {
    const fixture = TestBed.createComponent(ErrorHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('sn-icon');
    expect(icon.textContent?.trim()).toBe('error');
  });

  it('updates severity class dynamically', async () => {
    const fixture = TestBed.createComponent(DynamicSeverityHost);
    fixture.componentInstance.severity.set('success');
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-message');
    expect(el.classList).toContain('sn-message--success');
    expect(el.classList).not.toContain('sn-message--info');
  });

  it('applies snClass string to the host', async () => {
    const fixture = TestBed.createComponent(SnClassHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-message');
    expect(el.classList).toContain('extra-cls');
  });

  it('applies sn-message--closable class when closable', async () => {
    const fixture = TestBed.createComponent(ClosableHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-message');
    expect(el.classList).toContain('sn-message--closable');
  });

  it('close button has type="button"', async () => {
    const fixture = TestBed.createComponent(ClosableHost);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-message-close');
    expect(btn.getAttribute('type')).toBe('button');
  });

  it('simple variant applies host class and renders no icon or close button', async () => {
    const fixture = TestBed.createComponent(SimpleHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-message');
    expect(el.classList).toContain('sn-message--simple');
    expect(el.querySelector('.sn-message-icon')).toBeNull();
    expect(el.querySelector('.sn-message-close')).toBeNull();
    expect(el.textContent).toContain('Simple text');
  });

  it('applies snStyle and allowed snAttrs to named parts without replacing message semantics', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const root: HTMLElement = el.querySelector('sn-message')!;
    const icon: HTMLElement = el.querySelector('.sn-message-icon')!;
    const content: HTMLElement = el.querySelector('.sn-message-content')!;
    const close: HTMLElement = el.querySelector('.sn-message-close')!;

    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('msg-root');
    // error severity keeps the alert role, not the pass-through's value.
    expect(root.getAttribute('role')).toBe('alert');
    expect(icon.style.color).toBe('rgb(1, 2, 3)');
    expect(icon.getAttribute('data-testid')).toBe('msg-icon');
    expect(content.style.color).toBe('rgb(4, 5, 6)');
    expect(content.getAttribute('data-testid')).toBe('msg-content');
    expect(close.style.color).toBe('rgb(7, 8, 9)');
    expect(close.getAttribute('data-testid')).toBe('msg-close');
    expect(close.getAttribute('aria-label')).not.toBe('invalid label');
  });
});
