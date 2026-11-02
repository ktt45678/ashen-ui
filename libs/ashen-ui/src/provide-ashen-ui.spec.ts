import { describe, it, expect, beforeEach } from 'vitest';
import {
  Component,
  Injector,
  type Type,
  provideZonelessChangeDetection,
  runInInjectionContext,
  signal,
  ChangeDetectionStrategy
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  SN_ANIMATIONS_DISABLED,
  SnErrorStateMatcher,
  SnImmediateErrorStateMatcher,
  snAnimationsDisabled,
} from 'ashen-ui/core';
import { Button, SN_BUTTON_DEFAULTS } from 'ashen-ui/button';
import { SplitButton } from 'ashen-ui/split-button';
import { Menu, MenuItem } from 'ashen-ui/menu';
import { InputText } from 'ashen-ui/input-text';
import { Textarea } from 'ashen-ui/textarea';
import { InputPassword } from 'ashen-ui/input-password';
import { InputTags } from 'ashen-ui/input-tags';
import { Dialog } from 'ashen-ui/dialog';
import { Drawer } from 'ashen-ui/drawer';
import { Tooltip } from 'ashen-ui/tooltip';
import { Toast, ToastService } from 'ashen-ui/toast';
import { Paginator } from 'ashen-ui/paginator';
import { Table } from 'ashen-ui/table';
import { provideAshenUI } from './provide-ashen-ui';

@Component({
  template: `
    <button snButton>Go</button>
    <sn-split-button [menuFor]="m">Save</sn-split-button>
    <sn-menu #m><button snMenuItem>Item</button></sn-menu>

    <input snInputText />
    <textarea snTextarea></textarea>
    <sn-input-password />
    <sn-input-tags />

    <sn-dialog />
    <sn-drawer />
    <span [snTooltip]="'hi'">hover</span>
    <sn-toast />
    <sn-paginator [totalRecords]="100" />
    <sn-table [value]="rows()" />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    Button,
    SplitButton,
    Menu,
    MenuItem,
    InputText,
    Textarea,
    InputPassword,
    InputTags,
    Dialog,
    Drawer,
    Tooltip,
    Toast,
    Paginator,
    Table,
  ],
})
class Kitchen {
  readonly rows = signal<Array<{ id: number }>>([]);
}

/** Instantiate the kitchen-sink host under a given set of providers. */
async function mount(providers: unknown[]) {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection(), ...(providers as never[])],
  });
  const fixture = TestBed.createComponent(Kitchen);
  await fixture.whenStable();
  return fixture;
}

/**
 * The directive/component instance for `type` inside `fixture`.
 *
 * `injector.get` rather than `componentInstance`, because half of these are
 * attribute directives (`input[snInputText]`, `[snTooltip]`) whose debug
 * element's `componentInstance` is the *host* component, not the directive.
 */
function instance<T>(fixture: { debugElement: import('@angular/core').DebugElement }, type: Type<T>): T {
  return fixture.debugElement.query(By.directive(type)).injector.get(type);
}

describe('provideAshenUI: nothing configured', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('leaves every component on its own default', async () => {
    const f = await mount([provideAshenUI()]);
    expect(instance(f, Button).size()).toBe('md');
    expect(instance(f, Button).variant()).toBe('base');
    expect(instance(f, Button).color()).toBe('primary');
    expect(instance(f, InputText).size()).toBe('md');
    expect(instance(f, Dialog).size()).toBe('md');
    expect(instance(f, Drawer).position()).toBe('right');
    expect(instance(f, Toast).position()).toBe('top-right');
    expect(instance(f, Paginator).rows()).toBe(10);
    expect(instance(f, Table).striped()).toBe(false);
    expect(instance(f, Table).hover()).toBe(true);
  });

  it('registers no providers for keys that were not passed', async () => {
    // An empty `{}` for a key would still shadow an outer-injector default, so
    // the aggregator must skip absent keys entirely rather than provide `{}`.
    const f = await mount([
      { provide: SN_BUTTON_DEFAULTS, useValue: { size: 'lg' } },
      provideAshenUI({ defaults: { input: { size: 'sm' } } }),
    ]);
    expect(instance(f, Button).size()).toBe('lg');
    expect(instance(f, InputText).size()).toBe('sm');
  });
});

describe('provideAshenUI: per-component defaults', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('applies button defaults, and sn-split-button follows them', async () => {
    const f = await mount([
      provideAshenUI({ defaults: { button: { size: 'sm', variant: 'outlined', color: 'error' } } }),
    ]);
    expect(instance(f, Button).size()).toBe('sm');
    expect(instance(f, Button).variant()).toBe('outlined');
    expect(instance(f, Button).color()).toBe('error');

    // A split button renders a button; an app that says "buttons are small"
    // means these too, without a second knob.
    expect(instance(f, SplitButton).size()).toBe('sm');
    expect(instance(f, SplitButton).variant()).toBe('outlined');
    expect(instance(f, SplitButton).color()).toBe('error');
  });

  it('applies one input size across all four text controls', async () => {
    const f = await mount([provideAshenUI({ defaults: { input: { size: 'lg' } } })]);
    expect(instance(f, InputText).size()).toBe('lg');
    expect(instance(f, Textarea).size()).toBe('lg');
    expect(instance(f, InputPassword).size()).toBe('lg');
    expect(instance(f, InputTags).size()).toBe('lg');
  });

  it('applies dialog, drawer, tooltip, paginator and table defaults', async () => {
    const f = await mount([
      provideAshenUI({
        defaults: {
          dialog: { size: 'lg' },
          drawer: { position: 'left', mask: false, width: '480px' },
          tooltip: { position: 'right', showDelay: 0, hideDelay: 0 },
          paginator: { rows: 25, rowsPerPageOptions: [25, 50], siblings: 2, showEdges: false },
          table: { striped: true, hover: false, layout: 'flex', rowHeight: 56 },
        },
      }),
    ]);
    expect(instance(f, Dialog).size()).toBe('lg');

    const drawer = instance(f, Drawer);
    expect(drawer.position()).toBe('left');
    expect(drawer.width()).toBe('480px');
    // `false` must survive: a `||` fallback would have put the mask back.
    expect(drawer.mask()).toBe(false);

    const tooltip = instance(f, Tooltip);
    expect(tooltip.snTooltipPosition()).toBe('right');
    expect(tooltip.snTooltipShowDelay()).toBe(0);
    expect(tooltip.snTooltipHideDelay()).toBe(0);

    const paginator = instance(f, Paginator);
    expect(paginator.rows()).toBe(25);
    expect(paginator.rowsPerPageOptions()).toEqual([25, 50]);
    expect(paginator.siblings()).toBe(2);
    expect(paginator.showEdges()).toBe(false);

    const table = instance(f, Table);
    expect(table.striped()).toBe(true);
    expect(table.hover()).toBe(false);
    expect(table.layout()).toBe('flex');
    expect(table.rowHeight()).toBe(56);
  });
});

@Component({
  template: `<button snButton size="lg">Go</button><input snInputText size="sm" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Button, InputText],
})
class ExplicitHost {}

