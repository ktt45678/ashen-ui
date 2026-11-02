import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Panel } from './panel';
import { IconTemplate, SnPanelIntl } from 'ashen-ui/core';

@Component({
  template: `<sn-panel header="Grid Settings">Content here</sn-panel>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Panel],
})
class BasicHost {}

@Component({
  template: `<sn-panel header="No Toggle">Body text</sn-panel>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Panel],
})
class NoToggleHost {}

@Component({
  template: `<sn-panel header="Toggleable" toggleable>Body text</sn-panel>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Panel],
})
class ToggleableHost {}

@Component({
  template: `<sn-panel header="Collapsed" toggleable [collapsed]="collapsed()">Body</sn-panel>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Panel],
})
class CollapsedModelHost {
  readonly collapsed = signal(true);
}

@Component({
  template: `<sn-panel header="With Icon" icon="info">Body</sn-panel>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Panel],
})
class WithIconHost {}

@Component({
  template: `<sn-panel header="Custom Title" toggleable>
    <span snPanelTitle>Custom Header</span>
    Body
  </sn-panel>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Panel],
})
class CustomTitleHost {}

@Component({
  template: `<sn-panel header="snClass String" snClass="extra-class">Body</sn-panel>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Panel],
})
class SnClassStringHost {}

@Component({
  template: `<sn-panel header="snClass Map" [snClass]="{ root: 'my-root', header: 'my-header', content: 'my-content' }">Body</sn-panel>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Panel],
})
class SnClassMapHost {}

@Component({
  template: `<sn-panel header="Labels" toggleable expandLabel="Open" collapseLabel="Close">Body</sn-panel>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Panel],
})
class LabelsHost {}

@Component({
  template: `<sn-panel header="Custom Chevron" toggleable>
    <ng-template snIcon="toggle"><span class="custom-toggle-icon">▶</span></ng-template>
    Body
  </sn-panel>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Panel, IconTemplate],
})
class CustomChevronHost {}

