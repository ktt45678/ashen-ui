import { Component, provideZonelessChangeDetection, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IconTemplate, SnIconRegistry, provideSnIcons } from 'ashen-ui/core';
import { Avatar } from './avatar';

@Component({
  template: `<sn-avatar [image]="image()" [label]="label()" [alt]="alt()" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Avatar],
})
class Host {
  readonly image = signal('');
  readonly label = signal('');
  readonly alt = signal<string | undefined>(undefined);
}

function setup<T>(type: new () => T) {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  const fixture = TestBed.createComponent(type);
  fixture.detectChanges();
  return fixture;
}

describe('Avatar', () => {
  it('renders the icon when nothing else is given', () => {
    const fixture = setup(Host);
    const icon = fixture.nativeElement.querySelector('.sn-avatar-icon');

    expect(icon.textContent.trim()).toBe('person');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
  });

  it('derives initials from the first and last word', () => {
    const fixture = setup(Host);
    fixture.componentInstance.label.set('Ada Lovelace');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.sn-avatar-initials').textContent.trim()).toBe('AL');
  });

  it('takes one initial from a single word', () => {
    const fixture = setup(Host);
    fixture.componentInstance.label.set('ada');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.sn-avatar-initials').textContent.trim()).toBe('A');
  });

  it('ignores the initials of a whitespace-only label', () => {
    const fixture = setup(Host);
    fixture.componentInstance.label.set('   ');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.sn-avatar-initials')).toBeNull();
    expect(fixture.nativeElement.querySelector('.sn-avatar-icon')).not.toBeNull();
  });

  it('prefers the image over the initials', () => {
    const fixture = setup(Host);
    fixture.componentInstance.label.set('Ada Lovelace');
    fixture.componentInstance.image.set('/u/1.jpg');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.sn-avatar-image')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.sn-avatar-initials')).toBeNull();
  });

  it('falls back to the initials when the image fails to load', () => {
    const fixture = setup(Host);
    fixture.componentInstance.label.set('Ada Lovelace');
    fixture.componentInstance.image.set('/missing.jpg');
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.sn-avatar-image').dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.sn-avatar-image')).toBeNull();
    expect(fixture.nativeElement.querySelector('.sn-avatar-initials').textContent.trim()).toBe('AL');
  });

  it('retries when the image changes after a failure', () => {
    const fixture = setup(Host);
    fixture.componentInstance.image.set('/missing.jpg');
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.sn-avatar-image').dispatchEvent(new Event('error'));
    fixture.detectChanges();

    fixture.componentInstance.image.set('/found.jpg');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.sn-avatar-image')).not.toBeNull();
  });

  it('labels the image with alt, falling back to label', () => {
    const fixture = setup(Host);
    fixture.componentInstance.label.set('Ada Lovelace');
    fixture.componentInstance.image.set('/u/1.jpg');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.sn-avatar-image').getAttribute('alt')).toBe(
      'Ada Lovelace',
    );

    fixture.componentInstance.alt.set('Portrait of Ada');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.sn-avatar-image').getAttribute('alt')).toBe(
      'Portrait of Ada',
    );
  });

  it('labels the host only when there is no image to carry the alt', () => {
    const fixture = setup(Host);
    const host = fixture.nativeElement.querySelector('sn-avatar');

    fixture.componentInstance.label.set('Ada Lovelace');
    fixture.detectChanges();
    expect(host.getAttribute('role')).toBe('img');
    expect(host.getAttribute('aria-label')).toBe('Ada Lovelace');

    fixture.componentInstance.image.set('/u/1.jpg');
    fixture.detectChanges();
    expect(host.getAttribute('role')).toBeNull();
    expect(host.getAttribute('aria-label')).toBeNull();
  });

  it('has no role when there is nothing to announce', () => {
    const fixture = setup(Host);
    const host = fixture.nativeElement.querySelector('sn-avatar');

    expect(host.getAttribute('role')).toBeNull();
    expect(host.getAttribute('aria-label')).toBeNull();
  });
});

describe('Avatar size and shape', () => {
  @Component({
    template: `<sn-avatar [size]="size()" [shape]="shape()" />`,
    imports: [Avatar],
  })
  class SizedHost {
    readonly size = signal<'sm' | 'md' | 'lg' | 'xl' | undefined>(undefined);
    readonly shape = signal<'circle' | 'square' | undefined>(undefined);
  }

  it('defaults to a medium circle', () => {
    const fixture = setup(SizedHost);
    const host = fixture.nativeElement.querySelector('sn-avatar');

    expect(host.getAttribute('data-sn-size')).toBe('md');
    expect(host.getAttribute('data-sn-shape')).toBe('circle');
    expect(host.classList.contains('sn-avatar--square')).toBe(false);
  });

  it('reflects size and shape as classes and state attributes', () => {
    const fixture = setup(SizedHost);
    fixture.componentInstance.size.set('xl');
    fixture.componentInstance.shape.set('square');
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('sn-avatar');

    expect(host.classList.contains('sn-avatar-xl')).toBe(true);
    expect(host.classList.contains('sn-avatar--square')).toBe(true);
    expect(host.getAttribute('data-sn-size')).toBe('xl');
    expect(host.getAttribute('data-sn-shape')).toBe('square');
  });
});

describe('Avatar icon customization', () => {
  @Component({
    template: `<sn-avatar icon="support_agent" />`,
    imports: [Avatar],
  })
  class IconInputHost {}

  @Component({
    template: `<sn-avatar><ng-template snIcon><i class="custom">x</i></ng-template></sn-avatar>`,
    imports: [Avatar, IconTemplate],
  })
  class IconTemplateHost {}

  it('takes a glyph from the icon input', () => {
    const fixture = setup(IconInputHost);
    expect(fixture.nativeElement.querySelector('.sn-avatar-icon').textContent.trim()).toBe(
      'support_agent',
    );
  });

  it('takes a template over the registry glyph', () => {
    const fixture = setup(IconTemplateHost);

    expect(fixture.nativeElement.querySelector('.custom')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.sn-avatar-icon')).toBeNull();
  });

  it('follows a registry alias', () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideSnIcons({ user: 'account_circle' })],
    });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.sn-avatar-icon').textContent.trim()).toBe(
      'account_circle',
    );

    TestBed.inject(SnIconRegistry).alias('user', 'face');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.sn-avatar-icon').textContent.trim()).toBe('face');
  });
});

describe('Avatar part pass-through', () => {
  @Component({
    template: `
      <sn-avatar
        [image]="image()"
        [label]="label()"
        [icon]="icon()"
        [snStyle]="{
          root: { outline: '1px solid red' },
          image: { color: 'rgb(1, 2, 3)' },
          initials: { color: 'rgb(4, 5, 6)' },
          icon: { color: 'rgb(7, 8, 9)' }
        }"
        [snAttrs]="{
          root: { 'data-testid': 'avatar-root', role: 'presentation', 'aria-label': 'hijacked' },
          image: { 'data-testid': 'avatar-image', src: '/evil.jpg', alt: 'hijacked alt' },
          initials: { 'data-testid': 'avatar-initials' },
          icon: { 'data-testid': 'avatar-icon', 'aria-hidden': 'false' }
        }"
      />
    `,
    imports: [Avatar],
  })
  class SnPartHost {
    readonly image = signal('');
    readonly label = signal('');
    readonly icon = signal('');
  }

  it('styles the initials part and keeps the host label', () => {
    const fixture = setup(SnPartHost);
    fixture.componentInstance.label.set('Ada Lovelace');
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('sn-avatar');
    const initials = fixture.nativeElement.querySelector('.sn-avatar-initials');

    expect(host.style.outline).toContain('red');
    expect(host.getAttribute('data-testid')).toBe('avatar-root');
    // role and aria-label are library-owned, so the pass-through cannot replace them.
    expect(host.getAttribute('role')).toBe('img');
    expect(host.getAttribute('aria-label')).toBe('Ada Lovelace');
    expect(initials.style.color).toBe('rgb(4, 5, 6)');
    expect(initials.getAttribute('data-testid')).toBe('avatar-initials');
  });

  it('styles the icon part but leaves aria-hidden reserved', () => {
    const fixture = setup(SnPartHost);
    fixture.componentInstance.icon.set('support_agent');
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('.sn-avatar-icon');

    expect(icon.style.color).toBe('rgb(7, 8, 9)');
    expect(icon.getAttribute('data-testid')).toBe('avatar-icon');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
  });

  it('styles the image part but keeps its own src and alt', () => {
    const fixture = setup(SnPartHost);
    fixture.componentInstance.label.set('Ada Lovelace');
    fixture.componentInstance.image.set('/u/1.jpg');
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('.sn-avatar-image');

    expect(image.style.color).toBe('rgb(1, 2, 3)');
    expect(image.getAttribute('data-testid')).toBe('avatar-image');
    // src and alt are reserved so a broken URL or a wrong label cannot be injected.
    expect(image.getAttribute('src')).toBe('/u/1.jpg');
    expect(image.getAttribute('alt')).toBe('Ada Lovelace');
  });
});
