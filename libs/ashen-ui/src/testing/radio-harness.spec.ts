import { Component, provideZonelessChangeDetection, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HarnessLoader, TestKey } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Radio, RadioGroup } from 'ashen-ui/radio-group';
import { SnRadioButtonHarness, SnRadioGroupHarness } from './radio-harness';

@Component({
  template: `
    <sn-radio-group [(value)]="frequency" aria-label="Frequency">
      <sn-radio value="daily">Daily</sn-radio>
      <sn-radio value="weekly">Weekly</sn-radio>
      <sn-radio value="never" [disabled]="true">Never</sn-radio>
    </sn-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Radio, RadioGroup],
})
class Host {
  readonly frequency = signal<unknown>('daily');
}

describe('SnRadioGroupHarness', () => {
  let loader: HarnessLoader;
  let host: Host;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  const group = () => loader.getHarness(SnRadioGroupHarness.with({ ariaLabel: 'Frequency' }));

  it('lists its buttons in order', async () => {
    expect(await (await group()).getLabels()).toEqual(['Daily', 'Weekly', 'Never']);
  });

  it('reports which button is checked', async () => {
    expect(await (await group()).getCheckedLabel()).toBe('Daily');
  });

  it('checkByLabel moves the selection', async () => {
    const g = await group();

    await g.checkByLabel('Weekly');

    expect(await g.getCheckedLabel()).toBe('Weekly');
    expect(host.frequency()).toBe('weekly');
  });

  it('checking one button clears the previous one', async () => {
    const g = await group();
    await g.checkByLabel('Weekly');

    expect((await g.getButtons({ checked: true })).length).toBe(1);
  });

  it('throws for a label that is not in the group', async () => {
    const g = await group();
    await expect(g.checkByLabel('Hourly')).rejects.toThrow(/Hourly/);
  });

  it('does not select a disabled button', async () => {
    const g = await group();

    await g.checkByLabel('Never');

    expect(await g.getCheckedLabel()).toBe('Daily');
  });

  it('reads disabled off the individual button', async () => {
    const [daily, , never] = await (await group()).getButtons();

    expect(await daily.isDisabled()).toBe(false);
    expect(await never.isDisabled()).toBe(true);
  });

  it('sees a value set outside the harness', async () => {
    const g = await group();

    host.frequency.set('weekly');

    expect(await g.getCheckedLabel()).toBe('Weekly');
  });

  it('moves selection with an arrow key', async () => {
    const g = await group();
    const [daily] = await g.getButtons();

    await daily.focus();
    await daily.sendKey(TestKey.DOWN_ARROW);

    expect(await g.getCheckedLabel()).toBe('Weekly');
  });

  it('finds a radio button on its own, outside any group harness', async () => {
    const weekly = await loader.getHarness(SnRadioButtonHarness.with({ label: 'Weekly' }));

    await weekly.check();

    expect(await weekly.isChecked()).toBe(true);
  });
});