@Component({
  template: `
    <sn-panel
      header="Parts"
      icon="settings"
      toggleable
      [snStyle]="{
        root: { outline: '1px solid red' },
        header: { color: 'rgb(1, 2, 3)' },
        icon: { color: 'rgb(4, 5, 6)' },
        title: { color: 'rgb(7, 8, 9)' },
        actions: { color: 'rgb(10, 11, 12)' },
        toggle: { color: 'rgb(13, 14, 15)' },
        content: { color: 'rgb(16, 17, 18)' }
      }"
      [snAttrs]="{
        root: { 'data-testid': 'panel-root', 'data-sn-collapsed': 'invalid' },
        header: { 'data-testid': 'panel-header' },
        icon: { 'data-testid': 'panel-icon' },
        title: { 'data-testid': 'panel-title' },
        actions: { 'data-testid': 'panel-actions' },
        toggle: { 'data-testid': 'panel-toggle', 'aria-label': 'invalid label' },
        content: { 'data-testid': 'panel-content', id: 'invalid-id' }
      }"
    >
      Body
    </sn-panel>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Panel],
})
class SnPartHost {}

describe('Panel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders root element with sn-panel class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-panel');
    expect(el).not.toBeNull();
    expect(el.classList).toContain('sn-panel');
  });

  it('renders header string in .sn-panel-title', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const title = fixture.nativeElement.querySelector('.sn-panel-title');
    expect(title).not.toBeNull();
    expect(title.textContent.trim()).toBe('Grid Settings');
  });

  it('renders .sn-panel-header', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const header = fixture.nativeElement.querySelector('.sn-panel-header');
    expect(header).not.toBeNull();
  });

  it('renders .sn-panel-content when not collapsed', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const content = fixture.nativeElement.querySelector('.sn-panel-content');
    expect(content).not.toBeNull();
    expect(content.textContent.trim()).toBe('Content here');
  });

  it('does not render toggle button when toggleable is false', async () => {
    const fixture = TestBed.createComponent(NoToggleHost);
    await fixture.whenStable();
    const toggle = fixture.nativeElement.querySelector('.sn-panel-toggle');
    expect(toggle).toBeNull();
  });

  it('renders toggle button when toggleable is true', async () => {
    const fixture = TestBed.createComponent(ToggleableHost);
    await fixture.whenStable();
    const toggle = fixture.nativeElement.querySelector('.sn-panel-toggle');
    expect(toggle).not.toBeNull();
  });

  it('toggle button has aria-expanded=true when expanded', async () => {
    const fixture = TestBed.createComponent(ToggleableHost);
    await fixture.whenStable();
    const toggle: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-panel-toggle');
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
  });

  it('toggle button has aria-expanded=false when collapsed', async () => {
    const fixture = TestBed.createComponent(CollapsedModelHost);
    await fixture.whenStable();
    const toggle: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-panel-toggle');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('clicking toggle flips collapsed model from false to true', async () => {
    const fixture = TestBed.createComponent(ToggleableHost);
    await fixture.whenStable();
    const toggle: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-panel-toggle');
    toggle.click();
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('clicking toggle twice restores collapsed=false', async () => {
    const fixture = TestBed.createComponent(ToggleableHost);
    await fixture.whenStable();
    const toggle: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-panel-toggle');
    toggle.click();
    await fixture.whenStable();
    toggle.click();
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    const content = fixture.nativeElement.querySelector('.sn-panel-content');
    expect(content).not.toBeNull();
  });

  it('content wrapper has inert attribute when collapsed', async () => {
    const fixture = TestBed.createComponent(CollapsedModelHost);
    await fixture.whenStable();
    const wrapper: HTMLElement = fixture.nativeElement.querySelector('.sn-panel-content-wrapper');
    expect(wrapper).not.toBeNull();
    expect(wrapper.hasAttribute('inert')).toBe(true);
  });

  it('content wrapper does not have inert attribute when expanded', async () => {
    const fixture = TestBed.createComponent(ToggleableHost);
    await fixture.whenStable();
    const wrapper: HTMLElement = fixture.nativeElement.querySelector('.sn-panel-content-wrapper');
    expect(wrapper.hasAttribute('inert')).toBe(false);
  });

  it('header loses bottom border class when collapsed', async () => {
    const fixture = TestBed.createComponent(CollapsedModelHost);
    await fixture.whenStable();
    const header = fixture.nativeElement.querySelector('.sn-panel-header');
    expect(header.classList).toContain('sn-panel-header--collapsed');
  });

  it('aria-controls on toggle matches content id', async () => {
    const fixture = TestBed.createComponent(ToggleableHost);
    await fixture.whenStable();
    const toggle: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-panel-toggle');
    const content: HTMLElement = fixture.nativeElement.querySelector('.sn-panel-content');
    expect(toggle.getAttribute('aria-controls')).toBe(content.id);
    expect(content.id).toMatch(/^sn-panel-content-\d+$/);
  });

  it('renders icon when icon input is provided', async () => {
    const fixture = TestBed.createComponent(WithIconHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('.sn-panel-icon');
    expect(icon).not.toBeNull();
  });

  it('does not render icon when icon input is empty', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('.sn-panel-icon');
    expect(icon).toBeNull();
  });

  it('applies snClass plain string to root element', async () => {
    const fixture = TestBed.createComponent(SnClassStringHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-panel');
    expect(el.classList).toContain('extra-class');
  });

  it('applies snClass map sections to respective elements', async () => {
    const fixture = TestBed.createComponent(SnClassMapHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-panel');
    expect(el.classList).toContain('my-root');
    const header: HTMLElement = fixture.nativeElement.querySelector('.sn-panel-header');
    expect(header.classList).toContain('my-header');
    const content: HTMLElement = fixture.nativeElement.querySelector('.sn-panel-content');
    expect(content.classList).toContain('my-content');
  });

  it('uses English default aria-label when expanded', async () => {
    const fixture = TestBed.createComponent(ToggleableHost);
    await fixture.whenStable();
    const toggle: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-panel-toggle');
    expect(toggle.getAttribute('aria-label')).toBe('Collapse');
  });

  it('uses English default aria-label when collapsed', async () => {
    const fixture = TestBed.createComponent(CollapsedModelHost);
    await fixture.whenStable();
    const toggle: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-panel-toggle');
    expect(toggle.getAttribute('aria-label')).toBe('Expand');
  });

  it('uses instance expandLabel input over default', async () => {
    const fixture = TestBed.createComponent(LabelsHost);
    await fixture.whenStable();
    const toggle: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-panel-toggle');
    expect(toggle.getAttribute('aria-label')).toBe('Close');
    toggle.click();
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-label')).toBe('Open');
  });

  it('uses an SnPanelIntl override when no instance input provided', async () => {
    TestBed.overrideProvider(SnPanelIntl, {
      useValue: Object.assign(new SnPanelIntl(), { expand: 'Ouvrir', collapse: 'Fermer' }),
    });
    const fixture = TestBed.createComponent(ToggleableHost);
    await fixture.whenStable();
    const toggle: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-panel-toggle');
    expect(toggle.getAttribute('aria-label')).toBe('Fermer');
  });

  it('renders custom chevron template when snIcon="toggle" provided', async () => {
    const fixture = TestBed.createComponent(CustomChevronHost);
    await fixture.whenStable();
    const customIcon = fixture.nativeElement.querySelector('.custom-toggle-icon');
    expect(customIcon).not.toBeNull();
    const defaultIcon = fixture.nativeElement.querySelector('.sn-panel-toggle-icon');
    expect(defaultIcon).toBeNull();
  });

  it('projects custom title via [snPanelTitle]', async () => {
    const fixture = TestBed.createComponent(CustomTitleHost);
    await fixture.whenStable();
    const title = fixture.nativeElement.querySelector('.sn-panel-title');
    expect(title.textContent.trim()).toContain('Custom Header');
  });

  it('does not have sn-panel-animate immediately after first render', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-panel');
    expect(el.classList.contains('sn-panel-animate')).toBe(false);
  });

  it('adds sn-panel-animate after two animation frames', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-panel');
    expect(el.classList.contains('sn-panel-animate')).toBe(true);
  });
});

@Component({
  template: `<sn-panel header="Animated" toggleable [animated]="animated">Body</sn-panel>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Panel],
})
class AnimatedHost {
  animated = true;
}

