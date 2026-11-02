import { Component, provideZonelessChangeDetection, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Toggle } from 'ashen-ui/toggle';
import { SnToggleHarness } from './toggle-harness';

@Component({
  template: `
    <sn-toggle [disabled]="disabled()">Dark mode</sn-toggle>
    <sn-toggle [checked]="true">Notifications</sn-toggle>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Toggle],
})
class Host {
  readonly disabled = signal(false);
}

describe('SnToggleHarness', () => {
  let loader: HarnessLoader;
  let host: Host;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('finds every toggle on the page', async () => {
    expect((await loader.getAllHarnesses(SnToggleHarness)).length).toBe(2);
  });

  it('filters by label and by checked state', async () => {
    const byLabel = await loader.getHarness(SnToggleHarness.with({ label: 'Notifications' }));
    expect(await byLabel.isChecked()).toBe(true);

    const checked = await loader.getAllHarnesses(SnToggleHarness.with({ checked: true }));
    expect(checked.length).toBe(1);
  });

  it('check() and uncheck() are idempotent', async () => {
    const toggle = await loader.getHarness(SnToggleHarness.with({ label: 'Dark mode' }));

    await toggle.check();
    await toggle.check();
    expect(await toggle.isChecked()).toBe(true);

    await toggle.uncheck();
    await toggle.uncheck();
    expect(await toggle.isChecked()).toBe(false);
  });

  it('does not flip a disabled toggle', async () => {
    host.disabled.set(true);
    const toggle = await loader.getHarness(SnToggleHarness.with({ label: 'Dark mode' }));
    expect(await toggle.isDisabled()).toBe(true);

    await toggle.toggle();
    expect(await toggle.isChecked()).toBe(false);
  });

  it('sees a state change made outside the harness', async () => {
    const toggle = await loader.getHarness(SnToggleHarness.with({ label: 'Dark mode' }));

    host.disabled.set(true);
    // No detectChanges(): the harness has to stabilize the fixture itself.
    expect(await toggle.isDisabled()).toBe(true);
  });

  it('focuses and blurs', async () => {
    const toggle = await loader.getHarness(SnToggleHarness.with({ label: 'Dark mode' }));

    await toggle.focus();
    expect(await toggle.isFocused()).toBe(true);

    await toggle.blur();
    expect(await toggle.isFocused()).toBe(false);
  });
});
