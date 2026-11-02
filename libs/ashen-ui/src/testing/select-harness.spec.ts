import { Component, provideZonelessChangeDetection, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HarnessLoader, TestKey } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideSnAnimations } from 'ashen-ui/core';
import { ListOption } from 'ashen-ui/listbox';
import { MultiSelect } from 'ashen-ui/multi-select';
import { Select } from 'ashen-ui/select';
import { SnMultiSelectHarness, SnSelectHarness } from './select-harness';

@Component({
  template: `
    <sn-select [(value)]="language" ariaLabel="Language" placeholder="Pick one">
      <sn-list-option value="en">English</sn-list-option>
      <sn-list-option value="vi">Tiếng Việt</sn-list-option>
      <sn-list-option value="no" [disabled]="true">Norsk</sn-list-option>
    </sn-select>

    <sn-multi-select [(value)]="topics" ariaLabel="Topics" placeholder="Any">
      <sn-list-option value="a">Angular</sn-list-option>
      <sn-list-option value="b">Bazel</sn-list-option>
      <sn-list-option value="c">CSS</sn-list-option>
    </sn-multi-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ListOption, MultiSelect, Select],
})
class Host {
  readonly language = signal<unknown>(null);
  readonly topics = signal<unknown[]>([]);
}

describe('SnSelectHarness', () => {
  let loader: HarnessLoader;
  let host: Host;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      // The overlay waits for its exit animation; disabled, it detaches on the next render.
      providers: [provideZonelessChangeDetection(), provideSnAnimations('disabled')],
    });
    const fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  const select = () => loader.getHarness(SnSelectHarness.with({ ariaLabel: 'Language' }));

  it('starts closed and showing the placeholder', async () => {
    const s = await select();

    expect(await s.isOpen()).toBe(false);
    expect(await s.isEmpty()).toBe(true);
    expect(await s.getValueText()).toBe('Pick one');
  });

  it('opens and closes', async () => {
    const s = await select();

    await s.open();
    expect(await s.isOpen()).toBe(true);

    await s.close();
    expect(await s.isOpen()).toBe(false);
  });

  it('lists the options in its own panel', async () => {
    const s = await select();

    // Two selects are on the page; this must not see the other one's options.
    expect(await s.getOptionTexts()).toEqual(['English', 'Tiếng Việt', 'Norsk']);
  });

  it('selectOption commits the value and closes the panel', async () => {
    const s = await select();

    await s.selectOption({ text: 'Tiếng Việt' });

    expect(await s.getValueText()).toBe('Tiếng Việt');
    expect(await s.isOpen()).toBe(false);
    expect(host.language()).toBe('vi');
  });

  it('throws for an option that is not in the panel', async () => {
    const s = await select();
    await expect(s.selectOption({ text: 'Deutsch' })).rejects.toThrow(/Deutsch/);
  });

  it('reads disabled off the individual option', async () => {
    const [, , norsk] = await (await select()).getOptions();
    expect(await norsk.isDisabled()).toBe(true);
  });

  it('filters options by selected state', async () => {
    const s = await select();
    await s.selectOption({ text: 'English' });

    const selected = await s.getOptions({ selected: true });
    expect(selected.length).toBe(1);
    expect(await selected[0].getText()).toBe('English');
  });

  it('sees a value set outside the harness', async () => {
    const s = await select();

    host.language.set('vi');

    expect(await s.getValueText()).toBe('Tiếng Việt');
  });

  it('opens from the keyboard', async () => {
    const s = await select();

    await s.focus();
    await s.sendKey(TestKey.DOWN_ARROW);

    expect(await s.isOpen()).toBe(true);
  });

  it('filters selects by the text the trigger shows', async () => {
    host.language.set('en');
    const found = await loader.getAllHarnesses(SnSelectHarness.with({ valueText: 'English' }));

    expect(found.length).toBe(1);
  });
});

describe('SnMultiSelectHarness', () => {
  let loader: HarnessLoader;
  let host: Host;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideSnAnimations('disabled')],
    });
    const fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  const multi = () => loader.getHarness(SnMultiSelectHarness);

  it('selects several options without closing between them', async () => {
    const m = await multi();

    await m.selectOptions({ text: 'Angular' }, { text: 'CSS' });

    expect(await m.isOpen()).toBe(true);
    expect(await m.getSelectedTexts()).toEqual(['Angular', 'CSS']);
    expect(host.topics()).toEqual(['a', 'c']);
  });

  it('clicking a selected option deselects it', async () => {
    const m = await multi();
    await m.selectOptions({ text: 'Angular' });

    await m.selectOptions({ text: 'Angular' });

    expect(await m.getSelectedTexts()).toEqual([]);
    expect(host.topics()).toEqual([]);
  });

  it('shows a chip per selection on the trigger', async () => {
    const m = await multi();
    await m.selectOptions({ text: 'Angular' }, { text: 'Bazel' });
    await m.close();

    expect(await m.getChipTexts()).toEqual(['Angular', 'Bazel']);
  });

  it('reports empty before anything is picked', async () => {
    const m = await multi();

    expect(await m.isEmpty()).toBe(true);
    expect(await m.getValueText()).toBe('Any');
  });
});
