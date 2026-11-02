import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent, CardFooter } from 'ashen-ui/card';
import { Button } from 'ashen-ui/button';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-card-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Card, CardHeader, CardTitle, CardSubtitle, CardContent, CardFooter, Button, DocExample, DocApi],
  templateUrl: './card-page.html',
  styleUrl: './card-page.scss',
})
export class CardPage {

}
