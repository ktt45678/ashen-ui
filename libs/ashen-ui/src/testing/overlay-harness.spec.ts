import { Component, provideZonelessChangeDetection, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { OverlayContainer } from '@angular/cdk/overlay';
import { provideSnAnimations } from 'ashen-ui/core';
import { AutoComplete } from 'ashen-ui/autocomplete';
import { Button } from 'ashen-ui/button';
import { Dialog, DialogFooter } from 'ashen-ui/dialog';
import { Menu, MenuItem, MenuTrigger } from 'ashen-ui/menu';
import { Toast, ToastService } from 'ashen-ui/toast';
import { SnAutocompleteHarness } from './autocomplete-harness';
import { SnDialogHarness } from './dialog-harness';
import { SnMenuHarness } from './menu-harness';
import { SnToastOutletHarness } from './toast-harness';

/**
 * Every overlay-backed harness in one file, because they share one setup: a
 * root-provided overlay container that has to be torn down between tests, and
 * `provideSnAnimations('disabled')` so detach happens on the next tick rather
 * than after an exit animation.
 */
@Component({
  template: `
    <sn-autocomplete [(value)]="city" [suggestions]="cities" ariaLabel="City" />

    <button snButton [snMenuTriggerFor]="actions">Actions</button>
    <sn-menu #actions>
      <button snMenuItem>Duplicate</button>
      <button snMenuItem [disabled]="true">Archive</button>
      <button snMenuItem (click)="deleted.set(true)">Delete</button>
    </sn-menu>

    <sn-dialog [(open)]="dialogOpen" title="Delete project">
      <p>This cannot be undone.</p>
      <div snDialogFooter>
        <button snButton variant="text" (click)="dialogOpen.set(false)">Cancel</button>
        <button snButton (click)="confirmed.set(true); dialogOpen.set(false)">Delete</button>
      </div>
    </sn-dialog>

    <sn-toast />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AutoComplete, Button, Dialog, DialogFooter, Menu, MenuItem, MenuTrigger, Toast],
})
class Host {
  readonly toasts = inject(ToastService);
  readonly city = signal('');
  readonly cities = ['London', 'Lisbon', 'Los Angeles', 'Oslo'];
  readonly dialogOpen = signal(false);
  readonly confirmed = signal(false);
  readonly deleted = signal(false);
}

describe('overlay harnesses', () => {
  let loader: HarnessLoader;
  let host: Host;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideSnAnimations('disabled')],
    });
    overlayContainer = TestBed.inject(OverlayContainer);
    const fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  afterEach(() => overlayContainer.ngOnDestroy());

  describe('SnAutocompleteHarness', () => {
    const autocomplete = () => loader.getHarness(SnAutocompleteHarness);

    it('starts closed and empty', async () => {
      const a = await autocomplete();

      expect(await a.getValue()).toBe('');
      expect(await a.isOpen()).toBe(false);
      expect(await a.getOptions()).toEqual([]);
    });

    it('typing filters the panel', async () => {
      const a = await autocomplete();

      await a.type('l');
      expect(await a.getOptionTexts()).toEqual(['London', 'Lisbon', 'Los Angeles', 'Oslo']);

      await a.type('lo');
      expect(await a.getOptionTexts()).toEqual(['London', 'Los Angeles', 'Oslo']);
    });

    it('picking an option commits it and closes the panel', async () => {
      const a = await autocomplete();
      await a.type('lon');

      await a.selectOption({ text: 'London' });

      expect(await a.getValue()).toBe('London');
      expect(host.city()).toBe('London');
      expect(await a.isOpen()).toBe(false);
    });

    it('throws for a suggestion that is not showing', async () => {
      const a = await autocomplete();
      await a.type('lon');

      await expect(a.selectOption({ text: 'Oslo' })).rejects.toThrow(/Oslo/);
    });

    it('reads a value set outside the harness', async () => {
      const a = await autocomplete();

      host.city.set('Oslo');

      expect(await a.getValue()).toBe('Oslo');
    });
  });

  describe('SnMenuHarness', () => {
    const menu = () => loader.getHarness(SnMenuHarness.with({ triggerText: 'Actions' }));

    it('opens and lists its items', async () => {
      const m = await menu();

      await m.open();

      expect(await m.isOpen()).toBe(true);
      expect(await m.getItemTexts()).toEqual(['Duplicate', 'Archive', 'Delete']);
    });

    it('clicking an item runs it and closes the menu', async () => {
      const m = await menu();

      await m.clickItem({ text: 'Delete' });

      expect(host.deleted()).toBe(true);
      expect(await m.isOpen()).toBe(false);
    });

    it('reads disabled off the individual item', async () => {
      const [duplicate, archive] = await (await menu()).getItems();

      expect(await duplicate.isDisabled()).toBe(false);
      expect(await archive.isDisabled()).toBe(true);
    });

    it('throws for an item that is not in the menu', async () => {
      const m = await menu();
      await expect(m.clickItem({ text: 'Rename' })).rejects.toThrow(/Rename/);
    });

    it('closes on Escape', async () => {
      const m = await menu();
      await m.open();

      await m.close();

      expect(await m.isOpen()).toBe(false);
    });
  });

  describe('SnDialogHarness', () => {
    it('is absent until the dialog opens', async () => {
      expect(await loader.getHarnessOrNull(SnDialogHarness)).toBeNull();
    });

    it('reads the title and the content', async () => {
      host.dialogOpen.set(true);
      const dialog = await loader.getHarness(SnDialogHarness);

      expect(await dialog.getTitle()).toBe('Delete project');
      expect(await dialog.getContentText()).toContain('cannot be undone');
      expect(await dialog.isModal()).toBe(true);
    });

    it('filters by title', async () => {
      host.dialogOpen.set(true);

      const dialog = await loader.getHarness(SnDialogHarness.with({ title: /Delete/ }));

      expect(await dialog.getTitle()).toBe('Delete project');
    });

    it('clicks a footer button by its text', async () => {
      host.dialogOpen.set(true);
      const dialog = await loader.getHarness(SnDialogHarness);

      await dialog.clickFooterButton('Delete');

      expect(host.confirmed()).toBe(true);
    });

    it('throws for a footer button that is not there', async () => {
      host.dialogOpen.set(true);
      const dialog = await loader.getHarness(SnDialogHarness);

      await expect(dialog.clickFooterButton('Publish')).rejects.toThrow(/Publish/);
    });

    it('close() dismisses through the header button', async () => {
      host.dialogOpen.set(true);
      const dialog = await loader.getHarness(SnDialogHarness);

      await dialog.close();

      expect(host.dialogOpen()).toBe(false);
    });
  });

  describe('SnToastOutletHarness', () => {
    const outlet = () => loader.getHarness(SnToastOutletHarness);

    it('is empty until something is shown', async () => {
      expect(await (await outlet()).getSummaries()).toEqual([]);
    });

    it('lists what the service showed, newest last', async () => {
      host.toasts.info('Saved');
      host.toasts.error('Upload failed', { detail: 'Try again' });

      expect(await (await outlet()).getSummaries()).toEqual(['Saved', 'Upload failed']);
    });

    it('reads severity, detail and role off a toast', async () => {
      host.toasts.error('Upload failed', { detail: 'Try again' });
      const [toast] = await (await outlet()).getToasts();

      expect(await toast.getSeverity()).toBe('error');
      expect(await toast.getDetail()).toBe('Try again');
      // Errors interrupt; everything else is polite.
      expect(await toast.getRole()).toBe('alert');
    });

    it('an info toast is announced politely', async () => {
      host.toasts.info('Saved');
      const [toast] = await (await outlet()).getToasts();

      expect(await toast.getRole()).toBe('status');
    });

    it('filters by severity', async () => {
      host.toasts.info('Saved');
      host.toasts.error('Upload failed');

      const errors = await (await outlet()).getToasts({ severity: 'error' });

      expect(errors.length).toBe(1);
      expect(await errors[0].getSummary()).toBe('Upload failed');
    });

    it('dismiss removes the toast', async () => {
      host.toasts.info('Saved');
      const o = await outlet();

      await o.dismiss({ summary: 'Saved' });

      expect(await o.getSummaries()).toEqual([]);
    });

    it('throws for a toast that is not showing', async () => {
      const o = await outlet();
      await expect(o.dismiss({ summary: 'Nothing' })).rejects.toThrow(/Nothing/);
    });
  });
});
