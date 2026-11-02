import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Chip } from 'ashen-ui/chip';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-chip-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Chip, DocExample, DocApi],
  templateUrl: './chip-page.html',
  styleUrl: './chip-page.scss',
})
export class ChipPage {
  protected readonly toggleChips = signal([
    { label: 'Streaming', icon: 'videocam', selected: true },
    { label: 'Audio', icon: 'headphones', selected: false },
    { label: 'macros', icon: '', selected: false },
    { label: 'deploy', icon: '', selected: true },
  ]);

  protected readonly removableChips = signal(['Streaming', 'macros', 'deploy', 'typescript']);

  protected toggleChip(target: { label: string; icon: string; selected: boolean }): void {
    this.toggleChips.update((chips) =>
      chips.map((c) => (c.label === target.label ? { ...c, selected: !c.selected } : c)),
    );
  }

  protected removeChip(label: string): void {
    this.removableChips.update((chips) => chips.filter((c) => c !== label));
  }

}
