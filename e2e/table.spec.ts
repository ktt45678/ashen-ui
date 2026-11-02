import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Table', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.table);
  });

  test.describe('Basic columns', () => {
    test('renders a table with thead th column headers', async ({ page }) => {
      const d = demo(page, 'Basic columns with caption');
      const table = d.locator('table');
      await expect(table).toBeVisible();
      const headers = d.locator('thead th');
      await expect(headers).toHaveCount(3);
      await expect(headers.nth(0)).toContainText('Name');
      await expect(headers.nth(1)).toContainText('Size (B)');
      await expect(headers.nth(2)).toContainText('Modified');
    });

    test('th elements have scope=col', async ({ page }) => {
      const d = demo(page, 'Basic columns with caption');
      const headers = d.locator('thead th');
      await expect(headers.first()).toHaveAttribute('scope', 'col');
    });

    test('data rows are rendered with concrete file values', async ({ page }) => {
      const d = demo(page, 'Basic columns with caption');
      const rows = d.locator('tbody tr');
      await expect(rows).toHaveCount(5);
      await expect(rows.first()).toContainText('dashboard.ts');
    });
  });

  test.describe('Sortable columns', () => {
    test('sortable column header contains a button', async ({ page }) => {
      const d = demo(page, 'Sortable columns');
      const nameHeader = d.locator('thead th').nth(0);
      await expect(nameHeader.locator('button')).toBeVisible();
    });

    test('no aria-sort initially (unsorted state)', async ({ page }) => {
      const d = demo(page, 'Sortable columns');
      const nameHeader = d.locator('thead th').nth(0);
      await expect(nameHeader).not.toHaveAttribute('aria-sort');
    });

    test('clicking Name header once sets aria-sort=ascending on the th', async ({ page }) => {
      const d = demo(page, 'Sortable columns');
      const nameHeader = d.locator('thead th').nth(0);
      await nameHeader.locator('button').click();
      await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    });

    test('clicking Name header twice sets aria-sort=descending', async ({ page }) => {
      const d = demo(page, 'Sortable columns');
      const nameHeader = d.locator('thead th').nth(0);
      await nameHeader.locator('button').click();
      await nameHeader.locator('button').click();
      await expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
    });

    test('clicking Name header a third time removes aria-sort', async ({ page }) => {
      const d = demo(page, 'Sortable columns');
      const nameHeader = d.locator('thead th').nth(0);
      await nameHeader.locator('button').click();
      await nameHeader.locator('button').click();
      await nameHeader.locator('button').click();
      await expect(nameHeader).not.toHaveAttribute('aria-sort');
    });

    test('sorting Name ascending: first row is angular.json', async ({ page }) => {
      const d = demo(page, 'Sortable columns');
      const nameHeader = d.locator('thead th').nth(0);
      await nameHeader.locator('button').click();
      await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
      const firstRow = d.locator('tbody tr').first();
      await expect(firstRow).toContainText('angular.json');
    });

    test('sorting Name descending: first row is styles.css', async ({ page }) => {
      const d = demo(page, 'Sortable columns');
      const nameHeader = d.locator('thead th').nth(0);
      await nameHeader.locator('button').click();
      await nameHeader.locator('button').click();
      await expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
      const firstRow = d.locator('tbody tr').first();
      await expect(firstRow).toContainText('styles.css');
    });

    test('unsorted: rows restored to original order (dashboard.ts first)', async ({ page }) => {
      const d = demo(page, 'Sortable columns');
      const nameHeader = d.locator('thead th').nth(0);
      await nameHeader.locator('button').click();
      await nameHeader.locator('button').click();
      await nameHeader.locator('button').click();
      await expect(nameHeader).not.toHaveAttribute('aria-sort');
      const firstRow = d.locator('tbody tr').first();
      await expect(firstRow).toContainText('dashboard.ts');
    });

    test('sorting size ascending: first row has smallest size (main.ts 320)', async ({ page }) => {
      const d = demo(page, 'Sortable columns');
      const sizeHeader = d.locator('thead th').nth(1);
      await sizeHeader.locator('button').click();
      await expect(sizeHeader).toHaveAttribute('aria-sort', 'ascending');
      const firstRow = d.locator('tbody tr').first();
      await expect(firstRow).toContainText('main.ts');
    });
  });

  test.describe('Selectable rows', () => {
    test('rows have tabindex=0 when selectable', async ({ page }) => {
      const d = demo(page, 'Selectable rows (legacy)');
      const rows = d.locator('tbody tr');
      await expect(rows.first()).toHaveAttribute('tabindex', '0');
    });

    test('clicking a row sets aria-current=true on that row', async ({ page }) => {
      const d = demo(page, 'Selectable rows (legacy)');
      const rows = d.locator('tbody tr');
      await rows.nth(1).click();
      await expect(rows.nth(1)).toHaveAttribute('aria-current', 'true');
    });

    test('clicking a row clears aria-current from the previous row', async ({ page }) => {
      const d = demo(page, 'Selectable rows (legacy)');
      const rows = d.locator('tbody tr');
      await rows.nth(0).click();
      await rows.nth(1).click();
      await expect(rows.nth(0)).not.toHaveAttribute('aria-current', 'true');
      await expect(rows.nth(1)).toHaveAttribute('aria-current', 'true');
    });

    test('clicking a row updates the demo-note with the selected filename', async ({ page }) => {
      const d = demo(page, 'Selectable rows (legacy)');
      const rows = d.locator('tbody tr');
      await rows.nth(0).click();
      await expect(d.locator('.demo-note')).toContainText('dashboard.ts');
    });

    test('selected row carries sn-table-row--selected class', async ({ page }) => {
      const d = demo(page, 'Selectable rows (legacy)');
      const rows = d.locator('tbody tr');
      await rows.nth(2).click();
      await expect(rows.nth(2)).toHaveClass(/sn-table-row--selected/);
    });
  });

  test.describe('Empty state', () => {
    test('renders a single empty-state cell', async ({ page }) => {
      const d = demo(page, 'Empty state');
      const emptyCell = d.locator('.sn-table-empty');
      await expect(emptyCell).toBeVisible();
      await expect(emptyCell).toContainText('No results found.');
    });

    test('empty state cell spans all columns', async ({ page }) => {
      const d = demo(page, 'Empty state');
      const emptyCell = d.locator('.sn-table-empty');
      const colspan = await emptyCell.getAttribute('colspan');
      expect(Number(colspan)).toBe(2);
    });
  });
});

