import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Code samples live here rather than inline in the template: an HTML file
 * cannot carry `{{` (Angular parses it as interpolation, and the `&#123;&#123;`
 * escape decodes back to `{{` before the template parser runs).
 */
@Component({
  selector: 'app-testing-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  imports: [],
  templateUrl: './testing-page.html',
  styleUrl: './testing-page.scss',
})
export class TestingPage {
  readonly codeSetup = `import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideSnAnimations } from 'ashen-ui/core';
import { SnSelectHarness } from 'ashen-ui/testing';

TestBed.configureTestingModule({
  providers: [
    provideZonelessChangeDetection(),
    // Overlays detach when their exit animation ends. Off, there is none and
    // they detach on the next render.
    provideSnAnimations('disabled'),
  ],
});

const fixture = TestBed.createComponent(Host);
await fixture.whenStable();
const loader = TestbedHarnessEnvironment.loader(fixture);`;

  readonly codeWithout = `// Without a harness, an app's test reaches into markup it does not own.
const trigger = fixture.nativeElement.querySelector('.sn-select-trigger');
trigger.click();
fixture.detectChanges();
const options = document.querySelectorAll('.sn-listbox-option');
(options[1] as HTMLElement).click();
fixture.detectChanges();
expect(
  fixture.nativeElement.querySelector('.sn-select-value').textContent.trim(),
).toBe('Tiếng Việt');`;

  readonly codeWith = `const select = await loader.getHarness(
  SnSelectHarness.with({ ariaLabel: 'Language' }),
);

await select.selectOption({ text: 'Tiếng Việt' });

expect(await select.getValueText()).toBe('Tiếng Việt');`;

  readonly codeFilters = `// Every harness has a .with() that filters by what a user can see.
await loader.getHarness(SnCheckboxHarness.with({ label: 'Accept terms' }));
await loader.getAllHarnesses(SnCheckboxHarness.with({ checked: true }));
await loader.getHarness(SnToastOutletHarness);

// getHarnessOrNull is how to assert something is NOT there.
expect(await loader.getHarnessOrNull(SnDialogHarness)).toBeNull();`;

  readonly codeKeyboard = `import { TestKey } from '@angular/cdk/testing';

// Selection follows focus in tabs, so the keyboard is a different code path
// from a click, and worth testing on its own.
const tabs = await loader.getHarness(SnTabsHarness);
await tabs.sendKey(TestKey.RIGHT_ARROW);
expect(await tabs.getSelectedLabel()).toBe('Billing');`;

  readonly codeNoDetectChanges = `const box = await loader.getHarness(SnCheckboxHarness);

host.disabled.set(true);

// No detectChanges(): a harness stabilizes the fixture before it reads.
expect(await box.isDisabled()).toBe(true);`;
}
