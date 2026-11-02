import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Card } from './card';
import { CardHeader } from './card-header';
import { CardTitle } from './card-title';
import { CardSubtitle } from './card-subtitle';
import { CardContent } from './card-content';
import { CardFooter } from './card-footer';

@Component({
  template: `
    <sn-card>
      <sn-card-title>Grid Settings</sn-card-title>
      <sn-card-subtitle>Main · 6 × 3 · 12 items</sn-card-subtitle>
      <sn-card-content>Grids hold button and widget tiles.</sn-card-content>
      <sn-card-footer><button>Save</button></sn-card-footer>
    </sn-card>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Card, CardTitle, CardSubtitle, CardContent, CardFooter],
})
class FullHost {}

@Component({
  template: `<sn-card><sn-card-content>Content only</sn-card-content></sn-card>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Card, CardContent],
})
class ContentOnlyHost {}

@Component({
  template: `
    <sn-card>
      <sn-card-header><img src="image.jpg" alt="preview" /></sn-card-header>
      <sn-card-content>With header image</sn-card-content>
    </sn-card>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Card, CardHeader, CardContent],
})
class WithHeaderHost {}

@Component({
  template: `
    <sn-card-header
      [snStyle]="{ outline: '1px solid red' }"
      [snAttrs]="{ 'data-testid': 'header-root' }"
    >Header</sn-card-header>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CardHeader],
})
class HeaderSnPartHost {}

@Component({
  template: `
    <sn-card-content
      [snStyle]="{ outline: '1px solid red' }"
      [snAttrs]="{ 'data-testid': 'content-root' }"
    >Content</sn-card-content>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CardContent],
})
class ContentSnPartHost {}

@Component({
  template: `
    <sn-card-footer
      [snStyle]="{ outline: '1px solid red' }"
      [snAttrs]="{ 'data-testid': 'footer-root' }"
    >Footer</sn-card-footer>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CardFooter],
})
class FooterSnPartHost {}

@Component({
  template: `
    <sn-card-title
      [snStyle]="{ outline: '1px solid red' }"
      [snAttrs]="{ 'data-testid': 'title-root' }"
    >Title</sn-card-title>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CardTitle],
})
class TitleSnPartHost {}

@Component({
  template: `
    <sn-card-subtitle
      [snStyle]="{ outline: '1px solid red' }"
      [snAttrs]="{ 'data-testid': 'subtitle-root' }"
    >Subtitle</sn-card-subtitle>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CardSubtitle],
})
class SubtitleSnPartHost {}

@Component({
  template: `<sn-card snClass="extra-class"><sn-card-content>Test</sn-card-content></sn-card>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Card, CardContent],
})
class SnClassStringHost {}

@Component({
  template: `<sn-card [snClass]="{ root: 'my-root' }"><sn-card-content>Test</sn-card-content></sn-card>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Card, CardContent],
})
class SnClassObjectHost {}

@Component({
  template: `<sn-card [snClass]="[{ root: 'first' }, { root: 'second' }]"><sn-card-content>Test</sn-card-content></sn-card>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Card, CardContent],
})
class SnClassArrayHost {}

@Component({
  template: `
    <sn-card
      [snStyle]="{ outline: '1px solid red' }"
      [snAttrs]="{ role: 'presentation', 'data-testid': 'card-root' }"
    >
      <sn-card-content>Part card</sn-card-content>
    </sn-card>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Card, CardContent],
})
class SnPartHost {}

describe('Card', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders root element with sn-card class', async () => {
    const fixture = TestBed.createComponent(FullHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-card');
    expect(el).not.toBeNull();
    expect(el.classList).toContain('sn-card');
  });

  it('projects content into the card', async () => {
    const fixture = TestBed.createComponent(ContentOnlyHost);
    await fixture.whenStable();
    const content = fixture.nativeElement.querySelector('.sn-card-content');
    expect(content).not.toBeNull();
    expect(content.textContent.trim()).toBe('Content only');
  });

  it('applies snStyle and allowed snAttrs to the root part', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement.querySelector('sn-card')!;
    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('card-root');
    expect(root.getAttribute('role')).toBe('presentation');
  });
});

