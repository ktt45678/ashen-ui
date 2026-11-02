import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { SN_ICON_LOADING_FALLBACK, SnIconRegistry } from 'ashen-ui/core';
import { Icon } from './icon';

@Component({
  template: `<sn-icon>settings</sn-icon>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Icon],
})
class DefaultHost {}

@Component({
  template: `<sn-icon size="sm">star</sn-icon>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Icon],
})
class SmallHost {}

@Component({
  template: `<sn-icon size="lg">star</sn-icon>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Icon],
})
class LargeHost {}

@Component({
  template: `<sn-icon fill>favorite</sn-icon>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Icon],
})
class FilledHost {}

@Component({
  template: `<sn-icon [weight]="600">grade</sn-icon>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Icon],
})
class WeightHost {}

@Component({
  template: `<sn-icon ariaLabel="Settings icon">settings</sn-icon>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Icon],
})
class LabeledHost {}

@Component({
  template: `<sn-icon icon="play_arrow" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Icon],
})
class ClassModeHost {}

@Component({
  template: `<sn-icon [grad]="200">settings</sn-icon>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Icon],
})
class GradHost {}

@Component({
  template: `<sn-icon loadingFallback="placeholder">settings</sn-icon>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Icon],
})
class PlaceholderHost {}

@Component({
  template: `<sn-icon loadingFallback="text" icon="play_arrow" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Icon],
})
class TextFallbackHost {}

@Component({
  template: `<sn-icon loadingFallback="text">settings</sn-icon>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Icon],
})
class ProjectedTextFallbackHost {}

describe('Icon', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders with sn-icon and icon-ms classes', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-icon');
    expect(el.classList).toContain('sn-icon');
    expect(el.classList).toContain('icon-ms');
  });

  it('projects the ligature name as text content', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-icon');
    expect(el.textContent?.trim()).toBe('settings');
  });

  it('is aria-hidden by default', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-icon');
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.getAttribute('role')).toBeNull();
  });

  it('adds sn-size-sm class for size="sm"', async () => {
    const fixture = TestBed.createComponent(SmallHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-icon');
    expect(el.classList).toContain('sn-size-sm');
    expect(el.classList).not.toContain('sn-size-lg');
  });

  it('adds sn-size-lg class for size="lg"', async () => {
    const fixture = TestBed.createComponent(LargeHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-icon');
    expect(el.classList).toContain('sn-size-lg');
    expect(el.classList).not.toContain('sn-size-sm');
  });

  it('does not add size class for default md size', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-icon');
    expect(el.classList).not.toContain('sn-size-sm');
    expect(el.classList).not.toContain('sn-size-lg');
  });

  it('adds sn-filled class and sets --sn-icon-fill:1 when fill=true', async () => {
    const fixture = TestBed.createComponent(FilledHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-icon');
    expect(el.classList).toContain('sn-filled');
    expect(el.style.getPropertyValue('--sn-icon-fill')).toBe('1');
  });

  it('sets --sn-icon-fill:0 when fill=false (default)', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-icon');
    expect(el.classList).not.toContain('sn-filled');
    expect(el.style.getPropertyValue('--sn-icon-fill')).toBe('0');
  });

  it('sets --sn-icon-weight from weight input', async () => {
    const fixture = TestBed.createComponent(WeightHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-icon');
    expect(el.style.getPropertyValue('--sn-icon-weight')).toBe('600');
  });

  it('adds role="img" and aria-label when ariaLabel is set', async () => {
    const fixture = TestBed.createComponent(LabeledHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-icon');
    expect(el.getAttribute('role')).toBe('img');
    expect(el.getAttribute('aria-label')).toBe('Settings icon');
    expect(el.getAttribute('aria-hidden')).toBeNull();
  });

  it('applies the sn-icon-<name> class in codepoint mode (underscores become dashes)', async () => {
    const fixture = TestBed.createComponent(ClassModeHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-icon');
    expect(el.classList).toContain('sn-icon-play-arrow');
    expect(el.textContent?.trim()).toBe('');
  });

  it('sets --sn-icon-grad from grad input', async () => {
    const fixture = TestBed.createComponent(GradHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-icon');
    expect(el.style.getPropertyValue('--sn-icon-grad')).toBe('200');
  });

  it('uses the empty fallback for an unavailable projected font glyph', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-icon');
    expect(el.getAttribute('data-sn-icon-loading-fallback')).toBe('empty');
    expect(el.getAttribute('data-sn-icon-font-state')).not.toBe('ready');
  });

  it('allows a placeholder fallback per instance', async () => {
    const fixture = TestBed.createComponent(PlaceholderHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-icon');
    expect(el.getAttribute('data-sn-icon-loading-fallback')).toBe('placeholder');
    expect(el.getAttribute('data-sn-icon-font-state')).not.toBe('ready');
  });

  it('renders a class icon name as intentional text while its font is unavailable', async () => {
    const fixture = TestBed.createComponent(TextFallbackHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-icon');
    expect(el.getAttribute('data-sn-icon-loading-fallback')).toBe('text');
    expect(el.querySelector('.sn-icon-fallback-text')?.textContent).toBe('play_arrow');
  });

  it('keeps a projected ligature as intentional text while its font is unavailable', async () => {
    const fixture = TestBed.createComponent(ProjectedTextFallbackHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-icon');
    expect(el.getAttribute('data-sn-icon-loading-fallback')).toBe('text');
    expect(el.getAttribute('data-sn-icon-font-state')).not.toBe('ready');
    expect(el.textContent?.trim()).toBe('settings');
  });

  it('uses the global fallback policy when the instance has none', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: SN_ICON_LOADING_FALLBACK, useValue: 'text' },
      ],
    });
    const fixture = TestBed.createComponent(ClassModeHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-icon');

    expect(el.getAttribute('data-sn-icon-loading-fallback')).toBe('text');
    expect(el.querySelector('.sn-icon-fallback-text')?.textContent).toBe('play_arrow');
  });
});

@Component({
  template: `<sn-icon [set]="set()" [icon]="name()" [loadingFallback]="loadingFallback()" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Icon],
})
class SetHost {
  readonly set = signal<string | undefined>(undefined);
  readonly name = signal('check');
  readonly loadingFallback = signal<'empty' | 'placeholder' | 'text' | undefined>(undefined);
}

