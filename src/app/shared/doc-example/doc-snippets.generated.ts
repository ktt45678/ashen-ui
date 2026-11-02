/** One source file behind a documentation example. */
export interface DocSnippetFile {
  readonly name: string;
  readonly lang: 'html' | 'ts' | 'scss';
  readonly code: string;
}

export const DOC_SNIPPETS: Readonly<Record<string, readonly DocSnippetFile[]>> = {
  "autocomplete/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-autocomplete\n    [(value)]=\"basicValue\"\n    [suggestions]=\"countries\"\n    placeholder=\"Search countries…\"\n    class=\"demo-input\"\n  ></sn-autocomplete>\n  <p class=\"hint-text\">Value: \"{{ basicValue() }}\"</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { AutoComplete } from 'ashen-ui/autocomplete';\n\n@Component({\n  selector: 'app-demo',\n  imports: [AutoComplete],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly countries = [\n    'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'China',\n    'Denmark', 'Egypt', 'Finland', 'France', 'Germany', 'India',\n    'Indonesia', 'Ireland', 'Italy', 'Japan', 'Mexico', 'Netherlands',\n    'New Zealand', 'Norway', 'Poland', 'Portugal', 'Russia', 'South Africa',\n    'Spain', 'Sweden', 'Switzerland', 'United Kingdom', 'United States',\n  ];\n\n  readonly basicValue = signal('');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-input {\n  max-width: 320px;\n  width: 100%;\n}\n\n.hint-text {\n  font-size: 0.8rem;\n  color: var(--sn-text-subtle);\n  margin: 0;\n}"
    }
  ],
  "autocomplete/codeObjects": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-autocomplete\n    [(value)]=\"objectValue\"\n    [suggestions]=\"programs\"\n    optionLabel=\"name\"\n    [compareWith]=\"compareProgram\"\n    placeholder=\"Search programs…\"\n    class=\"demo-input\"\n  >\n    <ng-template snAutoCompleteOption let-option>\n      <span class=\"program-option\">\n        <span>{{ option.name }}</span>\n        <small>{{ option.category }}</small>\n      </span>\n    </ng-template>\n  </sn-autocomplete>\n  <p class=\"hint-text\">Value: {{ objectValueDisplay() }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, computed, signal } from '@angular/core';\nimport { AutoComplete, AutoCompleteOptionTemplate } from 'ashen-ui/autocomplete';\n\ninterface ProgramOption {\n  id: string;\n  name: string;\n  category: string;\n}\n\n@Component({\n  selector: 'app-demo',\n  imports: [AutoComplete, AutoCompleteOptionTemplate],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly programs: readonly ProgramOption[] = [\n    { id: 'terminal', name: 'Terminal', category: 'System' },\n    { id: 'obs', name: 'OBS Studio', category: 'Media' },\n    { id: 'spotify', name: 'Spotify', category: 'Media' },\n    { id: 'code', name: 'VS Code', category: 'Development' },\n  ];\n\n  readonly objectValue = signal<ProgramOption | string>('');\n\n  readonly objectValueDisplay = computed(() => {\n    const value = this.objectValue();\n    return typeof value === 'string' ? value : value.id;\n  });\n\n  readonly compareProgram = (left: ProgramOption, right: ProgramOption) =>\n  left.id === right.id;\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-input {\n  max-width: 320px;\n  width: 100%;\n}\n\n.program-option {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: var(--sn-space-4);\n  width: 100%;\n}\n\n.program-option small {\n  color: var(--sn-text-subtle);\n}\n\n.hint-text {\n  font-size: 0.8rem;\n  color: var(--sn-text-subtle);\n  margin: 0;\n}"
    }
  ],
  "autocomplete/codeMultiple": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-autocomplete\n    multiple\n    [(values)]=\"multipleValues\"\n    [suggestions]=\"programs\"\n    optionLabel=\"name\"\n    [compareWith]=\"compareProgram\"\n    [maxSelectedLabels]=\"2\"\n    placeholder=\"Add programs…\"\n    class=\"demo-input-wide\"\n  >\n    <ng-template snAutoCompleteSelectedValue let-option>{{ option.name }}</ng-template>\n    <ng-template snAutoCompleteSummary let-count=\"count\">+{{ count }} more</ng-template>\n    <ng-template snIcon=\"remove\"><span aria-hidden=\"true\">×</span></ng-template>\n  </sn-autocomplete>\n  <p class=\"hint-text\">{{ multipleValues().length }} programs selected</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { AutoComplete, AutoCompleteSelectedValueTemplate, AutoCompleteSummaryTemplate } from 'ashen-ui/autocomplete';\nimport { IconTemplate } from 'ashen-ui/core';\n\ninterface ProgramOption {\n  id: string;\n  name: string;\n  category: string;\n}\n\n@Component({\n  selector: 'app-demo',\n  imports: [AutoComplete, AutoCompleteSelectedValueTemplate, AutoCompleteSummaryTemplate, IconTemplate],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly programs: readonly ProgramOption[] = [\n    { id: 'terminal', name: 'Terminal', category: 'System' },\n    { id: 'obs', name: 'OBS Studio', category: 'Media' },\n    { id: 'spotify', name: 'Spotify', category: 'Media' },\n    { id: 'code', name: 'VS Code', category: 'Development' },\n  ];\n\n  readonly multipleValues = signal<readonly ProgramOption[]>([\n    this.programs[0],\n    this.programs[1],\n    this.programs[2],\n  ]);\n\n  readonly compareProgram = (left: ProgramOption, right: ProgramOption) =>\n  left.id === right.id;\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-input-wide {\n  max-width: 480px;\n  width: 100%;\n}\n\n.hint-text {\n  font-size: 0.8rem;\n  color: var(--sn-text-subtle);\n  margin: 0;\n}"
    }
  ],
  "autocomplete/codeToggle": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-autocomplete\n    multiple\n    [(values)]=\"panelValues\"\n    [suggestions]=\"programs\"\n    optionLabel=\"name\"\n    [compareWith]=\"compareProgram\"\n    [hideSelected]=\"panelHideSelected()\"\n    [checkmark]=\"panelCheckmark()\"\n    placeholder=\"Add programs…\"\n    class=\"demo-input-wide\"\n  />\n  <div class=\"demo-toggles\">\n    <sn-toggle [(checked)]=\"panelHideSelected\">hideSelected</sn-toggle>\n    <sn-toggle [(checked)]=\"panelCheckmark\">checkmark</sn-toggle>\n  </div>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { AutoComplete } from 'ashen-ui/autocomplete';\nimport { Toggle } from 'ashen-ui/toggle';\n\ninterface ProgramOption {\n  id: string;\n  name: string;\n  category: string;\n}\n\n@Component({\n  selector: 'app-demo',\n  imports: [AutoComplete, Toggle],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly programs: readonly ProgramOption[] = [\n    { id: 'terminal', name: 'Terminal', category: 'System' },\n    { id: 'obs', name: 'OBS Studio', category: 'Media' },\n    { id: 'spotify', name: 'Spotify', category: 'Media' },\n    { id: 'code', name: 'VS Code', category: 'Development' },\n  ];\n\n  readonly panelValues = signal<readonly ProgramOption[]>([this.programs[1]]);\n\n  readonly panelHideSelected = signal(false);\n\n  readonly panelCheckmark = signal(true);\n\n  readonly compareProgram = (left: ProgramOption, right: ProgramOption) =>\n  left.id === right.id;\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-input-wide {\n  max-width: 480px;\n  width: 100%;\n}\n\n.demo-toggles {\n  display: flex;\n  flex-wrap: wrap;\n  gap: var(--sn-space-4);\n}"
    }
  ],
  "autocomplete/codeBadge": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-autocomplete\n    multiple\n    [(values)]=\"badgeValues\"\n    [suggestions]=\"programs\"\n    optionLabel=\"name\"\n    [compareWith]=\"compareProgram\"\n    [maxSelectedLabels]=\"0\"\n    [removable]=\"false\"\n    hideValuesOnFocus\n    placeholder=\"Add programs…\"\n    class=\"demo-input-wide\"\n  >\n    <ng-template snAutoCompleteSummary let-count=\"count\">\n      <span class=\"selection-badge\">{{ count }} selected</span>\n    </ng-template>\n  </sn-autocomplete>\n  <p class=\"hint-text\">Focus the field to see the badge give way to the caret.</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { AutoComplete, AutoCompleteSummaryTemplate } from 'ashen-ui/autocomplete';\n\ninterface ProgramOption {\n  id: string;\n  name: string;\n  category: string;\n}\n\n@Component({\n  selector: 'app-demo',\n  imports: [AutoComplete, AutoCompleteSummaryTemplate],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly programs: readonly ProgramOption[] = [\n    { id: 'terminal', name: 'Terminal', category: 'System' },\n    { id: 'obs', name: 'OBS Studio', category: 'Media' },\n    { id: 'spotify', name: 'Spotify', category: 'Media' },\n    { id: 'code', name: 'VS Code', category: 'Development' },\n  ];\n\n  readonly badgeValues = signal<readonly ProgramOption[]>([\n    this.programs[0],\n    this.programs[2],\n  ]);\n\n  readonly compareProgram = (left: ProgramOption, right: ProgramOption) =>\n  left.id === right.id;\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-input-wide {\n  max-width: 480px;\n  width: 100%;\n}\n\n.hint-text {\n  font-size: 0.8rem;\n  color: var(--sn-text-subtle);\n  margin: 0;\n}\n\n.selection-badge {\n  display: inline-flex;\n  align-items: center;\n  padding: var(--sn-space-1) var(--sn-space-2);\n  border-radius: var(--sn-radius-pill);\n  background: color-mix(in srgb, var(--sn-color-primary) 16%, transparent);\n  color: var(--sn-color-primary);\n  font-size: var(--sn-text-xs);\n  line-height: var(--sn-leading-tight);\n}"
    }
  ],
  "autocomplete/codeServer": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-autocomplete\n    [(value)]=\"serverValue\"\n    [suggestions]=\"serverSuggestions()\"\n    [filter]=\"false\"\n    completeOnFocus\n    (complete)=\"onComplete($event)\"\n    placeholder=\"Search remote countries…\"\n    class=\"demo-input\"\n  />\n  @if (completionLog().length > 0) {\n    <p class=\"hint-text\">Latest completion: {{ completionLog()[0] }}</p>\n  }\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { AutoComplete, AutoCompleteCompleteEvent } from 'ashen-ui/autocomplete';\n\n@Component({\n  selector: 'app-demo',\n  imports: [AutoComplete],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly countries = [\n    'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'China',\n    'Denmark', 'Egypt', 'Finland', 'France', 'Germany', 'India',\n    'Indonesia', 'Ireland', 'Italy', 'Japan', 'Mexico', 'Netherlands',\n    'New Zealand', 'Norway', 'Poland', 'Portugal', 'Russia', 'South Africa',\n    'Spain', 'Sweden', 'Switzerland', 'United Kingdom', 'United States',\n  ];\n\n  readonly serverValue = signal('');\n\n  readonly serverSuggestions = signal<readonly string[]>([]);\n\n  readonly completionLog = signal<string[]>([]);\n\n  onComplete(event: AutoCompleteCompleteEvent): void {\n    const query = event.query.trim().toLowerCase();\n    const matches = this.countries.filter((country) => country.toLowerCase().includes(query));\n    this.serverSuggestions.set(matches.slice(0, 8));\n    this.completionLog.update((log) => [`${event.reason}: \"${event.query}\"`, ...log].slice(0, 4));\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-input {\n  max-width: 320px;\n  width: 100%;\n}\n\n.hint-text {\n  font-size: 0.8rem;\n  color: var(--sn-text-subtle);\n  margin: 0;\n}"
    }
  ],
  "autocomplete/codeReactive": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-autocomplete\n    [formControl]=\"formCtrl\"\n    [suggestions]=\"countries\"\n    placeholder=\"Search countries…\"\n    class=\"demo-input\"\n  ></sn-autocomplete>\n  <p class=\"hint-text\">FormControl value: \"{{ formCtrl.value }}\"</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule } from '@angular/forms';\nimport { AutoComplete } from 'ashen-ui/autocomplete';\n\n@Component({\n  selector: 'app-demo',\n  imports: [AutoComplete, ReactiveFormsModule],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly countries = [\n    'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'China',\n    'Denmark', 'Egypt', 'Finland', 'France', 'Germany', 'India',\n    'Indonesia', 'Ireland', 'Italy', 'Japan', 'Mexico', 'Netherlands',\n    'New Zealand', 'Norway', 'Poland', 'Portugal', 'Russia', 'South Africa',\n    'Spain', 'Sweden', 'Switzerland', 'United Kingdom', 'United States',\n  ];\n\n  readonly formCtrl = new FormControl<string>('');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-input {\n  max-width: 320px;\n  width: 100%;\n}\n\n.hint-text {\n  font-size: 0.8rem;\n  color: var(--sn-text-subtle);\n  margin: 0;\n}"
    }
  ],
  "autocomplete/codeEvent": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-autocomplete\n    [(value)]=\"eventLogValue\"\n    [suggestions]=\"countries\"\n    (selected)=\"onSelected($event)\"\n    placeholder=\"Search countries…\"\n    class=\"demo-input\"\n  ></sn-autocomplete>\n  <p class=\"hint-text\">Value: \"{{ eventLogValue() }}\"</p>\n  @if (eventLog().length > 0) {\n    <ul class=\"event-log\">\n      @for (entry of eventLog(); track entry) {\n        <li>{{ entry }}</li>\n      }\n    </ul>\n  }\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { AutoComplete } from 'ashen-ui/autocomplete';\n\n@Component({\n  selector: 'app-demo',\n  imports: [AutoComplete],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly countries = [\n    'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'China',\n    'Denmark', 'Egypt', 'Finland', 'France', 'Germany', 'India',\n    'Indonesia', 'Ireland', 'Italy', 'Japan', 'Mexico', 'Netherlands',\n    'New Zealand', 'Norway', 'Poland', 'Portugal', 'Russia', 'South Africa',\n    'Spain', 'Sweden', 'Switzerland', 'United Kingdom', 'United States',\n  ];\n\n  readonly eventLogValue = signal('');\n\n  readonly eventLog = signal<string[]>([]);\n\n  onSelected(s: string): void {\n    this.eventLog.update((log) => [`Selected: \"${s}\"`, ...log].slice(0, 5));\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-input {\n  max-width: 320px;\n  width: 100%;\n}\n\n.hint-text {\n  font-size: 0.8rem;\n  color: var(--sn-text-subtle);\n  margin: 0;\n}\n\n.event-log {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  font-size: 0.8rem;\n  color: var(--sn-text-subtle);\n  display: flex;\n  flex-direction: column;\n  gap: 0.25rem;\n}"
    }
  ],
  "autocomplete/codeFormField": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-form-field class=\"demo-input\">\n    <sn-label>Country</sn-label>\n    <sn-autocomplete\n      [(value)]=\"formFieldValue\"\n      [suggestions]=\"countries\"\n      placeholder=\"Search countries…\"\n    ></sn-autocomplete>\n    <sn-hint>Start typing to filter</sn-hint>\n  </sn-form-field>\n  <p class=\"hint-text\">Value: \"{{ formFieldValue() }}\"</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { AutoComplete } from 'ashen-ui/autocomplete';\nimport { FormField, FormFieldHint, FormFieldLabel } from 'ashen-ui/form-field';\n\n@Component({\n  selector: 'app-demo',\n  imports: [AutoComplete, FormField, FormFieldHint, FormFieldLabel],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly countries = [\n    'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'China',\n    'Denmark', 'Egypt', 'Finland', 'France', 'Germany', 'India',\n    'Indonesia', 'Ireland', 'Italy', 'Japan', 'Mexico', 'Netherlands',\n    'New Zealand', 'Norway', 'Poland', 'Portugal', 'Russia', 'South Africa',\n    'Spain', 'Sweden', 'Switzerland', 'United Kingdom', 'United States',\n  ];\n\n  readonly formFieldValue = signal('');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-input {\n  max-width: 320px;\n  width: 100%;\n}\n\n.hint-text {\n  font-size: 0.8rem;\n  color: var(--sn-text-subtle);\n  margin: 0;\n}"
    }
  ],
  "autocomplete/codeVirtual": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-autocomplete\n    [(value)]=\"virtualValue\"\n    [suggestions]=\"virtualSuggestions()\"\n    virtual\n    [hasMore]=\"virtualHasMore()\"\n    (loadMore)=\"onLoadMore($event)\"\n    placeholder=\"Search 10,000 items…\"\n    class=\"demo-input\"\n  ></sn-autocomplete>\n  <p class=\"hint-text\">{{ virtualSuggestions().length }} suggestions loaded{{ virtualHasMore() ? '' : ' (all)' }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, computed, signal } from '@angular/core';\nimport { AutoComplete, AutoCompleteLoadMoreEvent } from 'ashen-ui/autocomplete';\n\n@Component({\n  selector: 'app-demo',\n  imports: [AutoComplete],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  private static readonly PAGE_SIZE = 200;\n\n  private static readonly MAX_ITEMS = 10000;\n\n  readonly virtualValue = signal('');\n\n  readonly virtualSuggestions = signal(\n    Array.from({ length: AutocompletePage.PAGE_SIZE }, (_, i) => `Item ${i + 1}`),\n  );\n\n  readonly virtualHasMore = computed(\n    () => this.virtualSuggestions().length < AutocompletePage.MAX_ITEMS,\n  );\n\n  onLoadMore(_event: AutoCompleteLoadMoreEvent): void {\n    const current = this.virtualSuggestions();\n    const next = Array.from(\n      { length: AutocompletePage.PAGE_SIZE },\n      (_, i) => `Item ${current.length + i + 1}`,\n    );\n    this.virtualSuggestions.set([...current, ...next]);\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-input {\n  max-width: 320px;\n  width: 100%;\n}\n\n.hint-text {\n  font-size: 0.8rem;\n  color: var(--sn-text-subtle);\n  margin: 0;\n}"
    }
  ],
  "autocomplete/codeDisabled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-autocomplete\n    [disabled]=\"true\"\n    [(value)]=\"disabledValue\"\n    [suggestions]=\"countries\"\n    class=\"demo-input\"\n  ></sn-autocomplete>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { AutoComplete } from 'ashen-ui/autocomplete';\n\n@Component({\n  selector: 'app-demo',\n  imports: [AutoComplete],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly countries = [\n    'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'China',\n    'Denmark', 'Egypt', 'Finland', 'France', 'Germany', 'India',\n    'Indonesia', 'Ireland', 'Italy', 'Japan', 'Mexico', 'Netherlands',\n    'New Zealand', 'Norway', 'Poland', 'Portugal', 'Russia', 'South Africa',\n    'Spain', 'Sweden', 'Switzerland', 'United Kingdom', 'United States',\n  ];\n\n  readonly disabledValue = signal('Australia');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-input {\n  max-width: 320px;\n  width: 100%;\n}"
    }
  ],
  "avatar/codeFallback": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-avatar label=\"Ada Lovelace\" />\n  <sn-avatar label=\"Grace Hopper\" />\n  <sn-avatar label=\"Turing\" />\n  <sn-avatar />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Avatar } from 'ashen-ui/avatar';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Avatar],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row { display: flex; align-items: center; gap: var(--sn-space-3); flex-wrap: wrap; }"
    }
  ],
  "avatar/codeBrokenImage": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-avatar [image]=\"brokenImage()\" label=\"Ada Lovelace\" />\n  <span class=\"demo-caption\">image + label</span>\n  <sn-avatar [image]=\"brokenImage()\" />\n  <span class=\"demo-caption\">image alone, no initials to fall back to</span>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Avatar } from 'ashen-ui/avatar';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Avatar],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly brokenImage = signal('data:image/png;base64,AAAA');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row { display: flex; align-items: center; gap: var(--sn-space-3); flex-wrap: wrap; }\n\n.demo-caption { font-size: var(--sn-text-xs); color: var(--sn-text-subtle); }"
    }
  ],
  "avatar/codeSizes": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-avatar label=\"Ada Lovelace\" size=\"sm\" />\n  <sn-avatar label=\"Ada Lovelace\" size=\"md\" />\n  <sn-avatar label=\"Ada Lovelace\" size=\"lg\" />\n  <sn-avatar label=\"Ada Lovelace\" size=\"xl\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Avatar } from 'ashen-ui/avatar';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Avatar],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row { display: flex; align-items: center; gap: var(--sn-space-3); flex-wrap: wrap; }"
    }
  ],
  "avatar/codeShape": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-avatar label=\"Ada Lovelace\" shape=\"square\" />\n  <sn-avatar icon=\"groups\" shape=\"square\" />\n  <sn-avatar icon=\"corporate_fare\" shape=\"square\" size=\"lg\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Avatar } from 'ashen-ui/avatar';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Avatar],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row { display: flex; align-items: center; gap: var(--sn-space-3); flex-wrap: wrap; }"
    }
  ],
  "avatar/codeIcon": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-avatar icon=\"support_agent\" />\n  <sn-avatar icon=\"smart_toy\" />\n  <sn-avatar icon=\"groups\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Avatar } from 'ashen-ui/avatar';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Avatar],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row { display: flex; align-items: center; gap: var(--sn-space-3); flex-wrap: wrap; }"
    }
  ],
  "avatar/codeGroup": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-avatar-group [max]=\"3\">\n  <sn-avatar label=\"Ada Lovelace\" />\n  <sn-avatar label=\"Grace Hopper\" />\n  <sn-avatar label=\"Alan Turing\" />\n  <sn-avatar label=\"Katherine Johnson\" />\n</sn-avatar-group>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Avatar, AvatarGroup } from 'ashen-ui/avatar';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Avatar, AvatarGroup],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly max = signal(3);\n}"
    }
  ],
  "avatar/codeGroup-2": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-avatar-group [max]=\"max()\">\n    @for (name of team(); track name) {\n      <sn-avatar [label]=\"name\" />\n    }\n  </sn-avatar-group>\n  <div class=\"demo-row\">\n    <button snButton size=\"sm\" variant=\"outlined\" (click)=\"removeMember()\">Remove</button>\n    <button snButton size=\"sm\" variant=\"outlined\" (click)=\"addMember()\">Add</button>\n    <span class=\"demo-caption\">{{ team().length }} members, max {{ max() }}</span>\n  </div>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Avatar, AvatarGroup } from 'ashen-ui/avatar';\nimport { Button } from 'ashen-ui/button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Avatar, AvatarGroup, Button],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly team = signal([\n    'Ada Lovelace',\n    'Grace Hopper',\n    'Alan Turing',\n    'Katherine Johnson',\n    'Edsger Dijkstra',\n  ]);\n\n  readonly max = signal(3);\n\n  addMember(): void {\n    this.team.update((names) => [...names, `Member ${names.length + 1}`]);\n  }\n\n  removeMember(): void {\n    this.team.update((names) => names.slice(0, -1));\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-4); max-width: 480px; }\n\n.demo-row { display: flex; align-items: center; gap: var(--sn-space-3); flex-wrap: wrap; }\n\n.demo-caption { font-size: var(--sn-text-xs); color: var(--sn-text-subtle); }"
    }
  ],
  "avatar/codeGroupSize": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-avatar-group size=\"lg\" shape=\"square\">\n  <sn-avatar label=\"Ada Lovelace\" />\n  <sn-avatar label=\"Grace Hopper\" />\n  <sn-avatar label=\"Alan Turing\" size=\"sm\" />\n</sn-avatar-group>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Avatar, AvatarGroup } from 'ashen-ui/avatar';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Avatar, AvatarGroup],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "badge/codeStandalone": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-badge value=\"3\" />\n<sn-badge value=\"12\" color=\"error\" />\n<sn-badge value=\"new\" color=\"success\" />\n<sn-badge value=\"99+\" color=\"warning\" />\n<sn-badge value=\"1\" color=\"info\" />\n<sn-badge value=\"5\" color=\"secondary\" />"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Badge } from 'ashen-ui/badge';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Badge],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "badge/codeDot": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-badge dot />\n<sn-badge dot color=\"success\" />\n<sn-badge dot color=\"error\" />\n<sn-badge dot color=\"warning\" />"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Badge } from 'ashen-ui/badge';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Badge],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "badge/codeOverlay": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-badge value=\"2\" color=\"error\" overlay>\n  <button snButton variant=\"icon\" icon=\"notifications\" aria-label=\"Notifications\"></button>\n</sn-badge>\n<sn-badge dot color=\"success\" overlay>\n  <button snButton variant=\"icon\" icon=\"wifi\" aria-label=\"Network\"></button>\n</sn-badge>\n<sn-badge value=\"9+\" color=\"warning\" overlay>\n  <button snButton variant=\"icon\" icon=\"mail\" aria-label=\"Mail\"></button>\n</sn-badge>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Badge } from 'ashen-ui/badge';\nimport { Button } from 'ashen-ui/button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Badge, Button],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "badge/codeCustom": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-badge value=\"PRO\" style=\"--sn-badge-bg: #6941c6; --sn-badge-text: #fff;\" />\n<sn-badge value=\"BETA\" style=\"--sn-badge-bg: #0e7490; --sn-badge-text: #fff;\" />"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Badge } from 'ashen-ui/badge';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Badge],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "breadcrumb/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-breadcrumb>\n  <sn-breadcrumb-item href=\"/\">Home</sn-breadcrumb-item>\n  <sn-breadcrumb-item href=\"/library\">Library</sn-breadcrumb-item>\n  <sn-breadcrumb-item>Current Page</sn-breadcrumb-item>\n</sn-breadcrumb>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Breadcrumb, BreadcrumbItem } from 'ashen-ui/breadcrumb';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Breadcrumb, BreadcrumbItem],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "breadcrumb/codeWithIcons": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-breadcrumb>\n  <sn-breadcrumb-item href=\"/\" icon=\"grid_view\">Grids</sn-breadcrumb-item>\n  <sn-breadcrumb-item href=\"/main\">Main</sn-breadcrumb-item>\n  <sn-breadcrumb-item>Play Music</sn-breadcrumb-item>\n</sn-breadcrumb>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Breadcrumb, BreadcrumbItem } from 'ashen-ui/breadcrumb';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Breadcrumb, BreadcrumbItem],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "breadcrumb/codeSingleItem": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-breadcrumb>\n  <sn-breadcrumb-item>Dashboard</sn-breadcrumb-item>\n</sn-breadcrumb>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Breadcrumb, BreadcrumbItem } from 'ashen-ui/breadcrumb';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Breadcrumb, BreadcrumbItem],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "breadcrumb/codeCustomLabel": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-breadcrumb label=\"Site Navigation\">\n  <sn-breadcrumb-item href=\"/\">Home</sn-breadcrumb-item>\n  <sn-breadcrumb-item>About</sn-breadcrumb-item>\n</sn-breadcrumb>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Breadcrumb, BreadcrumbItem } from 'ashen-ui/breadcrumb';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Breadcrumb, BreadcrumbItem],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "breadcrumb/codeSnClass": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-breadcrumb snClass=\"my-breadcrumb\">\n  <sn-breadcrumb-item href=\"/\" [snClass]=\"{ link: 'my-link' }\">Home</sn-breadcrumb-item>\n  <sn-breadcrumb-item>Current</sn-breadcrumb-item>\n</sn-breadcrumb>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Breadcrumb, BreadcrumbItem } from 'ashen-ui/breadcrumb';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Breadcrumb, BreadcrumbItem],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "button/codeSolid": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<button snButton>Save</button>\n<button snButton color=\"secondary\">Cancel</button>\n<button snButton color=\"success\">Apply</button>\n<button snButton color=\"error\">Delete</button>\n<button snButton color=\"warning\">Reset</button>\n<button snButton color=\"info\">Info</button>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "button/codeVariants": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<button snButton variant=\"raised\">Raised</button>\n<button snButton variant=\"outlined\">Outlined</button>\n<button snButton variant=\"text\">Text</button>\n<button snButton variant=\"icon\" icon=\"settings\" aria-label=\"Settings\"></button>\n<button snButton variant=\"icon-filled\" icon=\"edit\" aria-label=\"Edit\"></button>\n<button snButton variant=\"icon-outlined\" icon=\"delete\" aria-label=\"Delete\"></button>\n<button snButton variant=\"icon-text\" icon=\"more_vert\" aria-label=\"More actions\"></button>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "button/codeSizes": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<button snButton size=\"xs\">Extra small</button>\n<button snButton size=\"sm\">Small</button>\n<button snButton>Medium</button>\n<button snButton size=\"lg\">Large</button>\n<button snButton icon=\"add\">With icon</button>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "button/codeShape": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<button snButton shape=\"pill\">Pill</button>\n<button snButton shape=\"pill\" size=\"xs\">Extra small pill</button>\n<button snButton shape=\"pill\" variant=\"outlined\">Outlined pill</button>\n<button snButton shape=\"pill\" variant=\"text\">Text pill</button>\n<button snButton shape=\"pill\" icon=\"add\">Pill with icon</button>\n<button snButton shape=\"pill\" variant=\"outlined\" icon=\"close\" iconOnly aria-label=\"Close\"></button>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "button/codeStates": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<button snButton disabled>Disabled</button>\n<button snButton loading>Saving</button>\n<button snButton variant=\"outlined\" disabled>Disabled outlined</button>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "button/codeLoading": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<button snButton loading>Default</button>\n<button snButton loading loadingVariant=\"material\">Material</button>\n<button snButton variant=\"outlined\" loading loadingVariant=\"material\">Material</button>\n<button snButton variant=\"icon\" loading loadingVariant=\"material\" aria-label=\"Loading\"></button>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "button/codeIcons": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<button snButton icon=\"save\">Save</button>\n<button snButton icon=\"download\" iconPosition=\"end\">Export</button>\n<button snButton variant=\"text\" icon=\"delete\" color=\"error\">Delete</button>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "button/codeOutlined": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<button snButton variant=\"outlined\">Primary</button>\n<button snButton variant=\"outlined\" color=\"secondary\">Secondary</button>\n<button snButton variant=\"outlined\" color=\"success\">Success</button>\n<button snButton variant=\"outlined\" color=\"error\">Error</button>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "button/codeAnchor": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<a snButton href=\"#\">Home</a>\n<a snButton variant=\"outlined\" href=\"#\">Docs</a>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "card/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-cards\">\n  <sn-card>\n    <sn-card-title>Grid Settings</sn-card-title>\n    <sn-card-subtitle>Main · 6 × 3 · 12 items</sn-card-subtitle>\n    <sn-card-content>\n      Grids hold button and widget tiles. Drag to move, pull a handle to resize.\n    </sn-card-content>\n    <sn-card-footer>\n      <button snButton variant=\"text\" color=\"secondary\" size=\"sm\">Cancel</button>\n      <button snButton size=\"sm\">Save</button>\n    </sn-card-footer>\n  </sn-card>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Card, CardContent, CardFooter, CardSubtitle, CardTitle } from 'ashen-ui/card';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Card, CardContent, CardFooter, CardSubtitle, CardTitle],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-cards { display: grid; grid-template-columns: 1fr; gap: var(--sn-space-4); max-width: 360px; }"
    }
  ],
  "card/codeContentOnly": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-cards\">\n  <sn-card>\n    <sn-card-content>\n      A minimal card with content only - no title, subtitle, or footer.\n    </sn-card-content>\n  </sn-card>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Card, CardContent } from 'ashen-ui/card';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Card, CardContent],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-cards { display: grid; grid-template-columns: 1fr; gap: var(--sn-space-4); max-width: 360px; }"
    }
  ],
  "card/codeNoFooter": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-cards\">\n  <sn-card>\n    <sn-card-title>Visual Appearance</sn-card-title>\n    <sn-card-subtitle>Icon, colors, and opacity</sn-card-subtitle>\n    <sn-card-content>\n      Configure the visual appearance of the selected tile.\n    </sn-card-content>\n  </sn-card>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Card, CardContent, CardSubtitle, CardTitle } from 'ashen-ui/card';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Card, CardContent, CardSubtitle, CardTitle],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-cards { display: grid; grid-template-columns: 1fr; gap: var(--sn-space-4); max-width: 360px; }"
    }
  ],
  "card/codeWithHeader": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-cards\">\n  <sn-card>\n    <sn-card-header>\n      <div class=\"demo-media-placeholder\" aria-hidden=\"true\"></div>\n    </sn-card-header>\n    <sn-card-title>Image Card</sn-card-title>\n    <sn-card-content>A card with a media header above the title.</sn-card-content>\n  </sn-card>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Card, CardContent, CardHeader, CardTitle } from 'ashen-ui/card';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Card, CardContent, CardHeader, CardTitle],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-cards { display: grid; grid-template-columns: 1fr; gap: var(--sn-space-4); max-width: 360px; }\n\n.demo-media-placeholder { width: 100%; height: 120px; background: var(--sn-surface-canvas); }"
    }
  ],
  "card/codeSnClass": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-cards\">\n  <sn-card [snClass]=\"{ root: 'demo-highlighted-card' }\">\n    <sn-card-content>Root element receives the <code>demo-highlighted-card</code> class.</sn-card-content>\n  </sn-card>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Card, CardContent } from 'ashen-ui/card';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Card, CardContent],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-cards { display: grid; grid-template-columns: 1fr; gap: var(--sn-space-4); max-width: 360px; }"
    }
  ],
  "carousel/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"carousel-demo-wrap\">\n  <sn-carousel>\n    <sn-carousel-item>\n      <div class=\"demo-slide demo-slide--1\">Slide 1</div>\n    </sn-carousel-item>\n    <sn-carousel-item>\n      <div class=\"demo-slide demo-slide--2\">Slide 2</div>\n    </sn-carousel-item>\n    <sn-carousel-item>\n      <div class=\"demo-slide demo-slide--3\">Slide 3</div>\n    </sn-carousel-item>\n    <sn-carousel-item>\n      <div class=\"demo-slide demo-slide--4\">Slide 4</div>\n    </sn-carousel-item>\n  </sn-carousel>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Carousel, CarouselItem } from 'ashen-ui/carousel';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Carousel, CarouselItem],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".carousel-demo-wrap {\n  width: 100%;\n  max-width: 480px;\n}\n\n.demo-slide {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 160px;\n  border-radius: var(--sn-radius-tile);\n  font-size: var(--sn-text-lg);\n  font-weight: var(--sn-font-weight-semibold);\n  color: var(--sn-text-on-primary);\n}\n\n.demo-slide--1 { background: var(--sn-color-primary); }\n\n.demo-slide--2 { background: var(--sn-color-success); }\n\n.demo-slide--3 { background: var(--sn-color-warning); }\n\n.demo-slide--4 { background: var(--sn-color-error); }\n\n/* In the vertical demo each slide should fill the fixed-height viewport. */\n.sn-carousel--vertical .demo-slide {\n  height: 100%;\n}"
    }
  ],
  "carousel/codeCards": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"carousel-demo-wrap\">\n  <sn-carousel>\n    <sn-carousel-item>\n      <div class=\"demo-card\">\n        <strong>Ocean Breeze</strong>\n        <p>A calming coastal view at dawn with soft pastel tones.</p>\n      </div>\n    </sn-carousel-item>\n    <sn-carousel-item>\n      <div class=\"demo-card\">\n        <strong>Mountain Peak</strong>\n        <p>Snow-capped summit above the clouds at golden hour.</p>\n      </div>\n    </sn-carousel-item>\n    <sn-carousel-item>\n      <div class=\"demo-card\">\n        <strong>Desert Dunes</strong>\n        <p>Warm sand ripples stretching to the horizon at sunset.</p>\n      </div>\n    </sn-carousel-item>\n  </sn-carousel>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Carousel, CarouselItem } from 'ashen-ui/carousel';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Carousel, CarouselItem],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".carousel-demo-wrap {\n  width: 100%;\n  max-width: 480px;\n}\n\n.demo-card {\n  display: flex;\n  flex-direction: column;\n  gap: var(--sn-space-2);\n  padding: var(--sn-space-5);\n  background: var(--sn-surface-raised);\n  border: 1px solid var(--sn-border);\n  border-radius: var(--sn-radius-tile);\n  min-height: 120px;\n\n  strong {\n    font-size: var(--sn-text-base);\n    font-weight: var(--sn-font-weight-semibold);\n    color: var(--sn-text);\n  }\n\n  p {\n    margin: 0;\n    font-size: var(--sn-text-sm);\n    color: var(--sn-text-muted);\n  }\n}"
    }
  ],
  "carousel/codeBinding": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"carousel-demo-wrap\">\n  <sn-carousel [(activeIndex)]=\"activeIndex\">\n    <sn-carousel-item>\n      <div class=\"demo-slide demo-slide--1\">First</div>\n    </sn-carousel-item>\n    <sn-carousel-item>\n      <div class=\"demo-slide demo-slide--2\">Second</div>\n    </sn-carousel-item>\n    <sn-carousel-item>\n      <div class=\"demo-slide demo-slide--3\">Third</div>\n    </sn-carousel-item>\n  </sn-carousel>\n  <p class=\"demo-binding-info\">Active index: {{ activeIndex() }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Carousel, CarouselItem } from 'ashen-ui/carousel';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Carousel, CarouselItem],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly activeIndex = signal(0);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".carousel-demo-wrap {\n  width: 100%;\n  max-width: 480px;\n}\n\n.demo-slide {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 160px;\n  border-radius: var(--sn-radius-tile);\n  font-size: var(--sn-text-lg);\n  font-weight: var(--sn-font-weight-semibold);\n  color: var(--sn-text-on-primary);\n}\n\n.demo-slide--1 { background: var(--sn-color-primary); }\n\n.demo-slide--2 { background: var(--sn-color-success); }\n\n.demo-slide--3 { background: var(--sn-color-warning); }\n\n/* In the vertical demo each slide should fill the fixed-height viewport. */\n.sn-carousel--vertical .demo-slide {\n  height: 100%;\n}\n\n.demo-binding-info {\n  margin-top: var(--sn-space-3);\n  font-size: var(--sn-text-sm);\n  color: var(--sn-text-subtle);\n}"
    }
  ],
  "carousel/codeAutoplay": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"carousel-demo-wrap\">\n  <sn-carousel\n    [options]=\"{\n      autoplay: { delay: 2500, pauseOnMouseEnter: true, disableOnInteraction: false },\n      loop: true,\n      pagination: { clickable: true }\n    }\"\n  >\n    <sn-carousel-item>\n      <div class=\"demo-slide demo-slide--1\">Slide 1</div>\n    </sn-carousel-item>\n    <sn-carousel-item>\n      <div class=\"demo-slide demo-slide--2\">Slide 2</div>\n    </sn-carousel-item>\n    <sn-carousel-item>\n      <div class=\"demo-slide demo-slide--3\">Slide 3</div>\n    </sn-carousel-item>\n  </sn-carousel>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Carousel, CarouselItem } from 'ashen-ui/carousel';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Carousel, CarouselItem],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".carousel-demo-wrap {\n  width: 100%;\n  max-width: 480px;\n}\n\n.demo-slide {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 160px;\n  border-radius: var(--sn-radius-tile);\n  font-size: var(--sn-text-lg);\n  font-weight: var(--sn-font-weight-semibold);\n  color: var(--sn-text-on-primary);\n}\n\n.demo-slide--1 { background: var(--sn-color-primary); }\n\n.demo-slide--2 { background: var(--sn-color-success); }\n\n.demo-slide--3 { background: var(--sn-color-warning); }\n\n/* In the vertical demo each slide should fill the fixed-height viewport. */\n.sn-carousel--vertical .demo-slide {\n  height: 100%;\n}"
    }
  ],
  "carousel/codeMultiView": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"carousel-demo-wrap\">\n  <sn-carousel [options]=\"{ slidesPerView: 3, spaceBetween: 12, slidesPerGroup: 3 }\">\n    @for (n of [1, 2, 3, 4, 5, 6]; track n) {\n      <sn-carousel-item>\n        <div class=\"demo-slide demo-slide--{{ n }}\">{{ n }}</div>\n      </sn-carousel-item>\n    }\n  </sn-carousel>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Carousel, CarouselItem } from 'ashen-ui/carousel';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Carousel, CarouselItem],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".carousel-demo-wrap {\n  width: 100%;\n  max-width: 480px;\n}\n\n.demo-slide {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 160px;\n  border-radius: var(--sn-radius-tile);\n  font-size: var(--sn-text-lg);\n  font-weight: var(--sn-font-weight-semibold);\n  color: var(--sn-text-on-primary);\n}\n\n/* In the vertical demo each slide should fill the fixed-height viewport. */\n.sn-carousel--vertical .demo-slide {\n  height: 100%;\n}"
    }
  ],
  "carousel/codeCustomNav": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"carousel-demo-wrap\">\n  <div class=\"demo-carousel-toolbar\">\n    <button snButton variant=\"icon\" icon=\"arrow_back\" aria-label=\"Previous\" [snCarouselPrev]=\"c\"></button>\n    <sn-carousel-pagination [carousel]=\"c\" />\n    <button snButton variant=\"icon\" icon=\"arrow_forward\" aria-label=\"Next\" [snCarouselNext]=\"c\"></button>\n  </div>\n  <sn-carousel #c [options]=\"{ navigation: false, pagination: false }\">\n    <sn-carousel-item>\n      <div class=\"demo-slide demo-slide--1\">Slide 1</div>\n    </sn-carousel-item>\n    <sn-carousel-item>\n      <div class=\"demo-slide demo-slide--2\">Slide 2</div>\n    </sn-carousel-item>\n    <sn-carousel-item>\n      <div class=\"demo-slide demo-slide--3\">Slide 3</div>\n    </sn-carousel-item>\n  </sn-carousel>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Carousel, CarouselItem, CarouselNext, CarouselPagination, CarouselPrev } from 'ashen-ui/carousel';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Carousel, CarouselItem, CarouselNext, CarouselPagination, CarouselPrev],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".carousel-demo-wrap {\n  width: 100%;\n  max-width: 480px;\n}\n\n.demo-slide {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 160px;\n  border-radius: var(--sn-radius-tile);\n  font-size: var(--sn-text-lg);\n  font-weight: var(--sn-font-weight-semibold);\n  color: var(--sn-text-on-primary);\n}\n\n.demo-slide--1 { background: var(--sn-color-primary); }\n\n.demo-slide--2 { background: var(--sn-color-success); }\n\n.demo-slide--3 { background: var(--sn-color-warning); }\n\n.demo-carousel-toolbar {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--sn-space-2);\n  margin-bottom: var(--sn-space-3);\n}\n\n/* In the vertical demo each slide should fill the fixed-height viewport. */\n.sn-carousel--vertical .demo-slide {\n  height: 100%;\n}"
    }
  ],
  "carousel/codeVertical": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"carousel-demo-wrap\">\n  <sn-carousel [options]=\"{ direction: 'vertical' }\">\n    <sn-carousel-item>\n      <div class=\"demo-slide demo-slide--1\">Slide 1</div>\n    </sn-carousel-item>\n    <sn-carousel-item>\n      <div class=\"demo-slide demo-slide--2\">Slide 2</div>\n    </sn-carousel-item>\n    <sn-carousel-item>\n      <div class=\"demo-slide demo-slide--3\">Slide 3</div>\n    </sn-carousel-item>\n  </sn-carousel>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Carousel, CarouselItem } from 'ashen-ui/carousel';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Carousel, CarouselItem],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".carousel-demo-wrap {\n  width: 100%;\n  max-width: 480px;\n}\n\n.demo-slide {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 160px;\n  border-radius: var(--sn-radius-tile);\n  font-size: var(--sn-text-lg);\n  font-weight: var(--sn-font-weight-semibold);\n  color: var(--sn-text-on-primary);\n}\n\n.demo-slide--1 { background: var(--sn-color-primary); }\n\n.demo-slide--2 { background: var(--sn-color-success); }\n\n.demo-slide--3 { background: var(--sn-color-warning); }\n\n/* In the vertical demo each slide should fill the fixed-height viewport. */\n.sn-carousel--vertical .demo-slide {\n  height: 100%;\n}"
    }
  ],
  "carousel/codeLoop": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"carousel-demo-wrap\">\n  <sn-carousel [options]=\"{ loop: true }\">\n    <sn-carousel-item>\n      <div class=\"demo-slide demo-slide--1\">Slide 1</div>\n    </sn-carousel-item>\n    <sn-carousel-item>\n      <div class=\"demo-slide demo-slide--2\">Slide 2</div>\n    </sn-carousel-item>\n    <sn-carousel-item>\n      <div class=\"demo-slide demo-slide--3\">Slide 3</div>\n    </sn-carousel-item>\n  </sn-carousel>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Carousel, CarouselItem } from 'ashen-ui/carousel';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Carousel, CarouselItem],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".carousel-demo-wrap {\n  width: 100%;\n  max-width: 480px;\n}\n\n.demo-slide {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 160px;\n  border-radius: var(--sn-radius-tile);\n  font-size: var(--sn-text-lg);\n  font-weight: var(--sn-font-weight-semibold);\n  color: var(--sn-text-on-primary);\n}\n\n.demo-slide--1 { background: var(--sn-color-primary); }\n\n.demo-slide--2 { background: var(--sn-color-success); }\n\n.demo-slide--3 { background: var(--sn-color-warning); }\n\n/* In the vertical demo each slide should fill the fixed-height viewport. */\n.sn-carousel--vertical .demo-slide {\n  height: 100%;\n}"
    }
  ],
  "carousel/codeNoSwipe": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"carousel-demo-wrap\">\n  <sn-carousel [options]=\"{ loop: true }\">\n    <sn-carousel-item>\n      <div class=\"demo-card\">\n        <strong>Drag the slide to move it</strong>\n        <p snCarouselNoSwipe>You can select this text or drag inside it freely without switching slides.</p>\n      </div>\n    </sn-carousel-item>\n    <sn-carousel-item>\n      <div class=\"demo-card\">\n        <strong>Second slide</strong>\n        <p snCarouselNoSwipe>This paragraph is also selectable and swipe-exempt.</p>\n      </div>\n    </sn-carousel-item>\n  </sn-carousel>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Carousel, CarouselItem, CarouselNoSwipe } from 'ashen-ui/carousel';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Carousel, CarouselItem, CarouselNoSwipe],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".carousel-demo-wrap {\n  width: 100%;\n  max-width: 480px;\n}\n\n.demo-card {\n  display: flex;\n  flex-direction: column;\n  gap: var(--sn-space-2);\n  padding: var(--sn-space-5);\n  background: var(--sn-surface-raised);\n  border: 1px solid var(--sn-border);\n  border-radius: var(--sn-radius-tile);\n  min-height: 120px;\n\n  strong {\n    font-size: var(--sn-text-base);\n    font-weight: var(--sn-font-weight-semibold);\n    color: var(--sn-text);\n  }\n\n  p {\n    margin: 0;\n    font-size: var(--sn-text-sm);\n    color: var(--sn-text-muted);\n  }\n}"
    }
  ],
  "cascade-select/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-cascade-select\n    [(value)]=\"basicValue\"\n    [options]=\"countryOptions\"\n    placeholder=\"Select a city…\"\n    class=\"demo-select\"\n  ></sn-cascade-select>\n  <p class=\"hint-text\">Value: \"{{ basicValue() }}\"</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { CascadeOption, CascadeSelect } from 'ashen-ui/cascade-select';\n\n@Component({\n  selector: 'app-demo',\n  imports: [CascadeSelect],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly countryOptions: CascadeOption[] = [\n    {\n      label: 'Europe',\n      icon: 'public',\n      children: [\n        {\n          label: 'France',\n          icon: 'flag',\n          children: [\n            { label: 'Paris', value: 'fr.paris' },\n            { label: 'Lyon', value: 'fr.lyon' },\n            { label: 'Marseille', value: 'fr.marseille' },\n          ],\n        },\n        {\n          label: 'Germany',\n          icon: 'flag',\n          children: [\n            { label: 'Berlin', value: 'de.berlin' },\n            { label: 'Munich', value: 'de.munich' },\n          ],\n        },\n        {\n          label: 'United Kingdom',\n          icon: 'flag',\n          children: [\n            { label: 'London', value: 'uk.london' },\n            { label: 'Manchester', value: 'uk.manchester' },\n          ],\n        },\n      ],\n    },\n    {\n      label: 'Asia',\n      icon: 'public',\n      children: [\n        {\n          label: 'Japan',\n          icon: 'flag',\n          children: [\n            { label: 'Tokyo', value: 'jp.tokyo' },\n            { label: 'Osaka', value: 'jp.osaka' },\n          ],\n        },\n        {\n          label: 'South Korea',\n          icon: 'flag',\n          children: [\n            { label: 'Seoul', value: 'kr.seoul' },\n          ],\n        },\n      ],\n    },\n  ];\n\n  readonly basicValue = signal<unknown>(null);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-select {\n  width: 18rem;\n}"
    }
  ],
  "cascade-select/codeReactive": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-cascade-select\n    [formControl]=\"formCtrl\"\n    [options]=\"mediaOptions\"\n    placeholder=\"Select an action…\"\n    class=\"demo-select\"\n  ></sn-cascade-select>\n  <p class=\"hint-text\">FormControl value: \"{{ formCtrl.value }}\"</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule } from '@angular/forms';\nimport { CascadeOption, CascadeSelect } from 'ashen-ui/cascade-select';\n\n@Component({\n  selector: 'app-demo',\n  imports: [CascadeSelect, ReactiveFormsModule],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly mediaOptions: CascadeOption[] = [\n    {\n      label: 'Media',\n      icon: 'music_note',\n      children: [\n        { label: 'Play / Pause', value: 'media.toggle' },\n        { label: 'Next Track', value: 'media.next' },\n        { label: 'Previous Track', value: 'media.prev' },\n      ],\n    },\n    {\n      label: 'System',\n      icon: 'memory',\n      children: [\n        { label: 'Lock Screen', value: 'sys.lock' },\n        {\n          label: 'Power',\n          icon: 'power_settings_new',\n          children: [\n            { label: 'Shutdown', value: 'sys.shutdown' },\n            { label: 'Restart', value: 'sys.restart' },\n            { label: 'Sleep', value: 'sys.sleep' },\n          ],\n        },\n      ],\n    },\n    { label: 'Mute', icon: 'volume_off', value: 'mute' },\n  ];\n\n  readonly formCtrl = new FormControl<unknown>(null);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-select {\n  width: 18rem;\n}"
    }
  ],
  "cascade-select/codeFormField": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-form-field class=\"demo-select\">\n    <sn-label>Target city</sn-label>\n    <sn-cascade-select\n      [(value)]=\"formFieldValue\"\n      [options]=\"countryOptions\"\n      placeholder=\"Select a city…\"\n    ></sn-cascade-select>\n    <sn-hint>Navigate continent → country → city</sn-hint>\n  </sn-form-field>\n  <p class=\"hint-text\">Value: \"{{ formFieldValue() }}\"</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { CascadeOption, CascadeSelect } from 'ashen-ui/cascade-select';\nimport { FormField, FormFieldHint, FormFieldLabel } from 'ashen-ui/form-field';\n\n@Component({\n  selector: 'app-demo',\n  imports: [CascadeSelect, FormField, FormFieldHint, FormFieldLabel],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly countryOptions: CascadeOption[] = [\n    {\n      label: 'Europe',\n      icon: 'public',\n      children: [\n        {\n          label: 'France',\n          icon: 'flag',\n          children: [\n            { label: 'Paris', value: 'fr.paris' },\n            { label: 'Lyon', value: 'fr.lyon' },\n            { label: 'Marseille', value: 'fr.marseille' },\n          ],\n        },\n        {\n          label: 'Germany',\n          icon: 'flag',\n          children: [\n            { label: 'Berlin', value: 'de.berlin' },\n            { label: 'Munich', value: 'de.munich' },\n          ],\n        },\n        {\n          label: 'United Kingdom',\n          icon: 'flag',\n          children: [\n            { label: 'London', value: 'uk.london' },\n            { label: 'Manchester', value: 'uk.manchester' },\n          ],\n        },\n      ],\n    },\n    {\n      label: 'Asia',\n      icon: 'public',\n      children: [\n        {\n          label: 'Japan',\n          icon: 'flag',\n          children: [\n            { label: 'Tokyo', value: 'jp.tokyo' },\n            { label: 'Osaka', value: 'jp.osaka' },\n          ],\n        },\n        {\n          label: 'South Korea',\n          icon: 'flag',\n          children: [\n            { label: 'Seoul', value: 'kr.seoul' },\n          ],\n        },\n      ],\n    },\n  ];\n\n  readonly formFieldValue = signal<unknown>(null);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-select {\n  width: 18rem;\n}"
    }
  ],
  "cascade-select/codeDisabled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-cascade-select\n    [disabled]=\"true\"\n    [(value)]=\"disabledValue\"\n    [options]=\"countryOptions\"\n    class=\"demo-select\"\n  ></sn-cascade-select>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { CascadeOption, CascadeSelect } from 'ashen-ui/cascade-select';\n\n@Component({\n  selector: 'app-demo',\n  imports: [CascadeSelect],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly countryOptions: CascadeOption[] = [\n    {\n      label: 'Europe',\n      icon: 'public',\n      children: [\n        {\n          label: 'France',\n          icon: 'flag',\n          children: [\n            { label: 'Paris', value: 'fr.paris' },\n            { label: 'Lyon', value: 'fr.lyon' },\n            { label: 'Marseille', value: 'fr.marseille' },\n          ],\n        },\n        {\n          label: 'Germany',\n          icon: 'flag',\n          children: [\n            { label: 'Berlin', value: 'de.berlin' },\n            { label: 'Munich', value: 'de.munich' },\n          ],\n        },\n        {\n          label: 'United Kingdom',\n          icon: 'flag',\n          children: [\n            { label: 'London', value: 'uk.london' },\n            { label: 'Manchester', value: 'uk.manchester' },\n          ],\n        },\n      ],\n    },\n    {\n      label: 'Asia',\n      icon: 'public',\n      children: [\n        {\n          label: 'Japan',\n          icon: 'flag',\n          children: [\n            { label: 'Tokyo', value: 'jp.tokyo' },\n            { label: 'Osaka', value: 'jp.osaka' },\n          ],\n        },\n        {\n          label: 'South Korea',\n          icon: 'flag',\n          children: [\n            { label: 'Seoul', value: 'kr.seoul' },\n          ],\n        },\n      ],\n    },\n  ];\n\n  readonly disabledValue = signal<unknown>('fr.paris');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-select {\n  width: 18rem;\n}"
    }
  ],
  "cascade-select/codePreselected": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-cascade-select\n    [(value)]=\"preselectedValue\"\n    [options]=\"mediaOptions\"\n    class=\"demo-select\"\n  ></sn-cascade-select>\n  <p class=\"hint-text\">Value: \"{{ preselectedValue() }}\"</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { CascadeOption, CascadeSelect } from 'ashen-ui/cascade-select';\n\n@Component({\n  selector: 'app-demo',\n  imports: [CascadeSelect],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly mediaOptions: CascadeOption[] = [\n    {\n      label: 'Media',\n      icon: 'music_note',\n      children: [\n        { label: 'Play / Pause', value: 'media.toggle' },\n        { label: 'Next Track', value: 'media.next' },\n        { label: 'Previous Track', value: 'media.prev' },\n      ],\n    },\n    {\n      label: 'System',\n      icon: 'memory',\n      children: [\n        { label: 'Lock Screen', value: 'sys.lock' },\n        {\n          label: 'Power',\n          icon: 'power_settings_new',\n          children: [\n            { label: 'Shutdown', value: 'sys.shutdown' },\n            { label: 'Restart', value: 'sys.restart' },\n            { label: 'Sleep', value: 'sys.sleep' },\n          ],\n        },\n      ],\n    },\n    { label: 'Mute', icon: 'volume_off', value: 'mute' },\n  ];\n\n  readonly preselectedValue = signal<unknown>('sys.shutdown');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-select {\n  width: 18rem;\n}"
    }
  ],
  "checkbox/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-checkbox>Enable zoom effect</sn-checkbox>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Checkbox } from 'ashen-ui/checkbox';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Checkbox],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "checkbox/codeChecked": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-checkbox [checked]=\"true\">Show label</sn-checkbox>\n  <sn-checkbox>Unchecked</sn-checkbox>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Checkbox } from 'ashen-ui/checkbox';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Checkbox],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "checkbox/codeIndeterminate": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-checkbox [indeterminate]=\"true\">Some selected</sn-checkbox>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Checkbox } from 'ashen-ui/checkbox';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Checkbox],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "checkbox/codeDisabled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-checkbox [disabled]=\"true\">Disabled unchecked</sn-checkbox>\n  <sn-checkbox [checked]=\"true\" [disabled]=\"true\">Disabled checked</sn-checkbox>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Checkbox } from 'ashen-ui/checkbox';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Checkbox],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "checkbox/codeSizes": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-checkbox size=\"sm\">Small</sn-checkbox>\n  <sn-checkbox>Medium (default)</sn-checkbox>\n  <sn-checkbox size=\"lg\">Large</sn-checkbox>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Checkbox } from 'ashen-ui/checkbox';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Checkbox],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "checkbox/codeReactive": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-checkbox [formControl]=\"formCtrl\">Receive notifications</sn-checkbox>\n  <p class=\"hint-text\">Value: {{ formCtrl.value }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule } from '@angular/forms';\nimport { Checkbox } from 'ashen-ui/checkbox';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Checkbox, ReactiveFormsModule],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly formCtrl = new FormControl(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "checkbox/codeNgModel": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-checkbox [(ngModel)]=\"ngModelVal\">Enable dark mode</sn-checkbox>\n  <p class=\"hint-text\">Value: {{ ngModelVal() }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\nimport { Checkbox } from 'ashen-ui/checkbox';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Checkbox, FormsModule],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly ngModelVal = signal(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "checkbox/codeReskin": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-checkbox\n    [checked]=\"true\"\n    style=\"--sn-checkbox-checked-bg: var(--sn-color-success); --sn-checkbox-checked-border: var(--sn-color-success);\"\n  >Custom color</sn-checkbox>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Checkbox } from 'ashen-ui/checkbox';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Checkbox],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "chip/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-chip label=\"Streaming\" />\n<sn-chip label=\"macros\" />\n<sn-chip label=\"deploy\" />"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Chip } from 'ashen-ui/chip';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Chip],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "chip/codeIcon": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-chip label=\"Streaming\" icon=\"videocam\" />\n<sn-chip label=\"Audio\" icon=\"headphones\" />\n<sn-chip label=\"Settings\" icon=\"settings\" />"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Chip } from 'ashen-ui/chip';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Chip],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "chip/codeSelected": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-chip label=\"Active\" [selected]=\"true\" />\n<sn-chip label=\"Inactive\" [selected]=\"false\" />\n<sn-chip label=\"Streaming\" icon=\"videocam\" [selected]=\"true\" />"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Chip } from 'ashen-ui/chip';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Chip],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "chip/codeToggle": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "@for (chip of toggleChips(); track chip.label) {\n  <sn-chip\n    [label]=\"chip.label\"\n    [icon]=\"chip.icon\"\n    [selected]=\"chip.selected\"\n    (click)=\"toggleChip(chip)\"\n  />\n}"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Chip } from 'ashen-ui/chip';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Chip],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly toggleChips = signal([\n    { label: 'Streaming', icon: 'videocam', selected: true },\n    { label: 'Audio', icon: 'headphones', selected: false },\n    { label: 'macros', icon: '', selected: false },\n    { label: 'deploy', icon: '', selected: true },\n  ]);\n\n  toggleChip(target: { label: string; icon: string; selected: boolean }): void {\n    this.toggleChips.update((chips) =>\n      chips.map((c) => (c.label === target.label ? { ...c, selected: !c.selected } : c)),\n    );\n  }\n}"
    }
  ],
  "chip/codeRemovable": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "@for (chip of removableChips(); track chip) {\n  <sn-chip\n    [label]=\"chip\"\n    removable\n    (removed)=\"removeChip(chip)\"\n  />\n}\n@if (!removableChips().length) {\n  <span class=\"no-chips\">All chips removed.</span>\n}"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Chip } from 'ashen-ui/chip';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Chip],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly removableChips = signal(['Streaming', 'macros', 'deploy', 'typescript']);\n\n  removeChip(label: string): void {\n    this.removableChips.update((chips) => chips.filter((c) => c !== label));\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".no-chips { font-size: var(--sn-text-xs); color: var(--sn-text-disabled); font-style: italic; }"
    }
  ],
  "chip/codeProjection": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-chip>angular</sn-chip>\n<sn-chip>typescript</sn-chip>\n<sn-chip removable>rxjs</sn-chip>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Chip } from 'ashen-ui/chip';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Chip],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "chip/codeCustom": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-chip label=\"Purple\" style=\"--sn-chip-selected-bg: #ede9fe; --sn-chip-selected-border: #6941c6; --sn-chip-selected-text: #6941c6;\" [selected]=\"true\" />\n<sn-chip label=\"Teal\" style=\"--sn-chip-selected-bg: #e0f2fe; --sn-chip-selected-border: #0e7490; --sn-chip-selected-text: #0e7490;\" [selected]=\"true\" />"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Chip } from 'ashen-ui/chip';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Chip],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "color-picker/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-color-picker [(value)]=\"basicValue\"></sn-color-picker>\n  <p class=\"hint-text\">Value: {{ basicValue() }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { ColorPicker } from 'ashen-ui/color-picker';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ColorPicker],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly basicValue = signal('#3399e6');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: flex-start;\n  gap: 1.5rem;\n  flex-wrap: wrap;\n}\n\n.hint-text {\n  font-size: 0.875rem;\n  color: var(--sn-text-subtle);\n  font-family: var(--sn-font-mono);\n}"
    }
  ],
  "color-picker/codeAlpha": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-color-picker\n    [(value)]=\"alphaValue\"\n    [showAlpha]=\"true\"\n    [showEyeDropper]=\"true\"\n  ></sn-color-picker>\n  <p class=\"hint-text\">Value: {{ alphaValue() }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { ColorPicker } from 'ashen-ui/color-picker';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ColorPicker],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly alphaValue = signal('#3399e680');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: flex-start;\n  gap: 1.5rem;\n  flex-wrap: wrap;\n}\n\n.hint-text {\n  font-size: 0.875rem;\n  color: var(--sn-text-subtle);\n  font-family: var(--sn-font-mono);\n}"
    }
  ],
  "color-picker/codePopover": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-color-picker [(value)]=\"popoverValue\" [popover]=\"true\"></sn-color-picker>\n  <p class=\"hint-text\">Value: {{ popoverValue() }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { ColorPicker } from 'ashen-ui/color-picker';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ColorPicker],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly popoverValue = signal('#ff6600');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: flex-start;\n  gap: 1.5rem;\n  flex-wrap: wrap;\n}\n\n.hint-text {\n  font-size: 0.875rem;\n  color: var(--sn-text-subtle);\n  font-family: var(--sn-font-mono);\n}"
    }
  ],
  "color-picker/codeCustom": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-color-picker [(value)]=\"customValue\">\n    <div style=\"display:flex;gap:10px\">\n      <sn-color-area height=\"10rem\" />\n      <sn-color-slider channel=\"hue\" orientation=\"vertical\" />\n      <sn-color-slider channel=\"alpha\" orientation=\"vertical\" />\n    </div>\n    <div style=\"display:flex;gap:8px;align-items:flex-start\">\n      <sn-color-eye-dropper />\n      <sn-color-input format=\"rgb\" />\n    </div>\n  </sn-color-picker>\n  <p class=\"hint-text\">Value: {{ customValue() }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { ColorArea, ColorEyeDropper, ColorInput, ColorPicker, ColorSlider } from 'ashen-ui/color-picker';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ColorArea, ColorEyeDropper, ColorInput, ColorPicker, ColorSlider],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly customValue = signal('#22c55e');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: flex-start;\n  gap: 1.5rem;\n  flex-wrap: wrap;\n}\n\n.hint-text {\n  font-size: 0.875rem;\n  color: var(--sn-text-subtle);\n  font-family: var(--sn-font-mono);\n}"
    }
  ],
  "color-picker/codeReactive": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-color-picker [formControl]=\"formCtrl\"></sn-color-picker>\n  <p class=\"hint-text\">FormControl value: {{ formCtrl.value }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule } from '@angular/forms';\nimport { ColorPicker } from 'ashen-ui/color-picker';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ColorPicker, ReactiveFormsModule],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly formCtrl = new FormControl<string>('#7c3aed');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: flex-start;\n  gap: 1.5rem;\n  flex-wrap: wrap;\n}\n\n.hint-text {\n  font-size: 0.875rem;\n  color: var(--sn-text-subtle);\n  font-family: var(--sn-font-mono);\n}"
    }
  ],
  "color-picker/codeDisabled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-color-picker [disabled]=\"true\" [(value)]=\"disabledValue\"></sn-color-picker>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { ColorPicker } from 'ashen-ui/color-picker';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ColorPicker],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly disabledValue = signal('#888888');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: flex-start;\n  gap: 1.5rem;\n  flex-wrap: wrap;\n}"
    }
  ],
  "confirm-dialog/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snButton color=\"error\" variant=\"outlined\" (click)=\"deleteOpen.set(true)\">Delete item</button>\n  @if (lastAction()) {\n    <span class=\"demo-status\">{{ lastAction() }}</span>\n  }\n  <sn-confirm-dialog\n    [(open)]=\"deleteOpen\"\n    header=\"Delete item\"\n    severity=\"error\"\n    icon=\"delete\"\n    message='This removes \"Play Music\" from Grid 1. This action cannot be undone.'\n    acceptLabel=\"Delete\"\n    (accept)=\"onAccept('Delete')\"\n    (reject)=\"onReject('Delete')\"\n  />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { ConfirmDialog } from 'ashen-ui/confirm-dialog';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, ConfirmDialog],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly deleteOpen = signal(false);\n\n  readonly lastAction = signal('');\n\n  onAccept(action: string): void {\n    this.lastAction.set(`${action} confirmed`);\n  }\n\n  onReject(action: string): void {\n    this.lastAction.set(`${action} cancelled`);\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}\n\n.demo-status {\n  font-size: var(--sn-text-sm);\n  color: var(--sn-text-muted);\n  font-style: italic;\n}"
    }
  ],
  "confirm-dialog/codePrimary": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snButton variant=\"outlined\" (click)=\"primaryOpen.set(true)\">Save changes</button>\n  <sn-confirm-dialog\n    [(open)]=\"primaryOpen\"\n    header=\"Save changes\"\n    message=\"Your unsaved changes will be applied to all connected devices.\"\n    (accept)=\"onAccept('Save')\"\n    (reject)=\"onReject('Save')\"\n  />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { ConfirmDialog } from 'ashen-ui/confirm-dialog';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, ConfirmDialog],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly primaryOpen = signal(false);\n\n  readonly lastAction = signal('');\n\n  onAccept(action: string): void {\n    this.lastAction.set(`${action} confirmed`);\n  }\n\n  onReject(action: string): void {\n    this.lastAction.set(`${action} cancelled`);\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "confirm-dialog/codeWarning": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snButton color=\"warning\" variant=\"outlined\" (click)=\"warningOpen.set(true)\">Reset layout</button>\n  <sn-confirm-dialog\n    [(open)]=\"warningOpen\"\n    header=\"Reset layout\"\n    severity=\"warning\"\n    icon=\"warning\"\n    message=\"This will revert your grid layout to the default. Custom tile positions will be lost.\"\n    (accept)=\"onAccept('Reset')\"\n    (reject)=\"onReject('Reset')\"\n  />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { ConfirmDialog } from 'ashen-ui/confirm-dialog';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, ConfirmDialog],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly warningOpen = signal(false);\n\n  readonly lastAction = signal('');\n\n  onAccept(action: string): void {\n    this.lastAction.set(`${action} confirmed`);\n  }\n\n  onReject(action: string): void {\n    this.lastAction.set(`${action} cancelled`);\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "confirm-dialog/codeCustomLabels": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snButton variant=\"outlined\" (click)=\"customLabelsOpen.set(true)\">Publish tile</button>\n  <sn-confirm-dialog\n    [(open)]=\"customLabelsOpen\"\n    header=\"Publish tile\"\n    severity=\"success\"\n    icon=\"publish\"\n    message=\"Publishing makes this tile visible to all workspace members.\"\n    acceptLabel=\"Publish now\"\n    rejectLabel=\"Not yet\"\n    (accept)=\"onAccept('Publish')\"\n    (reject)=\"onReject('Publish')\"\n  />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { ConfirmDialog } from 'ashen-ui/confirm-dialog';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, ConfirmDialog],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly customLabelsOpen = signal(false);\n\n  readonly lastAction = signal('');\n\n  onAccept(action: string): void {\n    this.lastAction.set(`${action} confirmed`);\n  }\n\n  onReject(action: string): void {\n    this.lastAction.set(`${action} cancelled`);\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "confirm-popup/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-confirm-popup\n    message=\"Delete this tile?\"\n    icon=\"delete\"\n    severity=\"error\"\n    acceptLabel=\"Delete\"\n    (accept)=\"onAccept('Delete')\"\n    (reject)=\"onReject('Delete')\"\n  >\n    <button snButton variant=\"outlined\" color=\"error\" snConfirmPopupTrigger>Delete tile</button>\n  </sn-confirm-popup>\n  @if (lastAction()) {\n    <span class=\"demo-status\">{{ lastAction() }}</span>\n  }\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { ConfirmPopup, ConfirmPopupTrigger } from 'ashen-ui/confirm-popup';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, ConfirmPopup, ConfirmPopupTrigger],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly lastAction = signal('');\n\n  onAccept(action: string): void {\n    this.lastAction.set(`${action} confirmed`);\n  }\n\n  onReject(action: string): void {\n    this.lastAction.set(`${action} cancelled`);\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}\n\n.demo-status {\n  font-size: var(--sn-text-sm);\n  color: var(--sn-text-muted);\n  font-style: italic;\n}"
    }
  ],
  "confirm-popup/codePrimary": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-confirm-popup\n    message=\"Save changes to all connected devices?\"\n    (accept)=\"onAccept('Save')\"\n    (reject)=\"onReject('Save')\"\n  >\n    <button snButton variant=\"outlined\" snConfirmPopupTrigger>Save changes</button>\n  </sn-confirm-popup>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { ConfirmPopup, ConfirmPopupTrigger } from 'ashen-ui/confirm-popup';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, ConfirmPopup, ConfirmPopupTrigger],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly lastAction = signal('');\n\n  onAccept(action: string): void {\n    this.lastAction.set(`${action} confirmed`);\n  }\n\n  onReject(action: string): void {\n    this.lastAction.set(`${action} cancelled`);\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "confirm-popup/codeWarning": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-confirm-popup\n    message=\"This will revert your grid layout to the default. Custom tile positions will be lost.\"\n    severity=\"warning\"\n    icon=\"warning\"\n    acceptLabel=\"Reset\"\n    (accept)=\"onAccept('Reset')\"\n    (reject)=\"onReject('Reset')\"\n  >\n    <button snButton color=\"warning\" variant=\"outlined\" snConfirmPopupTrigger>Reset layout</button>\n  </sn-confirm-popup>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { ConfirmPopup, ConfirmPopupTrigger } from 'ashen-ui/confirm-popup';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, ConfirmPopup, ConfirmPopupTrigger],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly lastAction = signal('');\n\n  onAccept(action: string): void {\n    this.lastAction.set(`${action} confirmed`);\n  }\n\n  onReject(action: string): void {\n    this.lastAction.set(`${action} cancelled`);\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "confirm-popup/codeCustomLabels": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-confirm-popup\n    message=\"Publishing makes this tile visible to all workspace members.\"\n    severity=\"success\"\n    icon=\"publish\"\n    acceptLabel=\"Publish now\"\n    rejectLabel=\"Not yet\"\n    (accept)=\"onAccept('Publish')\"\n    (reject)=\"onReject('Publish')\"\n  >\n    <button snButton variant=\"outlined\" snConfirmPopupTrigger>Publish tile</button>\n  </sn-confirm-popup>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { ConfirmPopup, ConfirmPopupTrigger } from 'ashen-ui/confirm-popup';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, ConfirmPopup, ConfirmPopupTrigger],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly lastAction = signal('');\n\n  onAccept(action: string): void {\n    this.lastAction.set(`${action} confirmed`);\n  }\n\n  onReject(action: string): void {\n    this.lastAction.set(`${action} cancelled`);\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "context-menu/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div [snContextMenuTriggerFor]=\"basicMenu\" class=\"demo-zone\">\n  Right-click anywhere in this area\n</div>\n<sn-menu #basicMenu>\n  <button snMenuItem>Rename</button>\n  <button snMenuItem>Duplicate</button>\n  <sn-menu-separator />\n  <button snMenuItem disabled>Delete</button>\n</sn-menu>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { ContextMenuTrigger, Menu, MenuItem, MenuSeparator } from 'ashen-ui/menu';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ContextMenuTrigger, Menu, MenuItem, MenuSeparator],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-zone {\n  padding: 3rem;\n  border: 1px dashed var(--sn-border-strong);\n  border-radius: var(--sn-radius-tile);\n  color: var(--sn-text-muted);\n  text-align: center;\n  user-select: none;\n}"
    }
  ],
  "context-menu/codeWithActions": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div style=\"display: flex; flex-direction: column; gap: 12px; align-items: flex-start;\">\n  <div [snContextMenuTriggerFor]=\"actionsMenu\" class=\"demo-zone\">\n    Right-click to perform an action\n  </div>\n  @if (lastAction()) {\n    <span style=\"font-size: var(--sn-text-sm); color: var(--sn-text-subtle);\">Last: {{ lastAction() }}</span>\n  }\n  <sn-menu #actionsMenu>\n    <button snMenuItem (click)=\"lastAction.set('Rename')\">Rename</button>\n    <button snMenuItem (click)=\"lastAction.set('Duplicate')\">Duplicate</button>\n    <button snMenuItem (click)=\"lastAction.set('Move')\">Move</button>\n    <button snMenuItem (click)=\"lastAction.set('Download')\">Download</button>\n  </sn-menu>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { ContextMenuTrigger, Menu, MenuItem } from 'ashen-ui/menu';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ContextMenuTrigger, Menu, MenuItem],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly lastAction = signal('');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-zone {\n  padding: 3rem;\n  border: 1px dashed var(--sn-border-strong);\n  border-radius: var(--sn-radius-tile);\n  color: var(--sn-text-muted);\n  text-align: center;\n  user-select: none;\n}"
    }
  ],
  "date-picker/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-date-picker\n    [(value)]=\"basicValue\"\n    class=\"demo-date-picker\"\n  ></sn-date-picker>\n  <p class=\"hint-text\">\n    Value: {{ basicValue() ? basicValue()!.toLocaleDateString() : 'null' }}\n  </p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { DatePicker } from 'ashen-ui/date-picker';\n\n@Component({\n  selector: 'app-demo',\n  imports: [DatePicker],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly basicValue = signal<Date | null>(null);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-date-picker {\n  width: 18rem;\n}"
    }
  ],
  "date-picker/codeReactive": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-date-picker\n    [formControl]=\"formCtrl\"\n    class=\"demo-date-picker\"\n  ></sn-date-picker>\n  <p class=\"hint-text\">\n    FormControl value: {{ formCtrl.value ? formCtrl.value.toLocaleDateString() : 'null' }}\n  </p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule } from '@angular/forms';\nimport { DatePicker } from 'ashen-ui/date-picker';\n\n@Component({\n  selector: 'app-demo',\n  imports: [DatePicker, ReactiveFormsModule],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly formCtrl = new FormControl<Date | null>(null);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-date-picker {\n  width: 18rem;\n}"
    }
  ],
  "date-picker/codeCustomFormat": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-date-picker\n    [(value)]=\"customFormatValue\"\n    [formatDate]=\"isoFormat\"\n    class=\"demo-date-picker\"\n  ></sn-date-picker>\n  <p class=\"hint-text\">\n    Value: {{ customFormatValue() ? isoFormat(customFormatValue()!) : 'null' }}\n  </p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { DatePicker } from 'ashen-ui/date-picker';\n\n@Component({\n  selector: 'app-demo',\n  imports: [DatePicker],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly customFormatValue = signal<Date | null>(null);\n\n  readonly isoFormat = (d: Date): string =>\n  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-date-picker {\n  width: 18rem;\n}"
    }
  ],
  "date-picker/codeRange": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-date-picker\n    [(value)]=\"rangeValue\"\n    [minDate]=\"rangeMin\"\n    [maxDate]=\"rangeMax\"\n    class=\"demo-date-picker\"\n  ></sn-date-picker>\n  <p class=\"hint-text\">\n    Selectable {{ rangeMin.toLocaleDateString() }} to {{ rangeMax.toLocaleDateString() }}.\n    Value: {{ rangeValue() ? rangeValue()!.toLocaleDateString() : 'null' }}\n  </p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { DatePicker } from 'ashen-ui/date-picker';\n\n@Component({\n  selector: 'app-demo',\n  imports: [DatePicker],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  /** A week either side of today, so the demo boundary is always visible. */\n  readonly rangeMin = this.addDays(new Date(), -7);\n\n  readonly rangeMax = this.addDays(new Date(), 7);\n\n  readonly rangeValue = signal<Date | null>(null);\n\n  private addDays(from: Date, days: number): Date {\n    const d = new Date(from);\n    d.setDate(d.getDate() + days);\n    return d;\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-date-picker {\n  width: 18rem;\n}"
    }
  ],
  "date-picker/codeFormField": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-form-field class=\"demo-date-picker\">\n    <sn-label>Appointment</sn-label>\n    <sn-date-picker [(value)]=\"formFieldValue\"></sn-date-picker>\n    <sn-hint>Pick a date from the calendar</sn-hint>\n  </sn-form-field>\n  <p class=\"hint-text\">\n    Value: {{ formFieldValue() ? formFieldValue()!.toLocaleDateString() : 'null' }}\n  </p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { DatePicker } from 'ashen-ui/date-picker';\nimport { FormField, FormFieldHint, FormFieldLabel } from 'ashen-ui/form-field';\n\n@Component({\n  selector: 'app-demo',\n  imports: [DatePicker, FormField, FormFieldHint, FormFieldLabel],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly formFieldValue = signal<Date | null>(null);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-date-picker {\n  width: 18rem;\n}"
    }
  ],
  "date-picker/codeDisabled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-date-picker\n    [disabled]=\"true\"\n    [(value)]=\"disabledValue\"\n    class=\"demo-date-picker\"\n  ></sn-date-picker>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { DatePicker } from 'ashen-ui/date-picker';\n\n@Component({\n  selector: 'app-demo',\n  imports: [DatePicker],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly disabledValue = signal<Date | null>(new Date(2026, 0, 15));\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-date-picker {\n  width: 18rem;\n}"
    }
  ],
  "date-picker/codeI18n": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-date-picker placeholder=\"Choisir une date\" />"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { DatePicker } from 'ashen-ui/date-picker';\n\n@Component({\n  selector: 'app-demo',\n  imports: [DatePicker],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "dialog/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snButton variant=\"outlined\" (click)=\"basicOpen.set(true)\">Open Dialog</button>\n  <sn-dialog [(open)]=\"basicOpen\" title=\"Edit Profile\">\n    <p style=\"margin:0;color:var(--sn-text-muted)\">Update your profile details below.</p>\n  </sn-dialog>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Dialog } from 'ashen-ui/dialog';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Dialog],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly basicOpen = signal(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "dialog/codeFooter": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snButton variant=\"outlined\" (click)=\"footerOpen.set(true)\">Open Dialog</button>\n  <sn-dialog [(open)]=\"footerOpen\" title=\"Edit Tile\">\n    <p style=\"margin:0;color:var(--sn-text-muted)\">Make changes to your tile. Click save when done.</p>\n    <div snDialogFooter>\n      <button snButton variant=\"text\" (click)=\"footerOpen.set(false)\">Cancel</button>\n      <button snButton (click)=\"footerOpen.set(false)\">Save</button>\n    </div>\n  </sn-dialog>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Dialog, DialogFooter } from 'ashen-ui/dialog';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Dialog, DialogFooter],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly footerOpen = signal(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "dialog/codeDirectiveClose": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snButton variant=\"outlined\" (click)=\"directiveCloseOpen.set(true)\">Open Dialog</button>\n  <sn-dialog [(open)]=\"directiveCloseOpen\" title=\"Save changes\">\n    <p style=\"margin:0;color:var(--sn-text-muted)\">Apply these changes to your configuration?</p>\n    <div snDialogFooter>\n      <button snButton variant=\"text\" snDialogClose>Cancel</button>\n      <button snButton snDialogClose>Save</button>\n    </div>\n  </sn-dialog>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Dialog, DialogClose, DialogFooter } from 'ashen-ui/dialog';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Dialog, DialogClose, DialogFooter],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly directiveCloseOpen = signal(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "dialog/codeDelete": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snButton color=\"error\" (click)=\"deleteOpen.set(true)\">Delete item</button>\n  <sn-dialog [(open)]=\"deleteOpen\" title=\"Delete item\">\n    <p style=\"margin:0;color:var(--sn-text-muted)\">\n      This removes the tile from the grid. This action cannot be undone.\n    </p>\n    <div snDialogFooter>\n      <button snButton variant=\"text\" (click)=\"deleteOpen.set(false)\">Cancel</button>\n      <button snButton color=\"error\" (click)=\"deleteOpen.set(false)\">Delete</button>\n    </div>\n  </sn-dialog>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Dialog, DialogFooter } from 'ashen-ui/dialog';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Dialog, DialogFooter],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly deleteOpen = signal(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "dialog/codeSizes": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row demo-row--spaced\">\n  <button snButton variant=\"outlined\" (click)=\"smOpen.set(true)\">Small</button>\n  <button snButton variant=\"outlined\" (click)=\"basicOpen.set(true)\">Medium (default)</button>\n  <button snButton variant=\"outlined\" (click)=\"lgOpen.set(true)\">Large</button>\n\n  <sn-dialog [(open)]=\"smOpen\" title=\"Confirm action\" size=\"sm\">\n    <p style=\"margin:0;color:var(--sn-text-muted)\">Small dialog - compact for brief messages.</p>\n    <div snDialogFooter>\n      <button snButton variant=\"text\" (click)=\"smOpen.set(false)\">Cancel</button>\n      <button snButton (click)=\"smOpen.set(false)\">Confirm</button>\n    </div>\n  </sn-dialog>\n\n  <sn-dialog [(open)]=\"basicOpen\" title=\"Edit Profile\">\n    <p style=\"margin:0;color:var(--sn-text-muted)\">Medium dialog - the default size.</p>\n  </sn-dialog>\n\n  <sn-dialog [(open)]=\"lgOpen\" title=\"Advanced Settings\" size=\"lg\">\n    <p style=\"margin:0;color:var(--sn-text-muted)\">Large dialog - use for complex forms or content-rich panels.</p>\n  </sn-dialog>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Dialog, DialogFooter } from 'ashen-ui/dialog';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Dialog, DialogFooter],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly basicOpen = signal(false);\n\n  readonly smOpen = signal(false);\n\n  readonly lgOpen = signal(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}\n\n.demo-row--spaced {\n  justify-content: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-6);\n}"
    }
  ],
  "dialog/codeRichTitle": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snButton variant=\"outlined\" (click)=\"richTitleOpen.set(true)\">Open with icon title</button>\n  <sn-dialog [(open)]=\"richTitleOpen\">\n    <div snDialogTitle style=\"display:flex;align-items:center;gap:0.5rem\">\n      <sn-icon style=\"font-size:1.25rem\">settings</sn-icon>\n      <span>Settings</span>\n    </div>\n    <p style=\"margin:0;color:var(--sn-text-muted)\">Configure your application preferences.</p>\n    <div snDialogFooter>\n      <button snButton variant=\"text\" (click)=\"richTitleOpen.set(false)\">Cancel</button>\n      <button snButton (click)=\"richTitleOpen.set(false)\">Save</button>\n    </div>\n  </sn-dialog>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Dialog, DialogFooter, DialogTitle } from 'ashen-ui/dialog';\nimport { Icon } from 'ashen-ui/icon';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Dialog, DialogFooter, DialogTitle, Icon],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly richTitleOpen = signal(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "dialog/codeDynamic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row demo-row--spaced\">\n  <button snButton variant=\"outlined\" (click)=\"openDynamic()\">Open imperatively</button>\n  <button snButton variant=\"outlined\" color=\"error\" (click)=\"openConfirm()\">Confirm…</button>\n  @if (lastResult()) {\n    <span style=\"align-self:center;color:var(--sn-text-muted)\">Result: {{ lastResult() }}</span>\n  }\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { DialogService, SN_DIALOG_DATA, SnDialogRef } from 'ashen-ui/dialog';\nimport { DialogDemoContent } from './dialog-demo-content';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  private readonly dialogService = inject(DialogService);\n\n  readonly lastResult = signal<string | null>(null);\n\n  openDynamic(): void {\n    const ref = this.dialogService.open<DialogDemoContent, string>(DialogDemoContent, {\n      header: 'Imperative Dialog',\n      data: { userName: 'Ada' },\n    });\n    ref.afterClosed().subscribe((result) => this.lastResult.set(result ?? '(dismissed)'));\n  }\n\n  openConfirm(): void {\n    this.dialogService\n      .confirm({\n        header: 'Delete item',\n        message: 'This action cannot be undone. Continue?',\n        severity: 'error',\n        acceptLabel: 'Delete',\n      })\n      .subscribe((ok) => this.lastResult.set(ok ? 'confirmed' : 'cancelled'));\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}\n\n.demo-row--spaced {\n  justify-content: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-6);\n}"
    },
    {
      "name": "dialog-demo-content.ts",
      "lang": "ts",
      "code": "/** Content rendered inside the imperative dialog demo. */\n@Component({\n  selector: 'app-dialog-demo-content',\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  host: { class: 'doc-page' },\n  imports: [Button],\n  template: `\n    <p style=\"margin:0 0 1.25rem;color:var(--sn-text-muted)\">\n      Opened imperatively from <code>DialogService</code>. Data: <strong>{{ data?.userName }}</strong>.\n    </p>\n    <div style=\"display:flex;justify-content:flex-end;gap:0.5rem\">\n      <button snButton variant=\"text\" (click)=\"ref.close()\">Cancel</button>\n      <button snButton (click)=\"ref.close('saved')\">Save</button>\n    </div>\n  `,\n})\nexport class DialogDemoContent {\n  readonly ref = inject<SnDialogRef<string>>(SnDialogRef);\n  readonly data = inject(SN_DIALOG_DATA) as { userName?: string } | null;\n}"
    }
  ],
  "divider/codePlain": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div style=\"width:100%\">\n  Basic tile properties\n  <sn-divider />\n  Icon, colors, and opacity\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Divider } from 'ashen-ui/divider';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Divider],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "divider/codeLabeled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div style=\"width:100%\">\n  <sn-divider label=\"Visual Appearance\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Divider } from 'ashen-ui/divider';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Divider],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "divider/codeVertical": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div style=\"display:flex; align-items:center\">\n  <button snButton variant=\"text\" size=\"sm\">Edit</button>\n  <sn-divider vertical />\n  <button snButton variant=\"text\" size=\"sm\">Duplicate</button>\n  <sn-divider vertical />\n  <button snButton variant=\"text\" color=\"error\" size=\"sm\">Delete</button>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Divider } from 'ashen-ui/divider';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Divider],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "divider/codeMultiple": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div style=\"width:100%\">\n  General settings\n  <sn-divider label=\"Display\" />\n  Theme and layout options\n  <sn-divider label=\"Behavior\" />\n  Interaction preferences\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Divider } from 'ashen-ui/divider';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Divider],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "drawer/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snButton variant=\"outlined\" (click)=\"basicOpen.set(true)\">Open Drawer</button>\n  <sn-drawer [(open)]=\"basicOpen\" title=\"Edit Tile\">\n    <p style=\"margin:0;color:var(--sn-text-muted)\">Make changes to your tile below.</p>\n  </sn-drawer>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Drawer } from 'ashen-ui/drawer';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Drawer],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly basicOpen = signal(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "drawer/codeLeft": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snButton variant=\"outlined\" (click)=\"leftOpen.set(true)\">Open Left Drawer</button>\n  <sn-drawer [(open)]=\"leftOpen\" title=\"Navigation\" position=\"left\">\n    <p style=\"margin:0;color:var(--sn-text-muted)\">Left-anchored drawer. Typically used for navigation panels.</p>\n  </sn-drawer>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Drawer } from 'ashen-ui/drawer';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Drawer],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly leftOpen = signal(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "drawer/codeLogical": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snButton variant=\"outlined\" (click)=\"startOpen.set(true)\">Open Start Drawer</button>\n  <sn-drawer [(open)]=\"startOpen\" title=\"Start\" position=\"start\">\n    <p style=\"margin:0;color:var(--sn-text-muted)\">Anchored to the edge the content starts from.</p>\n  </sn-drawer>\n  <button snButton variant=\"outlined\" (click)=\"endOpen.set(true)\">Open End Drawer</button>\n  <sn-drawer [(open)]=\"endOpen\" title=\"End\" position=\"end\">\n    <p style=\"margin:0;color:var(--sn-text-muted)\">Anchored to the edge the content ends at.</p>\n  </sn-drawer>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Drawer } from 'ashen-ui/drawer';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Drawer],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly startOpen = signal(false);\n\n  readonly endOpen = signal(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "drawer/codeFooter": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snButton variant=\"outlined\" (click)=\"footerOpen.set(true)\">Open Drawer</button>\n  <sn-drawer [(open)]=\"footerOpen\" title=\"Edit Tile\">\n    <p style=\"margin:0;color:var(--sn-text-muted)\">Make changes to your tile. Click save when done.</p>\n    <div snDrawerFooter>\n      <button snButton variant=\"text\" (click)=\"footerOpen.set(false)\">Cancel</button>\n      <button snButton (click)=\"footerOpen.set(false)\">Save</button>\n    </div>\n  </sn-drawer>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Drawer, DrawerFooter } from 'ashen-ui/drawer';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Drawer, DrawerFooter],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly footerOpen = signal(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "drawer/codeNoMask": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snButton variant=\"outlined\" (click)=\"noMaskOpen.set(true)\">Open Without Mask</button>\n  <sn-drawer [(open)]=\"noMaskOpen\" title=\"Inspector\" [mask]=\"false\">\n    <p style=\"margin:0;color:var(--sn-text-muted)\">\n      No dimming backdrop. <kbd>Escape</kbd> and the close button still dismiss the drawer.\n    </p>\n  </sn-drawer>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Drawer } from 'ashen-ui/drawer';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Drawer],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly noMaskOpen = signal(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "drawer/codeRichTitle": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snButton variant=\"outlined\" (click)=\"richTitleOpen.set(true)\">Open with icon title</button>\n  <sn-drawer [(open)]=\"richTitleOpen\">\n    <div snDrawerTitle style=\"display:flex;align-items:center;gap:0.5rem\">\n      <sn-icon style=\"font-size:1.125rem\">settings</sn-icon>\n      <span>Settings</span>\n    </div>\n    <p style=\"margin:0;color:var(--sn-text-muted)\">Configure your application preferences.</p>\n    <div snDrawerFooter>\n      <button snButton variant=\"text\" (click)=\"richTitleOpen.set(false)\">Cancel</button>\n      <button snButton (click)=\"richTitleOpen.set(false)\">Save</button>\n    </div>\n  </sn-drawer>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Drawer, DrawerFooter, DrawerTitle } from 'ashen-ui/drawer';\nimport { Icon } from 'ashen-ui/icon';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Drawer, DrawerFooter, DrawerTitle, Icon],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly richTitleOpen = signal(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "drawer/codeTop": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snButton variant=\"outlined\" (click)=\"topOpen.set(true)\">Open Top Drawer</button>\n  <sn-drawer [(open)]=\"topOpen\" title=\"Notifications\" position=\"top\" height=\"50vh\">\n    <p style=\"margin:0;color:var(--sn-text-muted)\">Slides in from the top edge. Use the <code>height</code> input to control the panel size.</p>\n  </sn-drawer>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Drawer } from 'ashen-ui/drawer';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Drawer],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly topOpen = signal(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "drawer/codeBottom": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snButton variant=\"outlined\" (click)=\"bottomOpen.set(true)\">Open Bottom Drawer</button>\n  <sn-drawer [(open)]=\"bottomOpen\" title=\"Share\" position=\"bottom\">\n    <p style=\"margin:0;color:var(--sn-text-muted)\">Slides in from the bottom edge. Defaults to <code>var(--sn-drawer-height)</code> (40 vh).</p>\n  </sn-drawer>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Drawer } from 'ashen-ui/drawer';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Drawer],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly bottomOpen = signal(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "drawer/codeFullscreen": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snButton variant=\"outlined\" (click)=\"fullscreenOpen.set(true)\">Open Fullscreen</button>\n  <sn-drawer [(open)]=\"fullscreenOpen\" title=\"Full Page Editor\" position=\"fullscreen\">\n    <p style=\"margin:0;color:var(--sn-text-muted)\">Covers the entire viewport - useful for immersive editing flows. Fades and scales in.</p>\n  </sn-drawer>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Drawer } from 'ashen-ui/drawer';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Drawer],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly fullscreenOpen = signal(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "drawer/codeNoLockScroll": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snButton variant=\"outlined\" (click)=\"noLockScrollOpen.set(true)\">Open (scroll unlocked)</button>\n  <sn-drawer [(open)]=\"noLockScrollOpen\" title=\"Side Panel\" [lockScroll]=\"false\">\n    <p style=\"margin:0;color:var(--sn-text-muted)\">The page behind the drawer remains scrollable. Useful for side-by-side inspect flows.</p>\n  </sn-drawer>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Drawer } from 'ashen-ui/drawer';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Drawer],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly noLockScrollOpen = signal(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "drawer/codeDirectiveClose": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snButton variant=\"outlined\" (click)=\"directiveCloseOpen.set(true)\">Open Drawer</button>\n  <sn-drawer [(open)]=\"directiveCloseOpen\" title=\"Edit Tile\">\n    <p style=\"margin:0;color:var(--sn-text-muted)\">Make changes to your tile. Click save when done.</p>\n    <div snDrawerFooter>\n      <button snButton variant=\"text\" snDrawerClose>Cancel</button>\n      <button snButton snDrawerClose>Save</button>\n    </div>\n  </sn-drawer>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Drawer, DrawerClose, DrawerFooter } from 'ashen-ui/drawer';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Drawer, DrawerClose, DrawerFooter],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly directiveCloseOpen = signal(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "expansion-panel/codeSingleOpen": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-panels\">\n  <sn-accordion>\n    <sn-expansion-panel header=\"Basic Information\" icon=\"info\">\n      Name, type, position, and size of the tile.\n    </sn-expansion-panel>\n    <sn-expansion-panel header=\"Visual Appearance\" icon=\"palette\">\n      Icon, colors, and opacity.\n    </sn-expansion-panel>\n    <sn-expansion-panel header=\"Interactive Options\" icon=\"touch_app\">\n      Zoom effect and color feedback.\n    </sn-expansion-panel>\n  </sn-accordion>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Accordion, ExpansionPanel } from 'ashen-ui/expansion-panel';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Accordion, ExpansionPanel],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-panels { display: grid; grid-template-columns: 1fr; gap: var(--sn-space-4); max-width: 420px; }"
    }
  ],
  "expansion-panel/codeMultipleOpen": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-panels\">\n  <sn-accordion [multiple]=\"true\">\n    <sn-expansion-panel header=\"Basic Information\" icon=\"info\" [expanded]=\"true\">\n      Name, type, position, and size of the tile.\n    </sn-expansion-panel>\n    <sn-expansion-panel header=\"Visual Appearance\" icon=\"palette\" [expanded]=\"true\">\n      Icon, colors, and opacity.\n    </sn-expansion-panel>\n    <sn-expansion-panel header=\"Interactive Options\" icon=\"touch_app\">\n      Zoom effect and color feedback.\n    </sn-expansion-panel>\n  </sn-accordion>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Accordion, ExpansionPanel } from 'ashen-ui/expansion-panel';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Accordion, ExpansionPanel],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-panels { display: grid; grid-template-columns: 1fr; gap: var(--sn-space-4); max-width: 420px; }"
    }
  ],
  "expansion-panel/codeWithDisabled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-panels\">\n  <sn-accordion>\n    <sn-expansion-panel header=\"Basic Information\" icon=\"info\">\n      Name, type, position, and size of the tile.\n    </sn-expansion-panel>\n    <sn-expansion-panel header=\"Visual Appearance\" icon=\"palette\" [disabled]=\"true\">\n      This section is disabled.\n    </sn-expansion-panel>\n    <sn-expansion-panel header=\"Interactive Options\" icon=\"touch_app\">\n      Zoom effect and color feedback.\n    </sn-expansion-panel>\n  </sn-accordion>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Accordion, ExpansionPanel } from 'ashen-ui/expansion-panel';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Accordion, ExpansionPanel],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-panels { display: grid; grid-template-columns: 1fr; gap: var(--sn-space-4); max-width: 420px; }"
    }
  ],
  "expansion-panel/codeStandalone": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-panels\">\n  <sn-expansion-panel header=\"Grid Settings\" icon=\"settings\">\n    Grids hold button and widget tiles. Drag to move, pull a handle to resize.\n  </sn-expansion-panel>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { ExpansionPanel } from 'ashen-ui/expansion-panel';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ExpansionPanel],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-panels { display: grid; grid-template-columns: 1fr; gap: var(--sn-space-4); max-width: 420px; }"
    }
  ],
  "expansion-panel/codeCustomChevron": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-panels\">\n  <sn-accordion>\n    <sn-expansion-panel header=\"Custom Chevron\">\n      <ng-template snIcon=\"toggle\">\n        <sn-icon icon=\"chevron_right\" />\n      </ng-template>\n      Content with a custom toggle icon.\n    </sn-expansion-panel>\n  </sn-accordion>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { IconTemplate } from 'ashen-ui/core';\nimport { Accordion, ExpansionPanel } from 'ashen-ui/expansion-panel';\nimport { Icon } from 'ashen-ui/icon';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Accordion, ExpansionPanel, Icon, IconTemplate],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-panels { display: grid; grid-template-columns: 1fr; gap: var(--sn-space-4); max-width: 420px; }"
    }
  ],
  "expansion-panel/codeSnClass": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-panels\">\n  <sn-accordion snClass=\"demo-highlighted-accordion\">\n    <sn-expansion-panel\n      header=\"Styled Section\"\n      [snClass]=\"{ button: 'demo-highlighted-button' }\"\n    >\n      Class pass-through example.\n    </sn-expansion-panel>\n  </sn-accordion>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Accordion, ExpansionPanel } from 'ashen-ui/expansion-panel';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Accordion, ExpansionPanel],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-panels { display: grid; grid-template-columns: 1fr; gap: var(--sn-space-4); max-width: 420px; }"
    }
  ],
  "form-field/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field>\n    <sn-label required>Name</sn-label>\n    <input snInputText placeholder=\"Enter item name\" />\n  </sn-form-field>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormField, FormFieldLabel } from 'ashen-ui/form-field';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldLabel, InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "form-field/codeAffix": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field>\n    <sn-label>Amount</sn-label>\n    <sn-icon snPrefix>attach_money</sn-icon>\n    <input snInputText type=\"number\" placeholder=\"0.00\" />\n    <sn-hint>The icon sits inside the border and doesn't take the click.</sn-hint>\n  </sn-form-field>\n\n  <sn-form-field>\n    <sn-label>Search</sn-label>\n    <input snInputText placeholder=\"Find anything\" />\n    <sn-icon snSuffix>search</sn-icon>\n  </sn-form-field>\n\n  <sn-form-field floatLabel=\"auto\">\n    <sn-label>Website</sn-label>\n    <sn-icon snPrefix>link</sn-icon>\n    <input snInputText />\n    <sn-icon snSuffix>open_in_new</sn-icon>\n  </sn-form-field>\n\n  <sn-form-field>\n    <sn-label>Price</sn-label>\n    <span snPrefix>USD</span>\n    <input snInputText type=\"number\" placeholder=\"0\" />\n    <sn-hint>Text affix: the room is measured, nothing to configure.</sn-hint>\n  </sn-form-field>\n\n  <sn-form-field [style]=\"{ '--sn-form-field-affix-width': '3.5rem' }\">\n    <sn-label>Aligned</sn-label>\n    <sn-icon snPrefix>tag</sn-icon>\n    <input snInputText placeholder=\"0\" />\n    <sn-hint>--sn-form-field-affix-width sets a minimum gutter.</sn-hint>\n  </sn-form-field>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormField, FormFieldHint, FormFieldLabel, FormFieldPrefix, FormFieldSuffix } from 'ashen-ui/form-field';\nimport { Icon } from 'ashen-ui/icon';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldHint, FormFieldLabel, FormFieldPrefix, FormFieldSuffix, Icon, InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "form-field/codeHint": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field>\n    <sn-label>Label</sn-label>\n    <input snInputText placeholder=\"Optional label\" />\n    <sn-hint>Shown under the tile icon</sn-hint>\n  </sn-form-field>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormField, FormFieldHint, FormFieldLabel } from 'ashen-ui/form-field';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldHint, FormFieldLabel, InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "form-field/codeError": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field [autoDisplayErrors]=\"false\">\n    <sn-label required>Name</sn-label>\n    <input snInputText [invalid]=\"true\" placeholder=\"Enter item name\" />\n    <sn-error>Name is required</sn-error>\n  </sn-form-field>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormField, FormFieldError, FormFieldLabel } from 'ashen-ui/form-field';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldError, FormFieldLabel, InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "form-field/codeMultipleErrors": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field [autoDisplayErrors]=\"false\">\n    <sn-label required>File</sn-label>\n    <input snInputText [invalid]=\"true\" placeholder=\"Choose a file\" />\n    <sn-error>File is too large (max 10 MB)</sn-error>\n    <sn-error>Unsupported file type</sn-error>\n  </sn-form-field>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormField, FormFieldError, FormFieldLabel } from 'ashen-ui/form-field';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldError, FormFieldLabel, InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "form-field/codeInteractive": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field>\n    <sn-label required>Username</sn-label>\n    <input snInputText [(ngModel)]=\"username\" required placeholder=\"Enter username\" />\n    <sn-error>Username is required</sn-error>\n  </sn-form-field>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\nimport { FormField, FormFieldError, FormFieldLabel } from 'ashen-ui/form-field';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldError, FormFieldLabel, FormsModule, InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly username = signal('');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "form-field/codeAuto": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field>\n    <sn-label required>Username</sn-label>\n    <input snInputText [formControl]=\"autoCtrl\" placeholder=\"Enter username\" />\n    <sn-error>Username is required</sn-error>\n  </sn-form-field>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';\nimport { FormField, FormFieldError, FormFieldLabel } from 'ashen-ui/form-field';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldError, FormFieldLabel, InputText, ReactiveFormsModule],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly username = signal('');\n\n  readonly autoCtrl = new FormControl('', Validators.required);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "form-field/codeNoLabel": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field>\n    <input snInputText placeholder=\"Search files…\" />\n    <sn-hint>Search by file name or path</sn-hint>\n  </sn-form-field>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormField, FormFieldHint } from 'ashen-ui/form-field';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldHint, InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "form-field/codeFloat": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field floatLabel=\"auto\">\n    <sn-label>Full name</sn-label>\n    <input snInputText [(ngModel)]=\"floatName\" />\n    <sn-hint>Floats up once you focus or type</sn-hint>\n  </sn-form-field>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\nimport { FormField, FormFieldHint, FormFieldLabel } from 'ashen-ui/form-field';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldHint, FormFieldLabel, FormsModule, InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly floatName = signal('');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "form-field/codeFloatAlways": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field floatLabel=\"always\">\n    <sn-label>Email</sn-label>\n    <input snInputText placeholder=\"name@example.com\" />\n  </sn-form-field>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormField, FormFieldLabel } from 'ashen-ui/form-field';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldLabel, InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "form-field/codeFloatInvalid": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field floatLabel=\"auto\" [autoDisplayErrors]=\"false\">\n    <sn-label required>Account name</sn-label>\n    <input snInputText [invalid]=\"true\" [(ngModel)]=\"invalidFloatName\" />\n    <sn-error>Account name is required</sn-error>\n  </sn-form-field>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\nimport { FormField, FormFieldError, FormFieldLabel } from 'ashen-ui/form-field';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldError, FormFieldLabel, FormsModule, InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly invalidFloatName = signal('');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "form-field/codeSubscript": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <button type=\"button\" class=\"demo-toggle\" (click)=\"showSubError.set(!showSubError())\">\n    {{ showSubError() ? 'Hide' : 'Show' }} error\n  </button>\n  <div class=\"demo-row\">\n    <sn-form-field subscriptSizing=\"fixed\" style=\"flex: 1;\">\n      <sn-label>Fixed</sn-label>\n      <input snInputText placeholder=\"Reserves space\" />\n      @if (showSubError()) {\n        <sn-error>Something went wrong</sn-error>\n      }\n    </sn-form-field>\n    <sn-form-field subscriptSizing=\"dynamic\" style=\"flex: 1;\">\n      <sn-label>Dynamic</sn-label>\n      <input snInputText placeholder=\"Collapses when empty\" />\n      @if (showSubError()) {\n        <sn-error>Something went wrong</sn-error>\n      }\n    </sn-form-field>\n  </div>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { FormField, FormFieldError, FormFieldLabel } from 'ashen-ui/form-field';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldError, FormFieldLabel, InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly showSubError = signal(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }\n\n.demo-row { display: flex; gap: var(--sn-space-4); width: 100%; }\n\n.demo-toggle { align-self: flex-start; font: inherit; font-size: var(--sn-text-sm); padding: var(--sn-space-1) var(--sn-space-3); border: 1px solid var(--sn-border); border-radius: var(--sn-radius-sm); background: var(--sn-surface-canvas); color: var(--sn-text); cursor: pointer; }"
    }
  ],
  "form-field/codeAuthoredIds": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field>\n    <sn-label>Email</sn-label>\n    <input snInputText id=\"signup-email\" aria-describedby=\"signup-legend\" />\n    <sn-hint id=\"signup-email-hint\">We only use this to sign you in</sn-hint>\n  </sn-form-field>\n  <p id=\"signup-legend\" class=\"demo-note\">Referenced by aria-describedby from outside the field.</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormField, FormFieldHint, FormFieldLabel } from 'ashen-ui/form-field';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldHint, FormFieldLabel, InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }\n\n.demo-note { margin: 0; font-size: var(--sn-text-sm); color: var(--sn-text-muted); }"
    }
  ],
  "form-field/codeReskin": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field>\n    <sn-label required [snStyle]=\"labelSkin\">Custom label color</sn-label>\n    <input snInputText placeholder=\"Value\" />\n    <sn-hint>Required field indicator is orange</sn-hint>\n  </sn-form-field>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormField, FormFieldHint, FormFieldLabel } from 'ashen-ui/form-field';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldHint, FormFieldLabel, InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly labelSkin = {\n    root: { '--sn-form-field-label-color': 'var(--sn-color-primary)' },\n    requiredIndicator: { '--sn-form-field-required-color': 'var(--sn-color-warning)' },\n  };\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "icon/codeDefault": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-icon>settings</sn-icon>\n<sn-icon>grid_view</sn-icon>\n<sn-icon>edit</sn-icon>\n<sn-icon>play_arrow</sn-icon>\n<sn-icon>favorite</sn-icon>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Icon } from 'ashen-ui/icon';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Icon],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "icon/codeSizes": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-icon size=\"sm\">star</sn-icon>\n<sn-icon>star</sn-icon>\n<sn-icon size=\"lg\">star</sn-icon>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Icon } from 'ashen-ui/icon';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Icon],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "icon/codeFilled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-icon fill>favorite</sn-icon>\n<sn-icon fill>star</sn-icon>\n<sn-icon fill>thumb_up</sn-icon>\n<sn-icon>favorite</sn-icon>\n<sn-icon>star</sn-icon>\n<sn-icon>thumb_up</sn-icon>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Icon } from 'ashen-ui/icon';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Icon],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "icon/codeWeight": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-icon [weight]=\"300\">settings</sn-icon>\n<sn-icon [weight]=\"400\">settings</sn-icon>\n<sn-icon [weight]=\"500\">settings</sn-icon>\n<sn-icon [weight]=\"600\">settings</sn-icon>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Icon } from 'ashen-ui/icon';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Icon],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "icon/codeA11y": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-icon ariaLabel=\"Settings\">settings</sn-icon>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Icon } from 'ashen-ui/icon';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Icon],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "icon/codeGrid": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "@for (name of iconNames; track name) {\n  <sn-icon>{{ name }}</sn-icon>\n}"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Icon } from 'ashen-ui/icon';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Icon],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly iconNames = [\n    'grid_view',\n    'apps',\n    'edit',\n    'settings',\n    'play_arrow',\n    'pause',\n    'volume_up',\n    'language',\n    'http',\n    'keyboard',\n    'schedule',\n    'monitor_heart',\n  ];\n}"
    }
  ],
  "icon/codeClassMode": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-icon icon=\"grid_view\" />\n<sn-icon icon=\"settings\" />\n<sn-icon icon=\"edit\" />\n<sn-icon icon=\"favorite\" fill />\n<sn-icon icon=\"rocket_launch\" />"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Icon } from 'ashen-ui/icon';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Icon],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "icon/codeClassRaw": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<span class=\"sn-icon sn-icon-home\"></span>\n<span class=\"sn-icon sn-icon-search\"></span>\n<span class=\"sn-icon sn-icon-download\"></span>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\n\n@Component({\n  selector: 'app-demo',\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "icon/codeSetUse": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  @for (name of dynamicChoices; track name) {\n    <button\n      snButton\n      size=\"sm\"\n      [variant]=\"dynamicName() === name ? 'base' : 'outlined'\"\n      (click)=\"dynamicName.set(name)\"\n    >{{ name }}</button>\n  }\n  <sn-icon set=\"ms\" [icon]=\"dynamicName()\" size=\"lg\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Icon } from 'ashen-ui/icon';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Icon],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  /** Chosen from a control, so the name is never visible to the Tailwind scan. */\n  readonly dynamicName = signal('rocket_launch');\n\n  readonly dynamicChoices = ['rocket_launch', 'travel_explore', 'bolt', 'diamond'];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row { display: flex; align-items: center; gap: var(--sn-space-3); flex-wrap: wrap; }"
    }
  ],
  "icon/codeSetUse-2": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  @for (name of spriteNames; track name) {\n    <sn-icon set=\"demo\" [icon]=\"name\" size=\"lg\" />\n  }\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Icon } from 'ashen-ui/icon';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Icon],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly spriteNames = ['spark', 'orbit', 'stack'];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row { display: flex; align-items: center; gap: var(--sn-space-3); flex-wrap: wrap; }"
    }
  ],
  "infinite-scroll/codeElement": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div\n  class=\"scroll-container\"\n  snInfiniteScroll\n  [distance]=\"100\"\n  [throttle]=\"150\"\n  (scrolled)=\"loadMore()\"\n>\n  @for (item of items(); track item) {\n    <div class=\"list-item\">{{ item }}</div>\n  }\n  @if (loading()) {\n    <div class=\"loading-row\">Loading…</div>\n  }\n</div>\n<p class=\"demo-count\">{{ totalLoaded() }} items loaded</p>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { InfiniteScroll } from 'ashen-ui/infinite-scroll';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InfiniteScroll],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly BATCH = 20;\n\n  readonly items = signal<string[]>(this._generateItems(0, this.BATCH));\n\n  readonly loading = signal(false);\n\n  readonly totalLoaded = signal(this.BATCH);\n\n  loadMore(): void {\n    if (this.loading()) return;\n    this.loading.set(true);\n    setTimeout(() => {\n      const start = this.totalLoaded();\n      const next = this._generateItems(start, this.BATCH);\n      this.items.update((prev) => [...prev, ...next]);\n      this.totalLoaded.update((n) => n + this.BATCH);\n      this.loading.set(false);\n    }, 400);\n  }\n\n  private _generateItems(start: number, count: number): string[] {\n    return Array.from({ length: count }, (_, i) => `Item ${start + i + 1}`);\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".scroll-container {\n  height: 240px;\n  overflow-y: auto;\n  border: 1px solid var(--sn-border);\n  border-radius: var(--sn-radius-sm);\n  background: var(--sn-input-bg);\n  max-width: 420px;\n}\n\n.list-item {\n  padding: 8px 12px;\n  font-size: var(--sn-text-sm);\n  color: var(--sn-text);\n  border-bottom: 1px solid var(--sn-border-subtle);\n\n  &:last-child {\n    border-bottom: none;\n  }\n}\n\n.loading-row {\n  padding: 8px 12px;\n  font-size: var(--sn-text-sm);\n  color: var(--sn-text-muted);\n  text-align: center;\n  font-style: italic;\n}\n\n.demo-count {\n  margin-top: 6px;\n  font-size: var(--sn-text-xs);\n  color: var(--sn-text-muted);\n\n  &.muted {\n    opacity: 0.5;\n  }\n}"
    }
  ],
  "infinite-scroll/codeScrolledUp": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div\n  class=\"chat-container\"\n  snInfiniteScroll\n  [distance]=\"80\"\n  (scrolledUp)=\"loadOlderMessages()\"\n>\n  @if (chatLoading()) {\n    <div class=\"loading-row\">Loading older messages…</div>\n  }\n  @for (msg of chatMessages(); track msg.id) {\n    <div class=\"chat-bubble\" [class.is-me]=\"msg.author === 'You'\">\n      <span class=\"chat-author\">{{ msg.author }}</span>\n      <span class=\"chat-text\">{{ msg.text }}</span>\n    </div>\n  }\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { InfiniteScroll } from 'ashen-ui/infinite-scroll';\n\ninterface ChatMessage {\n  id: number;\n  author: string;\n  text: string;\n}\n\n@Component({\n  selector: 'app-demo',\n  imports: [InfiniteScroll],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly loading = signal(false);\n\n  readonly chatMessages = signal<ChatMessage[]>(this._generateChat(80, 100));\n\n  readonly chatLoading = signal(false);\n\n  readonly chatOldestId = signal(80);\n\n  loadOlderMessages(): void {\n    if (this.chatLoading() || this.chatOldestId() <= 0) return;\n    this.chatLoading.set(true);\n    setTimeout(() => {\n      const end = this.chatOldestId();\n      const start = Math.max(0, end - 20);\n      const older = this._generateChat(start, end - start);\n      this.chatMessages.update((prev) => [...older, ...prev]);\n      this.chatOldestId.set(start);\n      this.chatLoading.set(false);\n    }, 400);\n  }\n\n  private _generateChat(start: number, count: number): ChatMessage[] {\n    return Array.from({ length: count }, (_, i) => ({\n      id: start + i,\n      author: i % 2 === 0 ? 'You' : 'Alex',\n      text: `Message #${start + i + 1} - some chat content here.`,\n    }));\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".loading-row {\n  padding: 8px 12px;\n  font-size: var(--sn-text-sm);\n  color: var(--sn-text-muted);\n  text-align: center;\n  font-style: italic;\n}\n\n.chat-container {\n  height: 260px;\n  overflow-y: auto;\n  border: 1px solid var(--sn-border);\n  border-radius: var(--sn-radius-sm);\n  background: var(--sn-input-bg);\n  padding: 8px;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  max-width: 480px;\n}\n\n.chat-bubble {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  align-items: flex-start;\n  max-width: 80%;\n\n  &.is-me {\n    align-self: flex-end;\n    align-items: flex-end;\n\n    .chat-text {\n      background: var(--sn-color-primary-soft);\n    }\n  }\n}\n\n.chat-author {\n  font-size: var(--sn-text-xs);\n  color: var(--sn-text-muted);\n  padding: 0 4px;\n}\n\n.chat-text {\n  font-size: var(--sn-text-sm);\n  color: var(--sn-text);\n  background: var(--sn-surface-raised);\n  border-radius: var(--sn-radius-sm);\n  padding: 6px 10px;\n  line-height: 1.4;\n}"
    }
  ],
  "infinite-scroll/codeTable": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div\n  class=\"table-scroll-wrap\"\n  snInfiniteScroll\n  [distance]=\"80\"\n  (scrolled)=\"loadMoreRows()\"\n>\n  <sn-table [value]=\"tableRows()\">\n    <sn-column field=\"id\" header=\"#\" />\n    <sn-column field=\"level\" header=\"Level\" />\n    <sn-column field=\"message\" header=\"Message\" />\n    <sn-column field=\"time\" header=\"Time\" />\n  </sn-table>\n  @if (tableLoading()) {\n    <div class=\"loading-row\">Loading more rows…</div>\n  }\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { InfiniteScroll } from 'ashen-ui/infinite-scroll';\nimport { Table, TableColumn } from 'ashen-ui/table';\n\ninterface LogRow {\n  id: number;\n  level: string;\n  message: string;\n  time: string;\n}\n\n@Component({\n  selector: 'app-demo',\n  imports: [InfiniteScroll, Table, TableColumn],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly BATCH = 20;\n\n  readonly loading = signal(false);\n\n  readonly tableRows = signal<LogRow[]>(this._generateLogs(1, this.BATCH));\n\n  readonly tableLoading = signal(false);\n\n  readonly tableTotal = signal(this.BATCH);\n\n  loadMoreRows(): void {\n    if (this.tableLoading()) return;\n    this.tableLoading.set(true);\n    setTimeout(() => {\n      const start = this.tableTotal();\n      const next = this._generateLogs(start + 1, this.BATCH);\n      this.tableRows.update((prev) => [...prev, ...next]);\n      this.tableTotal.update((n) => n + this.BATCH);\n      this.tableLoading.set(false);\n    }, 400);\n  }\n\n  private _generateLogs(start: number, count: number): LogRow[] {\n    const levels = ['info', 'warn', 'error'];\n    return Array.from({ length: count }, (_, i) => ({\n      id: start + i,\n      level: levels[(start + i) % 3],\n      message: `Log entry ${start + i}: operation completed successfully.`,\n      time: new Date(Date.now() - (start + i) * 60000).toISOString().substring(11, 19),\n    }));\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".loading-row {\n  padding: 8px 12px;\n  font-size: var(--sn-text-sm);\n  color: var(--sn-text-muted);\n  text-align: center;\n  font-style: italic;\n}\n\n.table-scroll-wrap {\n  height: 280px;\n  overflow-y: auto;\n  border: 1px solid var(--sn-border);\n  border-radius: var(--sn-radius-sm);\n  max-width: 700px;\n}"
    }
  ],
  "infinite-scroll/codeDisabled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div style=\"margin-bottom:8px;\">\n  <label style=\"display:flex;align-items:center;gap:8px;font-size:var(--sn-text-sm);\">\n    <input type=\"checkbox\" [checked]=\"isDisabled()\" (change)=\"isDisabled.set(!isDisabled())\" />\n    Disable infinite scroll\n  </label>\n</div>\n<div\n  class=\"scroll-container\"\n  snInfiniteScroll\n  [snInfiniteScrollDisabled]=\"isDisabled()\"\n  (scrolled)=\"loadMore()\"\n>\n  @for (item of disabledItems(); track item) {\n    <div class=\"list-item\">{{ item }}</div>\n  }\n</div>\n<p class=\"demo-count\" [class.muted]=\"isDisabled()\">\n  Scroll events {{ isDisabled() ? 'disabled' : 'enabled' }}\n</p>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { InfiniteScroll } from 'ashen-ui/infinite-scroll';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InfiniteScroll],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly BATCH = 20;\n\n  readonly items = signal<string[]>(this._generateItems(0, this.BATCH));\n\n  readonly loading = signal(false);\n\n  readonly totalLoaded = signal(this.BATCH);\n\n  readonly isDisabled = signal(false);\n\n  readonly disabledItems = signal<string[]>(this._generateItems(0, 10));\n\n  loadMore(): void {\n    if (this.loading()) return;\n    this.loading.set(true);\n    setTimeout(() => {\n      const start = this.totalLoaded();\n      const next = this._generateItems(start, this.BATCH);\n      this.items.update((prev) => [...prev, ...next]);\n      this.totalLoaded.update((n) => n + this.BATCH);\n      this.loading.set(false);\n    }, 400);\n  }\n\n  private _generateItems(start: number, count: number): string[] {\n    return Array.from({ length: count }, (_, i) => `Item ${start + i + 1}`);\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".scroll-container {\n  height: 240px;\n  overflow-y: auto;\n  border: 1px solid var(--sn-border);\n  border-radius: var(--sn-radius-sm);\n  background: var(--sn-input-bg);\n  max-width: 420px;\n}\n\n.list-item {\n  padding: 8px 12px;\n  font-size: var(--sn-text-sm);\n  color: var(--sn-text);\n  border-bottom: 1px solid var(--sn-border-subtle);\n\n  &:last-child {\n    border-bottom: none;\n  }\n}\n\n.demo-count {\n  margin-top: 6px;\n  font-size: var(--sn-text-xs);\n  color: var(--sn-text-muted);\n\n  &.muted {\n    opacity: 0.5;\n  }\n}"
    }
  ],
  "input-group/codeLeadingText": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-input-group>\n    <sn-input-group-addon>https://</sn-input-group-addon>\n    <input snInputText placeholder=\"example.com\" />\n  </sn-input-group>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { InputGroup, InputGroupAddon } from 'ashen-ui/input-group';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputGroup, InputGroupAddon, InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-group/codeTrailingIcon": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-input-group>\n    <input snInputText placeholder=\"Search…\" />\n    <sn-input-group-addon icon=\"search\" />\n  </sn-input-group>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { InputGroup, InputGroupAddon } from 'ashen-ui/input-group';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputGroup, InputGroupAddon, InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-group/codeBothSides": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-input-group>\n    <sn-input-group-addon icon=\"person\" />\n    <input snInputText placeholder=\"Username\" />\n    <sn-input-group-addon>@domain.com</sn-input-group-addon>\n  </sn-input-group>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { InputGroup, InputGroupAddon } from 'ashen-ui/input-group';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputGroup, InputGroupAddon, InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-group/codeButtonAddon": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-input-group>\n    <input snInputText placeholder=\"Enter promo code\" />\n    <button snButton variant=\"raised\">Apply</button>\n  </sn-input-group>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { InputGroup } from 'ashen-ui/input-group';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, InputGroup, InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-group/codeLeadingButton": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-input-group>\n    <button snButton variant=\"outlined\" [snClass]=\"'sn-input-group-addon'\">\n      <span class=\"sn-icon icon-ms\" aria-hidden=\"true\">attach_file</span>\n    </button>\n    <input snInputText placeholder=\"File path…\" />\n  </sn-input-group>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { InputGroup } from 'ashen-ui/input-group';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, InputGroup, InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-group/codeInFormField": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field>\n    <sn-label required>Website</sn-label>\n    <sn-input-group>\n      <sn-input-group-addon>https://</sn-input-group-addon>\n      <input snInputText [formControl]=\"urlCtrl\" placeholder=\"example.com\" />\n    </sn-input-group>\n    <sn-error>Website is required</sn-error>\n  </sn-form-field>\n  <p class=\"hint-text\">Status: {{ urlCtrl.status }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';\nimport { FormField, FormFieldError, FormFieldLabel } from 'ashen-ui/form-field';\nimport { InputGroup, InputGroupAddon } from 'ashen-ui/input-group';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldError, FormFieldLabel, InputGroup, InputGroupAddon, InputText, ReactiveFormsModule],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly urlCtrl = new FormControl('', [Validators.required]);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "input-group/codeReskin": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-input-group style=\"--sn-input-group-border-radius: 9999px;\">\n    <sn-input-group-addon icon=\"search\" />\n    <input snInputText placeholder=\"Pill search…\" />\n  </sn-input-group>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { InputGroup, InputGroupAddon } from 'ashen-ui/input-group';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputGroup, InputGroupAddon, InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-mask/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field floatLabel=\"auto\">\n    <sn-label>Phone</sn-label>\n    <input snInputText snMask=\"(999) 999-9999\" [(ngModel)]=\"phone\" />\n    <sn-hint>Model: {{ phone() || '(empty)' }}</sn-hint>\n  </sn-form-field>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\nimport { FormField, FormFieldHint, FormFieldLabel } from 'ashen-ui/form-field';\nimport { InputMask } from 'ashen-ui/input-mask';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldHint, FormFieldLabel, FormsModule, InputMask, InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly phone = signal('');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-mask/codeTokens": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field>\n    <sn-label>Date</sn-label>\n    <input snInputText snMask=\"99/99/9999\" [(ngModel)]=\"date\" />\n    <sn-hint><code>9</code> is a digit</sn-hint>\n  </sn-form-field>\n\n  <sn-form-field>\n    <sn-label>Licence plate</sn-label>\n    <input snInputText snMask=\"aa-9999\" [(ngModel)]=\"plate\" />\n    <sn-hint><code>a</code> is a letter. Literals are anything else.</sn-hint>\n  </sn-form-field>\n\n  <sn-form-field>\n    <sn-label>ZIP</sn-label>\n    <input snInputText snMask=\"99999?-9999\" [(ngModel)]=\"zip\" />\n    <sn-hint><code>?</code> makes everything after it optional, so 5 digits is complete.</sn-hint>\n  </sn-form-field>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\nimport { FormField, FormFieldHint, FormFieldLabel } from 'ashen-ui/form-field';\nimport { InputMask } from 'ashen-ui/input-mask';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldHint, FormFieldLabel, FormsModule, InputMask, InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly date = signal('');\n\n  readonly plate = signal('');\n\n  readonly zip = signal('');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-mask/codeUnmask": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field>\n    <sn-label>Phone</sn-label>\n    <input snInputText snMask=\"(999) 999-9999\" unmask [(ngModel)]=\"raw\" />\n    <sn-hint>Model: {{ raw() || '(empty)' }}. The element still shows the mask.</sn-hint>\n  </sn-form-field>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\nimport { FormField, FormFieldHint, FormFieldLabel } from 'ashen-ui/form-field';\nimport { InputMask } from 'ashen-ui/input-mask';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldHint, FormFieldLabel, FormsModule, InputMask, InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly raw = signal('');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-mask/codeIncomplete": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field>\n    <sn-label>Auto-clear time</sn-label>\n    <input snInputText snMask=\"99:99:99\" [(ngModel)]=\"autoCleared\" />\n    <sn-hint>Leave the field before all six digits are entered to clear it.</sn-hint>\n  </sn-form-field>\n\n  <sn-form-field>\n    <sn-label>Retained time</sn-label>\n    <input snInputText snMask=\"99:99:99\" [autoClear]=\"false\" [formControl]=\"retained\" />\n    <sn-hint>\n      @if (retained.hasError('maskIncomplete')) {\n        Angular forms reports <code>maskIncomplete</code>.\n      } @else {\n        Enter a partial value to see incomplete validation.\n      }\n    </sn-hint>\n  </sn-form-field>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';\nimport { FormField, FormFieldHint, FormFieldLabel } from 'ashen-ui/form-field';\nimport { InputMask } from 'ashen-ui/input-mask';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldHint, FormFieldLabel, FormsModule, InputMask, InputText, ReactiveFormsModule],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly autoCleared = signal('');\n\n  readonly retained = new FormControl('', { nonNullable: true });\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-number/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <input snInputNumber placeholder=\"0\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { InputNumber } from 'ashen-ui/input-number';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputNumber],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-number/codeConstraints": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <input snInputNumber [min]=\"0\" [max]=\"100\" [step]=\"5\" placeholder=\"0\" />\n  <p class=\"hint-text\">Try typing -10 or 200 and blur - value is clamped.</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { InputNumber } from 'ashen-ui/input-number';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputNumber],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "input-number/codeStepper": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-input-group>\n    <input snInputNumber #stepped=\"snInputNumber\" [min]=\"0\" [max]=\"10\" placeholder=\"0\" />\n    <sn-input-number-stepper [for]=\"stepped\" />\n  </sn-input-group>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { InputGroup } from 'ashen-ui/input-group';\nimport { InputNumber, InputNumberStepper } from 'ashen-ui/input-number';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputGroup, InputNumber, InputNumberStepper],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-number/codeSizes": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <input snInputNumber size=\"sm\" placeholder=\"Small (sm)\" />\n  <input snInputNumber placeholder=\"Medium (md - default)\" />\n  <input snInputNumber size=\"lg\" placeholder=\"Large (lg)\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { InputNumber } from 'ashen-ui/input-number';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputNumber],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-number/codeError": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <input snInputNumber [invalid]=\"true\" placeholder=\"Invalid\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { InputNumber } from 'ashen-ui/input-number';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputNumber],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-number/codeDisabled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <input snInputNumber disabled value=\"42\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { InputNumber } from 'ashen-ui/input-number';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputNumber],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-number/codeInField": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field>\n    <sn-label required>Quantity</sn-label>\n    <input snInputNumber [formControl]=\"quantityCtrl\" [min]=\"1\" [max]=\"99\" />\n    <sn-hint>Enter a value between 1 and 99</sn-hint>\n    <sn-error>A number between 1 and 99 is required</sn-error>\n  </sn-form-field>\n  <p class=\"hint-text\">Status: {{ quantityCtrl.status }} · Value: {{ quantityCtrl.value }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';\nimport { FormField, FormFieldError, FormFieldHint, FormFieldLabel } from 'ashen-ui/form-field';\nimport { InputNumber } from 'ashen-ui/input-number';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldError, FormFieldHint, FormFieldLabel, InputNumber, ReactiveFormsModule],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly quantityCtrl = new FormControl<number | null>(null, [Validators.required, Validators.min(1), Validators.max(99)]);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "input-number/codeNgModel": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <input snInputNumber [(ngModel)]=\"ngModelValue\" [min]=\"0\" [max]=\"10\" [step]=\"0.5\" />\n  <p class=\"hint-text\">Bound value: {{ ngModelValue() }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\nimport { InputNumber } from 'ashen-ui/input-number';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormsModule, InputNumber],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly ngModelValue = signal<number | null>(null);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "input-number/codeReskin": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <input\n    snInputNumber\n    placeholder=\"0\"\n    style=\"--sn-input-text-border-radius: 9999px; --sn-input-text-focus-border: var(--sn-color-success);\"\n  />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { InputNumber } from 'ashen-ui/input-number';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputNumber],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-password/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-input-password />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { InputPassword } from 'ashen-ui/input-password';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputPassword],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-password/codeWithMeter": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-input-password [meter]=\"true\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { InputPassword } from 'ashen-ui/input-password';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputPassword],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-password/codeDisabled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-input-password [disabled]=\"true\" value=\"hidden\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { InputPassword } from 'ashen-ui/input-password';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputPassword],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-password/codeSizes": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-input-password size=\"sm\" placeholder=\"Small\" />\n  <sn-input-password placeholder=\"Medium (default)\" />\n  <sn-input-password size=\"lg\" placeholder=\"Large\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { InputPassword } from 'ashen-ui/input-password';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputPassword],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-password/codeInField": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field>\n    <sn-label required>Password</sn-label>\n    <sn-input-password [formControl]=\"passwordCtrl\" [meter]=\"true\" />\n    <sn-hint>Minimum 8 characters</sn-hint>\n    <sn-error>Password must be at least 8 characters</sn-error>\n  </sn-form-field>\n  <p class=\"hint-text\">Status: {{ passwordCtrl.status }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';\nimport { FormField, FormFieldError, FormFieldHint, FormFieldLabel } from 'ashen-ui/form-field';\nimport { InputPassword } from 'ashen-ui/input-password';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldError, FormFieldHint, FormFieldLabel, InputPassword, ReactiveFormsModule],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly passwordCtrl = new FormControl('', [\n    Validators.required,\n    Validators.minLength(8),\n  ]);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "input-password/codeReactive": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-input-password [formControl]=\"passwordCtrl\" />\n  <p class=\"hint-text\">Value: {{ passwordCtrl.value }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';\nimport { InputPassword } from 'ashen-ui/input-password';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputPassword, ReactiveFormsModule],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly passwordCtrl = new FormControl('', [\n    Validators.required,\n    Validators.minLength(8),\n  ]);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "input-password/codeNgModel": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-input-password [(ngModel)]=\"ngModelValue\" />\n  <p class=\"hint-text\">Value: {{ ngModelValue() }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\nimport { InputPassword } from 'ashen-ui/input-password';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormsModule, InputPassword],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly ngModelValue = signal('');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "input-password/codeCustomIntl": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-input-password showPasswordLabel=\"Reveal\" hidePasswordLabel=\"Conceal\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { InputPassword } from 'ashen-ui/input-password';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputPassword],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-password/codeReskin": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-input-password\n    style=\"--sn-input-password-toggle-color: var(--sn-color-info);\"\n    [snStyle]=\"inputSkin\"\n  />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { InputPassword } from 'ashen-ui/input-password';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputPassword],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly inputSkin = { input: { '--sn-input-text-border-radius': '9999px' } };\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-tags/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-input-tags placeholder=\"Add tag\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { InputTags } from 'ashen-ui/input-tags';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputTags],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 400px; }"
    }
  ],
  "input-tags/codePreset": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-input-tags [value]=\"presetTags()\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { InputTags } from 'ashen-ui/input-tags';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputTags],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly presetTags = signal(['angular', 'typescript', 'rxjs']);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 400px; }"
    }
  ],
  "input-tags/codeFormField": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field>\n    <sn-label>Project tags</sn-label>\n    <sn-input-tags />\n    <sn-hint>Press Enter or comma to add a tag.</sn-hint>\n  </sn-form-field>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormField, FormFieldHint, FormFieldLabel } from 'ashen-ui/form-field';\nimport { InputTags } from 'ashen-ui/input-tags';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldHint, FormFieldLabel, InputTags],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 400px; }"
    }
  ],
  "input-tags/codeDisabled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-input-tags [value]=\"['locked', 'readonly']\" [disabled]=\"true\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { InputTags } from 'ashen-ui/input-tags';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputTags],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 400px; }"
    }
  ],
  "input-tags/codeReactive": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-input-tags [formControl]=\"tagsCtrl\" />\n  <p class=\"hint-text\">Value: {{ tagsCtrl.value | json }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule } from '@angular/forms';\nimport { InputTags } from 'ashen-ui/input-tags';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputTags, ReactiveFormsModule],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly tagsCtrl = new FormControl<string[]>([]);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 400px; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "input-tags/codeNgModel": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-input-tags [(ngModel)]=\"ngModelTags\" />\n  <p class=\"hint-text\">Value: {{ ngModelTags() | json }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\nimport { InputTags } from 'ashen-ui/input-tags';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormsModule, InputTags],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly ngModelTags = signal<string[]>([]);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 400px; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "input-text/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <input snInputText placeholder=\"Enter item name\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-text/codeSizes": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <input snInputText size=\"sm\" placeholder=\"Small (sm)\" />\n  <input snInputText placeholder=\"Medium (md - default)\" />\n  <input snInputText size=\"lg\" placeholder=\"Large (lg)\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-text/codeError": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <input snInputText [invalid]=\"true\" placeholder=\"Invalid input\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-text/codeDisabled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <input snInputText disabled value=\"Disabled value\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-text/codeReadonly": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <input snInputText readonly value=\"Read-only value\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-text/codeReactive": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field>\n    <sn-label required>Email address</sn-label>\n    <input snInputText [formControl]=\"emailCtrl\" placeholder=\"user@example.com\" type=\"email\" />\n    <sn-error>A valid email is required</sn-error>\n  </sn-form-field>\n  <p class=\"hint-text\">Status: {{ emailCtrl.status }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';\nimport { FormField, FormFieldError, FormFieldLabel } from 'ashen-ui/form-field';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldError, FormFieldLabel, InputText, ReactiveFormsModule],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly emailCtrl = new FormControl('', [Validators.required, Validators.email]);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "input-text/codeInField": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field>\n    <sn-label>Request body</sn-label>\n    <input snInputText placeholder='{ \"action\": \"play\" }' />\n  </sn-form-field>\n  <sn-form-field>\n    <sn-label>Volume</sn-label>\n    <input snInputText placeholder=\"65\" type=\"number\" />\n    <sn-hint>0 – 100</sn-hint>\n  </sn-form-field>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormField, FormFieldHint, FormFieldLabel } from 'ashen-ui/form-field';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldHint, FormFieldLabel, InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "input-text/codeReskin": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <input\n    snInputText\n    placeholder=\"Custom border radius\"\n    style=\"--sn-input-text-border-radius: 9999px; --sn-input-text-focus-border: var(--sn-color-success);\"\n  />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { InputText } from 'ashen-ui/input-text';\n\n@Component({\n  selector: 'app-demo',\n  imports: [InputText],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "listbox/codeSingle": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-listbox [(value)]=\"singleValue\" class=\"demo-listbox\">\n    @for (opt of options; track opt) {\n      <sn-list-option [value]=\"opt\">{{ opt }}</sn-list-option>\n    }\n  </sn-listbox>\n  <p class=\"hint-text\">Value: {{ singleValue() | json }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { ListOption, Listbox } from 'ashen-ui/listbox';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ListOption, Listbox],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly singleValue = signal<unknown>(null);\n\n  readonly options = ['Main', 'Streaming', 'Empty'];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-listbox {\n  max-width: 280px;\n  width: 100%;\n}\n\n.hint-text {\n  font-size: 0.875rem;\n  color: var(--sn-text-muted, #6b7280);\n}"
    }
  ],
  "listbox/codeCheckmark": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-listbox [(value)]=\"checkmarkValue\" checkmark class=\"demo-listbox\">\n    @for (opt of options; track opt) {\n      <sn-list-option [value]=\"opt\">{{ opt }}</sn-list-option>\n    }\n  </sn-listbox>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { ListOption, Listbox } from 'ashen-ui/listbox';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ListOption, Listbox],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly checkmarkValue = signal<unknown>(null);\n\n  readonly options = ['Main', 'Streaming', 'Empty'];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-listbox {\n  max-width: 280px;\n  width: 100%;\n}"
    }
  ],
  "listbox/codeMultiple": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-listbox [(value)]=\"multipleValue\" [multiple]=\"true\" class=\"demo-listbox\">\n    @for (w of widgets; track w.value) {\n      <sn-list-option [value]=\"w.value\">{{ w.label }}</sn-list-option>\n    }\n  </sn-listbox>\n  <p class=\"hint-text\">Value: {{ multipleValue() | json }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { ListOption, Listbox } from 'ashen-ui/listbox';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ListOption, Listbox],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly multipleValue = signal<unknown[]>([]);\n\n  readonly widgets = [\n    { label: 'Sales', value: 'sales' },\n    { label: 'Revenue', value: 'revenue' },\n    { label: 'Orders', value: 'orders' },\n    { label: 'Customers', value: 'customers' },\n  ];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-listbox {\n  max-width: 280px;\n  width: 100%;\n}\n\n.hint-text {\n  font-size: 0.875rem;\n  color: var(--sn-text-muted, #6b7280);\n}"
    }
  ],
  "listbox/codeIcons": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-listbox [(value)]=\"iconsValue\" class=\"demo-listbox\">\n    @for (opt of iconOptions; track opt.value) {\n      <sn-list-option [value]=\"opt.value\" [disabled]=\"opt.disabled\">\n        <sn-icon>{{ opt.icon }}</sn-icon>\n        {{ opt.label }}\n      </sn-list-option>\n    }\n  </sn-listbox>\n  <p class=\"hint-text\">Value: {{ iconsValue() | json }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Icon } from 'ashen-ui/icon';\nimport { ListOption, Listbox } from 'ashen-ui/listbox';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Icon, ListOption, Listbox],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly iconsValue = signal<unknown>(null);\n\n  readonly iconOptions = [\n    { label: 'View List', value: 'list', icon: 'view_list' },\n    { label: 'Grid View', value: 'grid', icon: 'grid_view' },\n    { label: 'Table Chart', value: 'table', icon: 'table_chart' },\n    { label: 'Map (disabled)', value: 'map', icon: 'map', disabled: true },\n  ];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-listbox {\n  max-width: 280px;\n  width: 100%;\n}\n\n.hint-text {\n  font-size: 0.875rem;\n  color: var(--sn-text-muted, #6b7280);\n}"
    }
  ],
  "listbox/codeReactive": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-listbox [formControl]=\"formCtrl\" class=\"demo-listbox\">\n    @for (fw of frameworks; track fw) {\n      <sn-list-option [value]=\"fw.toLowerCase()\">{{ fw }}</sn-list-option>\n    }\n  </sn-listbox>\n  <p class=\"hint-text\">Value: {{ formCtrl.value | json }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule } from '@angular/forms';\nimport { ListOption, Listbox } from 'ashen-ui/listbox';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ListOption, Listbox, ReactiveFormsModule],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly formCtrl = new FormControl<unknown>('react');\n\n  readonly frameworks = ['React', 'Angular', 'Vue', 'Svelte'];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-listbox {\n  max-width: 280px;\n  width: 100%;\n}\n\n.hint-text {\n  font-size: 0.875rem;\n  color: var(--sn-text-muted, #6b7280);\n}"
    }
  ],
  "listbox/codeNgModel": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-listbox [(ngModel)]=\"ngModelValue\" class=\"demo-listbox\">\n    <sn-list-option value=\"channels\">Channels</sn-list-option>\n    <sn-list-option value=\"streams\">Streams</sn-list-option>\n    <sn-list-option value=\"clips\">Clips</sn-list-option>\n  </sn-listbox>\n  <p class=\"hint-text\">Value: {{ ngModelValue() | json }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\nimport { ListOption, Listbox } from 'ashen-ui/listbox';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormsModule, ListOption, Listbox],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly ngModelValue = signal<unknown>('streams');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-listbox {\n  max-width: 280px;\n  width: 100%;\n}\n\n.hint-text {\n  font-size: 0.875rem;\n  color: var(--sn-text-muted, #6b7280);\n}"
    }
  ],
  "listbox/codeDisabled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-listbox [disabled]=\"true\" [(value)]=\"disabledValue\" class=\"demo-listbox\">\n    <sn-list-option value=\"option1\">Option 1</sn-list-option>\n    <sn-list-option value=\"option2\">Option 2</sn-list-option>\n    <sn-list-option value=\"option3\">Option 3</sn-list-option>\n  </sn-listbox>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { ListOption, Listbox } from 'ashen-ui/listbox';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ListOption, Listbox],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly disabledValue = signal<unknown>('option1');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-listbox {\n  max-width: 280px;\n  width: 100%;\n}"
    }
  ],
  "menu/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div style=\"display: flex; gap: 8px; flex-wrap: wrap; align-items: flex-start;\">\n  <button\n    style=\"padding: 7px 14px; border-radius: var(--sn-radius-md); border: 1px solid var(--sn-border); background: var(--sn-surface); color: var(--sn-text); cursor: pointer; font-size: var(--sn-text-sm); font-family: var(--sn-font-ui);\"\n    [snMenuTriggerFor]=\"basicMenu\"\n  >Options</button>\n  <sn-menu #basicMenu>\n    <button snMenuItem (click)=\"lastAction.set('Edit')\">Edit</button>\n    <button snMenuItem (click)=\"lastAction.set('Duplicate')\">Duplicate</button>\n    <button snMenuItem (click)=\"lastAction.set('Archive')\">Archive</button>\n  </sn-menu>\n  @if (lastAction()) {\n    <span style=\"font-size: var(--sn-text-sm); color: var(--sn-text-subtle); align-self: center;\">Last: {{ lastAction() }}</span>\n  }\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Menu, MenuItem, MenuTrigger } from 'ashen-ui/menu';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Menu, MenuItem, MenuTrigger],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly lastAction = signal('');\n}"
    }
  ],
  "menu/codeWithIcons": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<button\n  style=\"padding: 7px 14px; border-radius: var(--sn-radius-md); border: 1px solid var(--sn-border); background: var(--sn-surface); color: var(--sn-text); cursor: pointer; font-size: var(--sn-text-sm); font-family: var(--sn-font-ui);\"\n  [snMenuTriggerFor]=\"iconMenu\"\n>File</button>\n<sn-menu #iconMenu>\n  <button snMenuItem icon=\"edit\">Rename</button>\n  <button snMenuItem icon=\"content_copy\">Duplicate</button>\n  <button snMenuItem icon=\"drive_file_move\">Move to…</button>\n  <button snMenuItem icon=\"download\">Download</button>\n</sn-menu>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Menu, MenuItem, MenuTrigger } from 'ashen-ui/menu';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Menu, MenuItem, MenuTrigger],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "menu/codeWithShortcut": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<button\n  style=\"padding: 7px 14px; border-radius: var(--sn-radius-md); border: 1px solid var(--sn-border); background: var(--sn-surface); color: var(--sn-text); cursor: pointer; font-size: var(--sn-text-sm); font-family: var(--sn-font-ui);\"\n  [snMenuTriggerFor]=\"shortcutMenu\"\n>Edit</button>\n<sn-menu #shortcutMenu>\n  <button snMenuItem icon=\"undo\" shortcut=\"⌘Z\">Undo</button>\n  <button snMenuItem icon=\"redo\" shortcut=\"⌘⇧Z\">Redo</button>\n  <button snMenuItem icon=\"content_cut\" shortcut=\"⌘X\">Cut</button>\n  <button snMenuItem icon=\"content_copy\" shortcut=\"⌘C\">Copy</button>\n  <button snMenuItem icon=\"content_paste\" shortcut=\"⌘V\">Paste</button>\n</sn-menu>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Menu, MenuItem, MenuTrigger } from 'ashen-ui/menu';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Menu, MenuItem, MenuTrigger],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "menu/codeWithSeparator": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<button\n  style=\"padding: 7px 14px; border-radius: var(--sn-radius-md); border: 1px solid var(--sn-border); background: var(--sn-surface); color: var(--sn-text); cursor: pointer; font-size: var(--sn-text-sm); font-family: var(--sn-font-ui);\"\n  [snMenuTriggerFor]=\"separatorMenu\"\n>Actions</button>\n<sn-menu #separatorMenu>\n  <button snMenuItem icon=\"edit\">Edit</button>\n  <button snMenuItem icon=\"content_copy\">Duplicate</button>\n  <sn-menu-separator />\n  <button snMenuItem icon=\"share\">Share</button>\n  <button snMenuItem icon=\"link\">Copy link</button>\n  <sn-menu-separator />\n  <button snMenuItem icon=\"delete\" danger>Delete</button>\n</sn-menu>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Menu, MenuItem, MenuSeparator, MenuTrigger } from 'ashen-ui/menu';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Menu, MenuItem, MenuSeparator, MenuTrigger],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "menu/codeWithDanger": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<button\n  style=\"padding: 7px 14px; border-radius: var(--sn-radius-md); border: 1px solid var(--sn-border); background: var(--sn-surface); color: var(--sn-text); cursor: pointer; font-size: var(--sn-text-sm); font-family: var(--sn-font-ui);\"\n  [snMenuTriggerFor]=\"dangerMenu\"\n>More</button>\n<sn-menu #dangerMenu>\n  <button snMenuItem icon=\"flag\">Report</button>\n  <button snMenuItem icon=\"block\" danger>Block user</button>\n  <button snMenuItem icon=\"delete\" danger>Delete permanently</button>\n</sn-menu>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Menu, MenuItem, MenuTrigger } from 'ashen-ui/menu';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Menu, MenuItem, MenuTrigger],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "menu/codeWithDisabled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<button\n  style=\"padding: 7px 14px; border-radius: var(--sn-radius-md); border: 1px solid var(--sn-border); background: var(--sn-surface); color: var(--sn-text); cursor: pointer; font-size: var(--sn-text-sm); font-family: var(--sn-font-ui);\"\n  [snMenuTriggerFor]=\"disabledMenu\"\n>Permission-gated</button>\n<sn-menu #disabledMenu>\n  <button snMenuItem icon=\"edit\">Edit</button>\n  <button snMenuItem icon=\"content_copy\" disabled>Duplicate (no permission)</button>\n  <button snMenuItem icon=\"drive_file_move\">Move</button>\n  <button snMenuItem icon=\"delete\" disabled danger>Delete (read-only)</button>\n</sn-menu>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Menu, MenuItem, MenuTrigger } from 'ashen-ui/menu';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Menu, MenuItem, MenuTrigger],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "menu/codeWithSubmenu": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<button\n  style=\"padding: 7px 14px; border-radius: var(--sn-radius-md); border: 1px solid var(--sn-border); background: var(--sn-surface); color: var(--sn-text); cursor: pointer; font-size: var(--sn-text-sm); font-family: var(--sn-font-ui);\"\n  [snMenuTriggerFor]=\"fileMenuDemo\"\n>File</button>\n<sn-menu #fileMenuDemo>\n  <button snMenuItem icon=\"note_add\" [snSubmenuTriggerFor]=\"newMenuDemo\">New</button>\n  <button snMenuItem icon=\"folder_open\">Open…</button>\n  <sn-menu-separator />\n  <button snMenuItem icon=\"save\" shortcut=\"⌘S\">Save</button>\n</sn-menu>\n<sn-menu #newMenuDemo>\n  <button snMenuItem icon=\"description\">Blank document</button>\n  <button snMenuItem icon=\"table_chart\">Spreadsheet</button>\n  <button snMenuItem icon=\"slideshow\">Presentation</button>\n</sn-menu>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Menu, MenuItem, MenuSeparator, MenuTrigger, SubmenuTrigger } from 'ashen-ui/menu';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Menu, MenuItem, MenuSeparator, MenuTrigger, SubmenuTrigger],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "menubar/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-menubar>\n  <sn-menubar-item label=\"File\" [menuFor]=\"fileMenu\" />\n  <sn-menubar-item label=\"Edit\" [menuFor]=\"editMenu\" />\n  <sn-menubar-item label=\"Help\" (activated)=\"lastAction.set('Help')\" />\n</sn-menubar>\n\n<sn-menu #fileMenu>\n  <button snMenuItem icon=\"add\" (click)=\"lastAction.set('New')\">New</button>\n  <button snMenuItem icon=\"folder_open\" (click)=\"lastAction.set('Open')\">Open…</button>\n  <button snMenuItem icon=\"save\" (click)=\"lastAction.set('Save')\">Save</button>\n  <sn-menu-separator />\n  <button snMenuItem icon=\"close\" danger (click)=\"lastAction.set('Close')\">Close</button>\n</sn-menu>\n\n<sn-menu #editMenu>\n  <button snMenuItem icon=\"undo\" shortcut=\"⌘Z\" (click)=\"lastAction.set('Undo')\">Undo</button>\n  <button snMenuItem icon=\"redo\" shortcut=\"⌘⇧Z\" (click)=\"lastAction.set('Redo')\">Redo</button>\n  <sn-menu-separator />\n  <button snMenuItem icon=\"content_cut\" shortcut=\"⌘X\" (click)=\"lastAction.set('Cut')\">Cut</button>\n  <button snMenuItem icon=\"content_copy\" shortcut=\"⌘C\" (click)=\"lastAction.set('Copy')\">Copy</button>\n  <button snMenuItem icon=\"content_paste\" shortcut=\"⌘V\" (click)=\"lastAction.set('Paste')\">Paste</button>\n</sn-menu>\n\n@if (lastAction()) {\n  <p style=\"margin-top: 12px; font-size: var(--sn-text-sm); color: var(--sn-text-subtle);\">\n    Last action: <strong>{{ lastAction() }}</strong>\n  </p>\n}"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Menu, MenuItem, MenuSeparator } from 'ashen-ui/menu';\nimport { Menubar, MenubarItem } from 'ashen-ui/menubar';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Menu, MenuItem, MenuSeparator, Menubar, MenubarItem],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly lastAction = signal('');\n}"
    }
  ],
  "menubar/codeWithIcons": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-menubar>\n  <sn-menubar-item label=\"File\" icon=\"folder\" [menuFor]=\"iconFileMenu\" />\n  <sn-menubar-item label=\"View\" icon=\"visibility\" [menuFor]=\"iconViewMenu\" />\n  <sn-menubar-item label=\"About\" icon=\"info\" (activated)=\"lastAction.set('About')\" />\n</sn-menubar>\n\n<sn-menu #iconFileMenu>\n  <button snMenuItem icon=\"add\">New</button>\n  <button snMenuItem icon=\"folder_open\">Open…</button>\n  <button snMenuItem icon=\"save\">Save</button>\n</sn-menu>\n\n<sn-menu #iconViewMenu>\n  <button snMenuItem icon=\"zoom_in\">Zoom in</button>\n  <button snMenuItem icon=\"zoom_out\">Zoom out</button>\n  <button snMenuItem icon=\"fit_screen\">Fit to screen</button>\n</sn-menu>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Menu, MenuItem } from 'ashen-ui/menu';\nimport { Menubar, MenubarItem } from 'ashen-ui/menubar';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Menu, MenuItem, Menubar, MenubarItem],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly lastAction = signal('');\n}"
    }
  ],
  "menubar/codeActivated": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-menubar>\n  <sn-menubar-item label=\"Docs\" (activated)=\"lastAction.set('Docs')\" />\n  <sn-menubar-item label=\"Changelog\" (activated)=\"lastAction.set('Changelog')\" />\n  <sn-menubar-item label=\"Support\" (activated)=\"lastAction.set('Support')\" />\n</sn-menubar>\n\n@if (lastAction()) {\n  <p style=\"margin-top: 12px; font-size: var(--sn-text-sm); color: var(--sn-text-subtle);\">\n    Clicked: <strong>{{ lastAction() }}</strong>\n  </p>\n}"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Menubar, MenubarItem } from 'ashen-ui/menubar';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Menubar, MenubarItem],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly lastAction = signal('');\n}"
    }
  ],
  "message/codeSeverities": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div style=\"display: flex; flex-direction: column; gap: 8px; width: 100%;\">\n  <sn-message severity=\"info\">Widgets refresh every second</sn-message>\n  <sn-message severity=\"success\">Grid saved</sn-message>\n  <sn-message severity=\"warning\">Grid 2 has overlapping tiles</sn-message>\n  <sn-message severity=\"error\">Name is required</sn-message>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Message } from 'ashen-ui/message';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Message],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "message/codeClosable": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "@if (showClosable()) {\n  <sn-message severity=\"success\" [closable]=\"true\" (closed)=\"onClosed()\">\n    Grid saved\n  </sn-message>\n} @else {\n  <span style=\"font-size: var(--sn-text-sm); color: var(--sn-text-muted);\">Message closed - reappearing…</span>\n}"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Message } from 'ashen-ui/message';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Message],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly showClosable = signal(true);\n\n  onClosed(): void {\n    this.showClosable.set(false);\n    setTimeout(() => this.showClosable.set(true), 1500);\n  }\n}"
    }
  ],
  "message/codeSimple": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div style=\"display: flex; flex-direction: column; gap: 6px; width: 100%;\">\n  <sn-message severity=\"info\" simple>Widgets refresh every second</sn-message>\n  <sn-message severity=\"success\" simple>Grid saved</sn-message>\n  <sn-message severity=\"warning\" simple>Grid 2 has overlapping tiles</sn-message>\n  <sn-message severity=\"error\" simple>Name is required</sn-message>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Message } from 'ashen-ui/message';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Message],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "message/codeCustomIcon": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-message severity=\"info\" icon=\"notifications\">\n  You have 3 pending notifications\n</sn-message>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Message } from 'ashen-ui/message';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Message],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "message/codeProjected": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-message severity=\"warning\">\n  <strong>Overlapping tiles detected</strong> - open the layout editor to resolve conflicts.\n</sn-message>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Message } from 'ashen-ui/message';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Message],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "message/codeCustomColor": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-message severity=\"error\" style=\"--sn-message-color: var(--sn-color-primary);\">\n  Custom color override\n</sn-message>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Message } from 'ashen-ui/message';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Message],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "meter-group/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-meter-group style=\"width: 100%;\">\n  <sn-meter [value]=\"42\" label=\"Apps\" color=\"var(--sn-color-primary)\" />\n  <sn-meter [value]=\"23\" label=\"Media\" color=\"var(--sn-color-info)\" />\n  <sn-meter [value]=\"12\" label=\"System\" color=\"var(--sn-color-warning)\" />\n</sn-meter-group>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Meter, MeterGroup } from 'ashen-ui/meter-group';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Meter, MeterGroup],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "meter-group/codeCustomMax": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-meter-group [max]=\"500\" label=\"Storage (GB)\" style=\"width: 100%;\">\n  <sn-meter [value]=\"210\" label=\"Documents\" unit=\"GB\" color=\"var(--sn-color-primary)\" />\n  <sn-meter [value]=\"95\"  label=\"Media\"     unit=\"GB\" color=\"var(--sn-color-info)\" />\n  <sn-meter [value]=\"38\"  label=\"System\"    unit=\"GB\" color=\"var(--sn-color-warning)\" />\n</sn-meter-group>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Meter, MeterGroup } from 'ashen-ui/meter-group';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Meter, MeterGroup],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "meter-group/codeNoLegend": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-meter-group [showLegend]=\"false\" style=\"width: 100%;\">\n  <sn-meter [value]=\"64\" label=\"Used\" color=\"var(--sn-color-primary)\" />\n  <sn-meter [value]=\"14\" label=\"Reserved\" color=\"var(--sn-color-warning)\" />\n</sn-meter-group>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Meter, MeterGroup } from 'ashen-ui/meter-group';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Meter, MeterGroup],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "meter-group/codeDefaultColors": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-meter-group style=\"width: 100%;\">\n  <sn-meter [value]=\"35\" label=\"CPU\" />\n  <sn-meter [value]=\"28\" label=\"Memory\" />\n  <sn-meter [value]=\"15\" label=\"Disk I/O\" />\n</sn-meter-group>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Meter, MeterGroup } from 'ashen-ui/meter-group';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Meter, MeterGroup],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "meter-group/codeCustomToken": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-meter-group style=\"width: 100%; --sn-meter-group-bar-height: 12px; --sn-meter-group-bar-radius: var(--sn-radius-sm);\">\n  <sn-meter [value]=\"42\" label=\"Apps\" color=\"var(--sn-color-primary)\" />\n  <sn-meter [value]=\"23\" label=\"Media\" color=\"var(--sn-color-info)\" />\n</sn-meter-group>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Meter, MeterGroup } from 'ashen-ui/meter-group';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Meter, MeterGroup],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "multi-select/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-multi-select [(value)]=\"basicValue\" placeholder=\"Pick widgets…\" class=\"demo-select\">\n    @for (w of widgets; track w.value) {\n      <sn-list-option [value]=\"w.value\">{{ w.label }}</sn-list-option>\n    }\n  </sn-multi-select>\n  <p class=\"hint-text\">Value: {{ basicValue() | json }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { ListOption } from 'ashen-ui/listbox';\nimport { MultiSelect } from 'ashen-ui/multi-select';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ListOption, MultiSelect],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly basicValue = signal<unknown[]>([]);\n\n  readonly widgets = [\n    { label: 'Clock', value: 'clock' },\n    { label: 'Weather', value: 'weather' },\n    { label: 'Stats', value: 'stats' },\n    { label: 'Media', value: 'media' },\n    { label: 'Network', value: 'network' },\n  ];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-select {\n  max-width: 320px;\n  width: 100%;\n}\n\n.hint-text {\n  font-size: 0.8rem;\n  color: var(--sn-text-subtle);\n  margin: 0;\n}"
    }
  ],
  "multi-select/codeMaxChips": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-multi-select [(value)]=\"manyValue\" [maxChips]=\"2\" class=\"demo-select\">\n    @for (w of widgets; track w.value) {\n      <sn-list-option [value]=\"w.value\">{{ w.label }}</sn-list-option>\n    }\n  </sn-multi-select>\n  <p class=\"hint-text\">Value: {{ manyValue() | json }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { ListOption } from 'ashen-ui/listbox';\nimport { MultiSelect } from 'ashen-ui/multi-select';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ListOption, MultiSelect],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly manyValue = signal<unknown[]>(['clock', 'weather', 'stats', 'media', 'network']);\n\n  readonly widgets = [\n    { label: 'Clock', value: 'clock' },\n    { label: 'Weather', value: 'weather' },\n    { label: 'Stats', value: 'stats' },\n    { label: 'Media', value: 'media' },\n    { label: 'Network', value: 'network' },\n  ];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-select {\n  max-width: 320px;\n  width: 100%;\n}\n\n.hint-text {\n  font-size: 0.8rem;\n  color: var(--sn-text-subtle);\n  margin: 0;\n}"
    }
  ],
  "multi-select/codeReactive": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-multi-select [formControl]=\"formCtrl\" class=\"demo-select\">\n    @for (fw of frameworks; track fw.value) {\n      <sn-list-option [value]=\"fw.value\" [disabled]=\"!!fw.disabled\">{{ fw.label }}</sn-list-option>\n    }\n  </sn-multi-select>\n  <p class=\"hint-text\">Value: {{ formCtrl.value | json }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule } from '@angular/forms';\nimport { ListOption } from 'ashen-ui/listbox';\nimport { MultiSelect } from 'ashen-ui/multi-select';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ListOption, MultiSelect, ReactiveFormsModule],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly formCtrl = new FormControl<unknown[]>([]);\n\n  readonly frameworks = [\n    { label: 'React', value: 'react' },\n    { label: 'Angular', value: 'angular' },\n    { label: 'Vue', value: 'vue' },\n    { label: 'Svelte', value: 'svelte', disabled: true },\n    { label: 'SolidJS', value: 'solid' },\n  ];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-select {\n  max-width: 320px;\n  width: 100%;\n}\n\n.hint-text {\n  font-size: 0.8rem;\n  color: var(--sn-text-subtle);\n  margin: 0;\n}"
    }
  ],
  "multi-select/codeFormField": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-form-field class=\"demo-select\">\n    <sn-label>Frameworks</sn-label>\n    <sn-multi-select [(value)]=\"formFieldValue\">\n      @for (fw of frameworks; track fw.value) {\n        <sn-list-option [value]=\"fw.value\" [disabled]=\"!!fw.disabled\">{{ fw.label }}</sn-list-option>\n      }\n    </sn-multi-select>\n    <sn-hint>Choose all that apply</sn-hint>\n  </sn-form-field>\n  <p class=\"hint-text\">Value: {{ formFieldValue() | json }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { FormField, FormFieldHint, FormFieldLabel } from 'ashen-ui/form-field';\nimport { ListOption } from 'ashen-ui/listbox';\nimport { MultiSelect } from 'ashen-ui/multi-select';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldHint, FormFieldLabel, ListOption, MultiSelect],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly formFieldValue = signal<unknown[]>([]);\n\n  readonly frameworks = [\n    { label: 'React', value: 'react' },\n    { label: 'Angular', value: 'angular' },\n    { label: 'Vue', value: 'vue' },\n    { label: 'Svelte', value: 'svelte', disabled: true },\n    { label: 'SolidJS', value: 'solid' },\n  ];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-select {\n  max-width: 320px;\n  width: 100%;\n}\n\n.hint-text {\n  font-size: 0.8rem;\n  color: var(--sn-text-subtle);\n  margin: 0;\n}"
    }
  ],
  "multi-select/codeDisabled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-multi-select [disabled]=\"true\" [(value)]=\"disabledValue\" class=\"demo-select\">\n    @for (fw of frameworks; track fw.value) {\n      <sn-list-option [value]=\"fw.value\">{{ fw.label }}</sn-list-option>\n    }\n  </sn-multi-select>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { ListOption } from 'ashen-ui/listbox';\nimport { MultiSelect } from 'ashen-ui/multi-select';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ListOption, MultiSelect],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly disabledValue = signal<unknown[]>(['angular']);\n\n  readonly frameworks = [\n    { label: 'React', value: 'react' },\n    { label: 'Angular', value: 'angular' },\n    { label: 'Vue', value: 'vue' },\n    { label: 'Svelte', value: 'svelte', disabled: true },\n    { label: 'SolidJS', value: 'solid' },\n  ];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-select {\n  max-width: 320px;\n  width: 100%;\n}"
    }
  ],
  "paginator/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-paginator [page]=\"page()\" [totalRecords]=\"100\" [rows]=\"10\" (pageChange)=\"onPageChange($event)\" />"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { PageChangeEvent, Paginator } from 'ashen-ui/paginator';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Paginator],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly page = signal(0);\n\n  onPageChange(e: PageChangeEvent) {\n    this.page.set(e.page);\n  }\n}"
    }
  ],
  "paginator/codeReport": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-paginator [page]=\"1\" [totalRecords]=\"45\" [rows]=\"10\">\n  <ng-template\n    snPaginatorReport\n    let-first=\"first\"\n    let-last=\"last\"\n    let-total=\"total\"\n    let-page=\"page\"\n    let-pageCount=\"pageCount\"\n  >\n    Showing {{ first }} to {{ last }} of {{ total }}\n    (page {{ page + 1 }} of {{ pageCount }})\n  </ng-template>\n</sn-paginator>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Paginator, PaginatorReport } from 'ashen-ui/paginator';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Paginator, PaginatorReport],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly page = signal(0);\n}"
    }
  ],
  "paginator/codeMiddle": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-paginator [page]=\"pageMiddle()\" [totalRecords]=\"120\" [rows]=\"10\" [siblings]=\"1\" (pageChange)=\"onMiddlePageChange($event)\" />"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { PageChangeEvent, Paginator } from 'ashen-ui/paginator';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Paginator],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly page = signal(0);\n\n  readonly pageMiddle = signal(5);\n\n  onMiddlePageChange(e: PageChangeEvent) {\n    this.pageMiddle.set(e.page);\n  }\n}"
    }
  ],
  "paginator/codeNoEdges": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-paginator [page]=\"0\" [totalRecords]=\"100\" [rows]=\"10\" [showEdges]=\"false\" />"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Paginator } from 'ashen-ui/paginator';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Paginator],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly page = signal(0);\n}"
    }
  ],
  "paginator/codeRowsSelect": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-paginator\n  [page]=\"pageRows()\"\n  [totalRecords]=\"200\"\n  [rows]=\"rowsValue()\"\n  [rowsPerPageOptions]=\"[5, 10, 25, 50]\"\n  (pageChange)=\"onRowsPageChange($event)\"\n/>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { PageChangeEvent, Paginator } from 'ashen-ui/paginator';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Paginator],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly page = signal(0);\n\n  readonly pageRows = signal(0);\n\n  readonly rowsValue = signal(10);\n\n  onRowsPageChange(e: PageChangeEvent) {\n    this.pageRows.set(e.page);\n    this.rowsValue.set(e.rows);\n  }\n}"
    }
  ],
  "paginator/codeSnClass": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-paginator\n  [page]=\"pageSnClass()\"\n  [totalRecords]=\"100\"\n  [rows]=\"10\"\n  [snClass]=\"{ root: 'my-paginator', pages: 'my-pages' }\"\n  (pageChange)=\"pageSnClass.set($event.page)\"\n/>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Paginator } from 'ashen-ui/paginator';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Paginator],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly page = signal(0);\n\n  readonly pageSnClass = signal(0);\n}"
    }
  ],
  "panel/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-panels\">\n  <sn-panel header=\"Grid Settings\">\n    Grids hold button and widget tiles. Drag to move, pull a handle to resize.\n  </sn-panel>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Panel } from 'ashen-ui/panel';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Panel],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-panels { display: grid; grid-template-columns: 1fr; gap: var(--sn-space-4); width: 100%; max-width: 420px; }"
    }
  ],
  "panel/codeWithIcon": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-panels\">\n  <sn-panel header=\"Visual Appearance\" icon=\"palette\">\n    Configure the visual appearance of the selected tile.\n  </sn-panel>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Panel } from 'ashen-ui/panel';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Panel],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-panels { display: grid; grid-template-columns: 1fr; gap: var(--sn-space-4); width: 100%; max-width: 420px; }"
    }
  ],
  "panel/codeToggleable": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-panels\">\n  <sn-panel header=\"Interactive Options\" icon=\"touch_app\" toggleable [collapsed]=\"true\">\n    Zoom effect and color feedback settings.\n  </sn-panel>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Panel } from 'ashen-ui/panel';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Panel],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-panels { display: grid; grid-template-columns: 1fr; gap: var(--sn-space-4); width: 100%; max-width: 420px; }"
    }
  ],
  "panel/codeWithActions": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-panels\">\n  <sn-panel header=\"Grid Settings\" toggleable>\n    <div snPanelActions>\n      <button snButton variant=\"text\" size=\"sm\">Edit</button>\n    </div>\n    Grids hold button and widget tiles. Drag to move, pull a handle to resize.\n  </sn-panel>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Panel } from 'ashen-ui/panel';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Panel],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-panels { display: grid; grid-template-columns: 1fr; gap: var(--sn-space-4); width: 100%; max-width: 420px; }"
    }
  ],
  "panel/codeCustomTitle": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-panels\">\n  <sn-panel toggleable>\n    <span snPanelTitle style=\"color: var(--sn-color-primary)\">Custom Title</span>\n    Panel content goes here.\n  </sn-panel>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Panel } from 'ashen-ui/panel';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Panel],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-panels { display: grid; grid-template-columns: 1fr; gap: var(--sn-space-4); width: 100%; max-width: 420px; }"
    }
  ],
  "panel/codeCustomChevron": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-panels\">\n  <sn-panel header=\"Custom Chevron\" toggleable>\n    <ng-template snIcon=\"toggle\">\n      <sn-icon icon=\"chevron_right\" />\n    </ng-template>\n    Content with a custom toggle icon.\n  </sn-panel>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { IconTemplate } from 'ashen-ui/core';\nimport { Icon } from 'ashen-ui/icon';\nimport { Panel } from 'ashen-ui/panel';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Icon, IconTemplate, Panel],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-panels { display: grid; grid-template-columns: 1fr; gap: var(--sn-space-4); width: 100%; max-width: 420px; }"
    }
  ],
  "panel/codeSnClass": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-panels\">\n  <sn-panel header=\"Styled Panel\" [snClass]=\"{ root: 'demo-highlighted-panel' }\">\n    Root element receives the <code>demo-highlighted-panel</code> class.\n  </sn-panel>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Panel } from 'ashen-ui/panel';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Panel],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-panels { display: grid; grid-template-columns: 1fr; gap: var(--sn-space-4); width: 100%; max-width: 420px; }"
    }
  ],
  "popover/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-popover>\n    <button snButton variant=\"outlined\" snPopoverTrigger>Options</button>\n    <ng-template snPopoverContent let-close=\"close\">\n      <p style=\"margin:0 0 0.5rem;color:var(--sn-text)\">Quick settings panel</p>\n      <button snButton variant=\"text\" size=\"sm\" (click)=\"close()\">Done</button>\n    </ng-template>\n  </sn-popover>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Popover, PopoverContent, PopoverTrigger } from 'ashen-ui/popover';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Popover, PopoverContent, PopoverTrigger],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "popover/codePositions": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row demo-row--spaced\">\n  <sn-popover position=\"bottom\">\n    <button snButton variant=\"outlined\" snPopoverTrigger>Bottom</button>\n    <ng-template snPopoverContent><p style=\"margin:0;color:var(--sn-text)\">Anchored below</p></ng-template>\n  </sn-popover>\n  <sn-popover position=\"top\">\n    <button snButton variant=\"outlined\" snPopoverTrigger>Top</button>\n    <ng-template snPopoverContent><p style=\"margin:0;color:var(--sn-text)\">Anchored above</p></ng-template>\n  </sn-popover>\n  <sn-popover position=\"left\">\n    <button snButton variant=\"outlined\" snPopoverTrigger>Left</button>\n    <ng-template snPopoverContent><p style=\"margin:0;color:var(--sn-text)\">Anchored left</p></ng-template>\n  </sn-popover>\n  <sn-popover position=\"right\">\n    <button snButton variant=\"outlined\" snPopoverTrigger>Right</button>\n    <ng-template snPopoverContent><p style=\"margin:0;color:var(--sn-text)\">Anchored right</p></ng-template>\n  </sn-popover>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Popover, PopoverContent, PopoverTrigger } from 'ashen-ui/popover';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Popover, PopoverContent, PopoverTrigger],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}\n\n.demo-row--spaced {\n  justify-content: space-around;\n  padding: var(--sn-space-6) var(--sn-space-6);\n}"
    }
  ],
  "popover/codeDirectiveClose": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-popover>\n    <button snButton variant=\"outlined\" snPopoverTrigger>Options</button>\n    <ng-template snPopoverContent>\n      <p style=\"margin:0 0 0.5rem;color:var(--sn-text)\">Quick settings</p>\n      <button snButton variant=\"text\" size=\"sm\" snPopoverClose>Done</button>\n    </ng-template>\n  </sn-popover>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Popover, PopoverClose, PopoverContent, PopoverTrigger } from 'ashen-ui/popover';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Popover, PopoverClose, PopoverContent, PopoverTrigger],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "popover/codeClose": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-popover>\n    <button snButton variant=\"icon\" aria-label=\"Filter options\" snPopoverTrigger>\n      <sn-icon>tune</sn-icon>\n    </button>\n    <ng-template snPopoverContent let-close=\"close\">\n      <div class=\"filter-panel\">\n        <p style=\"margin:0 0 0.5rem;color:var(--sn-text);font-weight:600\">Filter options</p>\n        <label class=\"filter-option\"><input type=\"checkbox\" /> Show completed</label>\n        <label class=\"filter-option\"><input type=\"checkbox\" /> Show archived</label>\n        <hr style=\"border:none;border-top:1px solid var(--sn-border);margin:0.5rem 0\" />\n        <button snButton size=\"sm\" (click)=\"close()\">Apply</button>\n      </div>\n    </ng-template>\n  </sn-popover>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Icon } from 'ashen-ui/icon';\nimport { Popover, PopoverContent, PopoverTrigger } from 'ashen-ui/popover';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Icon, Popover, PopoverContent, PopoverTrigger],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}\n\n.filter-panel {\n  display: flex;\n  flex-direction: column;\n  gap: var(--sn-space-2);\n}\n\n.filter-option {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-2);\n  font-size: var(--sn-text-sm);\n  color: var(--sn-text);\n  cursor: pointer;\n}"
    }
  ],
  "popover/codeControlled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-popover [(open)]=\"isControlledOpen\">\n    <button snButton variant=\"outlined\" snPopoverTrigger>Toggle</button>\n    <ng-template snPopoverContent let-close=\"close\">\n      <p style=\"margin:0 0 0.5rem;color:var(--sn-text)\">Open state: {{ isControlledOpen() }}</p>\n      <button snButton variant=\"text\" size=\"sm\" (click)=\"close()\">Close</button>\n    </ng-template>\n  </sn-popover>\n  <span style=\"color:var(--sn-text-muted);font-size:var(--sn-text-sm)\">\n    open = {{ isControlledOpen() }}\n  </span>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Popover, PopoverContent, PopoverTrigger } from 'ashen-ui/popover';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Popover, PopoverContent, PopoverTrigger],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly isControlledOpen = signal(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "progress-bar/codeDeterminate": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-progress-bar [value]=\"64\" />"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { ProgressBar } from 'ashen-ui/progress-bar';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ProgressBar],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly value = signal(64);\n}"
    }
  ],
  "progress-bar/codeIndeterminate": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-progress-bar [indeterminate]=\"true\" />"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { ProgressBar } from 'ashen-ui/progress-bar';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ProgressBar],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "progress-bar/codeMaterial": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div style=\"display: flex; flex-direction: column; gap: 12px; width: 100%;\">\n  <sn-progress-bar variant=\"material\" [value]=\"64\" />\n  <sn-progress-bar variant=\"material\" [indeterminate]=\"true\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { ProgressBar } from 'ashen-ui/progress-bar';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ProgressBar],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly value = signal(64);\n}"
    }
  ],
  "progress-bar/codeNoLabel": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-progress-bar [value]=\"64\" [showValue]=\"false\" />"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { ProgressBar } from 'ashen-ui/progress-bar';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ProgressBar],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly value = signal(64);\n}"
    }
  ],
  "progress-bar/codeCustom": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-progress-bar [value]=\"64\" style=\"--sn-progress-bar-color: var(--sn-color-success);\" />"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { ProgressBar } from 'ashen-ui/progress-bar';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ProgressBar],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly value = signal(64);\n}"
    }
  ],
  "progress-spinner/codeDefault": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-progress-spinner />"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { ProgressSpinner } from 'ashen-ui/progress-spinner';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ProgressSpinner],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "progress-spinner/codeDeterminate": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div style=\"display: flex; align-items: center; gap: 16px;\">\n  <sn-progress-spinner [value]=\"70\" />\n  <sn-progress-spinner [value]=\"30\" [size]=\"24\" color=\"var(--sn-color-warning)\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { ProgressSpinner } from 'ashen-ui/progress-spinner';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ProgressSpinner],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "progress-spinner/codeMaterial": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div style=\"display: flex; align-items: center; gap: 16px;\">\n  <sn-progress-spinner variant=\"material\" />\n  <sn-progress-spinner variant=\"material\" [value]=\"70\" />\n  <sn-progress-spinner variant=\"material\" [value]=\"30\" [size]=\"24\" color=\"var(--sn-color-warning)\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { ProgressSpinner } from 'ashen-ui/progress-spinner';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ProgressSpinner],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "progress-spinner/codeCustom": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-progress-spinner [size]=\"48\" style=\"--sn-progress-spinner-color: var(--sn-color-success);\" />"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { ProgressSpinner } from 'ashen-ui/progress-spinner';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ProgressSpinner],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "radio-group/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-radio-group>\n    <sn-radio value=\"email\">Email</sn-radio>\n    <sn-radio value=\"sms\">SMS</sn-radio>\n    <sn-radio value=\"push\">Push notification</sn-radio>\n  </sn-radio-group>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Radio, RadioGroup } from 'ashen-ui/radio-group';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Radio, RadioGroup],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "radio-group/codeHorizontal": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-radio-group direction=\"horizontal\">\n    <sn-radio value=\"sm\">Small</sn-radio>\n    <sn-radio value=\"md\">Medium</sn-radio>\n    <sn-radio value=\"lg\">Large</sn-radio>\n  </sn-radio-group>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Radio, RadioGroup } from 'ashen-ui/radio-group';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Radio, RadioGroup],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "radio-group/codePreselected": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-radio-group [value]=\"'sms'\">\n    <sn-radio value=\"email\">Email</sn-radio>\n    <sn-radio value=\"sms\">SMS</sn-radio>\n    <sn-radio value=\"push\">Push notification</sn-radio>\n  </sn-radio-group>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Radio, RadioGroup } from 'ashen-ui/radio-group';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Radio, RadioGroup],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "radio-group/codeDisabledGroup": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-radio-group [disabled]=\"true\" [value]=\"'email'\">\n    <sn-radio value=\"email\">Email</sn-radio>\n    <sn-radio value=\"sms\">SMS</sn-radio>\n  </sn-radio-group>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Radio, RadioGroup } from 'ashen-ui/radio-group';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Radio, RadioGroup],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "radio-group/codeDisabledRadio": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-radio-group>\n    <sn-radio value=\"email\">Email</sn-radio>\n    <sn-radio value=\"sms\" [disabled]=\"true\">SMS (unavailable)</sn-radio>\n    <sn-radio value=\"push\">Push notification</sn-radio>\n  </sn-radio-group>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Radio, RadioGroup } from 'ashen-ui/radio-group';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Radio, RadioGroup],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "radio-group/codeReactive": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-radio-group [formControl]=\"formCtrl\">\n    <sn-radio value=\"email\">Email</sn-radio>\n    <sn-radio value=\"sms\">SMS</sn-radio>\n    <sn-radio value=\"push\">Push</sn-radio>\n  </sn-radio-group>\n  <p class=\"hint-text\">Value: {{ formCtrl.value }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule } from '@angular/forms';\nimport { Radio, RadioGroup } from 'ashen-ui/radio-group';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Radio, RadioGroup, ReactiveFormsModule],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly formCtrl = new FormControl<unknown>('email');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "radio-group/codeNgModel": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-radio-group [(ngModel)]=\"ngModelVal\">\n    <sn-radio value=\"email\">Email</sn-radio>\n    <sn-radio value=\"sms\">SMS</sn-radio>\n  </sn-radio-group>\n  <p class=\"hint-text\">Value: {{ ngModelVal() }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\nimport { Radio, RadioGroup } from 'ashen-ui/radio-group';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormsModule, Radio, RadioGroup],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly ngModelVal = signal<unknown>('email');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "select/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-select [(value)]=\"basicValue\" placeholder=\"Pick a framework…\" class=\"demo-select\">\n    @for (fw of frameworks; track fw.value) {\n      <sn-list-option [value]=\"fw.value\">{{ fw.label }}</sn-list-option>\n    }\n  </sn-select>\n  <p class=\"hint-text\">Value: {{ basicValue() | json }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { ListOption } from 'ashen-ui/listbox';\nimport { Select } from 'ashen-ui/select';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ListOption, Select],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly basicValue = signal<unknown>(null);\n\n  readonly frameworks = [\n    { label: 'React', value: 'react' },\n    { label: 'Angular', value: 'angular' },\n    { label: 'Vue', value: 'vue' },\n    { label: 'Svelte', value: 'svelte' },\n    { label: 'SolidJS', value: 'solid' },\n  ];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-select {\n  max-width: 280px;\n  width: 100%;\n}\n\n.hint-text {\n  font-size: 0.8rem;\n  color: var(--sn-text-subtle);\n  margin: 0;\n}"
    }
  ],
  "select/codeCheckmark": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-select [(value)]=\"checkmarkValue\" checkmark placeholder=\"Pick a framework…\" class=\"demo-select\">\n    @for (fw of frameworks; track fw.value) {\n      <sn-list-option [value]=\"fw.value\">{{ fw.label }}</sn-list-option>\n    }\n  </sn-select>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { ListOption } from 'ashen-ui/listbox';\nimport { Select } from 'ashen-ui/select';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ListOption, Select],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly checkmarkValue = signal<unknown>('angular');\n\n  readonly frameworks = [\n    { label: 'React', value: 'react' },\n    { label: 'Angular', value: 'angular' },\n    { label: 'Vue', value: 'vue' },\n    { label: 'Svelte', value: 'svelte' },\n    { label: 'SolidJS', value: 'solid' },\n  ];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-select {\n  max-width: 280px;\n  width: 100%;\n}"
    }
  ],
  "select/codeClearable": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-select\n    [(value)]=\"clearableValue\"\n    clearable\n    clearLabel=\"Clear framework\"\n    class=\"demo-select\"\n  >\n    @for (fw of frameworks; track fw.value) {\n      <sn-list-option [value]=\"fw.value\">{{ fw.label }}</sn-list-option>\n    }\n    <ng-template snIcon=\"clear\">\n      <span class=\"sn-icon icon-ms\">backspace</span>\n    </ng-template>\n  </sn-select>\n  <p class=\"hint-text\">Value: {{ clearableValue() | json }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { IconTemplate } from 'ashen-ui/core';\nimport { ListOption } from 'ashen-ui/listbox';\nimport { Select } from 'ashen-ui/select';\n\n@Component({\n  selector: 'app-demo',\n  imports: [IconTemplate, ListOption, Select],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly clearableValue = signal<unknown>('angular');\n\n  readonly frameworks = [\n    { label: 'React', value: 'react' },\n    { label: 'Angular', value: 'angular' },\n    { label: 'Vue', value: 'vue' },\n    { label: 'Svelte', value: 'svelte' },\n    { label: 'SolidJS', value: 'solid' },\n  ];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-select {\n  max-width: 280px;\n  width: 100%;\n}\n\n.hint-text {\n  font-size: 0.8rem;\n  color: var(--sn-text-subtle);\n  margin: 0;\n}"
    }
  ],
  "select/codeReactive": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-select [formControl]=\"formCtrl\" class=\"demo-select\">\n    @for (s of sizes; track s.value) {\n      <sn-list-option [value]=\"s.value\" [disabled]=\"s.value === 'lg'\">{{ s.label }}</sn-list-option>\n    }\n  </sn-select>\n  <p class=\"hint-text\">Value: {{ formCtrl.value | json }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule } from '@angular/forms';\nimport { ListOption } from 'ashen-ui/listbox';\nimport { Select } from 'ashen-ui/select';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ListOption, ReactiveFormsModule, Select],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly formCtrl = new FormControl<unknown>(null);\n\n  readonly sizes = [\n    { label: 'Small', value: 'sm' },\n    { label: 'Medium', value: 'md' },\n    { label: 'Large', value: 'lg' },\n  ];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-select {\n  max-width: 280px;\n  width: 100%;\n}\n\n.hint-text {\n  font-size: 0.8rem;\n  color: var(--sn-text-subtle);\n  margin: 0;\n}"
    }
  ],
  "select/codeFormField": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-form-field class=\"demo-select\">\n    <sn-label>Framework</sn-label>\n    <sn-select [(value)]=\"formFieldValue\">\n      @for (fw of frameworks; track fw.value) {\n        <sn-list-option [value]=\"fw.value\">{{ fw.label }}</sn-list-option>\n      }\n    </sn-select>\n    <sn-hint>Choose your preferred framework</sn-hint>\n  </sn-form-field>\n  <p class=\"hint-text\">Value: {{ formFieldValue() | json }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { FormField, FormFieldHint, FormFieldLabel } from 'ashen-ui/form-field';\nimport { ListOption } from 'ashen-ui/listbox';\nimport { Select } from 'ashen-ui/select';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldHint, FormFieldLabel, ListOption, Select],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly formFieldValue = signal<unknown>(null);\n\n  readonly frameworks = [\n    { label: 'React', value: 'react' },\n    { label: 'Angular', value: 'angular' },\n    { label: 'Vue', value: 'vue' },\n    { label: 'Svelte', value: 'svelte' },\n    { label: 'SolidJS', value: 'solid' },\n  ];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-select {\n  max-width: 280px;\n  width: 100%;\n}\n\n.hint-text {\n  font-size: 0.8rem;\n  color: var(--sn-text-subtle);\n  margin: 0;\n}"
    }
  ],
  "select/codeDisabled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-select [disabled]=\"true\" [(value)]=\"basicValue\" class=\"demo-select\">\n    @for (fw of frameworks; track fw.value) {\n      <sn-list-option [value]=\"fw.value\">{{ fw.label }}</sn-list-option>\n    }\n  </sn-select>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { ListOption } from 'ashen-ui/listbox';\nimport { Select } from 'ashen-ui/select';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ListOption, Select],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly basicValue = signal<unknown>(null);\n\n  readonly frameworks = [\n    { label: 'React', value: 'react' },\n    { label: 'Angular', value: 'angular' },\n    { label: 'Vue', value: 'vue' },\n    { label: 'Svelte', value: 'svelte' },\n    { label: 'SolidJS', value: 'solid' },\n  ];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-select {\n  max-width: 280px;\n  width: 100%;\n}"
    }
  ],
  "select/codePreselected": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-select [(value)]=\"preselectedValue\" class=\"demo-select\">\n    @for (fw of frameworks; track fw.value) {\n      <sn-list-option [value]=\"fw.value\">{{ fw.label }}</sn-list-option>\n    }\n  </sn-select>\n  <p class=\"hint-text\">Value: {{ preselectedValue() | json }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { ListOption } from 'ashen-ui/listbox';\nimport { Select } from 'ashen-ui/select';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ListOption, Select],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly preselectedValue = signal<unknown>('angular');\n\n  readonly frameworks = [\n    { label: 'React', value: 'react' },\n    { label: 'Angular', value: 'angular' },\n    { label: 'Vue', value: 'vue' },\n    { label: 'Svelte', value: 'svelte' },\n    { label: 'SolidJS', value: 'solid' },\n  ];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-select {\n  max-width: 280px;\n  width: 100%;\n}\n\n.hint-text {\n  font-size: 0.8rem;\n  color: var(--sn-text-subtle);\n  margin: 0;\n}"
    }
  ],
  "select/codePassThrough": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-select\n    [snStyle]=\"{ panel: { minWidth: '18rem' } }\"\n    [snAttrs]=\"{ panel: { 'data-testid': 'framework-panel' } }\"\n    class=\"demo-select\"\n  >\n    @for (fw of frameworks; track fw.value) {\n      <sn-list-option [value]=\"fw.value\">{{ fw.label }}</sn-list-option>\n    }\n  </sn-select>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { ListOption } from 'ashen-ui/listbox';\nimport { Select } from 'ashen-ui/select';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ListOption, Select],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly frameworks = [\n    { label: 'React', value: 'react' },\n    { label: 'Angular', value: 'angular' },\n    { label: 'Vue', value: 'vue' },\n    { label: 'Svelte', value: 'svelte' },\n    { label: 'SolidJS', value: 'solid' },\n  ];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n  width: 100%;\n}\n\n.demo-select {\n  max-width: 280px;\n  width: 100%;\n}"
    }
  ],
  "select-button/codeSingle": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-select-button [(value)]=\"singleValue\">\n    <button snSelectOption value=\"day\">Day</button>\n    <button snSelectOption value=\"week\">Week</button>\n    <button snSelectOption value=\"month\">Month</button>\n  </sn-select-button>\n  <p class=\"hint-text\">Value: {{ singleValue() | json }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { SelectButton, SelectOption } from 'ashen-ui/select-button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [SelectButton, SelectOption],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly singleValue = signal<unknown>(undefined);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "select-button/codeMultiple": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-select-button [(value)]=\"multipleValue\" [multiple]=\"true\">\n    <button snSelectOption value=\"mon\">Mon</button>\n    <button snSelectOption value=\"tue\">Tue</button>\n    <button snSelectOption value=\"wed\">Wed</button>\n    <button snSelectOption value=\"thu\">Thu</button>\n    <button snSelectOption value=\"fri\">Fri</button>\n  </sn-select-button>\n  <p class=\"hint-text\">Value: {{ multipleValue() | json }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { SelectButton, SelectOption } from 'ashen-ui/select-button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [SelectButton, SelectOption],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly multipleValue = signal<unknown[]>([]);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "select-button/codeIcons": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-select-button [(value)]=\"iconsValue\">\n    <button snSelectOption value=\"list\">\n      <sn-icon size=\"sm\">view_list</sn-icon> List\n    </button>\n    <button snSelectOption value=\"grid\">\n      <sn-icon size=\"sm\">grid_view</sn-icon> Grid\n    </button>\n  </sn-select-button>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Icon } from 'ashen-ui/icon';\nimport { SelectButton, SelectOption } from 'ashen-ui/select-button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Icon, SelectButton, SelectOption],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly iconsValue = signal<unknown>('list');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; }"
    }
  ],
  "select-button/codeDisabledGroup": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-select-button [(value)]=\"singleValue\" [disabled]=\"true\">\n    <button snSelectOption value=\"a\">Alpha</button>\n    <button snSelectOption value=\"b\">Beta</button>\n    <button snSelectOption value=\"c\">Gamma</button>\n  </sn-select-button>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { SelectButton, SelectOption } from 'ashen-ui/select-button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [SelectButton, SelectOption],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly singleValue = signal<unknown>(undefined);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; }"
    }
  ],
  "select-button/codeDisabledOption": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-select-button [(value)]=\"singleValue\">\n    <button snSelectOption value=\"a\">Available</button>\n    <button snSelectOption value=\"b\" [disabled]=\"true\">Unavailable</button>\n    <button snSelectOption value=\"c\">Available</button>\n  </sn-select-button>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { SelectButton, SelectOption } from 'ashen-ui/select-button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [SelectButton, SelectOption],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly singleValue = signal<unknown>(undefined);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; }"
    }
  ],
  "select-button/codeReactive": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-select-button [formControl]=\"formCtrlSingle\">\n    <button snSelectOption value=\"list\">List</button>\n    <button snSelectOption value=\"card\">Card</button>\n    <button snSelectOption value=\"table\">Table</button>\n  </sn-select-button>\n  <p class=\"hint-text\">Value: {{ formCtrlSingle.value | json }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule } from '@angular/forms';\nimport { SelectButton, SelectOption } from 'ashen-ui/select-button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ReactiveFormsModule, SelectButton, SelectOption],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly formCtrlSingle = new FormControl<unknown>('list');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "select-button/codeNgModel": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-select-button [(ngModel)]=\"ngModelSingle\">\n    <button snSelectOption value=\"day\">Day</button>\n    <button snSelectOption value=\"week\">Week</button>\n    <button snSelectOption value=\"month\">Month</button>\n  </sn-select-button>\n  <p class=\"hint-text\">Value: {{ ngModelSingle() | json }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\nimport { SelectButton, SelectOption } from 'ashen-ui/select-button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormsModule, SelectButton, SelectOption],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly ngModelSingle = signal<unknown>('week');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "select-button/codeMultiple-2": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-select-button [formControl]=\"formCtrlMultiple\" [multiple]=\"true\">\n    <button snSelectOption value=\"bold\">Bold</button>\n    <button snSelectOption value=\"italic\">Italic</button>\n    <button snSelectOption value=\"underline\">Underline</button>\n  </sn-select-button>\n  <p class=\"hint-text\">Value: {{ formCtrlMultiple.value | json }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule } from '@angular/forms';\nimport { SelectButton, SelectOption } from 'ashen-ui/select-button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ReactiveFormsModule, SelectButton, SelectOption],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly formCtrlMultiple = new FormControl<unknown[]>(['bold']);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "skeleton/codeShimmer": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-skeleton shape=\"circle\" />\n  <div class=\"demo-col\">\n    <sn-skeleton shape=\"text\" />\n    <sn-skeleton shape=\"text\" width=\"70%\" />\n    <sn-skeleton shape=\"rect\" height=\"36px\" />\n  </div>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Skeleton } from 'ashen-ui/skeleton';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Skeleton],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row { display: flex; gap: 12px; align-items: flex-start; }\n\n.demo-col { flex: 1; display: flex; flex-direction: column; gap: 8px; }"
    }
  ],
  "skeleton/codePulse": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-skeleton shape=\"circle\" animation=\"pulse\" />\n  <div class=\"demo-col\">\n    <sn-skeleton shape=\"text\" animation=\"pulse\" />\n    <sn-skeleton shape=\"rect\" animation=\"pulse\" height=\"36px\" />\n  </div>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Skeleton } from 'ashen-ui/skeleton';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Skeleton],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row { display: flex; gap: 12px; align-items: flex-start; }\n\n.demo-col { flex: 1; display: flex; flex-direction: column; gap: 8px; }"
    }
  ],
  "skeleton/codeStatic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-skeleton shape=\"circle\" animation=\"none\" />\n  <div class=\"demo-col\">\n    <sn-skeleton shape=\"text\" animation=\"none\" />\n    <sn-skeleton shape=\"text\" width=\"55%\" animation=\"none\" />\n  </div>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Skeleton } from 'ashen-ui/skeleton';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Skeleton],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row { display: flex; gap: 12px; align-items: flex-start; }\n\n.demo-col { flex: 1; display: flex; flex-direction: column; gap: 8px; }"
    }
  ],
  "skeleton/codeShapes": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-shapes\">\n  <div class=\"demo-shape-item\">\n    <span class=\"demo-label\">text</span>\n    <sn-skeleton shape=\"text\" />\n  </div>\n  <div class=\"demo-shape-item\">\n    <span class=\"demo-label\">rect</span>\n    <sn-skeleton shape=\"rect\" />\n  </div>\n  <div class=\"demo-shape-item\">\n    <span class=\"demo-label\">circle</span>\n    <sn-skeleton shape=\"circle\" />\n  </div>\n  <div class=\"demo-shape-item\">\n    <span class=\"demo-label\">tile</span>\n    <sn-skeleton shape=\"tile\" />\n  </div>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Skeleton } from 'ashen-ui/skeleton';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Skeleton],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-shapes { display: flex; flex-direction: column; gap: var(--sn-space-3); }\n\n.demo-shape-item { display: flex; align-items: center; gap: var(--sn-space-3); }\n\n.demo-label { font-size: var(--sn-text-xs); color: var(--sn-text-subtle); width: 44px; flex-shrink: 0; font-family: var(--sn-font-mono); }"
    }
  ],
  "skeleton/codeCustom": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-skeleton shape=\"rect\" width=\"100%\" height=\"120px\" />"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Skeleton } from 'ashen-ui/skeleton';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Skeleton],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "skeleton/codeCard": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-card\">\n  <sn-skeleton shape=\"rect\" width=\"100%\" height=\"120px\" />\n  <div class=\"demo-card-body\">\n    <sn-skeleton shape=\"text\" width=\"60%\" />\n    <sn-skeleton shape=\"text\" />\n    <sn-skeleton shape=\"text\" width=\"80%\" />\n  </div>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Skeleton } from 'ashen-ui/skeleton';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Skeleton],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-card { border: 1px solid var(--sn-border); border-radius: var(--sn-radius-md); overflow: hidden; width: 100%; max-width: 280px; }\n\n.demo-card-body { padding: var(--sn-space-3); display: flex; flex-direction: column; gap: var(--sn-space-2); }"
    }
  ],
  "skeleton/codeReskin": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-skeleton\n  shape=\"rect\"\n  height=\"48px\"\n  style=\"--sn-skeleton-bg: #e0e7ff; --sn-skeleton-shimmer-color: rgba(99,102,241,0.25);\"\n/>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Skeleton } from 'ashen-ui/skeleton';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Skeleton],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "slider/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-slider [(value)]=\"basicValue\" />\n  <p class=\"hint-text\">Value: {{ basicValue() }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Slider } from 'ashen-ui/slider';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Slider],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly basicValue = signal(40);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 400px; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "slider/codeCustomRange": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-slider [min]=\"10\" [max]=\"50\" [step]=\"5\" [(value)]=\"customValue\" />\n  <p class=\"hint-text\">Value: {{ customValue() }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Slider } from 'ashen-ui/slider';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Slider],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly customValue = signal(50);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 400px; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "slider/codeVertical": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-slider orientation=\"vertical\" [(value)]=\"verticalValue\" />\n  <p class=\"hint-text\">\n    Value: {{ verticalValue() }}. Fills from the bottom; ArrowUp and ArrowRight both\n    raise it. Track length comes from <code>--sn-slider-length</code>.\n  </p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Slider } from 'ashen-ui/slider';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Slider],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly verticalValue = signal(60);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 400px; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "slider/codeNoValue": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-slider [showValue]=\"false\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Slider } from 'ashen-ui/slider';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Slider],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 400px; }"
    }
  ],
  "slider/codeFormatPct": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-slider [formatValue]=\"formatPct\" [(value)]=\"pctValue\" style=\"--sn-slider-value-min-width: 4.5rem\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Slider } from 'ashen-ui/slider';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Slider],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly pctValue = signal(40);\n\n  readonly formatPct = (v: number) => v + '%';\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 400px; }"
    }
  ],
  "slider/codeFormatCurrency": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-slider [min]=\"0\" [max]=\"500\" [step]=\"10\" [formatValue]=\"formatCurrency\" style=\"--sn-slider-value-min-width: 4.5rem\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Slider } from 'ashen-ui/slider';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Slider],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly formatCurrency = (v: number) => '$' + v.toFixed(2);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 400px; }"
    }
  ],
  "slider/codeDisabled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-slider [disabled]=\"true\" [value]=\"40\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Slider } from 'ashen-ui/slider';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Slider],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 400px; }"
    }
  ],
  "slider/codeFormField": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field>\n    <sn-label>Volume</sn-label>\n    <sn-slider [formControl]=\"formFieldCtrl\" />\n    <sn-hint>0 – 100</sn-hint>\n  </sn-form-field>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule } from '@angular/forms';\nimport { FormField, FormFieldHint, FormFieldLabel } from 'ashen-ui/form-field';\nimport { Slider } from 'ashen-ui/slider';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldHint, FormFieldLabel, ReactiveFormsModule, Slider],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly formFieldCtrl = new FormControl<number>(70);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 400px; }"
    }
  ],
  "slider/codeReactive": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-slider [formControl]=\"reactiveCtrl\" />\n  <p class=\"hint-text\">Value: {{ reactiveCtrl.value }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule } from '@angular/forms';\nimport { Slider } from 'ashen-ui/slider';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ReactiveFormsModule, Slider],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly reactiveCtrl = new FormControl<number>(60);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 400px; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "slider/codeNgModel": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-slider [(ngModel)]=\"ngModelValue\" />\n  <p class=\"hint-text\">Value: {{ ngModelValue() }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\nimport { Slider } from 'ashen-ui/slider';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormsModule, Slider],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly ngModelValue = signal(30);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 400px; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "split-button/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-split-button [menuFor]=\"basicMenu\" (clicked)=\"save()\">Save</sn-split-button>\n<sn-menu #basicMenu>\n  <button snMenuItem>Save as draft</button>\n  <sn-menu-separator />\n  <button snMenuItem>Discard</button>\n</sn-menu>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Menu, MenuItem, MenuSeparator } from 'ashen-ui/menu';\nimport { SplitButton } from 'ashen-ui/split-button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Menu, MenuItem, MenuSeparator, SplitButton],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  save(): void {}\n}"
    }
  ],
  "split-button/codeColors": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-split-button color=\"primary\" [menuFor]=\"colorMenu\">Primary</sn-split-button>\n<sn-split-button color=\"secondary\" [menuFor]=\"colorMenu\">Secondary</sn-split-button>\n<sn-split-button color=\"success\" [menuFor]=\"colorMenu\">Success</sn-split-button>\n<sn-split-button color=\"error\" [menuFor]=\"colorMenu\">Error</sn-split-button>\n<sn-split-button color=\"warning\" [menuFor]=\"colorMenu\">Warning</sn-split-button>\n<sn-split-button color=\"info\" [menuFor]=\"colorMenu\">Info</sn-split-button>\n<sn-menu #colorMenu>\n  <button snMenuItem>Option A</button>\n  <button snMenuItem>Option B</button>\n</sn-menu>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Menu, MenuItem } from 'ashen-ui/menu';\nimport { SplitButton } from 'ashen-ui/split-button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Menu, MenuItem, SplitButton],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "split-button/codeSizes": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-split-button size=\"sm\" [menuFor]=\"sizeMenu\">Small</sn-split-button>\n<sn-split-button size=\"md\" [menuFor]=\"sizeMenu\">Medium</sn-split-button>\n<sn-split-button size=\"lg\" [menuFor]=\"sizeMenu\">Large</sn-split-button>\n<sn-menu #sizeMenu>\n  <button snMenuItem>Option</button>\n</sn-menu>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Menu, MenuItem } from 'ashen-ui/menu';\nimport { SplitButton } from 'ashen-ui/split-button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Menu, MenuItem, SplitButton],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "split-button/codeDisabled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-split-button [disabled]=\"true\" [menuFor]=\"disabledMenu\">Disabled</sn-split-button>\n<sn-menu #disabledMenu>\n  <button snMenuItem>Option</button>\n</sn-menu>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Menu, MenuItem } from 'ashen-ui/menu';\nimport { SplitButton } from 'ashen-ui/split-button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Menu, MenuItem, SplitButton],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "split-button/codeIcon": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-split-button icon=\"save\" [menuFor]=\"iconMenu\" (clicked)=\"save()\">Save</sn-split-button>\n<sn-menu #iconMenu>\n  <button snMenuItem>Save as copy</button>\n  <button snMenuItem>Export…</button>\n</sn-menu>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Menu, MenuItem } from 'ashen-ui/menu';\nimport { SplitButton } from 'ashen-ui/split-button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Menu, MenuItem, SplitButton],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  save(): void {}\n}"
    }
  ],
  "splitter/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-splitter class=\"demo-splitter\">\n  <sn-splitter-panel>\n    <div class=\"demo-panel-content\">Left panel - drag the gutter to resize.</div>\n  </sn-splitter-panel>\n  <sn-splitter-panel>\n    <div class=\"demo-panel-content\">Right panel.</div>\n  </sn-splitter-panel>\n</sn-splitter>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Splitter, SplitterPanel } from 'ashen-ui/splitter';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Splitter, SplitterPanel],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-splitter { height: 240px; }\n\n.demo-panel-content { padding: var(--sn-space-4); font-size: var(--sn-text-sm); color: var(--sn-text-muted); }"
    }
  ],
  "splitter/codeVertical": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-splitter layout=\"vertical\" class=\"demo-splitter demo-splitter-tall\">\n  <sn-splitter-panel>\n    <div class=\"demo-panel-content\">Top panel.</div>\n  </sn-splitter-panel>\n  <sn-splitter-panel>\n    <div class=\"demo-panel-content\">Bottom panel.</div>\n  </sn-splitter-panel>\n</sn-splitter>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Splitter, SplitterPanel } from 'ashen-ui/splitter';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Splitter, SplitterPanel],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-splitter { height: 240px; }\n\n.demo-splitter-tall { height: 320px; }\n\n.demo-panel-content { padding: var(--sn-space-4); font-size: var(--sn-text-sm); color: var(--sn-text-muted); }"
    }
  ],
  "splitter/codeMinSize": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-splitter [minSize]=\"25\" class=\"demo-splitter\">\n  <sn-splitter-panel>\n    <div class=\"demo-panel-content\">Min 25% - cannot shrink below 25%.</div>\n  </sn-splitter-panel>\n  <sn-splitter-panel>\n    <div class=\"demo-panel-content\">Right panel.</div>\n  </sn-splitter-panel>\n</sn-splitter>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Splitter, SplitterPanel } from 'ashen-ui/splitter';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Splitter, SplitterPanel],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-splitter { height: 240px; }\n\n.demo-panel-content { padding: var(--sn-space-4); font-size: var(--sn-text-sm); color: var(--sn-text-muted); }"
    }
  ],
  "splitter/codeControlled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-splitter [(size)]=\"controlledSize\" class=\"demo-splitter\">\n  <sn-splitter-panel>\n    <div class=\"demo-panel-content\">Left - {{ controlledSize() }}%</div>\n  </sn-splitter-panel>\n  <sn-splitter-panel>\n    <div class=\"demo-panel-content\">Right - {{ 100 - controlledSize() }}%</div>\n  </sn-splitter-panel>\n</sn-splitter>\n<p class=\"demo-readout\">First panel: {{ controlledSize() }}%</p>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Splitter, SplitterPanel } from 'ashen-ui/splitter';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Splitter, SplitterPanel],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly controlledSize = signal(40);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-splitter { height: 240px; }\n\n.demo-panel-content { padding: var(--sn-space-4); font-size: var(--sn-text-sm); color: var(--sn-text-muted); }\n\n.demo-readout { margin-top: var(--sn-space-3); font-size: var(--sn-text-xs); color: var(--sn-text-subtle); }"
    }
  ],
  "splitter/codeNested": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-splitter layout=\"horizontal\" class=\"demo-splitter demo-splitter-tall\">\n  <sn-splitter-panel>\n    <div class=\"demo-panel-content demo-panel-content--sidebar\">Sidebar</div>\n  </sn-splitter-panel>\n  <sn-splitter-panel>\n    <sn-splitter layout=\"vertical\" style=\"height: 100%; border: none; border-radius: 0;\">\n      <sn-splitter-panel>\n        <div class=\"demo-panel-content\">Editor</div>\n      </sn-splitter-panel>\n      <sn-splitter-panel>\n        <div class=\"demo-panel-content\">Terminal</div>\n      </sn-splitter-panel>\n    </sn-splitter>\n  </sn-splitter-panel>\n</sn-splitter>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Splitter, SplitterPanel } from 'ashen-ui/splitter';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Splitter, SplitterPanel],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-splitter { height: 240px; }\n\n.demo-splitter-tall { height: 320px; }\n\n.demo-panel-content { padding: var(--sn-space-4); font-size: var(--sn-text-sm); color: var(--sn-text-muted); }\n\n.demo-panel-content--sidebar { background: var(--sn-surface-canvas); height: 100%; box-sizing: border-box; }"
    }
  ],
  "splitter/codeSnClass": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-splitter\n  [snClass]=\"{ gutter: 'demo-custom-gutter' }\"\n  class=\"demo-splitter\"\n>\n  <sn-splitter-panel [snClass]=\"{ root: 'demo-custom-panel' }\">Left</sn-splitter-panel>\n  <sn-splitter-panel>Right</sn-splitter-panel>\n</sn-splitter>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Splitter, SplitterPanel } from 'ashen-ui/splitter';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Splitter, SplitterPanel],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-splitter { height: 240px; }"
    }
  ],
  "stepper/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-stepper style=\"width: 100%\">\n  <sn-step label=\"Account\">\n    <p style=\"margin: 0; color: var(--sn-text-muted); font-size: var(--sn-text-sm);\">Account setup content goes here.</p>\n  </sn-step>\n  <sn-step label=\"Address\">\n    <p style=\"margin: 0; color: var(--sn-text-muted); font-size: var(--sn-text-sm);\">Shipping address content goes here.</p>\n  </sn-step>\n  <sn-step label=\"Confirm\">\n    <p style=\"margin: 0; color: var(--sn-text-muted); font-size: var(--sn-text-sm);\">Order confirmation content goes here.</p>\n  </sn-step>\n</sn-stepper>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Step, Stepper } from 'ashen-ui/stepper';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Step, Stepper],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "stepper/codeWithIcons": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-stepper style=\"width: 100%\">\n  <sn-step label=\"Account\" icon=\"person\">\n    <p style=\"margin: 0; color: var(--sn-text-muted); font-size: var(--sn-text-sm);\">Account content.</p>\n  </sn-step>\n  <sn-step label=\"Address\" icon=\"home\">\n    <p style=\"margin: 0; color: var(--sn-text-muted); font-size: var(--sn-text-sm);\">Address content.</p>\n  </sn-step>\n  <sn-step label=\"Confirm\" icon=\"check_circle\">\n    <p style=\"margin: 0; color: var(--sn-text-muted); font-size: var(--sn-text-sm);\">Confirm content.</p>\n  </sn-step>\n</sn-stepper>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Step, Stepper } from 'ashen-ui/stepper';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Step, Stepper],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "stepper/codeTwoWay": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div style=\"display: flex; flex-direction: column; gap: 12px; width: 100%;\">\n  <sn-stepper [(activeStep)]=\"activeStep\">\n    <sn-step label=\"Step 1\">\n      <p style=\"margin: 0; color: var(--sn-text-muted); font-size: var(--sn-text-sm);\">Step 1 content</p>\n    </sn-step>\n    <sn-step label=\"Step 2\">\n      <p style=\"margin: 0; color: var(--sn-text-muted); font-size: var(--sn-text-sm);\">Step 2 content</p>\n    </sn-step>\n    <sn-step label=\"Step 3\">\n      <p style=\"margin: 0; color: var(--sn-text-muted); font-size: var(--sn-text-sm);\">Step 3 content</p>\n    </sn-step>\n  </sn-stepper>\n  <div style=\"display: flex; gap: 8px;\">\n    <button\n      type=\"button\"\n      style=\"padding: 6px 14px; border-radius: var(--sn-radius-sm); border: 1px solid var(--sn-border); background: var(--sn-surface); color: var(--sn-text); cursor: pointer; font-size: var(--sn-text-sm);\"\n      [disabled]=\"activeStep() === 0\"\n      (click)=\"activeStep.set(activeStep() - 1)\"\n    >Previous</button>\n    <button\n      type=\"button\"\n      style=\"padding: 6px 14px; border-radius: var(--sn-radius-sm); border: 1px solid var(--sn-color-primary); background: var(--sn-color-primary); color: var(--sn-text-on-primary); cursor: pointer; font-size: var(--sn-text-sm);\"\n      [disabled]=\"activeStep() === 2\"\n      (click)=\"activeStep.set(activeStep() + 1)\"\n    >Next</button>\n  </div>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Step, Stepper } from 'ashen-ui/stepper';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Step, Stepper],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly activeStep = signal(0);\n}"
    }
  ],
  "stepper/codeLinear": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div style=\"display: flex; flex-direction: column; gap: 12px; width: 100%;\">\n  <sn-stepper [linear]=\"true\" [(activeStep)]=\"linearStep\">\n    <sn-step label=\"Type\">\n      <p style=\"margin: 0; color: var(--sn-text-muted); font-size: var(--sn-text-sm);\">Choose type content.</p>\n    </sn-step>\n    <sn-step label=\"Action\">\n      <p style=\"margin: 0; color: var(--sn-text-muted); font-size: var(--sn-text-sm);\">Configure action content.</p>\n    </sn-step>\n    <sn-step label=\"Appearance\">\n      <p style=\"margin: 0; color: var(--sn-text-muted); font-size: var(--sn-text-sm);\">Set appearance content.</p>\n    </sn-step>\n  </sn-stepper>\n  <div style=\"display: flex; gap: 8px;\">\n    <button\n      type=\"button\"\n      style=\"padding: 6px 14px; border-radius: var(--sn-radius-sm); border: 1px solid var(--sn-border); background: var(--sn-surface); color: var(--sn-text); cursor: pointer; font-size: var(--sn-text-sm);\"\n      [disabled]=\"linearStep() === 0\"\n      (click)=\"linearStep.set(linearStep() - 1)\"\n    >Back</button>\n    <button\n      type=\"button\"\n      style=\"padding: 6px 14px; border-radius: var(--sn-radius-sm); border: 1px solid var(--sn-color-primary); background: var(--sn-color-primary); color: var(--sn-text-on-primary); cursor: pointer; font-size: var(--sn-text-sm);\"\n      [disabled]=\"linearStep() === 2\"\n      (click)=\"linearStep.set(linearStep() + 1)\"\n    >Continue</button>\n  </div>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Step, Stepper } from 'ashen-ui/stepper';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Step, Stepper],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly activeStep = signal(0);\n\n  readonly linearStep = signal(0);\n}"
    }
  ],
  "stepper/codeVertical": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-stepper orientation=\"vertical\">\n  <sn-step label=\"Account\">\n    <p style=\"margin: 0; color: var(--sn-text-muted); font-size: var(--sn-text-sm);\">Account setup content.</p>\n  </sn-step>\n  <sn-step label=\"Address\">\n    <p style=\"margin: 0; color: var(--sn-text-muted); font-size: var(--sn-text-sm);\">Shipping address content.</p>\n  </sn-step>\n  <sn-step label=\"Confirm\">\n    <p style=\"margin: 0; color: var(--sn-text-muted); font-size: var(--sn-text-sm);\">Order confirmation content.</p>\n  </sn-step>\n</sn-stepper>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Step, Stepper } from 'ashen-ui/stepper';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Step, Stepper],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "stepper/codeDisabled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-stepper [activeStep]=\"1\" style=\"width: 100%\">\n  <sn-step label=\"Completed\" [completed]=\"true\">Step 1 content</sn-step>\n  <sn-step label=\"Active\">Step 2 content</sn-step>\n  <sn-step label=\"Disabled\" [disabled]=\"true\">Step 3 content</sn-step>\n</sn-stepper>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Step, Stepper } from 'ashen-ui/stepper';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Step, Stepper],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly activeStep = signal(0);\n}"
    }
  ],
  "stepper/codeSnClass": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-stepper snClass=\"my-stepper\" style=\"width: 100%\">\n  <sn-step label=\"Step 1\" [snClass]=\"{ header: 'my-header', label: 'my-label' }\">Content</sn-step>\n  <sn-step label=\"Step 2\">Content</sn-step>\n</sn-stepper>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Step, Stepper } from 'ashen-ui/stepper';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Step, Stepper],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "tab-nav/codeRouter": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<nav snTabNav class=\"demo-tab-nav\" aria-label=\"Settings sections\">\n  <a snTabLink [routerLink]=\"[]\" [queryParams]=\"{}\" routerLinkActive [routerLinkActiveOptions]=\"{ exact: true }\">General</a>\n  <a snTabLink [routerLink]=\"[]\" [queryParams]=\"{ section: 'appearance' }\" routerLinkActive [routerLinkActiveOptions]=\"{ exact: true }\">Appearance</a>\n  <a snTabLink [routerLink]=\"[]\" [queryParams]=\"{ section: 'notifications' }\" routerLinkActive [routerLinkActiveOptions]=\"{ exact: true }\">Notifications</a>\n</nav>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { TabLink, TabNav } from 'ashen-ui/tab-nav';\n\n@Component({\n  selector: 'app-demo',\n  imports: [TabLink, TabNav],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly sections = ['General', 'Appearance', 'Notifications'];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-tab-nav { max-width: 480px; }"
    }
  ],
  "tab-nav/codeButtons": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<nav snTabNav class=\"demo-tab-nav\" aria-label=\"Settings sections\">\n  @for (section of sections; track section) {\n    <button type=\"button\" snTabLink [active]=\"selectedSection() === section\" (click)=\"selectedSection.set(section)\">\n      {{ section }}\n    </button>\n  }\n</nav>\n<p class=\"demo-readout\">Selected: {{ selectedSection() }}</p>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { TabLink, TabNav } from 'ashen-ui/tab-nav';\n\n@Component({\n  selector: 'app-demo',\n  imports: [TabLink, TabNav],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly sections = ['General', 'Appearance', 'Notifications'];\n\n  readonly selectedSection = signal('General');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-tab-nav { max-width: 480px; }\n\n.demo-readout { margin-top: var(--sn-space-3); font-size: var(--sn-text-xs); color: var(--sn-text-subtle); }"
    }
  ],
  "tab-nav/codeWithIcons": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<nav snTabNav class=\"demo-tab-nav\" aria-label=\"Library\">\n  @for (tab of iconTabs; track tab.label) {\n    <button type=\"button\" snTabLink [active]=\"selectedIconTab() === tab.label\" (click)=\"selectedIconTab.set(tab.label)\">\n      <sn-icon>{{ tab.icon }}</sn-icon>\n      {{ tab.label }}\n    </button>\n  }\n</nav>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Icon } from 'ashen-ui/icon';\nimport { TabLink, TabNav } from 'ashen-ui/tab-nav';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Icon, TabLink, TabNav],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly iconTabs = [\n    { label: 'Files', icon: 'folder' },\n    { label: 'Shared', icon: 'group' },\n    { label: 'Recent', icon: 'schedule' },\n  ];\n\n  readonly selectedIconTab = signal('Files');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-tab-nav { max-width: 480px; }"
    }
  ],
  "tab-nav/codeScrolling": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<nav snTabNav class=\"demo-tab-nav-narrow\" aria-label=\"Workspace settings\">\n  @for (link of manyLinks; track link) {\n    <button type=\"button\" snTabLink [active]=\"selectedManyLink() === link\" (click)=\"selectedManyLink.set(link)\">\n      {{ link }}\n    </button>\n  }\n</nav>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { TabLink, TabNav } from 'ashen-ui/tab-nav';\n\n@Component({\n  selector: 'app-demo',\n  imports: [TabLink, TabNav],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly manyLinks = [\n    'Overview',\n    'Appearance',\n    'Notifications',\n    'Integrations',\n    'Billing',\n    'Members',\n    'Security',\n    'Advanced',\n  ];\n\n  readonly selectedManyLink = signal('Overview');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": "/* Narrow enough that eight links cannot fit, which is the point of the demo. */\n.demo-tab-nav-narrow { max-width: 22rem; }"
    }
  ],
  "tab-nav/codeVertical": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<nav snTabNav orientation=\"vertical\" class=\"demo-tab-nav-side\" aria-label=\"Account settings\">\n  @for (page of settingsPages; track page) {\n    <button type=\"button\" snTabLink [active]=\"selectedSettingsPage() === page\" (click)=\"selectedSettingsPage.set(page)\">\n      {{ page }}\n    </button>\n  }\n</nav>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { TabLink, TabNav } from 'ashen-ui/tab-nav';\n\n@Component({\n  selector: 'app-demo',\n  imports: [TabLink, TabNav],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly settingsPages = ['Profile', 'Account', 'Privacy', 'Devices'];\n\n  readonly selectedSettingsPage = signal('Profile');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-tab-nav-side { max-width: 14rem; }"
    }
  ],
  "tab-nav/codeReskin": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<nav snTabNav class=\"demo-tab-nav demo-tab-nav-reskin\" aria-label=\"Reports\">\n  <button type=\"button\" snTabLink [active]=\"true\">Daily</button>\n  <button type=\"button\" snTabLink>Weekly</button>\n  <button type=\"button\" snTabLink>Monthly</button>\n</nav>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { TabLink, TabNav } from 'ashen-ui/tab-nav';\n\n@Component({\n  selector: 'app-demo',\n  imports: [TabLink, TabNav],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-tab-nav { max-width: 480px; }\n\n.demo-tab-nav-reskin { --sn-color-primary: var(--sn-color-success); }\n\n.demo-tab-nav-reskin [snTabLink] {\n  --sn-tab-link-padding: 10px 18px;\n  --sn-tab-link-color: var(--sn-text-subtle);\n}"
    }
  ],
  "table/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-table-wrapper\">\n  <sn-table [value]=\"files\" caption=\"Project files\">\n    <sn-column field=\"name\" header=\"Name\" />\n    <sn-column field=\"size\" header=\"Size (B)\" align=\"right\" width=\"100px\" />\n    <sn-column field=\"modified\" header=\"Modified\" />\n  </sn-table>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Table, TableColumn } from 'ashen-ui/table';\n\ninterface FileRow {\n  name: string;\n  size: number;\n  type: string;\n  modified: string;\n}\n\n@Component({\n  selector: 'app-demo',\n  imports: [Table, TableColumn],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly files: FileRow[] = [\n    { name: 'dashboard.ts', size: 4200, type: 'source', modified: '2026-07-10' },\n    { name: 'styles.css', size: 980, type: 'style', modified: '2026-07-08' },\n    { name: 'README.md', size: 1540, type: 'doc', modified: '2026-07-01' },\n    { name: 'angular.json', size: 12300, type: 'config', modified: '2026-06-20' },\n    { name: 'main.ts', size: 320, type: 'source', modified: '2026-07-12' },\n  ];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-table-wrapper {\n  width: 100%;\n}"
    }
  ],
  "table/codeServerPagination": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-table-wrapper\">\n  <sn-table\n    #serverTable\n    server\n    [value]=\"serverRows()\"\n    [totalRecords]=\"files.length\"\n    [(page)]=\"serverPage\"\n    [(pageSize)]=\"serverPageSize\"\n    (load)=\"onServerLoad($event)\"\n  >\n    <sn-column field=\"name\" header=\"Name\" sortable />\n    <sn-column field=\"size\" header=\"Size (B)\" align=\"right\" sortable />\n    <sn-column field=\"modified\" header=\"Modified\" sortable />\n  </sn-table>\n  <sn-paginator\n    [page]=\"serverPage()\"\n    [totalRecords]=\"files.length\"\n    [rows]=\"serverPageSize() ?? 2\"\n    [rowsPerPageOptions]=\"[2, 3, 5]\"\n    (pageChange)=\"serverTable.paginate($event)\"\n  />\n  @if (serverRequest()) {\n    <p class=\"demo-note\">Request: {{ serverRequest() }}</p>\n  }\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Paginator } from 'ashen-ui/paginator';\nimport { Table, TableColumn, TableLoadEvent } from 'ashen-ui/table';\n\ninterface FileRow {\n  name: string;\n  size: number;\n  type: string;\n  modified: string;\n}\n\n@Component({\n  selector: 'app-demo',\n  imports: [Paginator, Table, TableColumn],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly files: FileRow[] = [\n    { name: 'dashboard.ts', size: 4200, type: 'source', modified: '2026-07-10' },\n    { name: 'styles.css', size: 980, type: 'style', modified: '2026-07-08' },\n    { name: 'README.md', size: 1540, type: 'doc', modified: '2026-07-01' },\n    { name: 'angular.json', size: 12300, type: 'config', modified: '2026-06-20' },\n    { name: 'main.ts', size: 320, type: 'source', modified: '2026-07-12' },\n  ];\n\n  readonly serverRows = signal<FileRow[]>(this.files.slice(0, 2));\n\n  readonly serverPage = signal(0);\n\n  readonly serverPageSize = signal<number | undefined>(2);\n\n  readonly serverRequest = signal('');\n\n  onServerLoad(event: TableLoadEvent): void {\n    const rows = [...this.files];\n    if (event.sortField && event.sortOrder) {\n      const direction = event.sortOrder === 'asc' ? 1 : -1;\n      rows.sort((left, right) =>\n        String(left[event.sortField as keyof FileRow]).localeCompare(\n          String(right[event.sortField as keyof FileRow]),\n          undefined,\n          { numeric: true },\n        ) * direction,\n      );\n    }\n    this.serverRows.set(rows.slice(event.first, event.first + event.rows));\n    this.serverRequest.set(JSON.stringify(event));\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-table-wrapper {\n  width: 100%;\n}\n\n.demo-note {\n  margin-top: 8px;\n  font-size: var(--sn-text-sm);\n  color: var(--sn-text-muted);\n}"
    }
  ],
  "table/codeSortable": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-table-wrapper\">\n  <sn-table [value]=\"files\" (sortChange)=\"onSortChange($event)\">\n    <sn-column field=\"name\" header=\"Name\" [sortable]=\"true\" />\n    <sn-column field=\"size\" header=\"Size (B)\" align=\"right\" width=\"100px\" [sortable]=\"true\" />\n    <sn-column field=\"modified\" header=\"Modified\" [sortable]=\"true\" />\n  </sn-table>\n  @if (sortChanges()) {\n    <p class=\"demo-note\">Sort: {{ sortChanges() }}</p>\n  }\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Table, TableColumn } from 'ashen-ui/table';\n\ninterface FileRow {\n  name: string;\n  size: number;\n  type: string;\n  modified: string;\n}\n\n@Component({\n  selector: 'app-demo',\n  imports: [Table, TableColumn],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly files: FileRow[] = [\n    { name: 'dashboard.ts', size: 4200, type: 'source', modified: '2026-07-10' },\n    { name: 'styles.css', size: 980, type: 'style', modified: '2026-07-08' },\n    { name: 'README.md', size: 1540, type: 'doc', modified: '2026-07-01' },\n    { name: 'angular.json', size: 12300, type: 'config', modified: '2026-06-20' },\n    { name: 'main.ts', size: 320, type: 'source', modified: '2026-07-12' },\n  ];\n\n  readonly sortChanges = signal<string>('');\n\n  onSortChange(event: { field: string | null; order: 'asc' | 'desc' | null }): void {\n    this.sortChanges.set(event.field ? `${event.field} ${event.order}` : 'none');\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-table-wrapper {\n  width: 100%;\n}\n\n.demo-note {\n  margin-top: 8px;\n  font-size: var(--sn-text-sm);\n  color: var(--sn-text-muted);\n}"
    }
  ],
  "table/codeStriped": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-table-wrapper\">\n  <sn-table [value]=\"files\" [striped]=\"true\">\n    <sn-column field=\"name\" header=\"Name\" />\n    <sn-column field=\"type\" header=\"Type\">\n      <ng-template snCellDef let-row>\n        <sn-tag [value]=\"row.type\" />\n      </ng-template>\n    </sn-column>\n    <sn-column field=\"modified\" header=\"Modified\" />\n  </sn-table>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Table, TableCellDef, TableColumn } from 'ashen-ui/table';\nimport { Tag } from 'ashen-ui/tag';\n\ninterface FileRow {\n  name: string;\n  size: number;\n  type: string;\n  modified: string;\n}\n\n@Component({\n  selector: 'app-demo',\n  imports: [Table, TableCellDef, TableColumn, Tag],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly files: FileRow[] = [\n    { name: 'dashboard.ts', size: 4200, type: 'source', modified: '2026-07-10' },\n    { name: 'styles.css', size: 980, type: 'style', modified: '2026-07-08' },\n    { name: 'README.md', size: 1540, type: 'doc', modified: '2026-07-01' },\n    { name: 'angular.json', size: 12300, type: 'config', modified: '2026-06-20' },\n    { name: 'main.ts', size: 320, type: 'source', modified: '2026-07-12' },\n  ];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-table-wrapper {\n  width: 100%;\n}"
    }
  ],
  "table/codeSelectable": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-table-wrapper\">\n  <sn-table [value]=\"files\" [selectable]=\"true\" [(selectedIndex)]=\"selectedIndex\">\n    <sn-column field=\"name\" header=\"Name\" />\n    <sn-column field=\"size\" header=\"Size (B)\" align=\"right\" width=\"100px\" />\n    <sn-column field=\"modified\" header=\"Modified\" />\n  </sn-table>\n  @if (selectedIndex() !== null) {\n    <p class=\"demo-note\">Selected: {{ files[selectedIndex()!].name }}</p>\n  }\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Table, TableColumn } from 'ashen-ui/table';\n\ninterface FileRow {\n  name: string;\n  size: number;\n  type: string;\n  modified: string;\n}\n\n@Component({\n  selector: 'app-demo',\n  imports: [Table, TableColumn],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly files: FileRow[] = [\n    { name: 'dashboard.ts', size: 4200, type: 'source', modified: '2026-07-10' },\n    { name: 'styles.css', size: 980, type: 'style', modified: '2026-07-08' },\n    { name: 'README.md', size: 1540, type: 'doc', modified: '2026-07-01' },\n    { name: 'angular.json', size: 12300, type: 'config', modified: '2026-06-20' },\n    { name: 'main.ts', size: 320, type: 'source', modified: '2026-07-12' },\n  ];\n\n  readonly selectedIndex = signal<number | null>(null);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-table-wrapper {\n  width: 100%;\n}\n\n.demo-note {\n  margin-top: 8px;\n  font-size: var(--sn-text-sm);\n  color: var(--sn-text-muted);\n}"
    }
  ],
  "table/codeEmpty": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-table-wrapper\">\n  <sn-table [value]=\"[]\">\n    <sn-column field=\"name\" header=\"Name\" />\n    <sn-column field=\"size\" header=\"Size (B)\" />\n  </sn-table>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Table, TableColumn } from 'ashen-ui/table';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Table, TableColumn],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-table-wrapper {\n  width: 100%;\n}"
    }
  ],
  "table/codeMultiSelect": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-table-wrapper\">\n  <sn-table [value]=\"files\" selectionMode=\"multiple\" [(selection)]=\"multiSelection\">\n    <sn-column field=\"name\" header=\"Name\" />\n    <sn-column field=\"size\" header=\"Size (B)\" align=\"right\" width=\"100px\" />\n    <sn-column field=\"modified\" header=\"Modified\" />\n  </sn-table>\n  <p class=\"demo-note\">{{ multiSelection().length }} selected</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Table, TableColumn } from 'ashen-ui/table';\n\ninterface FileRow {\n  name: string;\n  size: number;\n  type: string;\n  modified: string;\n}\n\n@Component({\n  selector: 'app-demo',\n  imports: [Table, TableColumn],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly files: FileRow[] = [\n    { name: 'dashboard.ts', size: 4200, type: 'source', modified: '2026-07-10' },\n    { name: 'styles.css', size: 980, type: 'style', modified: '2026-07-08' },\n    { name: 'README.md', size: 1540, type: 'doc', modified: '2026-07-01' },\n    { name: 'angular.json', size: 12300, type: 'config', modified: '2026-06-20' },\n    { name: 'main.ts', size: 320, type: 'source', modified: '2026-07-12' },\n  ];\n\n  readonly multiSelection = signal<FileRow[]>([]);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-table-wrapper {\n  width: 100%;\n}\n\n.demo-note {\n  margin-top: 8px;\n  font-size: var(--sn-text-sm);\n  color: var(--sn-text-muted);\n}"
    }
  ],
  "table/codeSingleSelect": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-table-wrapper\">\n  <sn-table [value]=\"files\" selectionMode=\"single\" [(selection)]=\"singleSelection\">\n    <sn-column field=\"name\" header=\"Name\" />\n    <sn-column field=\"size\" header=\"Size (B)\" align=\"right\" width=\"100px\" />\n    <sn-column field=\"modified\" header=\"Modified\" />\n  </sn-table>\n  @if (singleSelection().length) {\n    <p class=\"demo-note\">Selected: {{ singleSelection()[0].name }}</p>\n  }\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Table, TableColumn } from 'ashen-ui/table';\n\ninterface FileRow {\n  name: string;\n  size: number;\n  type: string;\n  modified: string;\n}\n\n@Component({\n  selector: 'app-demo',\n  imports: [Table, TableColumn],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly files: FileRow[] = [\n    { name: 'dashboard.ts', size: 4200, type: 'source', modified: '2026-07-10' },\n    { name: 'styles.css', size: 980, type: 'style', modified: '2026-07-08' },\n    { name: 'README.md', size: 1540, type: 'doc', modified: '2026-07-01' },\n    { name: 'angular.json', size: 12300, type: 'config', modified: '2026-06-20' },\n    { name: 'main.ts', size: 320, type: 'source', modified: '2026-07-12' },\n  ];\n\n  readonly singleSelection = signal<FileRow[]>([]);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-table-wrapper {\n  width: 100%;\n}\n\n.demo-note {\n  margin-top: 8px;\n  font-size: var(--sn-text-sm);\n  color: var(--sn-text-muted);\n}"
    }
  ],
  "table/codeExpansion": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-table-wrapper\">\n  <sn-table [value]=\"files\" [(expandedKeys)]=\"expandedKeys\" expandRowOnClick (rowExpand)=\"onRowExpand($event)\">\n    <sn-column field=\"name\" header=\"Name\" />\n    <sn-column field=\"size\" header=\"Size (B)\" align=\"right\" width=\"100px\" />\n    <sn-column field=\"modified\" header=\"Modified\" />\n    <ng-template snExpansionDef let-row>\n      <div style=\"padding: 12px 16px\">\n        <strong>{{ row.name }}</strong> &mdash; {{ row.size }} bytes, last modified {{ row.modified }}\n      </div>\n    </ng-template>\n  </sn-table>\n  @if (rowExpandEvents()) {\n    <p class=\"demo-note\">Last event: {{ rowExpandEvents() }}</p>\n  }\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Table, TableColumn, TableExpansionDef } from 'ashen-ui/table';\n\ninterface FileRow {\n  name: string;\n  size: number;\n  type: string;\n  modified: string;\n}\n\n@Component({\n  selector: 'app-demo',\n  imports: [Table, TableColumn, TableExpansionDef],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly files: FileRow[] = [\n    { name: 'dashboard.ts', size: 4200, type: 'source', modified: '2026-07-10' },\n    { name: 'styles.css', size: 980, type: 'style', modified: '2026-07-08' },\n    { name: 'README.md', size: 1540, type: 'doc', modified: '2026-07-01' },\n    { name: 'angular.json', size: 12300, type: 'config', modified: '2026-06-20' },\n    { name: 'main.ts', size: 320, type: 'source', modified: '2026-07-12' },\n  ];\n\n  readonly expandedKeys = signal<unknown[]>([]);\n\n  readonly rowExpandEvents = signal<string>('');\n\n  onRowExpand(e: { row: FileRow; expanded: boolean }): void {\n    this.rowExpandEvents.set(`${e.row.name}: ${e.expanded ? 'expanded' : 'collapsed'}`);\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-table-wrapper {\n  width: 100%;\n}\n\n.demo-note {\n  margin-top: 8px;\n  font-size: var(--sn-text-sm);\n  color: var(--sn-text-muted);\n}"
    }
  ],
  "table/codeActions": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-table-wrapper\">\n  <sn-table [value]=\"files\">\n    <sn-column field=\"name\" header=\"Name\" />\n    <sn-column field=\"modified\" header=\"Modified\" />\n    <sn-column type=\"actions\" header=\"Actions\">\n      <ng-template snCellDef let-row>\n        <button snButton variant=\"icon\" size=\"sm\" aria-label=\"Edit\"><sn-icon>edit</sn-icon></button>\n        <button snButton variant=\"icon\" size=\"sm\" aria-label=\"Delete\"><sn-icon>delete</sn-icon></button>\n      </ng-template>\n    </sn-column>\n  </sn-table>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Icon } from 'ashen-ui/icon';\nimport { Table, TableCellDef, TableColumn } from 'ashen-ui/table';\n\ninterface FileRow {\n  name: string;\n  size: number;\n  type: string;\n  modified: string;\n}\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Icon, Table, TableCellDef, TableColumn],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly files: FileRow[] = [\n    { name: 'dashboard.ts', size: 4200, type: 'source', modified: '2026-07-10' },\n    { name: 'styles.css', size: 980, type: 'style', modified: '2026-07-08' },\n    { name: 'README.md', size: 1540, type: 'doc', modified: '2026-07-01' },\n    { name: 'angular.json', size: 12300, type: 'config', modified: '2026-06-20' },\n    { name: 'main.ts', size: 320, type: 'source', modified: '2026-07-12' },\n  ];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-table-wrapper {\n  width: 100%;\n}"
    }
  ],
  "table/codeSticky": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-table-wrapper\">\n  <sn-table [value]=\"files\" stickyHeader scrollHeight=\"300px\">\n    <sn-column field=\"name\" header=\"Name\" sticky=\"start\" width=\"120px\" />\n    <sn-column field=\"size\" header=\"Size (B)\" align=\"right\" width=\"120px\" />\n    <sn-column field=\"type\" header=\"Type\" width=\"120px\" />\n    <sn-column field=\"modified\" header=\"Modified\" width=\"160px\" />\n  </sn-table>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Table, TableColumn } from 'ashen-ui/table';\n\ninterface FileRow {\n  name: string;\n  size: number;\n  type: string;\n  modified: string;\n}\n\n@Component({\n  selector: 'app-demo',\n  imports: [Table, TableColumn],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly files: FileRow[] = [\n    { name: 'dashboard.ts', size: 4200, type: 'source', modified: '2026-07-10' },\n    { name: 'styles.css', size: 980, type: 'style', modified: '2026-07-08' },\n    { name: 'README.md', size: 1540, type: 'doc', modified: '2026-07-01' },\n    { name: 'angular.json', size: 12300, type: 'config', modified: '2026-06-20' },\n    { name: 'main.ts', size: 320, type: 'source', modified: '2026-07-12' },\n  ];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-table-wrapper {\n  width: 100%;\n}"
    }
  ],
  "table/codeResponsive": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-table-narrow\">\n  <sn-table [value]=\"files\" responsive>\n    <sn-column field=\"name\" header=\"Name\" width=\"160px\" />\n    <sn-column field=\"size\" header=\"Size (B)\" align=\"right\" width=\"140px\" />\n    <sn-column field=\"type\" header=\"Type\" width=\"160px\" />\n    <sn-column field=\"modified\" header=\"Modified\" width=\"200px\" />\n  </sn-table>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Table, TableColumn } from 'ashen-ui/table';\n\ninterface FileRow {\n  name: string;\n  size: number;\n  type: string;\n  modified: string;\n}\n\n@Component({\n  selector: 'app-demo',\n  imports: [Table, TableColumn],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly files: FileRow[] = [\n    { name: 'dashboard.ts', size: 4200, type: 'source', modified: '2026-07-10' },\n    { name: 'styles.css', size: 980, type: 'style', modified: '2026-07-08' },\n    { name: 'README.md', size: 1540, type: 'doc', modified: '2026-07-01' },\n    { name: 'angular.json', size: 12300, type: 'config', modified: '2026-06-20' },\n    { name: 'main.ts', size: 320, type: 'source', modified: '2026-07-12' },\n  ];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": "/* Constrained box to demonstrate the table's horizontal scroll. */\n.demo-table-narrow {\n  max-width: 420px;\n  width: 100%;\n}"
    }
  ],
  "table/codePagination": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-table-wrapper\">\n  <sn-table [value]=\"files\" [page]=\"tablePageSignal()\" [pageSize]=\"paginatorPageSize()\">\n    <sn-column field=\"name\" header=\"Name\" />\n    <sn-column field=\"size\" header=\"Size (B)\" align=\"right\" width=\"100px\" />\n    <sn-column field=\"modified\" header=\"Modified\" />\n  </sn-table>\n  <sn-paginator\n    [page]=\"tablePageSignal()\"\n    [totalRecords]=\"files.length\"\n    [rows]=\"paginatorPageSize()\"\n    [rowsPerPageOptions]=\"[2, 3, 5]\"\n    (pageChange)=\"onPaginatorChange($event)\"\n  />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { PageChangeEvent, Paginator } from 'ashen-ui/paginator';\nimport { Table, TableColumn } from 'ashen-ui/table';\n\ninterface FileRow {\n  name: string;\n  size: number;\n  type: string;\n  modified: string;\n}\n\n@Component({\n  selector: 'app-demo',\n  imports: [Paginator, Table, TableColumn],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly files: FileRow[] = [\n    { name: 'dashboard.ts', size: 4200, type: 'source', modified: '2026-07-10' },\n    { name: 'styles.css', size: 980, type: 'style', modified: '2026-07-08' },\n    { name: 'README.md', size: 1540, type: 'doc', modified: '2026-07-01' },\n    { name: 'angular.json', size: 12300, type: 'config', modified: '2026-06-20' },\n    { name: 'main.ts', size: 320, type: 'source', modified: '2026-07-12' },\n  ];\n\n  readonly tablePageSignal = signal(0);\n\n  readonly paginatorPageSize = signal(2);\n\n  onPaginatorChange(e: PageChangeEvent): void {\n    this.tablePageSignal.set(e.page);\n    this.paginatorPageSize.set(e.rows);\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-table-wrapper {\n  width: 100%;\n}"
    }
  ],
  "table/codeVirtual": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-table-wrapper\">\n  <sn-table [value]=\"virtualRows\" virtual [rowHeight]=\"40\" scrollHeight=\"400px\">\n    <sn-column field=\"id\" header=\"ID\" width=\"80px\" align=\"right\" />\n    <sn-column field=\"name\" header=\"Name\" />\n    <sn-column field=\"value\" header=\"Value\" align=\"right\" width=\"100px\" />\n  </sn-table>\n  <p class=\"demo-note\">10 000 rows - only a window of rows is rendered at a time.</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Table, TableColumn } from 'ashen-ui/table';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Table, TableColumn],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly virtualRows = Array.from({ length: 10000 }, (_, i) => ({\n    id: i,\n    name: `Row ${i}`,\n    value: Math.round(Math.random() * 1000),\n  }));\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-table-wrapper {\n  width: 100%;\n}\n\n.demo-note {\n  margin-top: 8px;\n  font-size: var(--sn-text-sm);\n  color: var(--sn-text-muted);\n}"
    }
  ],
  "table/codeInfinite": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-table-wrapper\">\n  <sn-table\n    [value]=\"infiniteRows()\"\n    [hasMore]=\"hasMore()\"\n    [loadMoreThreshold]=\"5\"\n    (loadMore)=\"onLoadMore($event)\"\n    scrollHeight=\"320px\">\n    <sn-column field=\"id\" header=\"ID\" width=\"80px\" align=\"right\" />\n    <sn-column field=\"name\" header=\"Name\" />\n    <sn-column field=\"score\" header=\"Score\" align=\"right\" width=\"100px\" />\n  </sn-table>\n  <p class=\"demo-note\">{{ loadedCount() }} rows loaded{{ hasMore() ? ' - scroll to load more' : ' - all loaded' }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Table, TableColumn } from 'ashen-ui/table';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Table, TableColumn],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly loadedCount = signal(50);\n\n  readonly hasMore = signal(true);\n\n  readonly infiniteRows = signal(\n    Array.from({ length: 50 }, (_, i) => ({ id: i, name: `Item ${i}`, score: i * 2 })),\n  );\n\n  onLoadMore(_e: { lastIndex: number }): void {\n    const current = this.loadedCount();\n    if (current >= 500) {\n      this.hasMore.set(false);\n      return;\n    }\n    const next = Math.min(current + 50, 500);\n    this.infiniteRows.set(\n      Array.from({ length: next }, (_, i) => ({ id: i, name: `Item ${i}`, score: i * 2 })),\n    );\n    this.loadedCount.set(next);\n    if (next >= 500) this.hasMore.set(false);\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-table-wrapper {\n  width: 100%;\n}\n\n.demo-note {\n  margin-top: 8px;\n  font-size: var(--sn-text-sm);\n  color: var(--sn-text-muted);\n}"
    }
  ],
  "table/codeRowReorder": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-table-wrapper\">\n  <sn-table [(value)]=\"reorderRows\" rowReorder (rowReordered)=\"onRowReordered($event)\">\n    <sn-column field=\"name\" header=\"Name\" />\n    <sn-column field=\"priority\" header=\"Priority\" />\n  </sn-table>\n  @if (lastReorderEvent()) {\n    <p class=\"demo-note\">{{ lastReorderEvent() }}</p>\n  }\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Table, TableColumn, TableRowReorderEvent } from 'ashen-ui/table';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Table, TableColumn],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly reorderRows = signal([\n    { id: 1, name: 'Alpha', priority: 'High' },\n    { id: 2, name: 'Beta', priority: 'Medium' },\n    { id: 3, name: 'Gamma', priority: 'Low' },\n    { id: 4, name: 'Delta', priority: 'High' },\n    { id: 5, name: 'Epsilon', priority: 'Medium' },\n  ]);\n\n  readonly lastReorderEvent = signal<string>('');\n\n  onRowReordered(e: TableRowReorderEvent<{ name: string }>): void {\n    this.lastReorderEvent.set(`\"${e.row.name}\" moved: index ${e.previousIndex} → ${e.currentIndex}`);\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-table-wrapper {\n  width: 100%;\n}\n\n.demo-note {\n  margin-top: 8px;\n  font-size: var(--sn-text-sm);\n  color: var(--sn-text-muted);\n}"
    }
  ],
  "table/codeColumnReorder": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-table-wrapper\">\n  <sn-table [value]=\"columnReorderRows\" columnReorder (columnReordered)=\"onColumnReordered($event)\">\n    <sn-column field=\"name\" header=\"Name\" />\n    <sn-column field=\"dept\" header=\"Dept\" />\n    <sn-column field=\"level\" header=\"Level\" />\n    <sn-column field=\"location\" header=\"Location\" />\n  </sn-table>\n  @if (lastColumnReorderEvent()) {\n    <p class=\"demo-note\">{{ lastColumnReorderEvent() }}</p>\n  }\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Table, TableColumn } from 'ashen-ui/table';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Table, TableColumn],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly columnReorderRows = [\n    { name: 'Alice', dept: 'Engineering', level: 'Senior', location: 'Remote' },\n    { name: 'Bob', dept: 'Design', level: 'Mid', location: 'Office' },\n    { name: 'Charlie', dept: 'QA', level: 'Junior', location: 'Remote' },\n    { name: 'Diana', dept: 'Product', level: 'Lead', location: 'Office' },\n  ];\n\n  readonly lastColumnReorderEvent = signal<string>('');\n\n  onColumnReordered(e: { previousIndex: number; currentIndex: number }): void {\n    this.lastColumnReorderEvent.set(`Column moved: index ${e.previousIndex} → ${e.currentIndex}`);\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-table-wrapper {\n  width: 100%;\n}\n\n.demo-note {\n  margin-top: 8px;\n  font-size: var(--sn-text-sm);\n  color: var(--sn-text-muted);\n}"
    }
  ],
  "table/codeFlex": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-table-wrapper\">\n  <sn-table [value]=\"files\" layout=\"flex\">\n    <sn-column field=\"name\" header=\"Name\" />\n    <sn-column field=\"size\" header=\"Size (B)\" align=\"right\" width=\"100px\" />\n    <sn-column field=\"modified\" header=\"Modified\" />\n  </sn-table>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Table, TableColumn } from 'ashen-ui/table';\n\ninterface FileRow {\n  name: string;\n  size: number;\n  type: string;\n  modified: string;\n}\n\n@Component({\n  selector: 'app-demo',\n  imports: [Table, TableColumn],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly files: FileRow[] = [\n    { name: 'dashboard.ts', size: 4200, type: 'source', modified: '2026-07-10' },\n    { name: 'styles.css', size: 980, type: 'style', modified: '2026-07-08' },\n    { name: 'README.md', size: 1540, type: 'doc', modified: '2026-07-01' },\n    { name: 'angular.json', size: 12300, type: 'config', modified: '2026-06-20' },\n    { name: 'main.ts', size: 320, type: 'source', modified: '2026-07-12' },\n  ];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-table-wrapper {\n  width: 100%;\n}"
    }
  ],
  "table/codeDirective": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-table-wrapper\">\n  <table snTable [striped]=\"true\" snTableSort (snSortChange)=\"onDirectiveSort($event)\">\n    <thead>\n      <tr>\n        <th snSortHeader=\"name\">Name</th>\n        <th snSortHeader=\"dept\">Dept</th>\n      </tr>\n    </thead>\n    <tbody>\n      @for (row of directiveRows; track row.name) {\n        <tr>\n          <td>{{ row.name }}</td>\n          <td>{{ row.dept }}</td>\n        </tr>\n      }\n    </tbody>\n  </table>\n  @if (directiveSortState()) {\n    <p class=\"demo-note\">Sort: {{ directiveSortState() }}</p>\n  }\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { TableSort, TableSortHeader, TableStyle } from 'ashen-ui/table';\n\n@Component({\n  selector: 'app-demo',\n  imports: [TableSort, TableSortHeader, TableStyle],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly directiveRows = [\n    { name: 'Alice', dept: 'Eng' },\n    { name: 'Bob', dept: 'Design' },\n    { name: 'Charlie', dept: 'QA' },\n  ];\n\n  readonly directiveSortState = signal<string>('');\n\n  onDirectiveSort(e: { field: string | null; order: string | null }): void {\n    this.directiveSortState.set(e.field ? `${e.field} ${e.order}` : 'none');\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-table-wrapper {\n  width: 100%;\n}\n\n.demo-note {\n  margin-top: 8px;\n  font-size: var(--sn-text-sm);\n  color: var(--sn-text-muted);\n}"
    }
  ],
  "tabs/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-tabs\">\n  <sn-tabs>\n    <sn-tab label=\"General\">\n      Name, type, position, and size of the tile.\n    </sn-tab>\n    <sn-tab label=\"Appearance\">\n      Icon, colors, and opacity.\n    </sn-tab>\n    <sn-tab label=\"Options\">\n      Zoom effect and color feedback.\n    </sn-tab>\n  </sn-tabs>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Tab, Tabs } from 'ashen-ui/tabs';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Tab, Tabs],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-tabs { max-width: 480px; }"
    }
  ],
  "tabs/codeWithIcons": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-tabs\">\n  <sn-tabs>\n    <sn-tab label=\"General\" icon=\"tune\">\n      Name, type, position, and size of the tile.\n    </sn-tab>\n    <sn-tab label=\"Appearance\" icon=\"palette\">\n      Icon, colors, and opacity.\n    </sn-tab>\n    <sn-tab label=\"Options\" icon=\"touch_app\">\n      Zoom effect and color feedback.\n    </sn-tab>\n  </sn-tabs>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Tab, Tabs } from 'ashen-ui/tabs';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Tab, Tabs],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-tabs { max-width: 480px; }"
    }
  ],
  "tabs/codeWithDisabled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-tabs\">\n  <sn-tabs>\n    <sn-tab label=\"General\" icon=\"tune\">\n      Name, type, position, and size of the tile.\n    </sn-tab>\n    <sn-tab label=\"Appearance\" icon=\"palette\" [disabled]=\"true\">\n      This tab is disabled.\n    </sn-tab>\n    <sn-tab label=\"Options\" icon=\"touch_app\">\n      Zoom effect and color feedback.\n    </sn-tab>\n  </sn-tabs>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Tab, Tabs } from 'ashen-ui/tabs';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Tab, Tabs],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-tabs { max-width: 480px; }"
    }
  ],
  "tabs/codeControlled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-tabs\">\n  <sn-tabs [(selectedIndex)]=\"controlledIndex\">\n    <sn-tab label=\"General\">General settings content.</sn-tab>\n    <sn-tab label=\"Appearance\">Visual settings content.</sn-tab>\n    <sn-tab label=\"Options\">Advanced options content.</sn-tab>\n  </sn-tabs>\n  <p class=\"demo-readout\">Active tab index: {{ controlledIndex() }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Tab, Tabs } from 'ashen-ui/tabs';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Tab, Tabs],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly controlledIndex = signal(0);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-tabs { max-width: 480px; }\n\n.demo-readout { margin-top: var(--sn-space-3); font-size: var(--sn-text-xs); color: var(--sn-text-subtle); }"
    }
  ],
  "tabs/codeValue": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-tabs\">\n  <sn-tabs [(value)]=\"controlledValue\">\n    <sn-tab label=\"General\" value=\"general\">General settings content.</sn-tab>\n    <sn-tab label=\"Appearance\" value=\"appearance\">Visual settings content.</sn-tab>\n    <sn-tab label=\"Options\" value=\"options\">Advanced options content.</sn-tab>\n  </sn-tabs>\n  <p class=\"demo-readout\">Active tab value: {{ controlledValue() }}</p>\n  <p class=\"hint-text\">\n    A value survives tabs being reordered or inserted, which an index does not. Writing\n    either one moves the selection and the other follows.\n  </p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Tab, Tabs } from 'ashen-ui/tabs';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Tab, Tabs],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly controlledValue = signal<unknown>('appearance');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-tabs { max-width: 480px; }\n\n.demo-readout { margin-top: var(--sn-space-3); font-size: var(--sn-text-xs); color: var(--sn-text-subtle); }"
    }
  ],
  "tabs/codeScrollable": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-tabs demo-tabs-narrow\">\n  <sn-tabs scrollable>\n    @for (label of manyTabs; track label) {\n      <sn-tab [label]=\"label\">{{ label }} content.</sn-tab>\n    }\n  </sn-tabs>\n</div>\n<p class=\"hint-text\">\n  The list scrolls instead of the buttons squeezing. The controls are pointer-only: arrow\n  keys already reach every tab and scroll the one they land on into view.\n</p>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Tab, Tabs } from 'ashen-ui/tabs';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Tab, Tabs],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly manyTabs = [\n    'Overview',\n    'Appearance',\n    'Notifications',\n    'Integrations',\n    'Billing',\n    'Members',\n    'Security',\n    'Advanced',\n  ];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-tabs { max-width: 480px; }\n\n/* Narrow enough that eight tabs cannot fit, which is the point of the demo. */\n.demo-tabs-narrow { max-width: 22rem; }"
    }
  ],
  "tabs/codeSnClass": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-tabs\">\n  <sn-tabs snClass=\"demo-custom-tabs\">\n    <sn-tab\n      label=\"General\"\n      [snClass]=\"{ tab: 'demo-custom-tab' }\"\n    >\n      General content with custom tab button class.\n    </sn-tab>\n    <sn-tab label=\"Appearance\">Appearance content.</sn-tab>\n  </sn-tabs>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Tab, Tabs } from 'ashen-ui/tabs';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Tab, Tabs],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-tabs { max-width: 480px; }"
    }
  ],
  "tag/codeSeverities": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-tag value=\"Button\" />\n<sn-tag value=\"Saved\" severity=\"success\" />\n<sn-tag value=\"Overlap\" severity=\"warning\" />\n<sn-tag value=\"Invalid\" severity=\"error\" />\n<sn-tag value=\"Widget\" severity=\"info\" />\n<sn-tag value=\"Draft\" severity=\"secondary\" />"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Tag } from 'ashen-ui/tag';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Tag],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "tag/codeIcons": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-tag value=\"Widget\" severity=\"info\" icon=\"widgets\" />\n<sn-tag value=\"Saved\" severity=\"success\" icon=\"check_circle\" />\n<sn-tag value=\"Error\" severity=\"error\" icon=\"cancel\" />\n<sn-tag value=\"Pending\" severity=\"warning\" icon=\"schedule\" />"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Tag } from 'ashen-ui/tag';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Tag],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "tag/codeProjection": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-tag severity=\"success\">Streaming</sn-tag>\n<sn-tag severity=\"info\">v2.4.1</sn-tag>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Tag } from 'ashen-ui/tag';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Tag],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "tag/codeCustom": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-tag value=\"Purple\" style=\"--sn-tag-color: #6941c6;\" />\n<sn-tag value=\"Teal\" style=\"--sn-tag-color: #0e7490;\" />"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Tag } from 'ashen-ui/tag';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Tag],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "textarea/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <textarea snTextarea rows=\"3\" placeholder='{ \"action\": \"play\" }'></textarea>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Textarea } from 'ashen-ui/textarea';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Textarea],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "textarea/codeSizes": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <textarea snTextarea size=\"sm\" rows=\"2\" placeholder=\"Small (sm)\"></textarea>\n  <textarea snTextarea rows=\"2\" placeholder=\"Medium (md - default)\"></textarea>\n  <textarea snTextarea size=\"lg\" rows=\"2\" placeholder=\"Large (lg)\"></textarea>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Textarea } from 'ashen-ui/textarea';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Textarea],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "textarea/codeError": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <textarea snTextarea [invalid]=\"true\" rows=\"3\" placeholder=\"Invalid input\"></textarea>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Textarea } from 'ashen-ui/textarea';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Textarea],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "textarea/codeDisabled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <textarea snTextarea disabled rows=\"3\">Disabled value</textarea>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Textarea } from 'ashen-ui/textarea';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Textarea],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "textarea/codeReadonly": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <textarea snTextarea readonly rows=\"3\">Read-only value</textarea>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Textarea } from 'ashen-ui/textarea';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Textarea],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "textarea/codeInField": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field>\n    <sn-label>Request body</sn-label>\n    <textarea snTextarea rows=\"3\" placeholder='{ \"action\": \"play\" }'></textarea>\n    <sn-hint>Enter valid JSON</sn-hint>\n  </sn-form-field>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormField, FormFieldHint, FormFieldLabel } from 'ashen-ui/form-field';\nimport { Textarea } from 'ashen-ui/textarea';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldHint, FormFieldLabel, Textarea],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "textarea/codeReactive": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field>\n    <sn-label required>Notes</sn-label>\n    <textarea snTextarea [formControl]=\"notesCtrl\" rows=\"4\" placeholder=\"Enter your notes\"></textarea>\n    <sn-error>Notes are required</sn-error>\n  </sn-form-field>\n  <p class=\"hint-text\">Status: {{ notesCtrl.status }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';\nimport { FormField, FormFieldError, FormFieldLabel } from 'ashen-ui/form-field';\nimport { Textarea } from 'ashen-ui/textarea';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldError, FormFieldLabel, ReactiveFormsModule, Textarea],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly notesCtrl = new FormControl('', Validators.required);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "textarea/codeInteractive": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-form-field>\n    <sn-label required>Description</sn-label>\n    <textarea\n      snTextarea\n      rows=\"3\"\n      [(ngModel)]=\"description\"\n      required\n      placeholder=\"Describe the action\"\n    ></textarea>\n    <sn-error>Description is required</sn-error>\n  </sn-form-field>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\nimport { FormField, FormFieldError, FormFieldLabel } from 'ashen-ui/form-field';\nimport { Textarea } from 'ashen-ui/textarea';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldError, FormFieldLabel, FormsModule, Textarea],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly description = signal('');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "textarea/codeReskin": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <textarea\n    snTextarea\n    rows=\"3\"\n    placeholder=\"Custom resize and border radius\"\n    style=\"--sn-textarea-resize: none; --sn-input-text-border-radius: var(--sn-radius-sm);\"\n  ></textarea>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Textarea } from 'ashen-ui/textarea';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Textarea],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "timeline/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-timeline>\n  <sn-timeline-item icon=\"add\">\n    <span class=\"sn-timeline-title\">\n      <span class=\"sn-timeline-title-text\">Grid created</span>\n      <span class=\"sn-timeline-time\">09:12</span>\n    </span>\n  </sn-timeline-item>\n  <sn-timeline-item>\n    <span class=\"sn-timeline-title\">\n      <span class=\"sn-timeline-title-text\">Tile added</span>\n      <span class=\"sn-timeline-time\">09:14</span>\n    </span>\n    <div class=\"sn-timeline-subtitle\">Play Music → play-sound</div>\n  </sn-timeline-item>\n  <sn-timeline-item icon=\"play_arrow\" color=\"var(--sn-color-success)\">\n    <span class=\"sn-timeline-title\">\n      <span class=\"sn-timeline-title-text\">Action run</span>\n      <span class=\"sn-timeline-time\">09:41</span>\n    </span>\n  </sn-timeline-item>\n</sn-timeline>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Timeline, TimelineItem } from 'ashen-ui/timeline';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Timeline, TimelineItem],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "timeline/codeDotOnly": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-timeline>\n  <sn-timeline-item>\n    <span class=\"sn-timeline-title\">\n      <span class=\"sn-timeline-title-text\">Draft saved</span>\n    </span>\n  </sn-timeline-item>\n  <sn-timeline-item>\n    <span class=\"sn-timeline-title\">\n      <span class=\"sn-timeline-title-text\">Review started</span>\n    </span>\n  </sn-timeline-item>\n  <sn-timeline-item>\n    <span class=\"sn-timeline-title\">\n      <span class=\"sn-timeline-title-text\">Published</span>\n    </span>\n  </sn-timeline-item>\n</sn-timeline>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Timeline, TimelineItem } from 'ashen-ui/timeline';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Timeline, TimelineItem],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "timeline/codeCustomColor": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<sn-timeline>\n  <sn-timeline-item icon=\"pending\" color=\"var(--sn-color-warning)\">\n    <span class=\"sn-timeline-title\">\n      <span class=\"sn-timeline-title-text\">Awaiting approval</span>\n    </span>\n  </sn-timeline-item>\n  <sn-timeline-item icon=\"check_circle\" color=\"var(--sn-color-success)\">\n    <span class=\"sn-timeline-title\">\n      <span class=\"sn-timeline-title-text\">Approved</span>\n    </span>\n  </sn-timeline-item>\n  <sn-timeline-item icon=\"cancel\" color=\"var(--sn-color-error)\">\n    <span class=\"sn-timeline-title\">\n      <span class=\"sn-timeline-title-text\">Rejected</span>\n    </span>\n  </sn-timeline-item>\n</sn-timeline>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Timeline, TimelineItem } from 'ashen-ui/timeline';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Timeline, TimelineItem],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    }
  ],
  "toast/codeSeverities": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"button-row\">\n  <button snButton variant=\"outlined\" (click)=\"showInfo()\">Info</button>\n  <button snButton variant=\"outlined\" (click)=\"showSuccess()\">Success</button>\n  <button snButton variant=\"outlined\" (click)=\"showWarn()\">Warning</button>\n  <button snButton variant=\"outlined\" (click)=\"showError()\">Error</button>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, inject } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { ToastService } from 'ashen-ui/toast';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly toast = inject(ToastService);\n\n  showInfo(): void {\n    this.toast.info('File uploaded', { detail: 'document.pdf has been saved.' });\n  }\n\n  showSuccess(): void {\n    this.toast.success('Changes saved', { detail: 'Your settings have been updated.' });\n  }\n\n  showWarn(): void {\n    this.toast.warn('Storage almost full', { detail: 'You have used 90% of your quota.' });\n  }\n\n  showError(): void {\n    this.toast.error('Upload failed', { detail: 'The server returned a 500 error.' });\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".button-row { display: flex; flex-wrap: wrap; gap: var(--sn-space-2); }"
    }
  ],
  "toast/codeSticky": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"button-row\">\n  <button snButton variant=\"outlined\" (click)=\"showSticky()\">Show sticky</button>\n  <button snButton variant=\"outlined\" (click)=\"showNoClose()\">No close button</button>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, inject } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { ToastService } from 'ashen-ui/toast';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly toast = inject(ToastService);\n\n  showSticky(): void {\n    this.toast.show({\n      severity: 'info',\n      summary: 'Sticky toast',\n      detail: 'This toast will not auto-dismiss. Close it manually.',\n      sticky: true,\n    });\n  }\n\n  showNoClose(): void {\n    this.toast.show({\n      severity: 'success',\n      summary: 'No close button',\n      detail: 'Dismisses automatically after 3 s.',\n      closable: false,\n    });\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".button-row { display: flex; flex-wrap: wrap; gap: var(--sn-space-2); }"
    }
  ],
  "toast/codeDuplicates": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"button-row\">\n  <button snButton variant=\"outlined\" (click)=\"showRetryStack()\">\n    Fire 3 identical, stacking\n  </button>\n  <button snButton variant=\"outlined\" (click)=\"showRetrySuppressed()\">\n    Fire 3 identical, suppressed\n  </button>\n  <button snButton variant=\"outlined\" (click)=\"showRetryKeyed()\">\n    Fire 3 with a shared key\n  </button>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, inject } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { ToastService } from 'ashen-ui/toast';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly toast = inject(ToastService);\n\n  showRetryStack(): void {\n    for (let attempt = 1; attempt <= 3; attempt++) {\n      this.toast.show({ severity: 'error', summary: 'Save failed', sticky: true });\n    }\n  }\n\n  showRetrySuppressed(): void {\n    for (let attempt = 1; attempt <= 3; attempt++) {\n      this.toast.show({\n        severity: 'warning',\n        summary: 'Save failed, retrying',\n        sticky: true,\n        preventDuplicates: true,\n      });\n    }\n  }\n\n  showRetryKeyed(): void {\n    // The detail differs every time, so only a shared key collapses these.\n    for (let attempt = 1; attempt <= 3; attempt++) {\n      this.toast.show({\n        severity: 'info',\n        summary: 'Uploading',\n        detail: `attempt ${attempt}`,\n        sticky: true,\n        key: 'upload',\n        preventDuplicates: true,\n      });\n    }\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".button-row { display: flex; flex-wrap: wrap; gap: var(--sn-space-2); }"
    }
  ],
  "toast/codePositions": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"button-row\">\n  <button snButton variant=\"outlined\" (click)=\"showInfo()\">Show toast (top-right)</button>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, inject } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { ToastService } from 'ashen-ui/toast';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly toast = inject(ToastService);\n\n  showInfo(): void {\n    this.toast.info('File uploaded', { detail: 'document.pdf has been saved.' });\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".button-row { display: flex; flex-wrap: wrap; gap: var(--sn-space-2); }"
    }
  ],
  "toast/codeClearAll": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"button-row\">\n  <button snButton variant=\"outlined\" (click)=\"showInfo()\">Add toast</button>\n  <button snButton variant=\"outlined\" (click)=\"showSuccess()\">Add another</button>\n  <button snButton variant=\"outlined\" (click)=\"clearAll()\">Clear all</button>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, inject } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { ToastService } from 'ashen-ui/toast';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly toast = inject(ToastService);\n\n  showInfo(): void {\n    this.toast.info('File uploaded', { detail: 'document.pdf has been saved.' });\n  }\n\n  showSuccess(): void {\n    this.toast.success('Changes saved', { detail: 'Your settings have been updated.' });\n  }\n\n  clearAll(): void {\n    this.toast.dismiss();\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".button-row { display: flex; flex-wrap: wrap; gap: var(--sn-space-2); }"
    }
  ],
  "toggle/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-toggle>Zoom Effect</sn-toggle>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Toggle } from 'ashen-ui/toggle';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Toggle],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "toggle/codeChecked": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-toggle [checked]=\"true\">Background Colors</sn-toggle>\n  <sn-toggle>Zoom Effect</sn-toggle>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Toggle } from 'ashen-ui/toggle';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Toggle],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "toggle/codeDisabled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-toggle [disabled]=\"true\">Disabled off</sn-toggle>\n  <sn-toggle [checked]=\"true\" [disabled]=\"true\">Disabled on</sn-toggle>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Toggle } from 'ashen-ui/toggle';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Toggle],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "toggle/codeSizes": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-toggle size=\"sm\">Small</sn-toggle>\n  <sn-toggle>Medium (default)</sn-toggle>\n  <sn-toggle size=\"lg\">Large</sn-toggle>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Toggle } from 'ashen-ui/toggle';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Toggle],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "toggle/codeReactive": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-toggle [formControl]=\"formCtrl\">Enable notifications</sn-toggle>\n  <p class=\"hint-text\">Value: {{ formCtrl.value }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule } from '@angular/forms';\nimport { Toggle } from 'ashen-ui/toggle';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ReactiveFormsModule, Toggle],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly formCtrl = new FormControl(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "toggle/codeNgModel": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-toggle [(ngModel)]=\"ngModelVal\">Enable dark mode</sn-toggle>\n  <p class=\"hint-text\">Value: {{ ngModelVal() }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\nimport { Toggle } from 'ashen-ui/toggle';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormsModule, Toggle],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly ngModelVal = signal(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "toggle/codeReskin": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <sn-toggle\n    [checked]=\"true\"\n    style=\"--sn-toggle-track-bg-checked: var(--sn-color-success);\"\n  >Custom color</sn-toggle>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Toggle } from 'ashen-ui/toggle';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Toggle],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }"
    }
  ],
  "toggle-button/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snToggleButton>Mute</button>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { ToggleButton } from 'ashen-ui/toggle-button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ToggleButton],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row { display: flex; flex-wrap: wrap; gap: var(--sn-space-3); align-items: flex-start; }"
    }
  ],
  "toggle-button/codeSelected": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snToggleButton [selected]=\"true\">Muted</button>\n  <button snToggleButton>Mic on</button>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { ToggleButton } from 'ashen-ui/toggle-button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ToggleButton],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row { display: flex; flex-wrap: wrap; gap: var(--sn-space-3); align-items: flex-start; }"
    }
  ],
  "toggle-button/codeSizes": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row demo-row--align-center\">\n  <button snToggleButton size=\"sm\">Small</button>\n  <button snToggleButton>Medium (default)</button>\n  <button snToggleButton size=\"lg\">Large</button>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { ToggleButton } from 'ashen-ui/toggle-button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ToggleButton],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row { display: flex; flex-wrap: wrap; gap: var(--sn-space-3); align-items: flex-start; }\n\n.demo-row--align-center { align-items: center; }"
    }
  ],
  "toggle-button/codeDisabled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snToggleButton [disabled]=\"true\">Disabled off</button>\n  <button snToggleButton [selected]=\"true\" [disabled]=\"true\">Disabled on</button>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { ToggleButton } from 'ashen-ui/toggle-button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ToggleButton],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row { display: flex; flex-wrap: wrap; gap: var(--sn-space-3); align-items: flex-start; }"
    }
  ],
  "toggle-button/codeWithIcon": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snToggleButton [(selected)]=\"muted\">\n    <span class=\"sn-icon icon-ms\" aria-hidden=\"true\">{{ muted() ? 'mic_off' : 'mic' }}</span>\n    {{ muted() ? 'Muted' : 'Mic on' }}\n  </button>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { ToggleButton } from 'ashen-ui/toggle-button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ToggleButton],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly muted = signal(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row { display: flex; flex-wrap: wrap; gap: var(--sn-space-3); align-items: flex-start; }"
    }
  ],
  "toggle-button/codeIconOnly": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snToggleButton [(selected)]=\"muted\" aria-label=\"Toggle mute\">\n    <span class=\"sn-icon icon-ms\" aria-hidden=\"true\">{{ muted() ? 'mic_off' : 'mic' }}</span>\n  </button>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { ToggleButton } from 'ashen-ui/toggle-button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ToggleButton],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly muted = signal(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row { display: flex; flex-wrap: wrap; gap: var(--sn-space-3); align-items: flex-start; }"
    }
  ],
  "toggle-button/codeReactive": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <button snToggleButton [formControl]=\"formCtrl\">Enable notifications</button>\n  <p class=\"hint-text\">Value: {{ formCtrl.value }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule } from '@angular/forms';\nimport { ToggleButton } from 'ashen-ui/toggle-button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ReactiveFormsModule, ToggleButton],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly formCtrl = new FormControl(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "toggle-button/codeNgModel": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-stack\">\n  <button snToggleButton [(ngModel)]=\"ngModelVal\">Dark mode</button>\n  <p class=\"hint-text\">Value: {{ ngModelVal() }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\nimport { ToggleButton } from 'ashen-ui/toggle-button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormsModule, ToggleButton],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly ngModelVal = signal(false);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-stack { display: flex; flex-direction: column; gap: var(--sn-space-3); width: 100%; max-width: 360px; }\n\n.hint-text { margin: 0; font-size: var(--sn-text-xs); color: var(--sn-text-subtle); font-family: var(--sn-font-mono); }"
    }
  ],
  "toggle-button/codeReskin": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button\n    snToggleButton\n    [selected]=\"true\"\n    style=\"--sn-toggle-button-bg-selected: var(--sn-color-success);\n           --sn-toggle-button-border-selected: var(--sn-color-success);\"\n  >Custom color</button>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { ToggleButton } from 'ashen-ui/toggle-button';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ToggleButton],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row { display: flex; flex-wrap: wrap; gap: var(--sn-space-3); align-items: flex-start; }"
    }
  ],
  "tooltip/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snButton variant=\"outlined\" snTooltip=\"Save changes\">Save</button>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Tooltip } from 'ashen-ui/tooltip';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Tooltip],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "tooltip/codePositions": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row demo-row--spaced\">\n  <button snButton variant=\"outlined\" snTooltip=\"Above the button\" snTooltipPosition=\"top\">Top</button>\n  <button snButton variant=\"outlined\" snTooltip=\"Below the button\" snTooltipPosition=\"bottom\">Bottom</button>\n  <button snButton variant=\"outlined\" snTooltip=\"Left of the button\" snTooltipPosition=\"left\">Left</button>\n  <button snButton variant=\"outlined\" snTooltip=\"Right of the button\" snTooltipPosition=\"right\">Right</button>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Tooltip } from 'ashen-ui/tooltip';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Tooltip],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}\n\n.demo-row--spaced {\n  justify-content: space-around;\n  padding: var(--sn-space-6) var(--sn-space-6);\n}"
    }
  ],
  "tooltip/codeDelay": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snButton variant=\"outlined\" snTooltip=\"Appears quickly\" [snTooltipShowDelay]=\"100\" [snTooltipHideDelay]=\"50\">Fast tooltip</button>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Tooltip } from 'ashen-ui/tooltip';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Tooltip],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "tooltip/codeDisabled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snButton variant=\"outlined\" snTooltip=\"Will not show\" [snTooltipDisabled]=\"true\">Disabled tooltip</button>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Tooltip } from 'ashen-ui/tooltip';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Tooltip],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "tooltip/codeOnAnyElement": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <span\n    tabindex=\"0\"\n    snTooltip=\"Tooltip on a plain span\"\n    class=\"demo-span-target\"\n  >Hover or focus me</span>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Tooltip } from 'ashen-ui/tooltip';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Tooltip],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}\n\n.demo-span-target {\n  display: inline-block;\n  padding: var(--sn-space-2) var(--sn-space-4);\n  border: 1px dashed var(--sn-border-strong);\n  border-radius: var(--sn-radius-sm);\n  cursor: default;\n  color: var(--sn-text-muted);\n  font-size: var(--sn-text-sm);\n\n  &:focus-visible {\n    outline: var(--sn-focus-ring-width) solid var(--sn-focus-ring-color);\n    outline-offset: var(--sn-focus-ring-offset);\n  }\n}"
    }
  ],
  "tooltip/codeIconButton": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <button snButton variant=\"icon\" aria-label=\"Edit tile\" snTooltip=\"Edit tile\">\n    <span class=\"sn-icon icon-ms\">edit</span>\n  </button>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Tooltip } from 'ashen-ui/tooltip';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Tooltip],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "tooltip/codeTemplate": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <ng-template #shortcutTip>\n    Copy selection <kbd>Ctrl</kbd> + <kbd>C</kbd>\n  </ng-template>\n  <button snButton variant=\"outlined\" [snTooltip]=\"shortcutTip\">Rich tooltip</button>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Button } from 'ashen-ui/button';\nimport { Tooltip } from 'ashen-ui/tooltip';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Button, Tooltip],\n  templateUrl: './demo.html',\n})\nexport class Demo {}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-row {\n  display: flex;\n  align-items: center;\n  gap: var(--sn-space-4);\n  padding: var(--sn-space-6) var(--sn-space-4);\n  min-height: 80px;\n  flex-wrap: wrap;\n}"
    }
  ],
  "tree/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-tree-wrapper\">\n  <sn-tree [nodes]=\"fileTree\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Tree, TreeNode } from 'ashen-ui/tree';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Tree],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly fileTree: TreeNode[] = [\n    {\n      key: 'src',\n      label: 'src',\n      icon: 'folder',\n      children: [\n        {\n          key: 'app',\n          label: 'app',\n          icon: 'folder',\n          children: [\n            { key: 'app-ts', label: 'app.ts', icon: 'description' },\n            { key: 'app-routes', label: 'app.routes.ts', icon: 'description' },\n          ],\n        },\n        { key: 'main', label: 'main.ts', icon: 'description' },\n        { key: 'styles', label: 'styles.css', icon: 'description' },\n      ],\n    },\n    {\n      key: 'public',\n      label: 'public',\n      icon: 'folder',\n      children: [\n        { key: 'favicon', label: 'favicon.ico', icon: 'image' },\n      ],\n    },\n    { key: 'angular-json', label: 'angular.json', icon: 'description' },\n  ];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-tree-wrapper {\n  width: 100%;\n  max-width: 320px;\n}"
    }
  ],
  "tree/codeSelection": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-tree-wrapper\">\n  <sn-tree\n    [nodes]=\"fileTree\"\n    [(selectedKey)]=\"selectedKey\"\n    (nodeSelect)=\"onNodeSelect($event)\"\n  />\n  @if (lastSelectedLabel()) {\n    <p class=\"demo-note\">Selected: {{ lastSelectedLabel() }}</p>\n  }\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Tree, TreeNode } from 'ashen-ui/tree';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Tree],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly fileTree: TreeNode[] = [\n    {\n      key: 'src',\n      label: 'src',\n      icon: 'folder',\n      children: [\n        {\n          key: 'app',\n          label: 'app',\n          icon: 'folder',\n          children: [\n            { key: 'app-ts', label: 'app.ts', icon: 'description' },\n            { key: 'app-routes', label: 'app.routes.ts', icon: 'description' },\n          ],\n        },\n        { key: 'main', label: 'main.ts', icon: 'description' },\n        { key: 'styles', label: 'styles.css', icon: 'description' },\n      ],\n    },\n    {\n      key: 'public',\n      label: 'public',\n      icon: 'folder',\n      children: [\n        { key: 'favicon', label: 'favicon.ico', icon: 'image' },\n      ],\n    },\n    { key: 'angular-json', label: 'angular.json', icon: 'description' },\n  ];\n\n  readonly selectedKey = signal<string | null>(null);\n\n  readonly lastSelectedLabel = signal<string>('');\n\n  onNodeSelect(event: { key: string; node: TreeNode }): void {\n    this.lastSelectedLabel.set(event.node.label);\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-tree-wrapper {\n  width: 100%;\n  max-width: 320px;\n}\n\n.demo-note {\n  margin-top: 8px;\n  font-size: var(--sn-text-sm);\n  color: var(--sn-text-muted);\n}"
    }
  ],
  "tree/codeControlled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-tree-wrapper\">\n  <div class=\"tree-controls\">\n    <button type=\"button\" class=\"demo-btn\" (click)=\"expandAll()\">Expand all</button>\n    <button type=\"button\" class=\"demo-btn\" (click)=\"collapseAll()\">Collapse all</button>\n  </div>\n  <sn-tree [nodes]=\"fileTree\" [(expandedKeys)]=\"expandedKeys\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { Tree, TreeNode } from 'ashen-ui/tree';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Tree],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly fileTree: TreeNode[] = [\n    {\n      key: 'src',\n      label: 'src',\n      icon: 'folder',\n      children: [\n        {\n          key: 'app',\n          label: 'app',\n          icon: 'folder',\n          children: [\n            { key: 'app-ts', label: 'app.ts', icon: 'description' },\n            { key: 'app-routes', label: 'app.routes.ts', icon: 'description' },\n          ],\n        },\n        { key: 'main', label: 'main.ts', icon: 'description' },\n        { key: 'styles', label: 'styles.css', icon: 'description' },\n      ],\n    },\n    {\n      key: 'public',\n      label: 'public',\n      icon: 'folder',\n      children: [\n        { key: 'favicon', label: 'favicon.ico', icon: 'image' },\n      ],\n    },\n    { key: 'angular-json', label: 'angular.json', icon: 'description' },\n  ];\n\n  readonly expandedKeys = signal<readonly string[]>(['src']);\n\n  expandAll(): void {\n    const keys: string[] = [];\n    this.collectKeys(this.fileTree, keys);\n    this.expandedKeys.set(keys);\n  }\n\n  collapseAll(): void {\n    this.expandedKeys.set([]);\n  }\n\n  private collectKeys(nodes: readonly TreeNode[], result: string[]): void {\n    nodes.forEach((n) => {\n      if (n.children && n.children.length > 0) {\n        result.push(n.key);\n        this.collectKeys(n.children, result);\n      }\n    });\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-tree-wrapper {\n  width: 100%;\n  max-width: 320px;\n}\n\n.tree-controls {\n  display: flex;\n  gap: 8px;\n  margin-bottom: 8px;\n}\n\n.demo-btn {\n  padding: 4px 10px;\n  border: 1px solid var(--sn-border);\n  border-radius: var(--sn-radius-sm);\n  background: var(--sn-surface-panel);\n  font-family: var(--sn-font-ui);\n  font-size: var(--sn-text-sm);\n  color: var(--sn-text);\n  cursor: pointer;\n\n  &:hover {\n    background: var(--sn-surface-hover);\n  }\n}"
    }
  ],
  "tree/codeExpandOnClick": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-tree-wrapper\">\n  <p class=\"hint-text\">Single click anywhere on a parent item toggles it. Use <code>expandOnClick=\"double\"</code> for double-click.</p>\n  <sn-tree [nodes]=\"fileTree\" expandOnClick=\"single\" />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { Tree, TreeNode } from 'ashen-ui/tree';\n\n@Component({\n  selector: 'app-demo',\n  imports: [Tree],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly fileTree: TreeNode[] = [\n    {\n      key: 'src',\n      label: 'src',\n      icon: 'folder',\n      children: [\n        {\n          key: 'app',\n          label: 'app',\n          icon: 'folder',\n          children: [\n            { key: 'app-ts', label: 'app.ts', icon: 'description' },\n            { key: 'app-routes', label: 'app.routes.ts', icon: 'description' },\n          ],\n        },\n        { key: 'main', label: 'main.ts', icon: 'description' },\n        { key: 'styles', label: 'styles.css', icon: 'description' },\n      ],\n    },\n    {\n      key: 'public',\n      label: 'public',\n      icon: 'folder',\n      children: [\n        { key: 'favicon', label: 'favicon.ico', icon: 'image' },\n      ],\n    },\n    { key: 'angular-json', label: 'angular.json', icon: 'description' },\n  ];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-tree-wrapper {\n  width: 100%;\n  max-width: 320px;\n}"
    }
  ],
  "tree-select/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-tree-select\n    [(value)]=\"basicValue\"\n    [nodes]=\"fileTree\"\n    placeholder=\"Select a file…\"\n    class=\"demo-select\"\n  ></sn-tree-select>\n  <p class=\"hint-text\">Value: \"{{ basicValue() }}\"</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { TreeNode } from 'ashen-ui/tree';\nimport { TreeSelect } from 'ashen-ui/tree-select';\n\n@Component({\n  selector: 'app-demo',\n  imports: [TreeSelect],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly fileTree: TreeNode[] = [\n    {\n      key: 'src',\n      label: 'src',\n      icon: 'folder',\n      children: [\n        {\n          key: 'app',\n          label: 'app',\n          icon: 'folder',\n          children: [\n            { key: 'app.ts', label: 'app.ts', icon: 'description' },\n            { key: 'app.html', label: 'app.html', icon: 'description' },\n          ],\n        },\n        { key: 'main.ts', label: 'main.ts', icon: 'description' },\n        { key: 'styles.css', label: 'styles.css', icon: 'description' },\n      ],\n    },\n    {\n      key: 'public',\n      label: 'public',\n      icon: 'folder',\n      children: [\n        { key: 'favicon.ico', label: 'favicon.ico', icon: 'image' },\n      ],\n    },\n    { key: 'package.json', label: 'package.json', icon: 'data_object' },\n    { key: 'tsconfig.json', label: 'tsconfig.json', icon: 'settings' },\n  ];\n\n  readonly basicValue = signal<string | null>(null);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-select {\n  width: 18rem;\n}\n\n/* -- Standard doc-page styles (shared look across all component pages) -- */\n.hint-text { margin: 0; color: var(--sn-text-subtle); font-size: 0.8rem; }"
    }
  ],
  "tree-select/codeReactive": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-tree-select\n    [formControl]=\"formCtrl\"\n    [nodes]=\"fileTree\"\n    class=\"demo-select\"\n  ></sn-tree-select>\n  <p class=\"hint-text\">FormControl value: \"{{ formCtrl.value }}\"</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { FormControl, ReactiveFormsModule } from '@angular/forms';\nimport { TreeNode } from 'ashen-ui/tree';\nimport { TreeSelect } from 'ashen-ui/tree-select';\n\n@Component({\n  selector: 'app-demo',\n  imports: [ReactiveFormsModule, TreeSelect],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly fileTree: TreeNode[] = [\n    {\n      key: 'src',\n      label: 'src',\n      icon: 'folder',\n      children: [\n        {\n          key: 'app',\n          label: 'app',\n          icon: 'folder',\n          children: [\n            { key: 'app.ts', label: 'app.ts', icon: 'description' },\n            { key: 'app.html', label: 'app.html', icon: 'description' },\n          ],\n        },\n        { key: 'main.ts', label: 'main.ts', icon: 'description' },\n        { key: 'styles.css', label: 'styles.css', icon: 'description' },\n      ],\n    },\n    {\n      key: 'public',\n      label: 'public',\n      icon: 'folder',\n      children: [\n        { key: 'favicon.ico', label: 'favicon.ico', icon: 'image' },\n      ],\n    },\n    { key: 'package.json', label: 'package.json', icon: 'data_object' },\n    { key: 'tsconfig.json', label: 'tsconfig.json', icon: 'settings' },\n  ];\n\n  readonly formCtrl = new FormControl<string | null>(null);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-select {\n  width: 18rem;\n}\n\n/* -- Standard doc-page styles (shared look across all component pages) -- */\n.hint-text { margin: 0; color: var(--sn-text-subtle); font-size: 0.8rem; }"
    }
  ],
  "tree-select/codePreExpanded": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-tree-select\n    [(value)]=\"preExpandedValue\"\n    [nodes]=\"fileTree\"\n    [(expandedKeys)]=\"preExpandedKeys\"\n    class=\"demo-select\"\n  ></sn-tree-select>\n  <p class=\"hint-text\">Value: \"{{ preExpandedValue() }}\" | Expanded: {{ preExpandedKeys() | json }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { TreeNode } from 'ashen-ui/tree';\nimport { TreeSelect } from 'ashen-ui/tree-select';\n\n@Component({\n  selector: 'app-demo',\n  imports: [TreeSelect],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly fileTree: TreeNode[] = [\n    {\n      key: 'src',\n      label: 'src',\n      icon: 'folder',\n      children: [\n        {\n          key: 'app',\n          label: 'app',\n          icon: 'folder',\n          children: [\n            { key: 'app.ts', label: 'app.ts', icon: 'description' },\n            { key: 'app.html', label: 'app.html', icon: 'description' },\n          ],\n        },\n        { key: 'main.ts', label: 'main.ts', icon: 'description' },\n        { key: 'styles.css', label: 'styles.css', icon: 'description' },\n      ],\n    },\n    {\n      key: 'public',\n      label: 'public',\n      icon: 'folder',\n      children: [\n        { key: 'favicon.ico', label: 'favicon.ico', icon: 'image' },\n      ],\n    },\n    { key: 'package.json', label: 'package.json', icon: 'data_object' },\n    { key: 'tsconfig.json', label: 'tsconfig.json', icon: 'settings' },\n  ];\n\n  readonly preExpandedValue = signal<string | null>(null);\n\n  readonly preExpandedKeys = signal<readonly string[]>(['src', 'app']);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-select {\n  width: 18rem;\n}\n\n/* -- Standard doc-page styles (shared look across all component pages) -- */\n.hint-text { margin: 0; color: var(--sn-text-subtle); font-size: 0.8rem; }"
    }
  ],
  "tree-select/codeFormField": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-form-field class=\"demo-select\">\n    <sn-label>File</sn-label>\n    <sn-tree-select\n      [(value)]=\"formFieldValue\"\n      [nodes]=\"fileTree\"\n      placeholder=\"Select a file…\"\n    ></sn-tree-select>\n    <sn-hint>Only leaf files are selectable</sn-hint>\n  </sn-form-field>\n  <p class=\"hint-text\">Value: \"{{ formFieldValue() }}\"</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { FormField, FormFieldHint, FormFieldLabel } from 'ashen-ui/form-field';\nimport { TreeNode } from 'ashen-ui/tree';\nimport { TreeSelect } from 'ashen-ui/tree-select';\n\n@Component({\n  selector: 'app-demo',\n  imports: [FormField, FormFieldHint, FormFieldLabel, TreeSelect],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly fileTree: TreeNode[] = [\n    {\n      key: 'src',\n      label: 'src',\n      icon: 'folder',\n      children: [\n        {\n          key: 'app',\n          label: 'app',\n          icon: 'folder',\n          children: [\n            { key: 'app.ts', label: 'app.ts', icon: 'description' },\n            { key: 'app.html', label: 'app.html', icon: 'description' },\n          ],\n        },\n        { key: 'main.ts', label: 'main.ts', icon: 'description' },\n        { key: 'styles.css', label: 'styles.css', icon: 'description' },\n      ],\n    },\n    {\n      key: 'public',\n      label: 'public',\n      icon: 'folder',\n      children: [\n        { key: 'favicon.ico', label: 'favicon.ico', icon: 'image' },\n      ],\n    },\n    { key: 'package.json', label: 'package.json', icon: 'data_object' },\n    { key: 'tsconfig.json', label: 'tsconfig.json', icon: 'settings' },\n  ];\n\n  readonly formFieldValue = signal<string | null>(null);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-select {\n  width: 18rem;\n}\n\n/* -- Standard doc-page styles (shared look across all component pages) -- */\n.hint-text { margin: 0; color: var(--sn-text-subtle); font-size: 0.8rem; }"
    }
  ],
  "tree-select/codeDisabled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-row\">\n  <sn-tree-select\n    [disabled]=\"true\"\n    [(value)]=\"disabledValue\"\n    [nodes]=\"fileTree\"\n    class=\"demo-select\"\n  ></sn-tree-select>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { TreeNode } from 'ashen-ui/tree';\nimport { TreeSelect } from 'ashen-ui/tree-select';\n\n@Component({\n  selector: 'app-demo',\n  imports: [TreeSelect],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly fileTree: TreeNode[] = [\n    {\n      key: 'src',\n      label: 'src',\n      icon: 'folder',\n      children: [\n        {\n          key: 'app',\n          label: 'app',\n          icon: 'folder',\n          children: [\n            { key: 'app.ts', label: 'app.ts', icon: 'description' },\n            { key: 'app.html', label: 'app.html', icon: 'description' },\n          ],\n        },\n        { key: 'main.ts', label: 'main.ts', icon: 'description' },\n        { key: 'styles.css', label: 'styles.css', icon: 'description' },\n      ],\n    },\n    {\n      key: 'public',\n      label: 'public',\n      icon: 'folder',\n      children: [\n        { key: 'favicon.ico', label: 'favicon.ico', icon: 'image' },\n      ],\n    },\n    { key: 'package.json', label: 'package.json', icon: 'data_object' },\n    { key: 'tsconfig.json', label: 'tsconfig.json', icon: 'settings' },\n  ];\n\n  readonly disabledValue = signal<string | null>('main.ts');\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-select {\n  width: 18rem;\n}"
    }
  ],
  "tree-table/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"doc-example-demo\">\n  <sn-tree-table [nodes]=\"fileNodes\">\n    <sn-column field=\"name\" header=\"Name\" />\n    <sn-column field=\"size\" header=\"Size\" width=\"80px\" align=\"right\" />\n    <sn-column field=\"modified\" header=\"Modified\" />\n  </sn-tree-table>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { TableColumn } from 'ashen-ui/table';\nimport { TreeTable, TreeTableNode } from 'ashen-ui/tree-table';\n\n@Component({\n  selector: 'app-demo',\n  imports: [TableColumn, TreeTable],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly fileNodes: TreeTableNode[] = [\n    {\n      key: 'src',\n      icon: 'folder',\n      data: { name: 'src', size: '-', modified: '2026-07-14' },\n      children: [\n        {\n          key: 'app',\n          icon: 'folder',\n          data: { name: 'app', size: '-', modified: '2026-07-14' },\n          children: [\n            { key: 'app-ts', icon: 'description', data: { name: 'app.ts', size: '2 KB', modified: '2026-07-14' } },\n            { key: 'app-routes', icon: 'description', data: { name: 'app.routes.ts', size: '8 KB', modified: '2026-07-12' } },\n          ],\n        },\n        { key: 'main', icon: 'description', data: { name: 'main.ts', size: '320 B', modified: '2026-07-01' } },\n        { key: 'styles', icon: 'description', data: { name: 'styles.css', size: '1 KB', modified: '2026-07-10' } },\n      ],\n    },\n    {\n      key: 'public',\n      icon: 'folder',\n      data: { name: 'public', size: '-', modified: '2026-06-15' },\n      children: [\n        { key: 'favicon', icon: 'image', data: { name: 'favicon.ico', size: '4 KB', modified: '2026-06-15' } },\n      ],\n    },\n    { key: 'angular-json', icon: 'description', data: { name: 'angular.json', size: '12 KB', modified: '2026-06-20' } },\n  ];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".doc-example-demo {\n  width: 100%;\n}"
    }
  ],
  "tree-table/codeControlled": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"doc-example-demo\">\n  <div class=\"tree-table-controls\">\n    <button type=\"button\" class=\"demo-btn\" (click)=\"expandAll()\">Expand all</button>\n    <button type=\"button\" class=\"demo-btn\" (click)=\"collapseAll()\">Collapse all</button>\n  </div>\n  <sn-tree-table [nodes]=\"fileNodes\" [(expandedKeys)]=\"expandedKeys\">\n    <sn-column field=\"name\" header=\"Name\" />\n    <sn-column field=\"size\" header=\"Size\" width=\"80px\" align=\"right\" />\n    <sn-column field=\"modified\" header=\"Modified\" />\n  </sn-tree-table>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { TableColumn } from 'ashen-ui/table';\nimport { TreeTable, TreeTableNode } from 'ashen-ui/tree-table';\n\n@Component({\n  selector: 'app-demo',\n  imports: [TableColumn, TreeTable],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly fileNodes: TreeTableNode[] = [\n    {\n      key: 'src',\n      icon: 'folder',\n      data: { name: 'src', size: '-', modified: '2026-07-14' },\n      children: [\n        {\n          key: 'app',\n          icon: 'folder',\n          data: { name: 'app', size: '-', modified: '2026-07-14' },\n          children: [\n            { key: 'app-ts', icon: 'description', data: { name: 'app.ts', size: '2 KB', modified: '2026-07-14' } },\n            { key: 'app-routes', icon: 'description', data: { name: 'app.routes.ts', size: '8 KB', modified: '2026-07-12' } },\n          ],\n        },\n        { key: 'main', icon: 'description', data: { name: 'main.ts', size: '320 B', modified: '2026-07-01' } },\n        { key: 'styles', icon: 'description', data: { name: 'styles.css', size: '1 KB', modified: '2026-07-10' } },\n      ],\n    },\n    {\n      key: 'public',\n      icon: 'folder',\n      data: { name: 'public', size: '-', modified: '2026-06-15' },\n      children: [\n        { key: 'favicon', icon: 'image', data: { name: 'favicon.ico', size: '4 KB', modified: '2026-06-15' } },\n      ],\n    },\n    { key: 'angular-json', icon: 'description', data: { name: 'angular.json', size: '12 KB', modified: '2026-06-20' } },\n  ];\n\n  readonly expandedKeys = signal<readonly string[]>(['src']);\n\n  expandAll(): void {\n    const keys: string[] = [];\n    this.collectKeys(this.fileNodes, keys);\n    this.expandedKeys.set(keys);\n  }\n\n  collapseAll(): void {\n    this.expandedKeys.set([]);\n  }\n\n  private collectKeys(nodes: readonly TreeTableNode[], result: string[]): void {\n    nodes.forEach((n) => {\n      if (n.children && n.children.length > 0) {\n        result.push(n.key);\n        this.collectKeys(n.children, result);\n      }\n    });\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".doc-example-demo {\n  width: 100%;\n}\n\n.tree-table-controls {\n  display: flex;\n  gap: 8px;\n  margin-bottom: 8px;\n}\n\n.demo-btn {\n  padding: 4px 10px;\n  border: 1px solid var(--sn-border);\n  border-radius: var(--sn-radius-sm);\n  background: var(--sn-surface-panel);\n  font-family: var(--sn-font-ui);\n  font-size: var(--sn-text-sm);\n  color: var(--sn-text);\n  cursor: pointer;\n\n  &:hover {\n    background: var(--sn-surface-hover);\n  }\n}"
    }
  ],
  "tree-table/codeCellDef": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"doc-example-demo\">\n  <sn-tree-table [nodes]=\"deployNodes\">\n    <sn-column field=\"name\" header=\"Name\" />\n    <sn-column field=\"region\" header=\"Region\" />\n    <sn-column field=\"status\" header=\"Status\">\n      <ng-template snCellDef let-data>\n        <sn-tag [value]=\"data.status\" />\n      </ng-template>\n    </sn-column>\n  </sn-tree-table>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { TableCellDef, TableColumn } from 'ashen-ui/table';\nimport { Tag } from 'ashen-ui/tag';\nimport { TreeTable, TreeTableNode } from 'ashen-ui/tree-table';\n\n@Component({\n  selector: 'app-demo',\n  imports: [TableCellDef, TableColumn, Tag, TreeTable],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly deployNodes: TreeTableNode[] = [\n    {\n      key: 'prod',\n      icon: 'cloud',\n      data: { name: 'production', region: 'us-east-1', status: 'healthy' },\n      children: [\n        { key: 'api', icon: 'dns', data: { name: 'api-server', region: 'us-east-1', status: 'healthy' } },\n        { key: 'db', icon: 'storage', data: { name: 'database', region: 'us-east-1', status: 'degraded' } },\n      ],\n    },\n    {\n      key: 'staging',\n      icon: 'cloud',\n      data: { name: 'staging', region: 'eu-west-1', status: 'healthy' },\n      children: [\n        { key: 'staging-api', icon: 'dns', data: { name: 'api-server', region: 'eu-west-1', status: 'healthy' } },\n      ],\n    },\n  ];\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".doc-example-demo {\n  width: 100%;\n}"
    }
  ],
  "virtual-scroller/codeBasic": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-scroller-wrapper\">\n  <sn-virtual-scroller\n    [items]=\"bigList\"\n    [itemHeight]=\"36\"\n    [height]=\"240\"\n  />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { VirtualScroller } from 'ashen-ui/virtual-scroller';\n\n@Component({\n  selector: 'app-demo',\n  imports: [VirtualScroller],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly bigList = Array.from({ length: 10000 }, (_, i) => `Row ${i + 1}`);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-scroller-wrapper {\n  width: 100%;\n  max-width: 420px;\n}"
    }
  ],
  "virtual-scroller/codeCustom": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-scroller-wrapper\">\n  <sn-virtual-scroller [items]=\"contacts\" [itemHeight]=\"52\" [height]=\"260\">\n    <ng-template snItemDef let-contact let-i=\"index\">\n      <div class=\"contact-row\">\n        <div class=\"contact-avatar\">{{ contact.name[0] }}</div>\n        <div class=\"contact-info\">\n          <span class=\"contact-name\">{{ contact.name }}</span>\n          <span class=\"contact-email\">{{ contact.email }}</span>\n        </div>\n      </div>\n    </ng-template>\n  </sn-virtual-scroller>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { VirtualScroller, VirtualScrollerItemDef } from 'ashen-ui/virtual-scroller';\n\ninterface Contact {\n  name: string;\n  email: string;\n}\n\n@Component({\n  selector: 'app-demo',\n  imports: [VirtualScroller, VirtualScrollerItemDef],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly contacts: Contact[] = Array.from({ length: 5000 }, (_, i) => ({\n    name: `User ${i + 1}`,\n    email: `user${i + 1}@example.com`,\n  }));\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-scroller-wrapper {\n  width: 100%;\n  max-width: 420px;\n}\n\n.contact-row {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  height: 100%;\n  padding: 0 12px;\n  border-bottom: 1px solid var(--sn-border-subtle);\n  box-sizing: border-box;\n}\n\n.contact-avatar {\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  background: var(--sn-color-primary-soft);\n  color: var(--sn-color-primary);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: var(--sn-text-sm);\n  font-weight: 600;\n  flex-shrink: 0;\n}\n\n.contact-info {\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n}\n\n.contact-name {\n  font-size: var(--sn-text-sm);\n  color: var(--sn-text);\n  font-weight: 500;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.contact-email {\n  font-size: var(--sn-text-xs);\n  color: var(--sn-text-muted);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}"
    }
  ],
  "virtual-scroller/codeSizes": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-scroller-wrapper\">\n  <sn-virtual-scroller\n    [items]=\"bigList\"\n    [itemHeight]=\"48\"\n    [height]=\"300\"\n    [overscan]=\"8\"\n  />\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component } from '@angular/core';\nimport { VirtualScroller } from 'ashen-ui/virtual-scroller';\n\n@Component({\n  selector: 'app-demo',\n  imports: [VirtualScroller],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  readonly bigList = Array.from({ length: 10000 }, (_, i) => `Row ${i + 1}`);\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-scroller-wrapper {\n  width: 100%;\n  max-width: 420px;\n}"
    }
  ],
  "virtual-scroller/codeInfinite": [
    {
      "name": "demo.html",
      "lang": "html",
      "code": "<div class=\"demo-scroller-wrapper\">\n  <p class=\"hint-text\">\n    Rows scrolled out of view are removed from the DOM and re-rendered when you\n    scroll back - the total scroll height is preserved so the position never jumps.\n    Near the end, <code>loadMore</code> fires to append the next page.\n  </p>\n  <sn-virtual-scroller\n    [items]=\"infiniteItems()\"\n    [itemHeight]=\"36\"\n    [height]=\"260\"\n    [hasMore]=\"infiniteHasMore()\"\n    (loadMore)=\"onLoadMore()\"\n  />\n  <p class=\"demo-note\">{{ infiniteItems().length }} items loaded{{ infiniteHasMore() ? '' : ' (all)' }}</p>\n</div>"
    },
    {
      "name": "demo.ts",
      "lang": "ts",
      "code": "import { Component, computed, signal } from '@angular/core';\nimport { VirtualScroller } from 'ashen-ui/virtual-scroller';\n\n@Component({\n  selector: 'app-demo',\n  imports: [VirtualScroller],\n  templateUrl: './demo.html',\n})\nexport class Demo {\n  private static readonly PAGE_SIZE = 100;\n\n  private static readonly MAX_ITEMS = 500;\n\n  readonly infiniteItems = signal(\n    Array.from({ length: VirtualScrollerPage.PAGE_SIZE }, (_, i) => `Item ${i + 1}`),\n  );\n\n  readonly infiniteHasMore = computed(\n    () => this.infiniteItems().length < VirtualScrollerPage.MAX_ITEMS,\n  );\n\n  onLoadMore(): void {\n    const current = this.infiniteItems();\n    const next = Array.from(\n      { length: VirtualScrollerPage.PAGE_SIZE },\n      (_, i) => `Item ${current.length + i + 1}`,\n    );\n    this.infiniteItems.set([...current, ...next]);\n  }\n}"
    },
    {
      "name": "demo.scss",
      "lang": "scss",
      "code": ".demo-scroller-wrapper {\n  width: 100%;\n  max-width: 420px;\n}\n\n.hint-text {\n  font-size: 0.8rem;\n  color: var(--sn-text-subtle);\n  margin: 0 0 8px;\n}\n\n.demo-note {\n  margin-top: 8px;\n  font-size: var(--sn-text-sm);\n  color: var(--sn-text-muted);\n}"
    }
  ]
};
