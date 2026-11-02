import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Dir } from '@angular/cdk/bidi';
import { Splitter } from './splitter';
import { SplitterPanel } from './splitter-panel';
import { provideSnIntl } from 'ashen-ui/core';

@Component({
  template: `
    <sn-splitter style="height:200px">
      <sn-splitter-panel>Left</sn-splitter-panel>
      <sn-splitter-panel>Right</sn-splitter-panel>
    </sn-splitter>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Splitter, SplitterPanel],
})
class BasicHost {}

@Component({
  template: `
    <sn-splitter layout="vertical" style="height:400px">
      <sn-splitter-panel>Top</sn-splitter-panel>
      <sn-splitter-panel>Bottom</sn-splitter-panel>
    </sn-splitter>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Splitter, SplitterPanel],
})
class VerticalHost {}

@Component({
  template: `
    <sn-splitter [minSize]="20" style="height:200px">
      <sn-splitter-panel>Left</sn-splitter-panel>
      <sn-splitter-panel>Right</sn-splitter-panel>
    </sn-splitter>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Splitter, SplitterPanel],
})
class CustomMinSizeHost {}

@Component({
  template: `
    <sn-splitter [(size)]="paneSize" style="height:200px">
      <sn-splitter-panel>Left</sn-splitter-panel>
      <sn-splitter-panel>Right</sn-splitter-panel>
    </sn-splitter>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Splitter, SplitterPanel],
})
class TwoWayHost {
  readonly paneSize = signal(30);
}

@Component({
  template: `
    <sn-splitter [size]="60" style="height:200px">
      <sn-splitter-panel>Left</sn-splitter-panel>
      <sn-splitter-panel>Right</sn-splitter-panel>
    </sn-splitter>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Splitter, SplitterPanel],
})
class InitialSizeHost {}

@Component({
  template: `
    <sn-splitter snClass="my-splitter" style="height:200px">
      <sn-splitter-panel [snClass]="{ root: 'my-panel' }">Left</sn-splitter-panel>
      <sn-splitter-panel>Right</sn-splitter-panel>
    </sn-splitter>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Splitter, SplitterPanel],
})
class SnClassHost {}

@Component({
  template: `
    <sn-splitter resizeLabel="Custom resize" style="height:200px">
      <sn-splitter-panel>Left</sn-splitter-panel>
      <sn-splitter-panel>Right</sn-splitter-panel>
    </sn-splitter>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Splitter, SplitterPanel],
})
class ResizeLabelHost {}

@Component({
  template: `
    <sn-splitter [step]="5" style="height:200px">
      <sn-splitter-panel>Left</sn-splitter-panel>
      <sn-splitter-panel>Right</sn-splitter-panel>
    </sn-splitter>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Splitter, SplitterPanel],
})
class CustomStepHost {}

@Component({
  template: `
    <div dir="rtl">
      <sn-splitter style="height:200px">
        <sn-splitter-panel>First</sn-splitter-panel>
        <sn-splitter-panel>Second</sn-splitter-panel>
      </sn-splitter>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Dir, Splitter, SplitterPanel],
})
class RtlHost {}

@Component({
  template: `
    <sn-splitter
      style="height:200px"
      [snStyle]="{
        root: { outline: '1px solid red' },
        gutter: { color: 'rgb(1, 2, 3)' },
        handle: { color: 'rgb(4, 5, 6)' }
      }"
      [snAttrs]="{
        root: { 'data-testid': 'splitter-root' },
        gutter: { 'data-testid': 'splitter-gutter', role: 'presentation', 'aria-label': 'nope' },
        handle: { 'data-testid': 'splitter-handle' }
      }"
    >
      <sn-splitter-panel
        [snStyle]="{ root: { color: 'rgb(7, 8, 9)' } }"
        [snAttrs]="{ root: { 'data-testid': 'panel-root', id: 'hijacked' } }"
      >Left</sn-splitter-panel>
      <sn-splitter-panel>Right</sn-splitter-panel>
    </sn-splitter>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Splitter, SplitterPanel],
})
class SnPartHost {}

function getGutter(el: HTMLElement): HTMLElement {
  return el.querySelector('.sn-splitter-gutter') as HTMLElement;
}