describe('Icon sets', () => {
  let fixture: ComponentFixture<SetHost>;
  let registry: SnIconRegistry;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    registry = TestBed.inject(SnIconRegistry);
    fixture = TestBed.createComponent(SetHost);
    await fixture.whenStable();
  });

  const el = (): HTMLElement => fixture.nativeElement.querySelector('sn-icon');

  it('resolves through the default class set when no set is named', () => {
    expect(el().classList).toContain('sn-icon-check');
  });

  it('applies a registered class set instead', async () => {
    registry.registerSet('pi', { type: 'class', classes: (n) => `pi pi-${n}` });
    fixture.componentInstance.set.set('pi');
    await fixture.whenStable();

    expect(el().classList).toContain('pi');
    expect(el().classList).toContain('pi-check');
    expect(el().classList).not.toContain('sn-icon-check');
  });

  it('renders the name as text for a ligature set', async () => {
    registry.registerSet('ms', { type: 'ligature' });
    fixture.componentInstance.set.set('ms');
    await fixture.whenStable();

    expect(el().textContent?.trim()).toBe('check');
    expect(el().classList).not.toContain('sn-icon-check');
  });

  it('references a sprite for an svg set', async () => {
    registry.registerSet('brand', { type: 'svg', url: (n) => `/brand.svg#${n}` });
    fixture.componentInstance.set.set('brand');
    await fixture.whenStable();

    const use = el().querySelector('svg.sn-icon-svg use');
    expect(use?.getAttribute('href')).toBe('/brand.svg#check');
    expect(el().getAttribute('data-sn-icon-font-state')).toBe('ready');
  });

  it('guards a registered ligature font until that font is available', async () => {
    registry.registerSet('legacy', { type: 'ligature', fontFamily: 'Material Icons' });
    fixture.componentInstance.set.set('legacy');
    await fixture.whenStable();

    expect(el().getAttribute('data-sn-icon-font-state')).not.toBe('ready');
  });

  it('keeps a registered ligature as intentional text while its font is unavailable', async () => {
    registry.registerSet('legacy', { type: 'ligature', fontFamily: 'Material Icons' });
    fixture.componentInstance.set.set('legacy');
    fixture.componentInstance.loadingFallback.set('text');
    await fixture.whenStable();

    expect(el().getAttribute('data-sn-icon-loading-fallback')).toBe('text');
    expect(el().textContent?.trim()).toBe('check');
  });

  it('guards a registered class font until that font is available', async () => {
    registry.registerSet('pi', {
      type: 'class',
      classes: (name) => `pi pi-${name}`,
      fontFamily: 'PrimeIcons',
    });
    fixture.componentInstance.set.set('pi');
    await fixture.whenStable();

    expect(el().getAttribute('data-sn-icon-font-state')).not.toBe('ready');
  });

  it('carries a set font family through to the element', async () => {
    registry.registerSet('legacy', { type: 'ligature', fontFamily: 'Material Icons' });
    fixture.componentInstance.set.set('legacy');
    await fixture.whenStable();

    expect(el().style.getPropertyValue('--sn-icon-font-family')).toBe('Material Icons');
  });

  it('repoints the default set with setFontFamily', async () => {
    registry.setFontFamily('MS Subset');
    await fixture.whenStable();

    expect(el().style.getPropertyValue('--sn-icon-font-family')).toBe('MS Subset');
    expect(el().classList).toContain('sn-icon-check');
  });

  it('falls back to the default set when the named one is unknown', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    fixture.componentInstance.set.set('nope');
    await fixture.whenStable();

    expect(el().classList).toContain('sn-icon-check');
    expect(String(warn.mock.calls.at(-1)?.[0])).toContain('"nope" is not registered');
    warn.mockRestore();
  });

  it('renders nothing extra when no icon name is given', async () => {
    registry.registerSet('brand', { type: 'svg', url: (n) => `/brand.svg#${n}` });
    fixture.componentInstance.set.set('brand');
    fixture.componentInstance.name.set('');
    await fixture.whenStable();

    expect(el().querySelector('svg')).toBeNull();
  });
});