@Component({
  template: `<sn-panel header="No Anim" toggleable [animated]="false">Body</sn-panel>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Panel],
})
class NoAnimHost {}

describe('Panel - animation inputs', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('content wrapper has sn-panel-content-wrapper--animated class when animated=true', async () => {
    const fixture = TestBed.createComponent(AnimatedHost);
    await fixture.whenStable();
    const wrapper: HTMLElement = fixture.nativeElement.querySelector('.sn-panel-content-wrapper');
    expect(wrapper.classList).toContain('sn-panel-content-wrapper--animated');
  });

  it('content wrapper lacks sn-panel-content-wrapper--animated class when animated=false', async () => {
    const fixture = TestBed.createComponent(NoAnimHost);
    await fixture.whenStable();
    const wrapper: HTMLElement = fixture.nativeElement.querySelector('.sn-panel-content-wrapper');
    expect(wrapper.classList).not.toContain('sn-panel-content-wrapper--animated');
  });

  it('content wrapper has sn-panel-content-wrapper--expanded when not collapsed', async () => {
    const fixture = TestBed.createComponent(AnimatedHost);
    await fixture.whenStable();
    const wrapper: HTMLElement = fixture.nativeElement.querySelector('.sn-panel-content-wrapper');
    expect(wrapper.classList).toContain('sn-panel-content-wrapper--expanded');
  });

  it('content wrapper lacks sn-panel-content-wrapper--expanded when collapsed', async () => {
    const fixture = TestBed.createComponent(CollapsedModelHost);
    await fixture.whenStable();
    const wrapper: HTMLElement = fixture.nativeElement.querySelector('.sn-panel-content-wrapper');
    expect(wrapper.classList).not.toContain('sn-panel-content-wrapper--expanded');
  });

  it('applies snStyle and allowed snAttrs to named parts without replacing panel semantics', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const root: HTMLElement = el.querySelector('sn-panel')!;
    const header: HTMLElement = el.querySelector('.sn-panel-header')!;
    const icon: HTMLElement = el.querySelector('.sn-panel-icon')!;
    const title: HTMLElement = el.querySelector('.sn-panel-title')!;
    const actions: HTMLElement = el.querySelector('.sn-panel-actions')!;
    const toggle: HTMLElement = el.querySelector('.sn-panel-toggle')!;
    const content: HTMLElement = el.querySelector('.sn-panel-content')!;

    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('panel-root');
    // The panel is expanded, so the reserved state attribute stays absent.
    expect(root.getAttribute('data-sn-collapsed')).toBeNull();
    expect(header.style.color).toBe('rgb(1, 2, 3)');
    expect(header.getAttribute('data-testid')).toBe('panel-header');
    expect(icon.style.color).toBe('rgb(4, 5, 6)');
    expect(icon.getAttribute('data-testid')).toBe('panel-icon');
    expect(title.style.color).toBe('rgb(7, 8, 9)');
    expect(title.getAttribute('data-testid')).toBe('panel-title');
    expect(actions.style.color).toBe('rgb(10, 11, 12)');
    expect(actions.getAttribute('data-testid')).toBe('panel-actions');
    expect(toggle.style.color).toBe('rgb(13, 14, 15)');
    expect(toggle.getAttribute('data-testid')).toBe('panel-toggle');
    expect(toggle.getAttribute('aria-label')).not.toBe('invalid label');
    expect(content.style.color).toBe('rgb(16, 17, 18)');
    expect(content.getAttribute('data-testid')).toBe('panel-content');
    expect(content.getAttribute('id')).not.toBe('invalid-id');
    // The toggle's aria-controls still points at the real content id.
    expect(toggle.getAttribute('aria-controls')).toBe(content.getAttribute('id'));
  });
});
