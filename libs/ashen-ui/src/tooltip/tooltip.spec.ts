import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Tooltip } from './tooltip';
import { fakeRunningAnimations } from '../core/fake-animations.spec-helper';

const tick = (ms = 0) => new Promise<void>((r) => setTimeout(r, ms));

@Component({
  template: `<button [snTooltip]="tip" [snTooltipShowDelay]="0" [snTooltipHideDelay]="0">T</button>`,
  imports: [Tooltip],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'fast-host' },
})
class FastHost {
  tip = 'Hello tooltip';
}

@Component({
  template: `<button aria-describedby="hint" snTooltip="Tip" [snTooltipShowDelay]="0" [snTooltipHideDelay]="0">T</button>`,
  imports: [Tooltip],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'described-host' },
})
class DescribedHost {}

@Component({
  template: `<button [snTooltip]="'Delayed'" [snTooltipShowDelay]="300">Delayed</button>`,
  imports: [Tooltip],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'delayed-host' },
})
class DelayedHost {}

@Component({
  template: `<button [snTooltip]="'Disabled'" [snTooltipDisabled]="true" [snTooltipShowDelay]="0">Disabled</button>`,
  imports: [Tooltip],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'disabled-host' },
})
class DisabledHost {}

@Component({
  template: `<button snTooltip="" [snTooltipShowDelay]="0">Empty</button>`,
  imports: [Tooltip],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'empty-host' },
})
class EmptyHost {}

@Component({
  template: `<button snTooltip="Bottom tip" snTooltipPosition="bottom" [snTooltipShowDelay]="0">B</button>`,
  imports: [Tooltip],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'bottom-host' },
})
class BottomHost {}

@Component({
  template: `
    <ng-template #tpl><b class="rich-tip">Bold</b> and <code>code</code></ng-template>
    <button [snTooltip]="tpl" [snTooltipShowDelay]="0" [snTooltipHideDelay]="0">T</button>
  `,
  imports: [Tooltip],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'template-host' },
})
class TemplateHost {}