@Component({
  template: `<sn-icon [icon]="name()" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Icon],
})
class DynamicIconHost {
  readonly name = signal<string | undefined>('grid_view');
}

const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

/**
 * jsdom loads no stylesheets, so `getComputedStyle(el, '::before').content` is
 * stubbed here to stand in for "the utility resolved" / "it did not". The real
 * browser behaviour those stubs represent, that an unmatched utility leaves
 * ::before content at its initial value, is pinned separately in
 * e2e/icon-dev-warning.spec.ts.
 */
describe('Icon dev-mode glyph warning', () => {
  let warn: ReturnType<typeof vi.spyOn>;
  let realGetComputedStyle: typeof window.getComputedStyle;

  function stubContent(content: string) {
    window.getComputedStyle = ((el: Element, pseudo?: string) =>
      pseudo === '::before'
        ? ({ content } as CSSStyleDeclaration)
        : realGetComputedStyle(el)) as typeof window.getComputedStyle;
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    realGetComputedStyle = window.getComputedStyle;
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    window.getComputedStyle = realGetComputedStyle;
    warn.mockRestore();
  });

  // Icons from earlier fixtures in this file can have a deferred check still in
  // flight, so count only the messages naming the icon under test.
  const messagesFor = (name: string): string[] =>
    warn.mock.calls
      .map((c: unknown[]) => String(c[0]))
      .filter((m: string) => m.includes('[sn-icon]') && m.includes(`"${name}"`));

  it('warns when the icon name produced no glyph', async () => {
    stubContent('none');
    const fixture = TestBed.createComponent(DynamicIconHost);
    await fixture.whenStable();
    await frame();

    const messages = messagesFor('grid_view');
    expect(messages).toHaveLength(1);
    const message = messages[0];
    // The message must name the class it looked for and both ways out, or it
    // only tells the developer something is broken with no next step.
    expect(message).toContain('sn-icon-grid-view');
    expect(message).toContain('@source inline');
    expect(message).toContain("type: 'ligature'");
  });

  it('stays quiet when the glyph resolves', async () => {
    stubContent('"\\ue9b0"');
    const fixture = TestBed.createComponent(DynamicIconHost);
    await fixture.whenStable();
    await frame();

    expect(messagesFor('grid_view')).toHaveLength(0);
  });

  it('warns once per name, not once per change detection', async () => {
    stubContent('none');
    const fixture = TestBed.createComponent(DynamicIconHost);
    await fixture.whenStable();
    await frame();
    expect(messagesFor('grid_view')).toHaveLength(1);

    // Something unrelated re-runs CD; the warning must not repeat, or it floods
    // the console for the rest of the session.
    fixture.detectChanges();
    await fixture.whenStable();
    await frame();
    expect(messagesFor('grid_view')).toHaveLength(1);
  });

  it('warns again when the name changes to another unresolved one', async () => {
    stubContent('none');
    const fixture = TestBed.createComponent(DynamicIconHost);
    await fixture.whenStable();
    await frame();

    fixture.componentInstance.name.set('some_other_icon');
    await fixture.whenStable();
    await frame();

    expect(messagesFor('grid_view')).toHaveLength(1);
    expect(messagesFor('some_other_icon')).toHaveLength(1);
  });

  it('says nothing in ligature mode, where there is no name to resolve', async () => {
    stubContent('none');
    const fixture = TestBed.createComponent(DynamicIconHost);
    fixture.componentInstance.name.set(undefined);
    await fixture.whenStable();
    await frame();

    expect(messagesFor('grid_view')).toHaveLength(0);
  });
});
