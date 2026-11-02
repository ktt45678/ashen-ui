import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CascadeSelect } from 'ashen-ui/cascade-select';
import type { CascadeOption } from 'ashen-ui/cascade-select';
import { FormField, FormFieldLabel, FormFieldHint } from 'ashen-ui/form-field';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-cascade-select-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [CascadeSelect, FormField, FormFieldLabel, FormFieldHint, DocExample, ReactiveFormsModule, FormsModule, DocApi],
  templateUrl: './cascade-select-page.html',
  styleUrl: './cascade-select-page.scss',
})
export class CascadeSelectPage {
  protected readonly countryOptions: CascadeOption[] = [
    {
      label: 'Europe',
      icon: 'public',
      children: [
        {
          label: 'France',
          icon: 'flag',
          children: [
            { label: 'Paris', value: 'fr.paris' },
            { label: 'Lyon', value: 'fr.lyon' },
            { label: 'Marseille', value: 'fr.marseille' },
          ],
        },
        {
          label: 'Germany',
          icon: 'flag',
          children: [
            { label: 'Berlin', value: 'de.berlin' },
            { label: 'Munich', value: 'de.munich' },
          ],
        },
        {
          label: 'United Kingdom',
          icon: 'flag',
          children: [
            { label: 'London', value: 'uk.london' },
            { label: 'Manchester', value: 'uk.manchester' },
          ],
        },
      ],
    },
    {
      label: 'Asia',
      icon: 'public',
      children: [
        {
          label: 'Japan',
          icon: 'flag',
          children: [
            { label: 'Tokyo', value: 'jp.tokyo' },
            { label: 'Osaka', value: 'jp.osaka' },
          ],
        },
        {
          label: 'South Korea',
          icon: 'flag',
          children: [
            { label: 'Seoul', value: 'kr.seoul' },
          ],
        },
      ],
    },
  ];

  protected readonly mediaOptions: CascadeOption[] = [
    {
      label: 'Media',
      icon: 'music_note',
      children: [
        { label: 'Play / Pause', value: 'media.toggle' },
        { label: 'Next Track', value: 'media.next' },
        { label: 'Previous Track', value: 'media.prev' },
      ],
    },
    {
      label: 'System',
      icon: 'memory',
      children: [
        { label: 'Lock Screen', value: 'sys.lock' },
        {
          label: 'Power',
          icon: 'power_settings_new',
          children: [
            { label: 'Shutdown', value: 'sys.shutdown' },
            { label: 'Restart', value: 'sys.restart' },
            { label: 'Sleep', value: 'sys.sleep' },
          ],
        },
      ],
    },
    { label: 'Mute', icon: 'volume_off', value: 'mute' },
  ];

  protected readonly basicValue = signal<unknown>(null);
  protected readonly formFieldValue = signal<unknown>(null);
  protected readonly disabledValue = signal<unknown>('fr.paris');
  protected readonly preselectedValue = signal<unknown>('sys.shutdown');
  protected readonly formCtrl = new FormControl<unknown>(null);

}
