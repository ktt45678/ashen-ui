import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { InputGroup } from './input-group';
import { InputGroupAddon } from './input-group-addon';

@Component({
  template: `<sn-input-group></sn-input-group>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputGroup],
})
class DefaultHost {}

@Component({
  template: `
    <sn-input-group>
      <sn-input-group-addon></sn-input-group-addon>
      <input type="text" />
    </sn-input-group>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputGroup, InputGroupAddon],
})
class WithChildrenHost {}

@Component({
  template: `<sn-input-group snClass="extra"></sn-input-group>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputGroup],
})
class SnClassStringHost {}

@Component({
  template: `<sn-input-group [snClass]="{ root: 'r' }"></sn-input-group>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputGroup],
})
class SnClassObjectHost {}

@Component({
  template: `<sn-input-group
    [snStyle]="{ root: { outline: '1px solid red' } }"
    [snAttrs]="{ root: { 'data-testid': 'ig-root', role: 'presentation' } }"
  ></sn-input-group>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputGroup],
})
class SnPartHost {}

@Component({
  template: `<sn-input-group-addon></sn-input-group-addon>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputGroupAddon],
})
class AddonDefaultHost {}

@Component({
  template: `<sn-input-group-addon icon="search"></sn-input-group-addon>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputGroupAddon],
})
class AddonWithIconHost {}

@Component({
  template: `<sn-input-group-addon>https://</sn-input-group-addon>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputGroupAddon],
})
class AddonProjectedHost {}

@Component({
  template: `<sn-input-group-addon [snClass]="{ root: 'r', icon: 'i' }" icon="search"></sn-input-group-addon>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputGroupAddon],
})
class AddonSnClassHost {}

describe('InputGroup', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders host with class sn-input-group', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-input-group');
    expect(el.classList).toContain('sn-input-group');
  });

  it('renders host with role=group', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-input-group');
    expect(el.getAttribute('role')).toBe('group');
  });

  it('projects its children', async () => {
    const fixture = TestBed.createComponent(WithChildrenHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-input-group');
    const addon = el.querySelector('sn-input-group-addon');
    const input = el.querySelector('input');
    expect(addon).toBeTruthy();
    expect(input).toBeTruthy();
    // Verify order: addon first, then input
    const children = Array.from(el.children);
    expect(children[0].tagName.toLowerCase()).toBe('sn-input-group-addon');
    expect(children[1].tagName.toLowerCase()).toBe('input');
  });

  describe('snClass', () => {
    it('applies plain string to root element', async () => {
      const fixture = TestBed.createComponent(SnClassStringHost);
      await fixture.whenStable();
      const el: HTMLElement = fixture.nativeElement.querySelector('sn-input-group');
      expect(el.classList).toContain('extra');
    });

    it('applies object map root section to host', async () => {
      const fixture = TestBed.createComponent(SnClassObjectHost);
      await fixture.whenStable();
      const el: HTMLElement = fixture.nativeElement.querySelector('sn-input-group');
      expect(el.classList).toContain('r');
    });
  });

  it('applies snStyle and allowed snAttrs to the host while reserving role', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-input-group');

    expect(el.style.outline).toContain('red');
    expect(el.getAttribute('data-testid')).toBe('ig-root');
    // role is library-owned, so the pass-through cannot replace it.
    expect(el.getAttribute('role')).toBe('group');
  });
});

describe('InputGroupAddon', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders host with class sn-input-group-addon', async () => {
    const fixture = TestBed.createComponent(AddonDefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-input-group-addon');
    expect(el.classList).toContain('sn-input-group-addon');
  });

  it('with icon renders a span.sn-icon whose text is the icon', async () => {
    const fixture = TestBed.createComponent(AddonWithIconHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('.sn-icon');
    expect(icon).toBeTruthy();
    expect(icon.textContent?.trim()).toBe('search');
  });

  it('with icon does not project ng-content text', async () => {
    const fixture = TestBed.createComponent(AddonWithIconHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-input-group-addon');
    const contentNodes = Array.from(el.childNodes).filter(
      (node) => node.nodeType === Node.TEXT_NODE && (node.textContent?.trim() || '')
    );
    expect(contentNodes.length).toBe(0);
  });

  it('without icon projects its content', async () => {
    const fixture = TestBed.createComponent(AddonProjectedHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-input-group-addon');
    expect(el.textContent?.trim()).toBe('https://');
  });

  it('without icon does not render sn-icon span', async () => {
    const fixture = TestBed.createComponent(AddonProjectedHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('sn-input-group-addon .sn-icon');
    expect(icon).toBeNull();
  });

  describe('snClass', () => {
    it('applies object map root section to host', async () => {
      const fixture = TestBed.createComponent(AddonSnClassHost);
      await fixture.whenStable();
      const el: HTMLElement = fixture.nativeElement.querySelector('sn-input-group-addon');
      expect(el.classList).toContain('r');
    });

    it('applies object map icon section to icon span', async () => {
      const fixture = TestBed.createComponent(AddonSnClassHost);
      await fixture.whenStable();
      const icon = fixture.nativeElement.querySelector('.sn-icon');
      expect(icon.classList).toContain('i');
    });
  });
});
