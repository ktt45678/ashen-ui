import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Timeline } from './timeline';
import { TimelineItem } from './timeline-item';

@Component({
  template: `
    <sn-timeline>
      <sn-timeline-item>
        <span class="sn-timeline-title">
          <span class="sn-timeline-title-text">Grid created</span>
          <span class="sn-timeline-time">09:12</span>
        </span>
      </sn-timeline-item>
      <sn-timeline-item>
        <span class="sn-timeline-title">
          <span class="sn-timeline-title-text">Tile added</span>
        </span>
        <div class="sn-timeline-subtitle">Play Music → play-sound</div>
      </sn-timeline-item>
      <sn-timeline-item icon="play_arrow" color="var(--sn-color-success)">
        <span class="sn-timeline-title">
          <span class="sn-timeline-title-text">Action run</span>
          <span class="sn-timeline-time">09:41</span>
        </span>
      </sn-timeline-item>
    </sn-timeline>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Timeline, TimelineItem],
})
class ThreeItemHost {}

@Component({
  template: `
    <sn-timeline>
      <sn-timeline-item>Only item</sn-timeline-item>
    </sn-timeline>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Timeline, TimelineItem],
})
class SingleItemHost {}

@Component({
  template: `
    <sn-timeline>
      <sn-timeline-item icon="add">With icon</sn-timeline-item>
      <sn-timeline-item>No icon</sn-timeline-item>
    </sn-timeline>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Timeline, TimelineItem],
})
class IconHost {}

@Component({
  template: `
    <sn-timeline>
      <sn-timeline-item color="var(--sn-color-success)">Custom color</sn-timeline-item>
      <sn-timeline-item>Default</sn-timeline-item>
    </sn-timeline>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Timeline, TimelineItem],
})
class ColorHost {}

