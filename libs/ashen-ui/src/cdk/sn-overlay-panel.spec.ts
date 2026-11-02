import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import {
  Component,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  inject,
  viewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { type ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import {
  snOverlayContextMenu,
  snOverlayPanel,
  snOverlaySelect,
  snOverlaySubmenu,
} from './sn-overlay-panel';

@Component({
  template: `
    <button #trigger type="button">Trigger</button>
    <ng-template #panel><div class="sn-overlay-panel-test">Panel content</div></ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [OverlayModule],
})
class OverlayHost {
  readonly trigger = viewChild.required<ElementRef<HTMLElement>>('trigger');
  readonly panel = viewChild.required<TemplateRef<unknown>>('panel');
  private readonly viewContainerRef = inject(ViewContainerRef);

  readonly overlay = snOverlayPanel(() => ({
    origin: this.trigger(),
    template: this.panel(),
    viewContainerRef: this.viewContainerRef,
    panelClass: 'sn-overlay-panel-test-pane',
    animated: false,
  }));
}

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [OverlayModule],
})
class MissingOverlayHost {
  private readonly viewContainerRef = inject(ViewContainerRef);

  readonly overlay = snOverlayPanel({
    origin: undefined,
    template: undefined,
    viewContainerRef: this.viewContainerRef,
  });
}

// Pins the overlay's bottom edge to the origin's top, so the strategy resolves
// to an above placement, the case the ref must detect and stamp.
const ABOVE_POSITION: ConnectedPosition = {
  originX: 'start',
  originY: 'top',
  overlayX: 'start',
  overlayY: 'bottom',
};

@Component({
  template: `
    <button #trigger type="button">Trigger</button>
    <ng-template #panel><div class="sn-overlay-panel-test">Panel content</div></ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [OverlayModule],
})
class AbovePanelHost {
  readonly trigger = viewChild.required<ElementRef<HTMLElement>>('trigger');
  readonly panel = viewChild.required<TemplateRef<unknown>>('panel');
  private readonly viewContainerRef = inject(ViewContainerRef);

  readonly overlay = snOverlayPanel(() => ({
    origin: this.trigger(),
    template: this.panel(),
    viewContainerRef: this.viewContainerRef,
    panelClass: 'sn-overlay-panel-test-pane',
    animated: false,
    positions: [ABOVE_POSITION],
  }));
}

describe('snOverlayPanel', () => {
  let fixture: ComponentFixture<OverlayHost> | null = null;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  afterEach(() => {
    fixture?.destroy();
    fixture = null;
    document.querySelector('.cdk-overlay-container')?.remove();
  });

  it('attaches the caller template and exposes its pane', async () => {
    fixture = TestBed.createComponent(OverlayHost);
    await fixture.whenStable();
    const opened = vi.fn();
    fixture.componentInstance.overlay.afterOpened.subscribe(opened);

    expect(fixture.componentInstance.overlay.open()).toBe(true);

    expect(fixture.componentInstance.overlay.isOpen()).toBe(true);
    expect(fixture.componentInstance.overlay.panelElement()).not.toBeNull();
    expect(document.querySelector('.sn-overlay-panel-test')?.textContent).toContain('Panel content');
    expect(document.querySelector('.sn-overlay-panel-test-pane')).not.toBeNull();
    expect(opened).toHaveBeenCalledOnce();
  });

  it('resolves the panel side on the ref and pane, surviving the reposition effect', async () => {
    // Opening bumps overlayVersion; the direction effect must reuse the strategy or the above placement is lost.
    const host = TestBed.createComponent(AbovePanelHost);
    await host.whenStable();
    host.componentInstance.overlay.open();
    await host.whenStable();

    expect(host.componentInstance.overlay.side()).toBe('above');
    const pane = document.querySelector('.sn-overlay-panel-test-pane') as HTMLElement;
    expect(pane.getAttribute('data-sn-overlay-side')).toBe('above');
    expect(host.nativeElement.querySelector('button').getAttribute('data-sn-overlay-origin-side')).toBe('above');

    host.destroy();
  });

  it('detaches immediately with its close reason and restores focus', async () => {
    fixture = TestBed.createComponent(OverlayHost);
    await fixture.whenStable();
    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const closed = vi.fn();
    fixture.componentInstance.overlay.afterClosed.subscribe(closed);
    trigger.focus();
    fixture.componentInstance.overlay.open();

    fixture.componentInstance.overlay.detach('tab');

    expect(fixture.componentInstance.overlay.isOpen()).toBe(false);
    expect(document.querySelector('.sn-overlay-panel-test')).toBeNull();
    expect(closed).toHaveBeenCalledWith('tab');
    expect(document.activeElement).toBe(trigger);
  });

  it('closes synchronously when no exit animation is configured', async () => {
    fixture = TestBed.createComponent(OverlayHost);
    await fixture.whenStable();
    const closed = vi.fn();
    fixture.componentInstance.overlay.afterClosed.subscribe(closed);
    fixture.componentInstance.overlay.open();

    fixture.componentInstance.overlay.close();

    expect(fixture.componentInstance.overlay.isClosing()).toBe(false);
    expect(fixture.componentInstance.overlay.isOpen()).toBe(false);
    expect(closed).toHaveBeenCalledWith('programmatic');
  });

  it('defers evaluating its config until open', async () => {
    fixture = TestBed.createComponent(OverlayHost);
    await fixture.whenStable();

    expect(fixture.componentInstance.overlay.open()).toBe(true);
  });

  it('does not attach when a required origin or template is absent', () => {
    const missing = TestBed.createComponent(MissingOverlayHost);

    expect(missing.componentInstance.overlay.open()).toBe(false);
    expect(missing.componentInstance.overlay.isOpen()).toBe(false);

    missing.destroy();
  });

  it('provides overridable select, submenu, and context-menu defaults', () => {
    const viewContainerRef = {} as ViewContainerRef;
    const base = { origin: undefined, template: undefined, viewContainerRef };

    expect(snOverlaySelect(base).matchOriginWidth).toBe(true);
    expect(snOverlaySubmenu(base).hasBackdrop).toBe(false);
    expect(snOverlayContextMenu({ ...base, restoreFocus: true }).restoreFocus).toBe(true);
  });
});
