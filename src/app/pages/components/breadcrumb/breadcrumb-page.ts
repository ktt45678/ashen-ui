import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Breadcrumb, BreadcrumbItem } from 'ashen-ui/breadcrumb';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-breadcrumb-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Breadcrumb, BreadcrumbItem, DocExample, DocApi],
  templateUrl: './breadcrumb-page.html',
  styleUrl: './breadcrumb-page.scss',
})
export class BreadcrumbPage {

}
