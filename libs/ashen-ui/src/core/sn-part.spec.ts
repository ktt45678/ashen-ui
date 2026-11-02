import { Component, forwardRef, input, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import {
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnPartSource,
  type SnStyle,
  resolveSnAttrs,
  resolveSnStyle,
} from './sn-part';

@Component({
  selector: 'sn-part-host',
  imports: [SnPart],
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => PartHost) }],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<div class="part" snPart="panel"></div>`,
})
class PartHost implements SnPartSource {
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    section === 'panel' ? ['role'] : [];
}

@Component({
  imports: [PartHost],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<sn-part-host [snStyle]="style()" [snAttrs]="attrs()" />`,
})
class Host {
  readonly style = input<SnStyle>();
  readonly attrs = input<SnAttrs>();
}

describe('snPart', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('resolves bare values only for the root section', () => {
    expect(resolveSnStyle({ minWidth: '18rem' }, 'root', true)).toEqual({ minWidth: '18rem' });
    expect(resolveSnStyle({ minWidth: '18rem' }, 'panel', false)).toEqual({});
    expect(resolveSnAttrs({ 'data-testid': 'trigger' }, 'root', true)).toEqual({
      'data-testid': 'trigger',
    });
    expect(resolveSnAttrs({ 'data-testid': 'trigger' }, 'panel', false)).toEqual({});
  });

  it('resolves a named section', () => {
    expect(resolveSnStyle({ panel: { minWidth: '18rem' } }, 'panel', false)).toEqual({
      minWidth: '18rem',
    });
    expect(resolveSnAttrs({ panel: { 'data-testid': 'language-panel' } }, 'panel', false)).toEqual({
      'data-testid': 'language-panel',
    });
  });

  it('applies styles and attributes to a named part', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentRef.setInput('style', { panel: { minWidth: '18rem', '--sn-accent': 'red' } });
    fixture.componentRef.setInput('attrs', {
      panel: { 'data-testid': 'language-panel', 'aria-hidden': false },
    });
    await fixture.whenStable();

    const part = fixture.nativeElement.querySelector('.part') as HTMLElement;
    expect(part.style.minWidth).toBe('18rem');
    expect(part.style.getPropertyValue('--sn-accent')).toBe('red');
    expect(part.getAttribute('data-testid')).toBe('language-panel');
    expect(part.getAttribute('aria-hidden')).toBe('false');
  });

  it('removes stale styles and attributes', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentRef.setInput('style', { panel: { minWidth: '18rem' } });
    fixture.componentRef.setInput('attrs', { panel: { 'data-testid': 'language-panel' } });
    await fixture.whenStable();

    fixture.componentRef.setInput('style', { panel: { maxWidth: '24rem' } });
    fixture.componentRef.setInput('attrs', { panel: { 'data-testid': null } });
    await fixture.whenStable();

    const part = fixture.nativeElement.querySelector('.part') as HTMLElement;
    expect(part.style.minWidth).toBe('');
    expect(part.style.maxWidth).toBe('24rem');
    expect(part.getAttribute('data-testid')).toBeNull();
  });

  it('rejects event, class, style, state, and reserved attributes', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentRef.setInput('attrs', {
      panel: {
        class: 'override',
        style: 'display: none',
        onclick: 'bad()',
        'data-sn-open': 'true',
        role: 'button',
        'data-testid': 'allowed',
      },
    });
    await fixture.whenStable();

    const part = fixture.nativeElement.querySelector('.part') as HTMLElement;
    expect(part.classList).toContain('part');
    expect(part.getAttribute('style')).toBeNull();
    expect(part.getAttribute('onclick')).toBeNull();
    expect(part.getAttribute('data-sn-open')).toBeNull();
    expect(part.getAttribute('role')).toBeNull();
    expect(part.getAttribute('data-testid')).toBe('allowed');
  });
});
