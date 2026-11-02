import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormField, FormFieldLabel, FormFieldHint } from 'ashen-ui/form-field';
import { InputText } from 'ashen-ui/input-text';
import { InputMask } from 'ashen-ui/input-mask';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-input-mask-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [
    FormField,
    FormFieldLabel,
    FormFieldHint,
    InputText,
    InputMask,
    DocExample,
    FormsModule,
    ReactiveFormsModule, DocApi],
  templateUrl: './input-mask-page.html',
  styleUrl: './input-mask-page.scss',
})
export class InputMaskPage {
  protected readonly phone = signal('');
  protected readonly date = signal('');
  protected readonly plate = signal('');
  protected readonly zip = signal('');
  protected readonly raw = signal('');
  protected readonly autoCleared = signal('');
  protected readonly retained = new FormControl('', { nonNullable: true });

  protected readonly codeThirdParty = `// Numeric masks with separators, self-correcting dates and
// Conditional masks need a real engine; bring one and tell the field what empty means.
import { InputText } from 'ashen-ui/input-text';

@Directive({ selector: 'input[myMask]' })
export class MyMask implements OnInit {
  private readonly host = inject(Injector);

  ngOnInit() {
    const input = this.host.get(InputText, null, { self: true, optional: true });
    input?.setEmptyPredicate(() => myEngine.unmasked() === '');
  }
}`;
}
