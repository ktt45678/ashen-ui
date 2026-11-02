import { Component, provideZonelessChangeDetection, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Message } from 'ashen-ui/message';
import { Select } from 'ashen-ui/select';
import {
  SN_DEFAULT_ICONS,
  SN_ICON_LOADING_FALLBACK,
  SnIconRegistry,
  provideSnIcons,
} from './sn-icon-registry';
import { provideAshenUI } from '../provide-ashen-ui';

@Component({
  template: `<sn-message severity="error" closable>Boom</sn-message>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Message],
})
class MessageHost {}

@Component({
  template: `<sn-select placeholder="Pick" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Select],
})
class SelectHost {}

/** Glyph text of the nth `<sn-icon>` in the fixture. */
function glyphs(fixture: { nativeElement: HTMLElement }): string[] {
  return [...fixture.nativeElement.querySelectorAll('.sn-icon')].map((el) =>
    (el.textContent ?? '').trim(),
  );
}

describe('SnIconRegistry', () => {
  describe('resolution', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    });

    it('resolves every semantic name to its Material Symbols default', () => {
      const registry = TestBed.inject(SnIconRegistry);
      for (const [name, glyph] of Object.entries(SN_DEFAULT_ICONS)) {
        expect(registry.resolve(name as never)).toBe(glyph);
      }
    });

    it('alias() changes one glyph and leaves the rest alone', () => {
      const registry = TestBed.inject(SnIconRegistry);
      registry.alias('close', 'cancel');
      expect(registry.resolve('close')).toBe('cancel');
      expect(registry.resolve('check')).toBe(SN_DEFAULT_ICONS.check);
    });

    it('aliasAll() merges rather than replaces', () => {
      const registry = TestBed.inject(SnIconRegistry);
      registry.aliasAll({ close: 'cancel', check: 'done' });
      expect(registry.resolve('close')).toBe('cancel');
      expect(registry.resolve('check')).toBe('done');
      expect(registry.resolve('chevron-down')).toBe(SN_DEFAULT_ICONS['chevron-down']);
    });
  });

  describe('provideSnIcons', () => {
    it('applies overrides and keeps the defaults for omitted keys', () => {
      TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection(), provideSnIcons({ close: 'cancel' })],
      });
      const registry = TestBed.inject(SnIconRegistry);
      expect(registry.resolve('close')).toBe('cancel');
      // A partially-filled overrides object must not blank out the rest.
      expect(registry.resolve('chevron-down')).toBe(SN_DEFAULT_ICONS['chevron-down']);
    });

    it('is reachable through provideAshenUI({ icons })', () => {
      TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          provideAshenUI({ icons: { 'chevron-down': 'expand_more' } }),
        ],
      });
      expect(TestBed.inject(SnIconRegistry).resolve('chevron-down')).toBe('expand_more');
    });

    it('configures the global font-loading fallback independently of semantic aliases', () => {
      TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          provideSnIcons({ loadingFallback: 'placeholder' }),
        ],
      });
      expect(TestBed.inject(SN_ICON_LOADING_FALLBACK)).toBe('placeholder');
      expect(TestBed.inject(SnIconRegistry).resolve('close')).toBe(SN_DEFAULT_ICONS.close);
    });

    it('passes the font-loading fallback through provideAshenUI({ icons })', () => {
      TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          provideAshenUI({ icons: { loadingFallback: 'text' } }),
        ],
      });
      expect(TestBed.inject(SN_ICON_LOADING_FALLBACK)).toBe('text');
    });
  });

  describe('components draw through the registry', () => {
    it('Message renders the severity and close glyphs the registry resolves', async () => {
      TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
      const fixture = TestBed.createComponent(MessageHost);
      await fixture.whenStable();
      // severity="error" picks the 'error' semantic icon; closable adds 'close'.
      expect(glyphs(fixture)).toEqual([SN_DEFAULT_ICONS.error, SN_DEFAULT_ICONS.close]);
    });

    it('Message follows provideSnIcons overrides', async () => {
      TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          provideSnIcons({ error: 'report', close: 'cancel' }),
        ],
      });
      const fixture = TestBed.createComponent(MessageHost);
      await fixture.whenStable();
      expect(glyphs(fixture)).toEqual(['report', 'cancel']);
    });

    it('Select draws the shared chevron, not a hardcoded glyph', async () => {
      TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection(), provideSnIcons({ 'chevron-down': 'unfold_more' })],
      });
      const fixture = TestBed.createComponent(SelectHost);
      await fixture.whenStable();
      expect(glyphs(fixture)).toContain('unfold_more');
    });

    it('alias() after bootstrap repaints an already-rendered component', async () => {
      TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
      const fixture = TestBed.createComponent(MessageHost);
      await fixture.whenStable();
      expect(glyphs(fixture)).toContain(SN_DEFAULT_ICONS.close);

      // The whole reason the map is a signal: an OnPush component in a zoneless
      // app must re-render off a runtime remap, not just off construction.
      TestBed.inject(SnIconRegistry).alias('close', 'cancel');
      await fixture.whenStable();
      expect(glyphs(fixture)).toContain('cancel');
      expect(glyphs(fixture)).not.toContain(SN_DEFAULT_ICONS.close);
    });
  });
});
