import { Component, provideZonelessChangeDetection, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Checkbox } from 'ashen-ui/checkbox';
import { SnCheckboxHarness } from './checkbox-harness';

/**
 * `TestbedHarnessEnvironment.forceStabilize()` historically leaned on
 * zone-based stability, and this library is zoneless. Every assertion here goes
 * through the harness API rather than a selector, and every state change is
 * driven by a harness action rather than `fixture.detectChanges()`.
 */
@Component({
  template: `
    <sn-checkbox [disabled]="disabled()">Accept terms</sn-checkbox>
    <sn-checkbox [checked]="true">Remember me</sn-checkbox>
    <sn-checkbox indeterminate>Partial</sn-checkbox>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Checkbox],
})
class Host {
  readonly disabled = signal(false);
}

describe('SnCheckboxHarness', () => {
  let loader: HarnessLoader;
  let host: Host;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('finds every checkbox on the page', async () => {
    expect((await loader.getAllHarnesses(SnCheckboxHarness)).length).toBe(3);
  });

  it('filters by label', async () => {
    const box = await loader.getHarness(SnCheckboxHarness.with({ label: 'Remember me' }));
    expect(await box.getLabelText()).toBe('Remember me');
  });

  it('filters by checked state', async () => {
    const checked = await loader.getAllHarnesses(SnCheckboxHarness.with({ checked: true }));
    expect(checked.length).toBe(1);
    expect(await checked[0].getLabelText()).toBe('Remember me');
  });

  it('reads checked, indeterminate and disabled', async () => {
    const [accept, remember, partial] = await loader.getAllHarnesses(SnCheckboxHarness);

    expect(await accept.isChecked()).toBe(false);
    expect(await remember.isChecked()).toBe(true);
    expect(await partial.isIndeterminate()).toBe(true);
    expect(await partial.isChecked()).toBe(false);
    expect(await accept.isDisabled()).toBe(false);
  });

  it('check() toggles and the change is visible through the harness', async () => {
    const box = await loader.getHarness(SnCheckboxHarness.with({ label: 'Accept terms' }));

    await box.check();
    // A harness action drives change detection to completion with no zone.
    expect(await box.isChecked()).toBe(true);

    await box.check();
    expect(await box.isChecked()).toBe(true);

    await box.uncheck();
    expect(await box.isChecked()).toBe(false);
  });

  it('uncheck() clears an indeterminate box', async () => {
    const box = await loader.getHarness(SnCheckboxHarness.with({ label: 'Partial' }));
    expect(await box.isIndeterminate()).toBe(true);

    await box.uncheck();
    expect(await box.isIndeterminate()).toBe(false);
    expect(await box.isChecked()).toBe(false);
  });

  it('sees a state change made outside the harness', async () => {
    const box = await loader.getHarness(SnCheckboxHarness.with({ label: 'Accept terms' }));
    expect(await box.isDisabled()).toBe(false);

    host.disabled.set(true);
    // No detectChanges(): the harness has to stabilize the fixture itself.
    expect(await box.isDisabled()).toBe(true);
  });

  it('does not toggle a disabled checkbox', async () => {
    host.disabled.set(true);
    const box = await loader.getHarness(SnCheckboxHarness.with({ label: 'Accept terms' }));

    await box.toggle();
    expect(await box.isChecked()).toBe(false);
  });

  it('focuses and blurs', async () => {
    const box = await loader.getHarness(SnCheckboxHarness.with({ label: 'Accept terms' }));
    expect(await box.isFocused()).toBe(false);

    await box.focus();
    expect(await box.isFocused()).toBe(true);

    await box.blur();
    expect(await box.isFocused()).toBe(false);
  });
});
