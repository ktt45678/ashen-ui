import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SplitButton } from 'ashen-ui/split-button';
import { Menu, MenuItem, MenuSeparator } from 'ashen-ui/menu';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-split-button-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [SplitButton, Menu, MenuItem, MenuSeparator, DocExample, DocApi],
  templateUrl: './split-button-page.html',
  styleUrl: './split-button-page.scss',
})
export class SplitButtonPage {

  save(): void {}
}
