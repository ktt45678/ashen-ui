import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IconTemplate } from 'ashen-ui/core';
import {
  AutoComplete,
  AutoCompleteOptionTemplate,
  AutoCompleteSelectedValueTemplate,
  AutoCompleteSummaryTemplate,
  type AutoCompleteCompleteEvent,
  type AutoCompleteLoadMoreEvent,
} from 'ashen-ui/autocomplete';
import { FormField, FormFieldLabel, FormFieldHint } from 'ashen-ui/form-field';
import { Toggle } from 'ashen-ui/toggle';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

interface ProgramOption {
  id: string;
  name: string;
  category: string;
}

@Component({
  selector: 'app-autocomplete-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [
    AutoComplete,
    AutoCompleteOptionTemplate,
    AutoCompleteSelectedValueTemplate,
    AutoCompleteSummaryTemplate,
    IconTemplate,
    FormField,
    FormFieldLabel,
    FormFieldHint,
    Toggle,
    DocExample,
    ReactiveFormsModule,
    FormsModule, DocApi],
  templateUrl: './autocomplete-page.html',
  styleUrl: './autocomplete-page.scss',
})
export class AutocompletePage {
  protected readonly programs: readonly ProgramOption[] = [
    { id: 'terminal', name: 'Terminal', category: 'System' },
    { id: 'obs', name: 'OBS Studio', category: 'Media' },
    { id: 'spotify', name: 'Spotify', category: 'Media' },
    { id: 'code', name: 'VS Code', category: 'Development' },
  ];
  protected readonly countries = [
    'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'China',
    'Denmark', 'Egypt', 'Finland', 'France', 'Germany', 'India',
    'Indonesia', 'Ireland', 'Italy', 'Japan', 'Mexico', 'Netherlands',
    'New Zealand', 'Norway', 'Poland', 'Portugal', 'Russia', 'South Africa',
    'Spain', 'Sweden', 'Switzerland', 'United Kingdom', 'United States',
  ];

  protected readonly basicValue = signal('');
  protected readonly formFieldValue = signal('');
  protected readonly eventLogValue = signal('');
  protected readonly eventLog = signal<string[]>([]);
  protected readonly disabledValue = signal('Australia');

  protected readonly formCtrl = new FormControl<string>('');
  protected readonly objectValue = signal<ProgramOption | string>('');
  protected readonly objectValueDisplay = computed(() => {
    const value = this.objectValue();
    return typeof value === 'string' ? value : value.id;
  });
  protected readonly multipleValues = signal<readonly ProgramOption[]>([
    this.programs[0],
    this.programs[1],
    this.programs[2],
  ]);
  protected readonly panelValues = signal<readonly ProgramOption[]>([this.programs[1]]);
  protected readonly panelHideSelected = signal(false);
  protected readonly panelCheckmark = signal(true);
  protected readonly badgeValues = signal<readonly ProgramOption[]>([
    this.programs[0],
    this.programs[2],
  ]);
  protected readonly serverValue = signal('');
  protected readonly serverSuggestions = signal<readonly string[]>([]);
  protected readonly completionLog = signal<string[]>([]);
  protected readonly compareProgram = (left: ProgramOption, right: ProgramOption) =>
    left.id === right.id;

  protected onSelected(s: string): void {
    this.eventLog.update((log) => [`Selected: "${s}"`, ...log].slice(0, 5));
  }

  private static readonly PAGE_SIZE = 200;
  private static readonly MAX_ITEMS = 10000;

  protected readonly virtualValue = signal('');
  protected readonly virtualSuggestions = signal(
    Array.from({ length: AutocompletePage.PAGE_SIZE }, (_, i) => `Item ${i + 1}`),
  );
  protected readonly virtualHasMore = computed(
    () => this.virtualSuggestions().length < AutocompletePage.MAX_ITEMS,
  );

  protected onLoadMore(_event: AutoCompleteLoadMoreEvent): void {
    const current = this.virtualSuggestions();
    const next = Array.from(
      { length: AutocompletePage.PAGE_SIZE },
      (_, i) => `Item ${current.length + i + 1}`,
    );
    this.virtualSuggestions.set([...current, ...next]);
  }

  protected onComplete(event: AutoCompleteCompleteEvent): void {
    const query = event.query.trim().toLowerCase();
    const matches = this.countries.filter((country) => country.toLowerCase().includes(query));
    this.serverSuggestions.set(matches.slice(0, 8));
    this.completionLog.update((log) => [`${event.reason}: "${event.query}"`, ...log].slice(0, 4));
  }
}
