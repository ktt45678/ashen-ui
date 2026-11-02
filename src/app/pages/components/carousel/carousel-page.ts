import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  Carousel,
  CarouselItem,
  CarouselPrev,
  CarouselNext,
  CarouselPagination,
  CarouselNoSwipe,
} from 'ashen-ui/carousel';
import { Button } from 'ashen-ui/button';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-carousel-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [
    Carousel,
    CarouselItem,
    CarouselPrev,
    CarouselNext,
    CarouselPagination,
    CarouselNoSwipe,
    Button,
    DocExample, DocApi],
  templateUrl: './carousel-page.html',
  styleUrl: './carousel-page.scss',
})
export class CarouselPage {
  protected readonly activeIndex = signal(0);

}
