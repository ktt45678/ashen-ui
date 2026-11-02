import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Dir } from '@angular/cdk/bidi';
import { Paginator, PageChangeEvent } from './paginator';
import { PaginatorReport, type PaginatorReportContext } from './paginator-report';
import { SN_DEFAULT_ICONS, provideSnIntl } from 'ashen-ui/core';

@Component({
  template: `<sn-paginator [page]="page" [totalRecords]="100" [rows]="10" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Paginator],
})
class BasicHost {
  page = 0;
}

@Component({
  template: `<sn-paginator [page]="page" [totalRecords]="120" [rows]="10" (pageChange)="onPageChange($event)" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Paginator],
})
class TwoWayHost {
  page = 0;
  lastEvent: PageChangeEvent | null = null;
  onPageChange(e: PageChangeEvent) {
    this.page = e.page;
    this.lastEvent = e;
  }
}

@Component({
  template: `<sn-paginator [page]="5" [totalRecords]="120" [rows]="10" [siblings]="1" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Paginator],
})
class SiblingsHost {}

@Component({
  template: `<sn-paginator [page]="0" [totalRecords]="100" [rows]="10" [showEdges]="false" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Paginator],
})
class NoEdgesHost {}

@Component({
  template: `<sn-paginator [page]="0" [totalRecords]="100" [rows]="rows" [rowsPerPageOptions]="[5, 10, 25]" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Paginator],
})
class RowsSelectHost {
  rows = 10;
}

@Component({
  template: `<sn-paginator [page]="0" [totalRecords]="50" [rows]="10" ariaLabel="Custom Nav" firstLabel="Go first" prevLabel="Go prev" nextLabel="Go next" lastLabel="Go last" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Paginator],
})
class CustomLabelsHost {}

@Component({
  template: `
    <div dir="rtl">
      <sn-paginator [page]="2" [totalRecords]="100" [rows]="10" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Dir, Paginator],
})
class RtlHost {}

/** The glyph a paginator button draws, by the button's own class. */
function glyphIn(root: HTMLElement, selector: string): string {
  return root.querySelector(`${selector} .sn-icon`)!.textContent!.trim();
}

@Component({
  template: `<sn-paginator [page]="2" [totalRecords]="50" [rows]="10" [snClass]="{ root: 'my-root', pages: 'my-pages', page: 'my-page', current: 'my-current', report: 'my-report' }" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Paginator],
})
class SnClassHost {}

@Component({
  template: `<sn-paginator [page]="0" [totalRecords]="0" [rows]="10" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Paginator],
})
class EmptyHost {}

@Component({
  template: `
    <sn-paginator [page]="1" [totalRecords]="45" [rows]="10">
      <ng-template
        snPaginatorReport
        let-first="first"
        let-last="last"
        let-total="total"
        let-page="page"
        let-pageCount="pageCount"
        let-rows="rows"
      >
        Records {{ first }} to {{ last }} of {{ total }}, page {{ page + 1 }} of
        {{ pageCount }}, {{ rows }} rows
      </ng-template>
    </sn-paginator>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Paginator, PaginatorReport],
})
class ReportTemplateHost {}

@Component({
  template: `<sn-paginator [page]="1" [totalRecords]="45" [rows]="10" [reportFormatter]="formatReport" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Paginator],
})
class ReportFormatterHost {
  formatReport = (context: PaginatorReportContext): string =>
    `${context.first}-${context.last}/${context.total} on ${context.pageCount} pages`;
}

@Component({
  template: `
    <sn-paginator
      [page]="2"
      [totalRecords]="200"
      [rows]="10"
      [rowsPerPageOptions]="[10, 20]"
      [snStyle]="{
        root: { outline: '1px solid red' },
        nav: { outline: '1px solid green' },
        rowsSelect: { color: 'rgb(1, 2, 3)' },
        rowsTrigger: { color: 'rgb(4, 5, 6)' },
        controls: { color: 'rgb(7, 8, 9)' },
        pages: { color: 'rgb(10, 11, 12)' },
        page: { color: 'rgb(13, 14, 15)' },
        ellipsis: { color: 'rgb(16, 17, 18)' },
        report: { color: 'rgb(19, 20, 21)' }
      }"
      [snAttrs]="{
        root: { 'data-testid': 'pg-root' },
        nav: { 'data-testid': 'pg-nav', 'aria-label': 'invalid nav' },
        rowsSelect: { 'data-testid': 'pg-rows-select' },
        rowsTrigger: { 'data-testid': 'pg-rows-trigger', 'aria-haspopup': 'menu' },
        controls: { 'data-testid': 'pg-controls' },
        pages: { 'data-testid': 'pg-pages' },
        page: { 'data-testid': 'pg-page', 'aria-current': 'step' },
        ellipsis: { 'data-testid': 'pg-ellipsis' },
        report: { 'data-testid': 'pg-report' }
      }"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Paginator],
})
class SnPartHost {}