describe('Tooltip directive', () => {
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

  function getOverlayEl(): HTMLElement {
    return overlayContainer.getContainerElement();
  }

  function getTooltipEl(): HTMLElement | null {
    return getOverlayEl().querySelector('[role="tooltip"]');
  }

  async function openTooltip(fixture: ComponentFixture<unknown>): Promise<HTMLElement> {
    await fixture.whenStable();
    const btn: HTMLElement = fixture.nativeElement.querySelector('button');
    btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await tick(10);
    await fixture.whenStable();
    return btn;
  }

  it('does not show tooltip initially', async () => {
    TestBed.createComponent(FastHost);
    await tick(10);
    expect(getTooltipEl()).toBeNull();
  });

  it('shows tooltip after mouseenter when showDelay=0', async () => {
    const fixture = TestBed.createComponent(FastHost);
    await openTooltip(fixture);
    expect(getTooltipEl()).toBeTruthy();
  });

  it('renders tooltip text content', async () => {
    const fixture = TestBed.createComponent(FastHost);
    await openTooltip(fixture);
    expect(getTooltipEl()!.textContent?.trim()).toBe('Hello tooltip');
  });

  it('shows tooltip after focus when showDelay=0', async () => {
    const fixture = TestBed.createComponent(FastHost);
    await fixture.whenStable();
    const btn: HTMLElement = fixture.nativeElement.querySelector('button');
    btn.dispatchEvent(new Event('focus', { bubbles: true }));
    await tick(10);
    await fixture.whenStable();
    expect(getTooltipEl()).toBeTruthy();
  });

  it('does not show before showDelay expires', async () => {
    const fixture = TestBed.createComponent(DelayedHost);
    await fixture.whenStable();
    const btn: HTMLElement = fixture.nativeElement.querySelector('button');
    btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await tick(50);
    expect(getTooltipEl()).toBeNull();
  });

  it('shows after showDelay expires', async () => {
    const fixture = TestBed.createComponent(DelayedHost);
    await fixture.whenStable();
    const btn: HTMLElement = fixture.nativeElement.querySelector('button');
    btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await tick(350);
    await fixture.whenStable();
    expect(getTooltipEl()).toBeTruthy();
  });

  it('bubble has role="tooltip"', async () => {
    const fixture = TestBed.createComponent(FastHost);
    await openTooltip(fixture);
    expect(getTooltipEl()?.getAttribute('role')).toBe('tooltip');
  });

  it('adds aria-describedby to trigger when open', async () => {
    const fixture = TestBed.createComponent(FastHost);
    const btn = await openTooltip(fixture);
    expect(btn.getAttribute('aria-describedby')).toBeTruthy();
  });

  it('aria-describedby matches tooltip bubble id', async () => {
    const fixture = TestBed.createComponent(FastHost);
    const btn = await openTooltip(fixture);
    const describedBy = btn.getAttribute('aria-describedby');
    const tip = getTooltipEl();
    expect(tip).toBeTruthy();
    expect(tip!.getAttribute('id')).toBe(describedBy);
  });

  it('removes aria-describedby after hide completes', async () => {
    const fixture = TestBed.createComponent(FastHost);
    const btn = await openTooltip(fixture);
    btn.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    await tick(400);
    await fixture.whenStable();
    expect(btn.getAttribute('aria-describedby')).toBeNull();
  });

  it('keeps an existing aria-describedby while open and restores it on hide', async () => {
    const fixture = TestBed.createComponent(DescribedHost);
    const btn = await openTooltip(fixture);
    const tipId = getTooltipEl()!.getAttribute('id');
    expect(btn.getAttribute('aria-describedby')).toBe(`hint ${tipId}`);

    btn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await fixture.whenStable();
    expect(btn.getAttribute('aria-describedby')).toBe('hint');
  });

  it('hides immediately on Escape key', async () => {
    const fixture = TestBed.createComponent(FastHost);
    const btn = await openTooltip(fixture);
    expect(getTooltipEl()).toBeTruthy();
    btn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await fixture.whenStable();
    expect(getTooltipEl()).toBeNull();
  });

  it('removes aria-describedby on Escape', async () => {
    const fixture = TestBed.createComponent(FastHost);
    const btn = await openTooltip(fixture);
    btn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await fixture.whenStable();
    expect(btn.getAttribute('aria-describedby')).toBeNull();
  });

  it('does not show when snTooltipDisabled=true', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    const btn: HTMLElement = fixture.nativeElement.querySelector('button');
    btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await tick(50);
    expect(getTooltipEl()).toBeNull();
  });

  it('does not open overlay when snTooltip is empty string', async () => {
    const fixture = TestBed.createComponent(EmptyHost);
    await fixture.whenStable();
    const btn: HTMLElement = fixture.nativeElement.querySelector('button');
    btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await tick(50);
    expect(getTooltipEl()).toBeNull();
  });

  it('hides after blur (with hideDelay=0)', async () => {
    const fixture = TestBed.createComponent(FastHost);
    const btn = await openTooltip(fixture);
    btn.dispatchEvent(new Event('blur', { bubbles: true }));
    await tick(400);
    await fixture.whenStable();
    expect(getTooltipEl()).toBeNull();
  });

  it('stays visible when mouse re-enters trigger before hide completes', async () => {
    const fixture = TestBed.createComponent(FastHost);
    const btn = await openTooltip(fixture);
    btn.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    await tick(50);
    btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await tick(250);
    await fixture.whenStable();
    expect(getTooltipEl()).toBeTruthy();
  });

  it('bubble has sn-tooltip-bubble class', async () => {
    const fixture = TestBed.createComponent(FastHost);
    await openTooltip(fixture);
    expect(getOverlayEl().querySelector('.sn-tooltip-bubble')).toBeTruthy();
  });

  it('overlay container has sn-tooltip-container class', async () => {
    const fixture = TestBed.createComponent(FastHost);
    await openTooltip(fixture);
    expect(getOverlayEl().querySelector('.sn-tooltip-container')).toBeTruthy();
  });

  it('sn-tooltip-container has sn-tooltip-visible class when shown', async () => {
    const fixture = TestBed.createComponent(FastHost);
    await openTooltip(fixture);
    const container = getOverlayEl().querySelector<HTMLElement>('.sn-tooltip-container');
    expect(container?.classList).toContain('sn-tooltip-visible');
  });

  it('CDK overlay panel has sn-tooltip-panel class', async () => {
    const fixture = TestBed.createComponent(FastHost);
    await openTooltip(fixture);
    expect(getOverlayEl().querySelector('.sn-tooltip-panel')).toBeTruthy();
  });

  it('shows tooltip when position=bottom', async () => {
    const fixture = TestBed.createComponent(BottomHost);
    await fixture.whenStable();
    const btn: HTMLElement = fixture.nativeElement.querySelector('button');
    btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await tick(10);
    await fixture.whenStable();
    expect(getTooltipEl()).toBeTruthy();
    expect(getTooltipEl()!.textContent?.trim()).toBe('Bottom tip');
  });

  it('renders TemplateRef content with rich elements', async () => {
    const fixture = TestBed.createComponent(TemplateHost);
    await fixture.whenStable();
    const btn: HTMLElement = fixture.nativeElement.querySelector('button');
    btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await tick(10);
    await fixture.whenStable();
    const tooltip = getTooltipEl();
    expect(tooltip).toBeTruthy();
    expect(tooltip!.querySelector('b.rich-tip')?.textContent).toBe('Bold');
    expect(tooltip!.querySelector('code')?.textContent).toBe('code');
  });
});