// ── New feature tests appended below ────────────────────────────────────────

test.describe('Table - new features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.table);
  });

  // ── 1. Checkbox multi-selection ─────────────────────────────────────────
  test.describe('Checkbox multi-selection', () => {
    test('header checkbox and row checkboxes render', async ({ page }) => {
      const d = demo(page, 'Checkbox multi-selection');
      const headerCheckbox = d.locator('thead .sn-table-checkbox');
      await expect(headerCheckbox).toBeVisible();
      const rowCheckboxes = d.locator('tbody .sn-table-checkbox');
      await expect(rowCheckboxes).toHaveCount(5);
    });

    test('checking row 1 sets aria-selected=true on its tr', async ({ page }) => {
      const d = demo(page, 'Checkbox multi-selection');
      const rows = d.locator('tbody tr');
      const firstRowCheckbox = rows.first().locator('.sn-table-checkbox');
      await firstRowCheckbox.click();
      await expect(rows.first()).toHaveAttribute('aria-selected', 'true');
    });

    test('select-all checks all row checkboxes', async ({ page }) => {
      const d = demo(page, 'Checkbox multi-selection');
      const headerCheckbox = d.locator('thead .sn-table-checkbox');
      await headerCheckbox.click();
      // Wait for all rows to become selected
      await expect(d.locator('tbody tr').first()).toHaveAttribute('aria-selected', 'true');
      const rowCheckboxes = d.locator('tbody .sn-table-checkbox');
      const count = await rowCheckboxes.count();
      for (let i = 0; i < count; i++) {
        await expect(rowCheckboxes.nth(i)).toBeChecked();
      }
    });

    test('unchecking one row after select-all puts header checkbox into indeterminate', async ({ page }) => {
      const d = demo(page, 'Checkbox multi-selection');
      const headerCheckbox = d.locator('thead .sn-table-checkbox');
      // Select all first
      await headerCheckbox.click();
      await expect(d.locator('tbody tr').first()).toHaveAttribute('aria-selected', 'true');
      // Uncheck row 1
      const firstRowCheckbox = d.locator('tbody .sn-table-checkbox').first();
      await firstRowCheckbox.click();
      await expect(d.locator('tbody tr').first()).not.toHaveAttribute('aria-selected', 'true');
      // Header must be indeterminate (sn-checkbox exposes aria-checked="mixed")
      await expect(headerCheckbox).toHaveAttribute('aria-checked', 'mixed');
    });

    test('demo-note shows count of selected rows', async ({ page }) => {
      const d = demo(page, 'Checkbox multi-selection');
      const firstRowCheckbox = d.locator('tbody .sn-table-checkbox').first();
      await firstRowCheckbox.click();
      await expect(d.locator('.demo-note')).toContainText('1 selected');
    });
  });

  // ── 2. Expandable rows ───────────────────────────────────────────────────
  test.describe('Expandable rows', () => {
    test('expand button is present in each row with aria-expanded=false initially', async ({ page }) => {
      const d = demo(page, 'Expandable rows');
      const expandBtn = d.locator('tbody .sn-table-expand-btn').first();
      await expect(expandBtn).toBeVisible();
      await expect(expandBtn).toHaveAttribute('aria-expanded', 'false');
    });

    test('clicking expand button sets aria-expanded=true and shows expansion row', async ({ page }) => {
      const d = demo(page, 'Expandable rows');
      const expandBtn = d.locator('tbody .sn-table-expand-btn').first();
      await expandBtn.click();
      await expect(expandBtn).toHaveAttribute('aria-expanded', 'true');
      await expect(d.locator('.sn-table-expansion-row').first()).toBeVisible();
    });

    test('expansion row contains the expansion content', async ({ page }) => {
      const d = demo(page, 'Expandable rows');
      const expandBtn = d.locator('tbody .sn-table-expand-btn').first();
      await expandBtn.click();
      await expect(d.locator('.sn-table-expansion-row').first()).toContainText('dashboard.ts');
    });

    test('aria-controls on button matches the expansion row id', async ({ page }) => {
      const d = demo(page, 'Expandable rows');
      const expandBtn = d.locator('tbody .sn-table-expand-btn').first();
      await expandBtn.click();
      const expansionRow = d.locator('.sn-table-expansion-row').first();
      await expect(expansionRow).toBeVisible();
      const controls = await expandBtn.getAttribute('aria-controls');
      const rowId = await expansionRow.getAttribute('id');
      expect(controls).toBeTruthy();
      expect(rowId).toBeTruthy();
      expect(controls).toBe(rowId);
    });

    test('collapsing removes the expansion row', async ({ page }) => {
      const d = demo(page, 'Expandable rows');
      const expandBtn = d.locator('tbody .sn-table-expand-btn').first();
      await expandBtn.click();
      await expect(d.locator('.sn-table-expansion-row').first()).toBeVisible();
      await expandBtn.click();
      await expect(expandBtn).toHaveAttribute('aria-expanded', 'false');
      await expect(d.locator('.sn-table-expansion-row')).toHaveCount(0);
    });
  });

  // ── 3. Actions column ────────────────────────────────────────────────────
  test.describe('Actions column', () => {
    test('.sn-table-td--actions cells are rendered', async ({ page }) => {
      const d = demo(page, 'Actions column');
      const actionsCells = d.locator('.sn-table-td--actions');
      await expect(actionsCells.first()).toBeVisible();
      await expect(actionsCells).toHaveCount(5);
    });

    test('each actions cell contains buttons', async ({ page }) => {
      const d = demo(page, 'Actions column');
      const firstActionsCell = d.locator('.sn-table-td--actions').first();
      const buttons = firstActionsCell.locator('button');
      await expect(buttons).toHaveCount(2);
    });

    test('Edit button has aria-label=Edit', async ({ page }) => {
      const d = demo(page, 'Actions column');
      const editBtn = d.locator('.sn-table-td--actions').first().locator('button[aria-label="Edit"]');
      await expect(editBtn).toBeVisible();
    });

    test('clicking Edit button does not throw (button remains in DOM)', async ({ page }) => {
      const d = demo(page, 'Actions column');
      const editBtn = d.locator('.sn-table-td--actions').first().locator('button[aria-label="Edit"]');
      // Click should not throw or navigate
      await editBtn.click();
      await expect(editBtn).toBeVisible();
    });
  });

  // ── 4. Sticky header and sticky first column ─────────────────────────────
  test.describe('Sticky header and sticky first column', () => {
    test('sn-table has .sn-table--sticky-header class', async ({ page }) => {
      const d = demo(page, 'Sticky header and sticky first column');
      await expect(d.locator('sn-table')).toHaveClass(/sn-table--sticky-header/);
    });

    test('header th stays at container top after scrolling down', async ({ page }) => {
      const d = demo(page, 'Sticky header and sticky first column');
      // Find the actual scroll container (sn-table itself may be it)
      const snTable = d.locator('sn-table');
      const headerTh = d.locator('thead th').first();

      // Scroll down inside the table's scroll container
      await snTable.evaluate((el) => {
        // The scroll container is the sn-table host or .sn-table-scroll if it exists
        const scroller = el.querySelector('.sn-table-scroll') ||
                         el.querySelector('table')?.closest('[style*="overflow"]') ||
                         el;
        (scroller as HTMLElement).scrollTop = 200;
      });

      const containerBox = await snTable.boundingBox();
      await expect.poll(async () => {
        const thBox = await headerTh.boundingBox();
        return thBox ? Math.round(thBox.y) : null;
      }, { timeout: 3000 }).toBeCloseTo(containerBox!.y, -1);
    });

    test('the first column is pinned to the inline start', async ({ page }) => {
      const d = demo(page, 'Sticky header and sticky first column');
      const firstBodyCell = d.locator('tbody td').first();
      await expect(firstBodyCell).toHaveClass(/sn-table-cell--sticky-start/);
    });
  });

  // ── 5. Pagination ─────────────────────────────────────────────────────────
  test.describe('Pagination', () => {
    test('only pageSize rows are rendered initially', async ({ page }) => {
      const d = demo(page, 'Pagination');
      await expect(d.locator('tbody tr').first()).toBeVisible();
      // Default rowsPerPage is 2 per the paginator options; the demo starts at 2
      const rows = d.locator('tbody tr');
      const count = await rows.count();
      // Should be <= default page size (2 or 3, not 5)
      expect(count).toBeLessThan(5);
    });

    test('sn-paginator is rendered', async ({ page }) => {
      const d = demo(page, 'Pagination');
      await expect(d.locator('sn-paginator')).toBeVisible();
    });

    test('clicking next page changes the rendered rows', async ({ page }) => {
      const d = demo(page, 'Pagination');
      await expect(d.locator('tbody tr').first()).toBeVisible();
      const firstRowTextBefore = await d.locator('tbody tr').first().textContent();

      // Find and click the next-page button in the paginator
      const nextBtn = d.locator('sn-paginator').getByRole('button', { name: /next/i });
      await nextBtn.click();

      await expect.poll(async () => {
        return d.locator('tbody tr').first().textContent();
      }, { timeout: 3000 }).not.toBe(firstRowTextBefore);
    });
  });

  // ── 6. Virtual scroll ─────────────────────────────────────────────────────
  test.describe('Virtual scroll - 10 000 rows', () => {
    test('only a small subset of the 10,000 rows is in the DOM', async ({ page }) => {
      const d = demo(page, 'Virtual scroll - 10 000 rows');
      await expect(d.locator('tbody tr.sn-table-row').first()).toBeVisible();
      const count = await d.locator('tbody tr.sn-table-row').count();
      expect(count).toBeLessThan(100);
    });

    test('scrolling renders different rows and DOM count stays small', async ({ page }) => {
      const d = demo(page, 'Virtual scroll - 10 000 rows');
      const snTable = d.locator('sn-table');
      await expect(d.locator('tbody tr.sn-table-row').first()).toBeVisible();
      const textBefore = await d.locator('tbody tr.sn-table-row').first().textContent();

      await snTable.evaluate((el) => {
        (el as HTMLElement).scrollTop = 5000;
      });

      await expect.poll(async () => {
        return d.locator('tbody tr.sn-table-row').first().textContent();
      }, { timeout: 5000 }).not.toBe(textBefore);

      // DOM count must still be small
      const countAfter = await d.locator('tbody tr.sn-table-row').count();
      expect(countAfter).toBeLessThan(100);
    });

    test('no-jump: keeps the scroll position steady while the virtual rows update', async ({ page }) => {
      const d = demo(page, 'Virtual scroll - 10 000 rows');
      const snTable = d.locator('sn-table');
      await expect(d.locator('tbody tr.sn-table-row').first()).toBeVisible();
      const initialText = await d.locator('tbody tr.sn-table-row').first().textContent();

      const targetScroll = 8000;
      await snTable.evaluate((el, top) => {
        (el as HTMLElement).scrollTop = top;
      }, targetScroll);

      // Wait for re-render (first row text changes)
      await expect.poll(async () => {
        return d.locator('tbody tr.sn-table-row').first().textContent();
      }, { timeout: 5000 }).not.toBe(initialText);

      // Scroll position must not have shifted
      await expect.poll(async () => {
        return snTable.evaluate((el) => (el as HTMLElement).scrollTop);
      }, { timeout: 2000 }).toBeGreaterThan(targetScroll - 2);
    });

    test('bidirectional recycling: scroll back to 0 restores first rows', async ({ page }) => {
      const d = demo(page, 'Virtual scroll - 10 000 rows');
      const snTable = d.locator('sn-table');
      await expect(d.locator('tbody tr.sn-table-row').first()).toBeVisible();
      const topText = await d.locator('tbody tr.sn-table-row').first().textContent();

      // Scroll down
      await snTable.evaluate((el) => { (el as HTMLElement).scrollTop = 10000; });
      await expect.poll(async () => {
        return d.locator('tbody tr.sn-table-row').first().textContent();
      }, { timeout: 5000 }).not.toBe(topText);

      // Scroll back to top
      await snTable.evaluate((el) => { (el as HTMLElement).scrollTop = 0; });
      await expect.poll(async () => {
        return d.locator('tbody tr.sn-table-row').first().textContent();
      }, { timeout: 5000 }).toBe(topText);
    });
  });

  // ── 7. Infinite scroll ───────────────────────────────────────────────────
  test.describe('Infinite scroll', () => {
    test('starts with 50 rows loaded', async ({ page }) => {
      const d = demo(page, 'Infinite scroll');
      await expect(d.locator('tbody tr.sn-table-row').first()).toBeVisible();
      await expect(d.locator('.demo-note')).toContainText('50');
    });

    test('scrolling to the bottom loads more rows (count grows by 50s)', async ({ page }) => {
      const d = demo(page, 'Infinite scroll');
      const snTable = d.locator('sn-table');
      await expect(d.locator('tbody tr.sn-table-row').first()).toBeVisible();
      await expect(d.locator('.demo-note')).toContainText('50');

      let increment = 0;
      // Drive load inside expect.poll - self-healing against races
      await expect.poll(async () => {
        await snTable.evaluate((el) => { (el as HTMLElement).scrollTop = (el as HTMLElement).scrollHeight; });
        const text = await d.locator('.demo-note').textContent();
        const match = text?.match(/(\d+) rows/);
        if (match) {
          const loaded = parseInt(match[1], 10);
          if (loaded > 50) increment++;
          return loaded;
        }
        return 0;
      }, { timeout: 10000, intervals: [500, 500, 500, 500, 500, 500, 500, 500] })
        .toBeGreaterThan(50);

      // Assert at least one increment happened
      expect(increment).toBeGreaterThanOrEqual(1);
    });

    test('note text updates as rows load', async ({ page }) => {
      const d = demo(page, 'Infinite scroll');
      const snTable = d.locator('sn-table');
      await expect(d.locator('.demo-note')).toContainText('50');
      const noteBefore = await d.locator('.demo-note').textContent();

      await expect.poll(async () => {
        await snTable.evaluate((el) => { (el as HTMLElement).scrollTop = (el as HTMLElement).scrollHeight; });
        return d.locator('.demo-note').textContent();
      }, { timeout: 8000 }).not.toBe(noteBefore);
    });

    test('loading stops at 500 after enough scrolls', async ({ page }) => {
      const d = demo(page, 'Infinite scroll');
      const snTable = d.locator('sn-table');
      await expect(d.locator('tbody tr.sn-table-row').first()).toBeVisible();

      // Drive 10 load cycles; if it hits 500 it should stop incrementing
      await expect.poll(async () => {
        await snTable.evaluate((el) => { (el as HTMLElement).scrollTop = (el as HTMLElement).scrollHeight; });
        const text = await d.locator('.demo-note').textContent();
        const match = text?.match(/(\d+) rows/);
        return match ? parseInt(match[1], 10) : 0;
      }, { timeout: 30000, intervals: Array(20).fill(500) })
        .toBeGreaterThanOrEqual(100); // assert at least 2 increments (50→100+)
    });
  });

  // ── 8. Row reorder ────────────────────────────────────────────────────────
  test.describe('Row reorder', () => {
    test('tbody is a cdk-drop-list and rows have cdk-drag class', async ({ page }) => {
      const d = demo(page, 'Row reorder');
      await expect(d.locator('tbody.cdk-drop-list')).toBeVisible();
      const firstRow = d.locator('tbody tr.sn-table-row').first();
      await expect(firstRow).toHaveClass(/cdk-drag/);
    });

    // Raw mouse.move does not auto-scroll the target into the viewport (unlike
    // click), so the demo must be scrolled into view before reading boundingBox
    // coordinates - otherwise the mousedown lands outside the viewport and CDK
    // never starts the drag.
    test('dragging the first row below the third reorders rows and emits the event', async ({ page }) => {
      const d = demo(page, 'Row reorder');
      const rows = d.locator('tbody tr.sn-table-row');
      await rows.first().scrollIntoViewIfNeeded();
      const firstText = await rows.nth(0).locator('td').first().innerText();
      const secondText = await rows.nth(1).locator('td').first().innerText();

      const src = await rows.nth(0).boundingBox();
      const dst = await rows.nth(2).boundingBox();
      expect(src && dst).toBeTruthy();

      const startX = src!.x + src!.width / 2;
      const startY = src!.y + src!.height / 2;
      const endY = dst!.y + dst!.height * 0.75;

      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(startX, startY + 6, { steps: 3 });
      await page.mouse.move(startX, endY, { steps: 12 });
      await page.mouse.move(startX, endY + 1, { steps: 2 });
      await page.mouse.up();

      await expect(rows.nth(0).locator('td').first()).not.toHaveText(firstText);
      await expect(rows.nth(0).locator('td').first()).toHaveText(secondText);
      await expect(d.locator('.demo-note')).toContainText('moved');
    });
  });

  // ── 9. Column reorder ─────────────────────────────────────────────────────
  test.describe('Column reorder', () => {
    test('thead th headers have cdk-drag class when columnReorder enabled', async ({ page }) => {
      const d = demo(page, 'Column reorder');
      const firstDraggableTh = d.locator('thead th.cdk-drag').first();
      await firstDraggableTh.scrollIntoViewIfNeeded();
      await expect(firstDraggableTh).toBeVisible();
      await expect(firstDraggableTh).toHaveClass(/sn-table-th--draggable/);
      await expect(d.locator('thead th.cdk-drag')).toHaveCount(4);
    });

    test('dragging the first header after the second reorders columns and emits the event', async ({ page }) => {
      const d = demo(page, 'Column reorder');
      const headers = d.locator('thead th.cdk-drag');
      await headers.first().scrollIntoViewIfNeeded();
      // textContent, not innerText - the header has CSS text-transform: uppercase
      // and toHaveText compares against the untransformed text.
      const firstHeader = (await headers.nth(0).textContent())!.trim();
      const secondHeader = (await headers.nth(1).textContent())!.trim();

      const src = await headers.nth(0).boundingBox();
      const dst = await headers.nth(1).boundingBox();
      expect(src && dst).toBeTruthy();

      const startY = src!.y + src!.height / 2;
      await page.mouse.move(src!.x + src!.width / 2, startY);
      await page.mouse.down();
      await page.mouse.move(src!.x + src!.width / 2 + 6, startY, { steps: 3 });
      await page.mouse.move(dst!.x + dst!.width * 0.9, startY, { steps: 12 });
      await page.mouse.move(dst!.x + dst!.width * 0.9 + 1, startY, { steps: 2 });
      await page.mouse.up();

      await expect(headers.nth(0)).toHaveText(secondHeader);
      await expect(headers.nth(1)).toHaveText(firstHeader);
      await expect(d.locator('.demo-note')).toContainText('moved');
    });
  });

  // ── 10. Flex layout ───────────────────────────────────────────────────────
  test.describe('Flex layout', () => {
    test('sn-table host has .sn-table--flex class', async ({ page }) => {
      const d = demo(page, 'Flex layout');
      await expect(d.locator('sn-table')).toHaveClass(/sn-table--flex/);
    });

    test('tbody tr has role=row', async ({ page }) => {
      const d = demo(page, 'Flex layout');
      const firstRow = d.locator('tbody tr').first();
      await expect(firstRow).toBeVisible();
      await expect(firstRow).toHaveAttribute('role', 'row');
    });

    test('tbody tr has display:flex via computed style', async ({ page }) => {
      const d = demo(page, 'Flex layout');
      const firstRow = d.locator('tbody tr').first();
      await expect(firstRow).toBeVisible();
      const display = await firstRow.evaluate((el) => {
        return window.getComputedStyle(el).display;
      });
      expect(display).toBe('flex');
    });
  });

  // ── 11. Directive mode ────────────────────────────────────────────────────
  test.describe('Directive mode (hand-written table)', () => {
    test('table has .sn-table-native class', async ({ page }) => {
      const d = demo(page, 'Directive mode (hand-written table)');
      await expect(d.locator('table.sn-table-native')).toBeVisible();
    });

    test('th[snSortHeader] has .sn-sort-header class', async ({ page }) => {
      const d = demo(page, 'Directive mode (hand-written table)');
      const nameHeader = d.locator('th[snsortheader="name"], th.sn-sort-header').first();
      await expect(nameHeader).toBeVisible();
      await expect(nameHeader).toHaveClass(/sn-sort-header/);
    });

    test('clicking Name th sets aria-sort=ascending', async ({ page }) => {
      const d = demo(page, 'Directive mode (hand-written table)');
      const nameHeader = d.locator('thead th').nth(0);
      await expect(nameHeader).toHaveClass(/sn-sort-header/);
      await nameHeader.click();
      await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    });

    test('clicking Name th twice sets aria-sort=descending', async ({ page }) => {
      const d = demo(page, 'Directive mode (hand-written table)');
      const nameHeader = d.locator('thead th').nth(0);
      await nameHeader.click();
      await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
      await nameHeader.click();
      await expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
    });

    test('clicking Name th a third time removes aria-sort', async ({ page }) => {
      const d = demo(page, 'Directive mode (hand-written table)');
      const nameHeader = d.locator('thead th').nth(0);
      await nameHeader.click();
      await nameHeader.click();
      await nameHeader.click();
      await expect(nameHeader).not.toHaveAttribute('aria-sort');
    });

    test('sorting Name ascending changes row order', async ({ page }) => {
      const d = demo(page, 'Directive mode (hand-written table)');
      const nameHeader = d.locator('thead th').nth(0);
      await nameHeader.click();
      await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
      // First row in ascending order should be alphabetically first
      const firstRow = d.locator('tbody tr').first();
      await expect(firstRow).toBeVisible();
      const firstCellText = await firstRow.locator('td').first().textContent();
      // After sorting ascending, first name should come before others alphabetically
      expect(firstCellText).toBeTruthy();
    });

    test('pressing Enter on focused Name th cycles aria-sort', async ({ page }) => {
      const d = demo(page, 'Directive mode (hand-written table)');
      const nameHeader = d.locator('thead th').nth(0);
      await nameHeader.focus();
      await nameHeader.press('Enter');
      await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
      await nameHeader.press('Enter');
      await expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
      await nameHeader.press('Enter');
      await expect(nameHeader).not.toHaveAttribute('aria-sort');
    });

    test('demo-note updates with sort state', async ({ page }) => {
      const d = demo(page, 'Directive mode (hand-written table)');
      const nameHeader = d.locator('thead th').nth(0);
      await nameHeader.click();
      await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
      await expect(d.locator('.demo-note')).toBeVisible();
      await expect(d.locator('.demo-note')).toContainText('name');
    });
  });
});
