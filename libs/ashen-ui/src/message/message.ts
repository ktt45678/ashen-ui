import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Icon } from 'ashen-ui/icon';
import {
  SnIconRegistry,
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnStyle,
  resolveSnClass,
  SnMessageIntl,
} from 'ashen-ui/core';

const MESSAGE_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['role'],
  closeButton: ['type', 'aria-label'],
};

export type MessageSeverity = 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'sn-message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, SnPart],
  hostDirectives: [SnPart],
  templateUrl: './message.html',
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => Message) }],
  host: {
    class: 'sn-message',
    '[class.sn-message--info]': 'severity() === "info"',
    '[class.sn-message--success]': 'severity() === "success"',
    '[class.sn-message--warning]': 'severity() === "warning"',
    '[class.sn-message--error]': 'severity() === "error"',
    '[class.sn-message--closable]': 'closable()',
    '[class.sn-message--simple]': 'simple()',
    '[class.sn-message--hidden]': '!visible()',
    '[attr.role]': 'ariaRole()',
    '[class]': 'snClassResolved()',
    '[attr.data-sn-severity]': 'severity()',
    '[attr.data-sn-closable]': 'closable() ? "" : null',
    '[attr.data-sn-simple]': 'simple() ? "" : null',
    '[attr.data-sn-hidden]': '!visible() ? "" : null',
  },
})
export class Message implements SnPartSource {
  protected readonly icons = inject(SnIconRegistry);

  readonly severity = input<MessageSeverity>('info');
  readonly icon = input<string | undefined>(undefined);
  readonly closable = input(false, { transform: booleanAttribute });
  /** Text-only variant - severity-tinted text with no icon, container, border or background. */
  readonly simple = input(false, { transform: booleanAttribute });
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    MESSAGE_RESERVED_ATTRS[section] ?? [];

  readonly closed = output<void>();

  protected readonly intl = inject(SnMessageIntl);
  protected readonly visible = signal(true);

  protected readonly effectiveIcon = computed(
    () => this.icon() ?? this.icons.resolve(this.severity()),
  );

  protected readonly ariaRole = computed(() =>
    this.severity() === 'error' || this.severity() === 'warning' ? 'alert' : 'status',
  );

  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly iconClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'icon', false),
  );

  protected readonly contentClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'content', false),
  );

  protected readonly closeButtonClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'closeButton', false),
  );

  protected onClose(): void {
    this.visible.set(false);
    this.closed.emit();
  }
}