@Component({
  template: `<button [snTooltip]="'Hi'" [snTooltipShowDelay]="0" [snTooltipHideDelay]="0" [animated]="false">T</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tooltip],
})
class NoAnimTooltipHost {}

@Component({
  template: `<button [snTooltip]="'Hi'" [snTooltipShowDelay]="0" [snTooltipHideDelay]="0"
    [animation]="{ enter: 'my-in 40ms ease-out', exit: 'my-out 40ms ease-in' }">T</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tooltip],
})
class CustomAnimTooltipHost {}

describe('Tooltip animation inputs', () => {
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

  function getContainerEl(): HTMLElement | null {
    return overlayContainer.getContainerElement().querySelector('.sn-tooltip-container');
  }

  it('animated=false suppresses animation and hides immediately', async () => {
    const fix = TestBed.createComponent(NoAnimTooltipHost);
    await fix.whenStable();
    const btn: HTMLElement = fix.nativeElement.querySelector('button');
    btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await tick(10);
    await fix.whenStable();
    const container = getContainerEl()!;
    expect(container.style.animation).toBe('none');
    btn.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    await fix.whenStable();
    await tick(10);
    await fix.whenStable();
    expect(overlayContainer.getContainerElement().querySelector('[role="tooltip"]')).toBeNull();
  });

  it('custom enter/exit animations apply inline and drive the close timer', async () => {
    onTestFinished(fakeRunningAnimations(40));
    const fix = TestBed.createComponent(CustomAnimTooltipHost);
    await fix.whenStable();
    const btn: HTMLElement = fix.nativeElement.querySelector('button');
    btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await tick(10);
    await fix.whenStable();
    expect(getContainerEl()!.style.animation).toContain('my-in');
    btn.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    await fix.whenStable();
    await tick(5);
    await fix.whenStable();
    expect(getContainerEl()!.style.animation).toContain('my-out');
    await tick(80);
    await fix.whenStable();
    expect(overlayContainer.getContainerElement().querySelector('[role="tooltip"]')).toBeNull();
  });
});