function getSplitter(el: HTMLElement): HTMLElement {
  return el.querySelector('sn-splitter') as HTMLElement;
}

function dispatchKey(el: HTMLElement, key: string): void {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

/** jsdom lays nothing out, so a drag needs the geometry handed to it. */
function stubRect(el: HTMLElement, box: { left: number; right: number; width: number }): void {
  el.getBoundingClientRect = () =>
    ({ ...box, top: 0, bottom: 200, height: 200, x: box.left, y: 0 }) as DOMRect;
}

describe('Splitter', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  describe('rendering', () => {
    it('renders two sn-splitter-panel elements and a gutter', async () => {
      const fixture = TestBed.createComponent(BasicHost);
      await fixture.whenStable();
      const panels = fixture.nativeElement.querySelectorAll('sn-splitter-panel');
      expect(panels.length).toBe(2);
      const gutter = getGutter(fixture.nativeElement);
      expect(gutter).toBeTruthy();
    });

    it('applies sn-splitter class on host', async () => {
      const fixture = TestBed.createComponent(BasicHost);
      await fixture.whenStable();
      const splitter = getSplitter(fixture.nativeElement);
      expect(splitter.classList).toContain('sn-splitter');
    });

    it('applies sn-splitter-horizontal class for horizontal layout', async () => {
      const fixture = TestBed.createComponent(BasicHost);
      await fixture.whenStable();
      const splitter = getSplitter(fixture.nativeElement);
      expect(splitter.classList).toContain('sn-splitter-horizontal');
      expect(splitter.classList).not.toContain('sn-splitter-vertical');
    });

    it('applies sn-splitter-vertical class for vertical layout', async () => {
      const fixture = TestBed.createComponent(VerticalHost);
      await fixture.whenStable();
      const splitter = getSplitter(fixture.nativeElement);
      expect(splitter.classList).toContain('sn-splitter-vertical');
      expect(splitter.classList).not.toContain('sn-splitter-horizontal');
    });

    it('renders sn-splitter-panel class on each panel', async () => {
      const fixture = TestBed.createComponent(BasicHost);
      await fixture.whenStable();
      const panels = fixture.nativeElement.querySelectorAll('.sn-splitter-panel');
      expect(panels.length).toBe(2);
    });

    it('renders sn-splitter-gutter-handle inside gutter', async () => {
      const fixture = TestBed.createComponent(BasicHost);
      await fixture.whenStable();
      const handle = fixture.nativeElement.querySelector('.sn-splitter-gutter-handle');
      expect(handle).toBeTruthy();
    });

    it('applies initial size as flex-basis on first panel', async () => {
      const fixture = TestBed.createComponent(InitialSizeHost);
      await fixture.whenStable();
      const firstPanel = fixture.nativeElement.querySelector('sn-splitter-panel') as HTMLElement;
      expect(firstPanel.style.flexBasis).toBe('60%');
    });
  });

  describe('aria attributes', () => {
    it('gutter has role=separator', async () => {
      const fixture = TestBed.createComponent(BasicHost);
      await fixture.whenStable();
      const gutter = getGutter(fixture.nativeElement);
      expect(gutter.getAttribute('role')).toBe('separator');
    });

    it('gutter has tabindex=0', async () => {
      const fixture = TestBed.createComponent(BasicHost);
      await fixture.whenStable();
      const gutter = getGutter(fixture.nativeElement);
      expect(gutter.getAttribute('tabindex')).toBe('0');
    });

    it('horizontal layout gutter has aria-orientation=vertical', async () => {
      const fixture = TestBed.createComponent(BasicHost);
      await fixture.whenStable();
      const gutter = getGutter(fixture.nativeElement);
      expect(gutter.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('vertical layout gutter has aria-orientation=horizontal', async () => {
      const fixture = TestBed.createComponent(VerticalHost);
      await fixture.whenStable();
      const gutter = getGutter(fixture.nativeElement);
      expect(gutter.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('gutter has aria-valuenow=50 by default', async () => {
      const fixture = TestBed.createComponent(BasicHost);
      await fixture.whenStable();
      const gutter = getGutter(fixture.nativeElement);
      expect(gutter.getAttribute('aria-valuenow')).toBe('50');
    });

    it('gutter has aria-valuemin matching minSize', async () => {
      const fixture = TestBed.createComponent(BasicHost);
      await fixture.whenStable();
      const gutter = getGutter(fixture.nativeElement);
      expect(gutter.getAttribute('aria-valuemin')).toBe('15');
    });

    it('gutter has aria-valuemax matching 100-minSize', async () => {
      const fixture = TestBed.createComponent(BasicHost);
      await fixture.whenStable();
      const gutter = getGutter(fixture.nativeElement);
      expect(gutter.getAttribute('aria-valuemax')).toBe('85');
    });

    it('gutter has aria-valuemin/max from custom minSize', async () => {
      const fixture = TestBed.createComponent(CustomMinSizeHost);
      await fixture.whenStable();
      const gutter = getGutter(fixture.nativeElement);
      expect(gutter.getAttribute('aria-valuemin')).toBe('20');
      expect(gutter.getAttribute('aria-valuemax')).toBe('80');
    });

    it('gutter has aria-controls pointing to first panel id', async () => {
      const fixture = TestBed.createComponent(BasicHost);
      await fixture.whenStable();
      const gutter = getGutter(fixture.nativeElement);
      const controls = gutter.getAttribute('aria-controls');
      expect(controls).toBeTruthy();
      expect(controls).toMatch(/^sn-splitter-panel-\d+$/);
      const firstPanel = fixture.nativeElement.querySelector('sn-splitter-panel') as HTMLElement;
      expect(firstPanel.getAttribute('id')).toBe(controls);
    });

    it('gutter has default aria-label from SnIntl', async () => {
      const fixture = TestBed.createComponent(BasicHost);
      await fixture.whenStable();
      const gutter = getGutter(fixture.nativeElement);
      expect(gutter.getAttribute('aria-label')).toBe('Resize panels');
    });

    it('resizeLabel input overrides default aria-label', async () => {
      const fixture = TestBed.createComponent(ResizeLabelHost);
      await fixture.whenStable();
      const gutter = getGutter(fixture.nativeElement);
      expect(gutter.getAttribute('aria-label')).toBe('Custom resize');
    });

    it('SnIntl override applies to aria-label', async () => {
      TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          provideSnIntl({ splitterResize: 'Panel vergrößern' }),
        ],
      });
      const fixture = TestBed.createComponent(BasicHost);
      await fixture.whenStable();
      const gutter = getGutter(fixture.nativeElement);
      expect(gutter.getAttribute('aria-label')).toBe('Panel vergrößern');
    });
  });

  describe('keyboard interaction', () => {
    it('ArrowRight increases size by step for horizontal layout', async () => {
      const fixture = TestBed.createComponent(BasicHost);
      await fixture.whenStable();
      const gutter = getGutter(fixture.nativeElement);
      dispatchKey(gutter, 'ArrowRight');
      await fixture.whenStable();
      expect(gutter.getAttribute('aria-valuenow')).toBe('60');
    });

    it('ArrowLeft decreases size by step for horizontal layout', async () => {
      const fixture = TestBed.createComponent(BasicHost);
      await fixture.whenStable();
      const gutter = getGutter(fixture.nativeElement);
      dispatchKey(gutter, 'ArrowLeft');
      await fixture.whenStable();
      expect(gutter.getAttribute('aria-valuenow')).toBe('40');
    });

    it('ArrowDown increases size for vertical layout', async () => {
      const fixture = TestBed.createComponent(VerticalHost);
      await fixture.whenStable();
      const gutter = getGutter(fixture.nativeElement);
      dispatchKey(gutter, 'ArrowDown');
      await fixture.whenStable();
      expect(gutter.getAttribute('aria-valuenow')).toBe('60');
    });

    it('ArrowUp decreases size for vertical layout', async () => {
      const fixture = TestBed.createComponent(VerticalHost);
      await fixture.whenStable();
      const gutter = getGutter(fixture.nativeElement);
      dispatchKey(gutter, 'ArrowUp');
      await fixture.whenStable();
      expect(gutter.getAttribute('aria-valuenow')).toBe('40');
    });

    it('ArrowRight does not affect vertical layout', async () => {
      const fixture = TestBed.createComponent(VerticalHost);
      await fixture.whenStable();
      const gutter = getGutter(fixture.nativeElement);
      dispatchKey(gutter, 'ArrowRight');
      await fixture.whenStable();
      expect(gutter.getAttribute('aria-valuenow')).toBe('50');
    });

    it('Home sets size to minSize', async () => {
      const fixture = TestBed.createComponent(BasicHost);
      await fixture.whenStable();
      const gutter = getGutter(fixture.nativeElement);
      dispatchKey(gutter, 'Home');
      await fixture.whenStable();
      expect(gutter.getAttribute('aria-valuenow')).toBe('15');
    });

    it('End sets size to 100-minSize', async () => {
      const fixture = TestBed.createComponent(BasicHost);
      await fixture.whenStable();
      const gutter = getGutter(fixture.nativeElement);
      dispatchKey(gutter, 'End');
      await fixture.whenStable();
      expect(gutter.getAttribute('aria-valuenow')).toBe('85');
    });

    it('clamps size to minSize at lower bound', async () => {
      const fixture = TestBed.createComponent(BasicHost);
      await fixture.whenStable();
      const gutter = getGutter(fixture.nativeElement);
      for (let i = 0; i < 10; i++) {
        dispatchKey(gutter, 'ArrowLeft');
      }
      await fixture.whenStable();
      const valuenow = parseInt(gutter.getAttribute('aria-valuenow') ?? '0', 10);
      expect(valuenow).toBeGreaterThanOrEqual(15);
    });

    it('clamps size to 100-minSize at upper bound', async () => {
      const fixture = TestBed.createComponent(BasicHost);
      await fixture.whenStable();
      const gutter = getGutter(fixture.nativeElement);
      for (let i = 0; i < 10; i++) {
        dispatchKey(gutter, 'ArrowRight');
      }
      await fixture.whenStable();
      const valuenow = parseInt(gutter.getAttribute('aria-valuenow') ?? '100', 10);
      expect(valuenow).toBeLessThanOrEqual(85);
    });

    it('uses custom step from step input', async () => {
      const fixture = TestBed.createComponent(CustomStepHost);
      await fixture.whenStable();
      const gutter = getGutter(fixture.nativeElement);
      dispatchKey(gutter, 'ArrowRight');
      await fixture.whenStable();
      expect(gutter.getAttribute('aria-valuenow')).toBe('55');
    });
  });

  describe('two-way binding', () => {
    it('initial size is reflected in first panel flex-basis', async () => {
      const fixture = TestBed.createComponent(TwoWayHost);
      await fixture.whenStable();
      const firstPanel = fixture.nativeElement.querySelector('sn-splitter-panel') as HTMLElement;
      expect(firstPanel.style.flexBasis).toBe('30%');
    });

    it('size model changes update first panel flex-basis', async () => {
      const fixture = TestBed.createComponent(TwoWayHost);
      await fixture.whenStable();
      fixture.componentInstance.paneSize.set(70);
      await fixture.whenStable();
      const firstPanel = fixture.nativeElement.querySelector('sn-splitter-panel') as HTMLElement;
      expect(firstPanel.style.flexBasis).toBe('70%');
    });

    it('keyboard change propagates back to two-way bound signal', async () => {
      const fixture = TestBed.createComponent(TwoWayHost);
      await fixture.whenStable();
      const gutter = getGutter(fixture.nativeElement);
      dispatchKey(gutter, 'ArrowRight');
      await fixture.whenStable();
      expect(fixture.componentInstance.paneSize()).toBe(40);
    });
  });

  describe('snClass pass-through', () => {
    it('plain string snClass on splitter lands on host .sn-splitter element', async () => {
      const fixture = TestBed.createComponent(SnClassHost);
      await fixture.whenStable();
      const splitter = getSplitter(fixture.nativeElement);
      expect(splitter.classList).toContain('my-splitter');
    });

    it('object snClass root on panel lands on sn-splitter-panel host', async () => {
      const fixture = TestBed.createComponent(SnClassHost);
      await fixture.whenStable();
      const firstPanel = fixture.nativeElement.querySelector('sn-splitter-panel') as HTMLElement;
      expect(firstPanel.classList).toContain('my-panel');
    });
  });

  // `size` is the first panel's share, and flex `row` puts the first panel on
  // the RIGHT in RTL. Both the arrows and the drag have to follow it there.
  describe('rtl', () => {
    it('ArrowRight shrinks the first panel', async () => {
      const fixture = TestBed.createComponent(RtlHost);
      await fixture.whenStable();
      const gutter = getGutter(fixture.nativeElement);

      dispatchKey(gutter, 'ArrowRight');
      await fixture.whenStable();

      expect(gutter.getAttribute('aria-valuenow')).toBe('40');
    });

    it('ArrowLeft grows the first panel', async () => {
      const fixture = TestBed.createComponent(RtlHost);
      await fixture.whenStable();
      const gutter = getGutter(fixture.nativeElement);

      dispatchKey(gutter, 'ArrowLeft');
      await fixture.whenStable();

      expect(gutter.getAttribute('aria-valuenow')).toBe('60');
    });

    it('a drag measures the first panel from the right edge', async () => {
      const fixture = TestBed.createComponent(RtlHost);
      await fixture.whenStable();
      stubRect(getSplitter(fixture.nativeElement), { left: 100, right: 300, width: 200 });
      const gutter = getGutter(fixture.nativeElement);

      gutter.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, clientX: 200 }));
      document.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: 250 }));
      await fixture.whenStable();

      // 50px in from the right edge of a 200px splitter. The same pointer in
      // LTR would read 75.
      expect(gutter.getAttribute('aria-valuenow')).toBe('25');
      document.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }));
    });
  });

  describe('snPart pass-through', () => {
    it('applies snStyle and allowed snAttrs to root and named parts without breaking aria semantics', async () => {
      const fixture = TestBed.createComponent(SnPartHost);
      await fixture.whenStable();
      const el: HTMLElement = fixture.nativeElement;

      const splitter = getSplitter(el);
      const gutter = getGutter(el);
      const handle = el.querySelector('.sn-splitter-gutter-handle') as HTMLElement;
      const firstPanel = el.querySelector('sn-splitter-panel') as HTMLElement;

      expect(splitter.style.outline).toContain('red');
      expect(splitter.getAttribute('data-testid')).toBe('splitter-root');
      expect(gutter.style.color).toBe('rgb(1, 2, 3)');
      expect(gutter.getAttribute('data-testid')).toBe('splitter-gutter');
      expect(handle.style.color).toBe('rgb(4, 5, 6)');
      expect(handle.getAttribute('data-testid')).toBe('splitter-handle');
      expect(firstPanel.style.color).toBe('rgb(7, 8, 9)');
      expect(firstPanel.getAttribute('data-testid')).toBe('panel-root');

      // Reserved attrs stay under the components' own control, not the pass-through's.
      expect(gutter.getAttribute('role')).toBe('separator');
      expect(gutter.getAttribute('aria-label')).not.toBe('nope');
      expect(firstPanel.getAttribute('id')).not.toBe('hijacked');
      expect(firstPanel.getAttribute('id')).toMatch(/^sn-splitter-panel-\d+$/);
    });
  });
});

describe('SplitterPanel (standalone)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders with sn-splitter-panel class', async () => {
    @Component({
      template: `<sn-splitter-panel>Content</sn-splitter-panel>`,
      imports: [SplitterPanel],
    })
    class StandaloneHost {}

    const fixture = TestBed.createComponent(StandaloneHost);
    await fixture.whenStable();
    const panel = fixture.nativeElement.querySelector('sn-splitter-panel') as HTMLElement;
    expect(panel.classList).toContain('sn-splitter-panel');
  });

  it('projects content', async () => {
    @Component({
      template: `<sn-splitter-panel>Panel content</sn-splitter-panel>`,
      imports: [SplitterPanel],
    })
    class ContentHost {}

    const fixture = TestBed.createComponent(ContentHost);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Panel content');
  });
});