describe('an explicit binding beats the configured default', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('keeps the template value', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideAshenUI({ defaults: { button: { size: 'sm' }, input: { size: 'lg' } } }),
      ],
    });
    const f = TestBed.createComponent(ExplicitHost);
    await f.whenStable();
    expect(instance(f, Button).size()).toBe('lg');
    expect(instance(f, InputText).size()).toBe('sm');
  });
});

describe('provideAshenUI: toast service defaults', () => {
  beforeEach(() => TestBed.resetTestingModule());

  function serviceWith(providers: unknown[]) {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), ...(providers as never[])],
    });
    return TestBed.inject(ToastService);
  }

  it('uses the library defaults when nothing is configured', () => {
    const service = serviceWith([]);
    service.show({ summary: 'hi' });
    const item = service.items()[0];
    expect(item.life).toBe(3000);
    expect(item.closable).toBe(true);
    expect(item.severity).toBe('info');
    expect(item.sticky).toBe(false);
  });

  it('applies configured life/closable/severity/sticky', () => {
    const service = serviceWith([
      provideAshenUI({
        defaults: { toast: { life: 8000, closable: false, severity: 'warning', sticky: true } },
      }),
    ]);
    service.show({ summary: 'hi' });
    const item = service.items()[0];
    expect(item.life).toBe(8000);
    expect(item.closable).toBe(false);
    expect(item.severity).toBe('warning');
    expect(item.sticky).toBe(true);
  });

  it('lets an explicit show() option win, including falsy ones', () => {
    const service = serviceWith([
      provideAshenUI({ defaults: { toast: { life: 8000, closable: true } } }),
    ]);
    // `life: 0` means "never auto-dismiss" and `closable: false` means "no close
    // button". Both are falsy; both must reach the item.
    service.show({ summary: 'hi', life: 0, closable: false });
    const item = service.items()[0];
    expect(item.life).toBe(0);
    expect(item.closable).toBe(false);
  });
});

describe('provideAshenUI: animations and error state', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it("wires animations: 'disabled' through to SN_ANIMATIONS_DISABLED", () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideAshenUI({ animations: 'disabled' })],
    });
    expect(TestBed.inject(SN_ANIMATIONS_DISABLED)).toBe(true);
    const off = runInInjectionContext(TestBed.inject(Injector), snAnimationsDisabled);
    expect(off()).toBe(true);
  });

  it('leaves the animations token unprovided when nothing is asked for', () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideAshenUI()],
    });
    expect(TestBed.inject(SN_ANIMATIONS_DISABLED, null, { optional: true })).toBeNull();
  });

  it('swaps the error state matcher', () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideAshenUI({ errorStateMatcher: SnImmediateErrorStateMatcher }),
      ],
    });
    const matcher = TestBed.inject(SnErrorStateMatcher);
    expect(matcher).toBeInstanceOf(SnImmediateErrorStateMatcher);
    // The point of the swap: errored before any interaction.
    expect(matcher.isErrorState({ invalid: true, touched: false, dirty: false } as never, null)).toBe(
      true,
    );
  });

  it('keeps the Material-style default matcher when none is configured', () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideAshenUI()],
    });
    const matcher = TestBed.inject(SnErrorStateMatcher);
    expect(matcher.isErrorState({ invalid: true, touched: false, dirty: false } as never, null)).toBe(
      false,
    );
  });
});
