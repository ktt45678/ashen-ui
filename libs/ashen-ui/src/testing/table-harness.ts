import { ComponentHarness, HarnessPredicate, type BaseHarnessFilters } from '@angular/cdk/testing';

export interface SnTableRowHarnessFilters extends BaseHarnessFilters {
  /** Match a row containing this text in any cell. */
  text?: string | RegExp;
  /** Match on selected state. */
  selected?: boolean;
}

export interface SnTableHarnessFilters extends BaseHarnessFilters {
  /** Match on the table's `aria-label`. */
  ariaLabel?: string | RegExp;
}

/** One body row. Reached through {@link SnTableHarness}. */
export class SnTableRowHarness extends ComponentHarness {
  static readonly hostSelector = '.sn-table-row';

  static with(filters: SnTableRowHarnessFilters = {}): HarnessPredicate<SnTableRowHarness> {
    return new HarnessPredicate(SnTableRowHarness, filters)
      .addOption('text', filters.text, (harness, text) =>
        HarnessPredicate.stringMatches(harness.getText(), text),
      )
      .addOption(
        'selected',
        filters.selected,
        async (harness, selected) => (await harness.isSelected()) === selected,
      );
  }

  private readonly cells = this.locatorForAll('.sn-table-td');

  /** Every data cell's text, in column order. Icons are excluded. */
  async getCellTexts(): Promise<string[]> {
    return Promise.all((await this.cells()).map((c) => c.text({ exclude: '.sn-icon' })));
  }

  async getText(): Promise<string> {
    return (await this.host()).text({ exclude: '.sn-icon' });
  }

  async isSelected(): Promise<boolean> {
    return (await this.host()).hasClass('sn-table-row--selected');
  }

  async click(): Promise<void> {
    return (await this.host()).click();
  }

  /** Toggle this row's selection checkbox. Throws when the table has none. */
  async toggleSelection(): Promise<void> {
    const checkbox = await this.locatorForOptional('.sn-table-td--select sn-checkbox')();
    if (!checkbox) throw new Error('This row has no selection checkbox.');
    await checkbox.click();
  }

  /** Toggle this row's expansion chevron. Throws when the table has none. */
  async toggleExpansion(): Promise<void> {
    const toggle = await this.locatorForOptional('.sn-table-td--expand button')();
    if (!toggle) throw new Error('This row has no expansion toggle.');
    await toggle.click();
  }
}

/**
 * Drives an `<sn-table>`.
 *
 * ```ts
 * const table = await loader.getHarness(SnTableHarness);
 * expect(await table.getHeaderTexts()).toEqual(['Name', 'Size']);
 * await table.sortBy('Size');
 * expect(await table.getCellTexts()).toEqual([['a.txt', '1'], ['b.txt', '2']]);
 * ```
 */
export class SnTableHarness extends ComponentHarness {
  static readonly hostSelector = 'sn-table';

  static with(filters: SnTableHarnessFilters = {}): HarnessPredicate<SnTableHarness> {
    return new HarnessPredicate(SnTableHarness, filters).addOption(
      'ariaLabel',
      filters.ariaLabel,
      (harness, label) => HarnessPredicate.stringMatches(harness.getAriaLabel(), label),
    );
  }

  private readonly headers = this.locatorForAll('.sn-table-th');
  private readonly rows = this.locatorForAll(SnTableRowHarness);
  private readonly empty = this.locatorForOptional('.sn-table-empty');

  async getAriaLabel(): Promise<string | null> {
    return (await this.host()).getAttribute('aria-label');
  }

  /**
   * Header labels, in column order. The select and expand columns are left
   * out: they have no label, and counting them would shift every index a
   * caller derives from this list.
   */
  async getHeaderTexts(): Promise<string[]> {
    const texts: string[] = [];
    for (const header of await this.headers()) {
      const isControl =
        (await header.hasClass('sn-table-th--select')) ||
        (await header.hasClass('sn-table-th--expand'));
      if (!isControl) texts.push(await header.text({ exclude: '.sn-icon' }));
    }
    return texts;
  }

  async getRows(filters: SnTableRowHarnessFilters = {}): Promise<SnTableRowHarness[]> {
    return this.locatorForAll(SnTableRowHarness.with(filters))();
  }

  /** Every row's cells, as a grid. */
  async getCellTexts(): Promise<string[][]> {
    return Promise.all((await this.rows()).map((r) => r.getCellTexts()));
  }

  /** One column's cells, by its header label. */
  async getColumnTexts(header: string): Promise<string[]> {
    const index = (await this.getHeaderTexts()).indexOf(header);
    if (index === -1) throw new Error(`No column headed "${header}".`);
    return (await this.getCellTexts()).map((row) => row[index]);
  }

  /** Click a sortable column's header, which cycles ascending → descending → none. */
  async sortBy(header: string | RegExp): Promise<void> {
    const buttons = await this.locatorForAll('.sn-table-sort')();
    for (const button of buttons) {
      const label = await button.text({ exclude: '.sn-icon' });
      if (await HarnessPredicate.stringMatches(Promise.resolve(label), header)) {
        await button.click();
        return;
      }
    }
    throw new Error(`No sortable column headed ${header}.`);
  }

  /** `'ascending'`, `'descending'` or `'none'`, straight off `aria-sort`. */
  async getSortState(header: string): Promise<string | null> {
    const headers = await this.headers();
    for (const th of headers) {
      if ((await th.text({ exclude: '.sn-icon' })).trim() === header) {
        return th.getAttribute('aria-sort');
      }
    }
    throw new Error(`No column headed "${header}".`);
  }

  async getSelectedRows(): Promise<SnTableRowHarness[]> {
    return this.getRows({ selected: true });
  }

  /** Toggle the header checkbox that selects every row. */
  async toggleSelectAll(): Promise<void> {
    const checkbox = await this.locatorForOptional('.sn-table-th--select sn-checkbox')();
    if (!checkbox) throw new Error('This table has no select-all checkbox.');
    await checkbox.click();
  }

  /** The empty-state text, or null while the table has rows. */
  async getEmptyText(): Promise<string | null> {
    const empty = await this.empty();
    return empty ? empty.text() : null;
  }
}