@Component({
  template: `
    <sn-timeline
      [snStyle]="{ root: { outline: '1px solid teal' } }"
      [snAttrs]="{ root: { 'data-testid': 'tl-root' } }"
    >
      <sn-timeline-item
        icon="check"
        [snStyle]="{
          root: { outline: '1px solid red' },
          marker: { color: 'rgb(1, 2, 3)' },
          content: { color: 'rgb(4, 5, 6)' }
        }"
        [snAttrs]="{
          root: { 'data-testid': 'item-root', role: 'presentation' },
          marker: { 'data-testid': 'item-marker' },
          content: { 'data-testid': 'item-content' }
        }"
      >
        Part item
      </sn-timeline-item>
    </sn-timeline>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Timeline, TimelineItem],
})
class SnPartHost {}

describe('Timeline', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('applies sn-timeline host class', async () => {
    const fixture = TestBed.createComponent(ThreeItemHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-timeline');
    expect(el.classList).toContain('sn-timeline');
  });

  it('renders sn-timeline-list ol', async () => {
    const fixture = TestBed.createComponent(ThreeItemHost);
    await fixture.whenStable();
    const list = fixture.nativeElement.querySelector('.sn-timeline-list');
    expect(list).toBeTruthy();
    expect(list.tagName.toLowerCase()).toBe('ol');
  });

  it('renders three items', async () => {
    const fixture = TestBed.createComponent(ThreeItemHost);
    await fixture.whenStable();
    const items = fixture.nativeElement.querySelectorAll('sn-timeline-item');
    expect(items.length).toBe(3);
  });

  it('each item has sn-timeline-item class', async () => {
    const fixture = TestBed.createComponent(ThreeItemHost);
    await fixture.whenStable();
    const items = fixture.nativeElement.querySelectorAll('sn-timeline-item');
    items.forEach((item: HTMLElement) => {
      expect(item.classList).toContain('sn-timeline-item');
    });
  });

  it('each item has role="listitem"', async () => {
    const fixture = TestBed.createComponent(ThreeItemHost);
    await fixture.whenStable();
    const items = fixture.nativeElement.querySelectorAll('sn-timeline-item');
    items.forEach((item: HTMLElement) => {
      expect(item.getAttribute('role')).toBe('listitem');
    });
  });

  it('last item gets sn-timeline-item--last class', async () => {
    const fixture = TestBed.createComponent(ThreeItemHost);
    await fixture.whenStable();
    const items = fixture.nativeElement.querySelectorAll('sn-timeline-item');
    expect(items[2].classList).toContain('sn-timeline-item--last');
  });

  it('non-last items do not get sn-timeline-item--last class', async () => {
    const fixture = TestBed.createComponent(ThreeItemHost);
    await fixture.whenStable();
    const items = fixture.nativeElement.querySelectorAll('sn-timeline-item');
    expect(items[0].classList).not.toContain('sn-timeline-item--last');
    expect(items[1].classList).not.toContain('sn-timeline-item--last');
  });

  it('single item gets sn-timeline-item--last class', async () => {
    const fixture = TestBed.createComponent(SingleItemHost);
    await fixture.whenStable();
    const item: HTMLElement = fixture.nativeElement.querySelector('sn-timeline-item');
    expect(item.classList).toContain('sn-timeline-item--last');
  });

  it('renders connector for non-last items', async () => {
    const fixture = TestBed.createComponent(ThreeItemHost);
    await fixture.whenStable();
    const items = fixture.nativeElement.querySelectorAll('sn-timeline-item');
    const connector0 = items[0].querySelector('.sn-timeline-connector');
    const connector1 = items[1].querySelector('.sn-timeline-connector');
    expect(connector0).toBeTruthy();
    expect(connector1).toBeTruthy();
  });

  it('suppresses connector on last item', async () => {
    const fixture = TestBed.createComponent(ThreeItemHost);
    await fixture.whenStable();
    const items = fixture.nativeElement.querySelectorAll('sn-timeline-item');
    const connector = items[2].querySelector('.sn-timeline-connector');
    expect(connector).toBeNull();
  });

  it('renders icon marker when icon input is set', async () => {
    const fixture = TestBed.createComponent(IconHost);
    await fixture.whenStable();
    const items = fixture.nativeElement.querySelectorAll('sn-timeline-item');
    const iconMarker = items[0].querySelector('.sn-timeline-marker--icon');
    expect(iconMarker).toBeTruthy();
    const iconEl = items[0].querySelector('.sn-timeline-marker-icon');
    expect(iconEl?.textContent?.trim()).toBe('add');
  });

  it('renders dot marker when no icon', async () => {
    const fixture = TestBed.createComponent(IconHost);
    await fixture.whenStable();
    const items = fixture.nativeElement.querySelectorAll('sn-timeline-item');
    const iconMarker = items[1].querySelector('.sn-timeline-marker--icon');
    expect(iconMarker).toBeNull();
    const marker = items[1].querySelector('.sn-timeline-marker');
    expect(marker).toBeTruthy();
  });

  it('applies custom color via CSS variable', async () => {
    const fixture = TestBed.createComponent(ColorHost);
    await fixture.whenStable();
    const items = fixture.nativeElement.querySelectorAll('sn-timeline-item');
    const marker = items[0].querySelector('.sn-timeline-marker') as HTMLElement;
    expect(marker.style.getPropertyValue('--sn-timeline-item-color')).toBe('var(--sn-color-success)');
  });

  it('projects content into sn-timeline-content', async () => {
    const fixture = TestBed.createComponent(ThreeItemHost);
    await fixture.whenStable();
    const items = fixture.nativeElement.querySelectorAll('sn-timeline-item');
    const content = items[0].querySelector('.sn-timeline-content');
    expect(content).toBeTruthy();
    expect(content.textContent).toContain('Grid created');
  });

  it('renders axis element', async () => {
    const fixture = TestBed.createComponent(ThreeItemHost);
    await fixture.whenStable();
    const items = fixture.nativeElement.querySelectorAll('sn-timeline-item');
    const axis = items[0].querySelector('.sn-timeline-item-axis');
    expect(axis).toBeTruthy();
    expect(axis.getAttribute('aria-hidden')).toBe('true');
  });

  it('plays icon ligature (icon=play_arrow) on third item', async () => {
    const fixture = TestBed.createComponent(ThreeItemHost);
    await fixture.whenStable();
    const items = fixture.nativeElement.querySelectorAll('sn-timeline-item');
    const iconEl = items[2].querySelector('.sn-timeline-marker-icon');
    expect(iconEl?.textContent?.trim()).toBe('play_arrow');
  });

  it('applies snStyle and allowed snAttrs to named parts without replacing timeline semantics', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const timeline: HTMLElement = el.querySelector('sn-timeline')!;
    const item: HTMLElement = el.querySelector('sn-timeline-item')!;
    const marker: HTMLElement = el.querySelector('.sn-timeline-marker')!;
    const content: HTMLElement = el.querySelector('.sn-timeline-content')!;

    expect(timeline.style.outline).toContain('teal');
    expect(timeline.getAttribute('data-testid')).toBe('tl-root');

    expect(item.style.outline).toContain('red');
    expect(item.getAttribute('data-testid')).toBe('item-root');
    // The item keeps its listitem role, not the pass-through's value.
    expect(item.getAttribute('role')).toBe('listitem');
    expect(marker.style.color).toBe('rgb(1, 2, 3)');
    expect(marker.getAttribute('data-testid')).toBe('item-marker');
    expect(content.style.color).toBe('rgb(4, 5, 6)');
    expect(content.getAttribute('data-testid')).toBe('item-content');
  });
});