describe('CardHeader', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders with sn-card-header class', async () => {
    const fixture = TestBed.createComponent(WithHeaderHost);
    await fixture.whenStable();
    const header = fixture.nativeElement.querySelector('sn-card-header');
    expect(header).not.toBeNull();
    expect(header.classList).toContain('sn-card-header');
  });

  it('projects content into the header', async () => {
    const fixture = TestBed.createComponent(WithHeaderHost);
    await fixture.whenStable();
    const img = fixture.nativeElement.querySelector('.sn-card-header img');
    expect(img).not.toBeNull();
  });

  it('applies snStyle and allowed snAttrs to the root part', async () => {
    const fixture = TestBed.createComponent(HeaderSnPartHost);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement.querySelector('sn-card-header')!;
    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('header-root');
  });
});

describe('CardTitle', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders with sn-card-title class', async () => {
    const fixture = TestBed.createComponent(FullHost);
    await fixture.whenStable();
    const title = fixture.nativeElement.querySelector('.sn-card-title');
    expect(title).not.toBeNull();
    expect(title.textContent.trim()).toBe('Grid Settings');
  });

  it('does not render when absent', async () => {
    const fixture = TestBed.createComponent(ContentOnlyHost);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.sn-card-title')).toBeNull();
  });

  it('applies snStyle and allowed snAttrs to the root part', async () => {
    const fixture = TestBed.createComponent(TitleSnPartHost);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement.querySelector('sn-card-title')!;
    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('title-root');
  });
});

describe('CardSubtitle', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders with sn-card-subtitle class', async () => {
    const fixture = TestBed.createComponent(FullHost);
    await fixture.whenStable();
    const subtitle = fixture.nativeElement.querySelector('.sn-card-subtitle');
    expect(subtitle).not.toBeNull();
    expect(subtitle.textContent.trim()).toBe('Main · 6 × 3 · 12 items');
  });

  it('does not render when absent', async () => {
    const fixture = TestBed.createComponent(ContentOnlyHost);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.sn-card-subtitle')).toBeNull();
  });

  it('applies snStyle and allowed snAttrs to the root part', async () => {
    const fixture = TestBed.createComponent(SubtitleSnPartHost);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement.querySelector('sn-card-subtitle')!;
    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('subtitle-root');
  });
});

describe('CardContent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders with sn-card-content class', async () => {
    const fixture = TestBed.createComponent(FullHost);
    await fixture.whenStable();
    const content = fixture.nativeElement.querySelector('.sn-card-content');
    expect(content).not.toBeNull();
    expect(content.textContent.trim()).toBe('Grids hold button and widget tiles.');
  });

  it('applies snStyle and allowed snAttrs to the root part', async () => {
    const fixture = TestBed.createComponent(ContentSnPartHost);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement.querySelector('sn-card-content')!;
    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('content-root');
  });
});

describe('CardFooter', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders with sn-card-footer class', async () => {
    const fixture = TestBed.createComponent(FullHost);
    await fixture.whenStable();
    const footer = fixture.nativeElement.querySelector('.sn-card-footer');
    expect(footer).not.toBeNull();
  });

  it('projects content into the footer', async () => {
    const fixture = TestBed.createComponent(FullHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('.sn-card-footer button');
    expect(btn).not.toBeNull();
    expect(btn.textContent.trim()).toBe('Save');
  });

  it('does not render when absent', async () => {
    const fixture = TestBed.createComponent(ContentOnlyHost);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.sn-card-footer')).toBeNull();
  });

  it('applies snStyle and allowed snAttrs to the root part', async () => {
    const fixture = TestBed.createComponent(FooterSnPartHost);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement.querySelector('sn-card-footer')!;
    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('footer-root');
  });
});

describe('Card snClass', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('applies plain string snClass to root element', async () => {
    const fixture = TestBed.createComponent(SnClassStringHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-card');
    expect(el.classList).toContain('extra-class');
  });

  it('applies object snClass root section to root element', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-card');
    expect(el.classList).toContain('my-root');
  });

  it('merges array snClass root sections in order', async () => {
    const fixture = TestBed.createComponent(SnClassArrayHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-card');
    expect(el.classList).toContain('first');
    expect(el.classList).toContain('second');
  });
});
