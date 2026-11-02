import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { type SnClass, resolveSnClass } from 'ashen-ui/core';

@Component({
  selector: 'sn-input-group-addon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input-group-addon.html',
  host: {
    class: 'sn-input-group-addon',
    '[class]': 'snClassResolved()',
  },
})
export class InputGroupAddon {
  readonly icon = input<string>();
  readonly snClass = input<SnClass>();

  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly iconClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'icon', false),
  );
}
