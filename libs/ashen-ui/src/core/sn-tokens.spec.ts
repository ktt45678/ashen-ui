import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { SnButtonTokens, SnTokens as SnTokenMap } from 'ashen-ui/tokens';
import { SnTokenOverrides } from './sn-tokens';

const buttonTokens: SnTokenMap<keyof SnButtonTokens> = {
  '--sn-button-bg': 'var(--brand-accent)',
  '--sn-button-text': '#ffffff',
};

@Component({
  template: `<button [snTokens]="tokens()">Save</button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SnTokenOverrides],
})
class TokensHost {
  readonly tokens = signal<SnTokenMap>(buttonTokens);
}

describe('SnTokenOverrides', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('applies typed custom-property overrides to its host', async () => {
    const fixture = TestBed.createComponent(TokensHost);
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.style.getPropertyValue('--sn-button-bg')).toBe('var(--brand-accent)');
    expect(button.style.getPropertyValue('--sn-button-text')).toBe('#ffffff');
  });

  it('synchronizes replacements and removes stale overrides', async () => {
    const fixture = TestBed.createComponent(TokensHost);
    fixture.componentInstance.tokens.set({ '--sn-button-bg': 'rebeccapurple' });
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.style.getPropertyValue('--sn-button-bg')).toBe('rebeccapurple');
    expect(button.style.getPropertyValue('--sn-button-text')).toBe('');
  });

  it('does not apply non-Ashen properties received at runtime', async () => {
    const fixture = TestBed.createComponent(TokensHost);
    fixture.componentInstance.tokens.set({ color: 'red' } as unknown as SnTokenMap);
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.style.color).toBe('');
  });
});