@Component({
  template: `<sn-paginator [page]="page()" [totalRecords]="120" [rows]="10" [pageLinkSize]="5" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Paginator],
})
class PageLinkSizeHost {
  readonly page = signal(5);
}

@Component({
  template: `<sn-paginator [page]="0" [totalRecords]="100" [rows]="10" reportPosition="start" [rowsPerPageOptions]="[10, 25]" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Paginator],
})
class ReportStartHost {}

@Component({
  template: `<sn-paginator [page]="0" [totalRecords]="100" [rows]="10" justify="end" [showRowsLabel]="false" [rowsPerPageOptions]="[10, 25]" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Paginator],
})
class PackedHost {}

@Component({
  template: `<sn-paginator [totalRecords]="100" [showReport]="false" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Paginator],
})
class NoReportHost {}

describe('Paginator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders sn-paginator host with sn-paginator class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-paginator');
    expect(el.classList).toContain('sn-paginator');
  });

  it('renders a nav element', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const nav: HTMLElement = fixture.nativeElement.querySelector('nav');
    expect(nav).not.toBeNull();
    expect(nav.classList).toContain('sn-paginator-nav');
  });

  it('nav has default aria-label from SnIntl', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const nav: HTMLElement = fixture.nativeElement.querySelector('nav');
    expect(nav.getAttribute('aria-label')).toBe('Pagination');
  });

  it('nav aria-label uses custom ariaLabel input', async () => {
    const fixture = TestBed.createComponent(CustomLabelsHost);
    await fixture.whenStable();
    const nav: HTMLElement = fixture.nativeElement.querySelector('nav');
    expect(nav.getAttribute('aria-label')).toBe('Custom Nav');
  });

  it('renders first/prev/next/last buttons when showEdges=true (default)', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.sn-paginator-first')).not.toBeNull();
    expect(el.querySelector('.sn-paginator-prev')).not.toBeNull();
    expect(el.querySelector('.sn-paginator-next')).not.toBeNull();
    expect(el.querySelector('.sn-paginator-last')).not.toBeNull();
  });

  it('points all four navigation glyphs along the page order', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();

    expect(glyphIn(fixture.nativeElement, '.sn-paginator-first')).toBe('first_page');
    expect(glyphIn(fixture.nativeElement, '.sn-paginator-prev')).toBe('chevron_left');
    expect(glyphIn(fixture.nativeElement, '.sn-paginator-next')).toBe('chevron_right');
    expect(glyphIn(fixture.nativeElement, '.sn-paginator-last')).toBe('last_page');
  });

  it('turns all four navigation glyphs around in rtl', async () => {
    const fixture = TestBed.createComponent(RtlHost);
    await fixture.whenStable();

    expect(glyphIn(fixture.nativeElement, '.sn-paginator-first')).toBe('last_page');
    expect(glyphIn(fixture.nativeElement, '.sn-paginator-prev')).toBe('chevron_right');
    expect(glyphIn(fixture.nativeElement, '.sn-paginator-next')).toBe('chevron_left');
    expect(glyphIn(fixture.nativeElement, '.sn-paginator-last')).toBe('first_page');
  });

  it('omits first/last buttons when showEdges=false', async () => {
    const fixture = TestBed.createComponent(NoEdgesHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.sn-paginator-first')).toBeNull();
    expect(el.querySelector('.sn-paginator-last')).toBeNull();
    expect(el.querySelector('.sn-paginator-prev')).not.toBeNull();
    expect(el.querySelector('.sn-paginator-next')).not.toBeNull();
  });

  it('first/prev buttons are disabled on first page', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.sn-paginator-first')?.hasAttribute('disabled')).toBeTruthy();
    expect(el.querySelector('.sn-paginator-prev')?.hasAttribute('disabled')).toBeTruthy();
  });

  it('next/last buttons are not disabled on first page (multiple pages)', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.sn-paginator-next')?.hasAttribute('disabled')).toBeFalsy();
    expect(el.querySelector('.sn-paginator-last')?.hasAttribute('disabled')).toBeFalsy();
  });

  it('first button uses default SnIntl aria-label', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const btn: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-first');
    expect(btn.getAttribute('aria-label')).toBe('First page');
  });

  it('prev button uses default SnIntl aria-label', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const btn: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-prev');
    expect(btn.getAttribute('aria-label')).toBe('Previous page');
  });

  it('next button uses default SnIntl aria-label', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const btn: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-next');
    expect(btn.getAttribute('aria-label')).toBe('Next page');
  });

  it('last button uses default SnIntl aria-label', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const btn: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-last');
    expect(btn.getAttribute('aria-label')).toBe('Last page');
  });

  it('custom firstLabel overrides SnIntl', async () => {
    const fixture = TestBed.createComponent(CustomLabelsHost);
    await fixture.whenStable();
    const btn: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-first');
    expect(btn.getAttribute('aria-label')).toBe('Go first');
  });

  it('renders page buttons', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const pages = fixture.nativeElement.querySelectorAll('.sn-paginator-page');
    expect(pages.length).toBeGreaterThan(0);
  });

  it('current page button has aria-current="page"', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const current: HTMLElement = fixture.nativeElement.querySelector('[aria-current="page"]');
    expect(current).not.toBeNull();
    expect(current.textContent?.trim()).toBe('1');
  });

  it('current page button has sn-paginator-page--current class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const current: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-page--current');
    expect(current).not.toBeNull();
  });

  it('non-current page buttons do not have aria-current', async () => {
    const fixture = TestBed.createComponent(SiblingsHost);
    await fixture.whenStable();
    const pages: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.sn-paginator-page');
    const nonCurrent = Array.from(pages).filter((p) => !p.classList.contains('sn-paginator-page--current'));
    nonCurrent.forEach((p) => {
      expect(p.getAttribute('aria-current')).toBeNull();
    });
  });

  it('page button aria-label is "Page N"', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const first: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-page');
    expect(first.getAttribute('aria-label')).toBe('Page 1');
  });

  it('shows ellipsis on a middle page with many pages', async () => {
    const fixture = TestBed.createComponent(SiblingsHost);
    await fixture.whenStable();
    const ellipsis = fixture.nativeElement.querySelectorAll('.sn-paginator-ellipsis');
    expect(ellipsis.length).toBeGreaterThan(0);
  });

  it('ellipsis button has aria-haspopup="dialog"', async () => {
    const fixture = TestBed.createComponent(SiblingsHost);
    await fixture.whenStable();
    const btn: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-ellipsis');
    expect(btn.getAttribute('aria-haspopup')).toBe('dialog');
  });

  it('ellipsis button has aria-expanded="false" when panel closed', async () => {
    const fixture = TestBed.createComponent(SiblingsHost);
    await fixture.whenStable();
    const btn: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-ellipsis');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('ellipsis button has aria-label from SnIntl', async () => {
    const fixture = TestBed.createComponent(SiblingsHost);
    await fixture.whenStable();
    const btn: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-ellipsis');
    expect(btn.getAttribute('aria-label')).toBe('Jump to page');
  });

  it('clicking ellipsis opens jump panel with page buttons', async () => {
    const fixture = TestBed.createComponent(SiblingsHost);
    await fixture.whenStable();
    const btn: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-ellipsis');
    btn.click();
    await fixture.whenStable();
    const panel = document.querySelector('.sn-paginator-jump-panel');
    expect(panel).not.toBeNull();
    const jumpPages = panel!.querySelectorAll('.sn-paginator-jump-page');
    expect(jumpPages.length).toBeGreaterThan(0);
  });

  it('ellipsis button aria-expanded is true when panel open', async () => {
    const fixture = TestBed.createComponent(SiblingsHost);
    await fixture.whenStable();
    const btn: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-ellipsis');
    btn.click();
    await fixture.whenStable();
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });

  it('selecting a jump page emits pageChange and closes panel', async () => {
    @Component({
      template: `<sn-paginator [page]="page" [totalRecords]="120" [rows]="10" [siblings]="1" (pageChange)="onEvent($event)" />`,
      imports: [Paginator],
    })
    class JumpHost {
      page = 5;
      lastEvent: PageChangeEvent | null = null;
      onEvent(e: PageChangeEvent) { this.lastEvent = e; this.page = e.page; }
    }
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(JumpHost);
    await fixture.whenStable();
    const btn: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-ellipsis');
    btn.click();
    await fixture.whenStable();
    const jumpPages = document.querySelectorAll<HTMLElement>('.sn-paginator-jump-page');
    const page2 = Array.from(jumpPages).find(p => p.textContent?.trim() === '2');
    expect(page2).not.toBeNull();
    page2!.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.lastEvent?.page).toBe(1);
    // The panel plays a short exit animation before detaching.
    await new Promise((r) => setTimeout(r, 160));
    await fixture.whenStable();
    expect(document.querySelector('.sn-paginator-jump-panel')).toBeNull();
  });

  it('jump panel marks current page as selected', async () => {
    const fixture = TestBed.createComponent(SiblingsHost);
    await fixture.whenStable();
    const btn: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-ellipsis');
    btn.click();
    await fixture.whenStable();
    const currentJump = document.querySelector('.sn-paginator-jump-page--current');
    expect(currentJump).not.toBeNull();
    expect(currentJump!.textContent?.trim()).toBe('6');
  });

  it('pageLinkSize shows a fixed window of links with no ellipsis', async () => {
    const fixture = TestBed.createComponent(PageLinkSizeHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('.sn-paginator-ellipsis').length).toBe(0);
    expect(el.querySelectorAll('.sn-paginator-page').length).toBe(5);
  });

  it('pageLinkSize window slides with the current page and clamps to bounds', async () => {
    const fixture = TestBed.createComponent(PageLinkSizeHost);
    await fixture.whenStable();
    const labels = () =>
      Array.from(
        (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.sn-paginator-page'),
      ).map((p) => p.textContent?.trim());
    // page index 5 of 12 pages, window 5 → centred on pages 4–8.
    expect(labels()).toEqual(['4', '5', '6', '7', '8']);
    fixture.componentInstance.page.set(0);
    await fixture.whenStable();
    expect(labels()).toEqual(['1', '2', '3', '4', '5']);
    fixture.componentInstance.page.set(11);
    await fixture.whenStable();
    expect(labels()).toEqual(['8', '9', '10', '11', '12']);
  });

  it('reportPosition="start" adds the report-start modifier to the host', async () => {
    const fixture = TestBed.createComponent(ReportStartHost);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement.querySelector('sn-paginator');
    expect(host.classList).toContain('sn-paginator--report-start');
  });

  it('reportPosition defaults to end (no modifier class)', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement.querySelector('sn-paginator');
    expect(host.classList).not.toContain('sn-paginator--report-start');
  });

  it('justify defaults to between with the rows label shown', async () => {
    const fixture = TestBed.createComponent(ReportStartHost);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement.querySelector('sn-paginator');
    expect(host.getAttribute('data-sn-justify')).toBe('between');
    expect(host.classList).not.toContain('sn-paginator--packed');
    expect(host.querySelector('.sn-paginator-rows-label')).not.toBeNull();
  });

  it('justify="end" packs the parts and showRowsLabel=false hides only the visible label', async () => {
    const fixture = TestBed.createComponent(PackedHost);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement.querySelector('sn-paginator');
    expect(host.getAttribute('data-sn-justify')).toBe('end');
    expect(host.classList).toContain('sn-paginator--packed');
    expect(host.querySelector('.sn-paginator-rows-label')).toBeNull();
    const trigger = host.querySelector('.sn-paginator-rows-trigger')!;
    expect(trigger.getAttribute('aria-label')).toBeTruthy();
  });

  it('showReport=false hides the record report', async () => {
    const fixture = TestBed.createComponent(NoReportHost);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement.querySelector('sn-paginator');
    expect(host.querySelector('.sn-paginator-report')).toBeNull();
  });

  it('clicking next emits pageChange with next page', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    const comp = fixture.componentInstance;
    await fixture.whenStable();
    const next: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-next');
    next.click();
    await fixture.whenStable();
    expect(comp.lastEvent).toEqual({ page: 1, rows: 10, first: 10 });
  });

  it('clicking prev emits pageChange with previous page', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    const comp = fixture.componentInstance;
    comp.page = 3;
    fixture.detectChanges();
    await fixture.whenStable();
    const prev: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-prev');
    prev.click();
    await fixture.whenStable();
    expect(comp.lastEvent?.page).toBe(2);
  });

  it('clicking a page button emits pageChange', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    const comp = fixture.componentInstance;
    await fixture.whenStable();
    const pages: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.sn-paginator-page');
    const lastPage = pages[pages.length - 1];
    lastPage.click();
    await fixture.whenStable();
    expect(comp.lastEvent).not.toBeNull();
  });

  it('clicking first button emits pageChange with page 0', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    const comp = fixture.componentInstance;
    comp.page = 5;
    fixture.detectChanges();
    await fixture.whenStable();
    const first: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-first');
    first.click();
    await fixture.whenStable();
    expect(comp.lastEvent).toEqual({ page: 0, rows: 10, first: 0 });
  });

  it('clicking last button emits pageChange with last page', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    const comp = fixture.componentInstance;
    await fixture.whenStable();
    const last: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-last');
    last.click();
    await fixture.whenStable();
    expect(comp.lastEvent?.page).toBe(11);
    expect(comp.lastEvent?.first).toBe(110);
  });

  it('shows record report "X–Y of Z"', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const report: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-report');
    expect(report).not.toBeNull();
    expect(report.textContent?.trim()).toBe('1–10 of 100');
  });

  it('report is not shown when totalRecords is 0', async () => {
    const fixture = TestBed.createComponent(EmptyHost);
    await fixture.whenStable();
    const report: HTMLElement | null = fixture.nativeElement.querySelector('.sn-paginator-report');
    expect(report).toBeNull();
  });

  it('localizes the default report through SnPaginatorIntl', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideSnIntl({
          paginator: {
            report: (first, last, total) => `${first} bis ${last} von ${total}`,
          },
        }),
      ],
    });
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const report: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-report');

    expect(report.textContent?.trim()).toBe('1 bis 10 von 100');
  });

  it('localizes page button labels through SnPaginatorIntl', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideSnIntl({ paginator: { page: (page) => `Seite ${page}` } }),
      ],
    });
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const firstPage: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-page');

    expect(firstPage.getAttribute('aria-label')).toBe('Seite 1');
  });

  it('uses a typed report formatter input', async () => {
    const fixture = TestBed.createComponent(ReportFormatterHost);
    await fixture.whenStable();
    const report: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-report');

    expect(report.textContent?.trim()).toBe('11-20/45 on 5 pages');
  });

  it('projects the typed report context', async () => {
    const fixture = TestBed.createComponent(ReportTemplateHost);
    await fixture.whenStable();
    const report: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-report');

    expect(report.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'Records 11 to 20 of 45, page 2 of 5, 10 rows',
    );
  });

  it('rows-per-page trigger is not rendered without rowsPerPageOptions', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.sn-paginator-rows-trigger')).toBeNull();
  });

  it('rows-per-page trigger renders when rowsPerPageOptions is provided', async () => {
    const fixture = TestBed.createComponent(RowsSelectHost);
    await fixture.whenStable();
    const trigger: HTMLElement | null = fixture.nativeElement.querySelector('.sn-paginator-rows-trigger');
    expect(trigger).not.toBeNull();
  });

  it('rows-per-page trigger shows current rows value', async () => {
    const fixture = TestBed.createComponent(RowsSelectHost);
    await fixture.whenStable();
    const value: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-rows-value');
    expect(value).not.toBeNull();
    expect(value.textContent?.trim()).toBe('10');
  });

  it('rows-per-page trigger has aria-haspopup="listbox"', async () => {
    const fixture = TestBed.createComponent(RowsSelectHost);
    await fixture.whenStable();
    const trigger: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-rows-trigger');
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
  });

  it('rows-per-page trigger has aria-expanded="false" when closed', async () => {
    const fixture = TestBed.createComponent(RowsSelectHost);
    await fixture.whenStable();
    const trigger: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-rows-trigger');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('rows-per-page trigger draws the shared chevron-down glyph', async () => {
    const fixture = TestBed.createComponent(RowsSelectHost);
    await fixture.whenStable();
    const icon: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-rows-trigger .sn-icon');
    expect(icon).not.toBeNull();
    expect(icon.textContent?.trim()).toBe(SN_DEFAULT_ICONS['chevron-down']);
  });

  it('rows-per-page trigger has aria-label from SnIntl', async () => {
    const fixture = TestBed.createComponent(RowsSelectHost);
    await fixture.whenStable();
    const trigger: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-rows-trigger');
    expect(trigger.getAttribute('aria-label')).toBe('Rows per page');
  });

  it('clicking rows trigger opens rows panel with options', async () => {
    const fixture = TestBed.createComponent(RowsSelectHost);
    await fixture.whenStable();
    const trigger: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-rows-trigger');
    trigger.click();
    await fixture.whenStable();
    const panel = document.querySelector('.sn-paginator-rows-panel');
    expect(panel).not.toBeNull();
    const options = panel!.querySelectorAll('.sn-paginator-rows-option');
    expect(options.length).toBe(3);
  });

  it('rows-per-page trigger aria-expanded is true when panel open', async () => {
    const fixture = TestBed.createComponent(RowsSelectHost);
    await fixture.whenStable();
    const trigger: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-rows-trigger');
    trigger.click();
    await fixture.whenStable();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('selecting a rows option emits pageChange with new rows and page 0', async () => {
    @Component({
      template: `<sn-paginator [page]="page" [totalRecords]="100" [rows]="rows" [rowsPerPageOptions]="[5,10,25]" (pageChange)="onEvent($event)" />`,
      imports: [Paginator],
    })
    class RpsEventHost {
      page = 3;
      rows = 10;
      lastEvent: PageChangeEvent | null = null;
      onEvent(e: PageChangeEvent) { this.lastEvent = e; this.page = e.page; this.rows = e.rows; }
    }
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(RpsEventHost);
    await fixture.whenStable();
    const trigger: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-rows-trigger');
    trigger.click();
    await fixture.whenStable();
    const options = document.querySelectorAll<HTMLElement>('.sn-paginator-rows-option');
    const opt25 = Array.from(options).find(o => o.textContent?.trim() === '25');
    expect(opt25).not.toBeNull();
    opt25!.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.lastEvent).toEqual({ page: 0, rows: 25, first: 0 });
  });

  it('snClass string lands on root host', async () => {
    const fixture = TestBed.createComponent(SnClassHost);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement.querySelector('sn-paginator');
    expect(root.classList).toContain('my-root');
  });

  it('snClass pages section lands on pages container', async () => {
    const fixture = TestBed.createComponent(SnClassHost);
    await fixture.whenStable();
    const pages: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-pages');
    expect(pages.classList).toContain('my-pages');
  });

  it('snClass page section lands on page buttons', async () => {
    const fixture = TestBed.createComponent(SnClassHost);
    await fixture.whenStable();
    const page: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-page');
    expect(page.classList).toContain('my-page');
  });

  it('snClass current section lands on current page button', async () => {
    const fixture = TestBed.createComponent(SnClassHost);
    await fixture.whenStable();
    const cur: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-page--current');
    expect(cur.classList).toContain('my-current');
  });

  it('snClass report section lands on report element', async () => {
    const fixture = TestBed.createComponent(SnClassHost);
    await fixture.whenStable();
    const report: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-report');
    expect(report.classList).toContain('my-report');
  });

  it('SnIntl paginator label can be overridden', async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideSnIntl({ paginator: 'Page Nav' })],
    });
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const nav: HTMLElement = fixture.nativeElement.querySelector('nav');
    expect(nav.getAttribute('aria-label')).toBe('Page Nav');
  });

  it('SnIntl paginatorFirst can be overridden', async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideSnIntl({ paginatorFirst: 'Beginning' })],
    });
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const btn: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-first');
    expect(btn.getAttribute('aria-label')).toBe('Beginning');
  });

  it('first button icon renders ligature text first_page', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const icon: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-first .sn-icon');
    expect(icon).not.toBeNull();
    expect(icon.textContent?.trim()).toBe('first_page');
  });

  it('prev button icon renders ligature text chevron_left', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const icon: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-prev .sn-icon');
    expect(icon.textContent?.trim()).toBe('chevron_left');
  });

  it('next button icon renders ligature text chevron_right', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const icon: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-next .sn-icon');
    expect(icon.textContent?.trim()).toBe('chevron_right');
  });

  it('last button icon renders ligature text last_page', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const icon: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-last .sn-icon');
    expect(icon.textContent?.trim()).toBe('last_page');
  });

  it('last page has next button disabled', async () => {
    @Component({
      template: `<sn-paginator [page]="9" [totalRecords]="100" [rows]="10" />`,
      imports: [Paginator],
    })
    class AtLastHost {}
    const fixture = TestBed.createComponent(AtLastHost);
    await fixture.whenStable();
    const next: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-next');
    const last: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-last');
    expect(next.hasAttribute('disabled')).toBeTruthy();
    expect(last.hasAttribute('disabled')).toBeTruthy();
  });

  it('single page: both first/prev and next/last are disabled', async () => {
    @Component({
      template: `<sn-paginator [page]="0" [totalRecords]="5" [rows]="10" />`,
      imports: [Paginator],
    })
    class SinglePageHost {}
    const fixture = TestBed.createComponent(SinglePageHost);
    await fixture.whenStable();
    const first: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-first');
    const last: HTMLElement = fixture.nativeElement.querySelector('.sn-paginator-last');
    expect(first.hasAttribute('disabled')).toBeTruthy();
    expect(last.hasAttribute('disabled')).toBeTruthy();
  });

  it('applies snStyle and allowed snAttrs to named parts without replacing paginator semantics', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const root: HTMLElement = el.querySelector('sn-paginator')!;
    const nav: HTMLElement = el.querySelector('.sn-paginator-nav')!;
    const rowsSelect: HTMLElement = el.querySelector('.sn-paginator-rows-select')!;
    const rowsTrigger: HTMLElement = el.querySelector('.sn-paginator-rows-trigger')!;
    const controls: HTMLElement = el.querySelector('.sn-paginator-controls')!;
    const pages: HTMLElement = el.querySelector('.sn-paginator-pages')!;
    const page: HTMLElement = el.querySelector('.sn-paginator-page')!;
    const ellipsis: HTMLElement = el.querySelector('.sn-paginator-ellipsis')!;
    const report: HTMLElement = el.querySelector('.sn-paginator-report')!;

    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('pg-root');
    expect(nav.style.outline).toContain('green');
    expect(nav.getAttribute('data-testid')).toBe('pg-nav');
    expect(nav.getAttribute('aria-label')).not.toBe('invalid nav');
    expect(rowsSelect.style.color).toBe('rgb(1, 2, 3)');
    expect(rowsSelect.getAttribute('data-testid')).toBe('pg-rows-select');
    expect(rowsTrigger.style.color).toBe('rgb(4, 5, 6)');
    expect(rowsTrigger.getAttribute('data-testid')).toBe('pg-rows-trigger');
    expect(rowsTrigger.getAttribute('aria-haspopup')).toBe('listbox');
    expect(controls.style.color).toBe('rgb(7, 8, 9)');
    expect(controls.getAttribute('data-testid')).toBe('pg-controls');
    expect(pages.style.color).toBe('rgb(10, 11, 12)');
    expect(pages.getAttribute('data-testid')).toBe('pg-pages');
    expect(report.style.color).toBe('rgb(19, 20, 21)');
    expect(report.getAttribute('data-testid')).toBe('pg-report');

    // A repeated section applies to every instance, and the current page keeps
    // its own aria-current.
    const pageButtons = el.querySelectorAll<HTMLElement>('.sn-paginator-page');
    expect(pageButtons.length).toBeGreaterThan(1);
    for (const button of pageButtons) {
      expect(button.style.color).toBe('rgb(13, 14, 15)');
      expect(button.getAttribute('data-testid')).toBe('pg-page');
    }
    expect(page.getAttribute('aria-current')).not.toBe('step');
    expect(ellipsis.style.color).toBe('rgb(16, 17, 18)');
    expect(ellipsis.getAttribute('data-testid')).toBe('pg-ellipsis');
  });
});
