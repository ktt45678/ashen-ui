import { Component, provideZonelessChangeDetection, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HarnessLoader, TestKey } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Tab, Tabs } from 'ashen-ui/tabs';
import { SnTabsHarness } from './tabs-harness';

@Component({
  template: `
    <sn-tabs [(selectedIndex)]="index">
      <sn-tab label="Overview">Usage this month</sn-tab>
      <sn-tab label="Billing">Invoices and receipts</sn-tab>
      <sn-tab label="Archived" [disabled]="true">Nothing here</sn-tab>
    </sn-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tab, Tabs],
})
class Host {
  readonly index = signal(0);
}

describe('SnTabsHarness', () => {
  let loader: HarnessLoader;
  let host: Host;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  const tabs = () => loader.getHarness(SnTabsHarness);

  it('lists its tabs in order', async () => {
    expect(await (await tabs()).getLabels()).toEqual(['Overview', 'Billing', 'Archived']);
  });

  it('reports the selected tab and its panel', async () => {
    const t = await tabs();

    expect(await t.getSelectedLabel()).toBe('Overview');
    expect(await t.getPanelText()).toContain('Usage this month');
  });

  it('selectTab switches the panel with it', async () => {
    const t = await tabs();

    await t.selectTab({ label: 'Billing' });

    expect(await t.getSelectedLabel()).toBe('Billing');
    expect(await t.getPanelText()).toContain('Invoices');
    expect(host.index()).toBe(1);
  });

  it('throws for a label that is not a tab', async () => {
    const t = await tabs();
    await expect(t.selectTab({ label: 'Nope' })).rejects.toThrow(/Nope/);
  });

  it('does not select a disabled tab', async () => {
    const t = await tabs();

    await t.selectTab({ label: 'Archived' });

    expect(await t.getSelectedLabel()).toBe('Overview');
  });

  it('reads disabled off the individual tab', async () => {
    const [overview, , archived] = await (await tabs()).getTabs();

    expect(await overview.isDisabled()).toBe(false);
    expect(await archived.isDisabled()).toBe(true);
  });

  it('sees a selection made outside the harness', async () => {
    const t = await tabs();

    host.index.set(1);

    expect(await t.getSelectedLabel()).toBe('Billing');
  });

  it('moves selection with an arrow key', async () => {
    const t = await tabs();

    await t.sendKey(TestKey.RIGHT_ARROW);

    expect(await t.getSelectedLabel()).toBe('Billing');
  });

  it('skips the disabled tab when arrowing past it', async () => {
    const t = await tabs();

    await t.sendKey(TestKey.RIGHT_ARROW);
    await t.sendKey(TestKey.RIGHT_ARROW);

    // Archived is disabled, so the strip wraps to the first enabled tab.
    expect(await t.getSelectedLabel()).toBe('Overview');
  });
});
