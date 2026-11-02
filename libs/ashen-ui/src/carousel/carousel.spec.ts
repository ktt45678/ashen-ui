import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Dir } from '@angular/cdk/bidi';
import { provideSnIntl } from 'ashen-ui/core';
import { Carousel } from './carousel';
import { CarouselItem } from './carousel-item';
import { CarouselPrev, CarouselNext, CarouselNoSwipe } from './carousel-nav';
import { CarouselPagination } from './carousel-pagination';

@Component({
  template: `
    <sn-carousel>
      <sn-carousel-item>Slide A</sn-carousel-item>
      <sn-carousel-item>Slide B</sn-carousel-item>
      <sn-carousel-item>Slide C</sn-carousel-item>
    </sn-carousel>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Carousel, CarouselItem],
})
class ThreeSlideHost {}

@Component({
  template: `
    <sn-carousel [(activeIndex)]="idx">
      <sn-carousel-item>One</sn-carousel-item>
      <sn-carousel-item>Two</sn-carousel-item>
    </sn-carousel>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Carousel, CarouselItem],
})
class ModelHost {
  readonly idx = signal(0);
}

@Component({
  template: `
    <sn-carousel [snClass]="'extra-class'">
      <sn-carousel-item>A</sn-carousel-item>
    </sn-carousel>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Carousel, CarouselItem],
})
class SnClassHost {}

@Component({
  template: `
    <div dir="rtl">
      <sn-carousel [(activeIndex)]="idx">
        <sn-carousel-item>One</sn-carousel-item>
        <sn-carousel-item>Two</sn-carousel-item>
        <sn-carousel-item>Three</sn-carousel-item>
      </sn-carousel>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Dir, Carousel, CarouselItem],
})
class RtlHost {
  readonly idx = signal(0);
}

describe('Carousel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('applies sn-carousel host class', async () => {
    const fixture = TestBed.createComponent(ThreeSlideHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-carousel');
    expect(el.classList).toContain('sn-carousel');
  });

  it('has role="region" and aria-roledescription="carousel"', async () => {
    const fixture = TestBed.createComponent(ThreeSlideHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-carousel');
    expect(el.getAttribute('role')).toBe('region');
    expect(el.getAttribute('aria-roledescription')).toBe('carousel');
  });

  it('sets default aria-label from SnIntl', async () => {
    const fixture = TestBed.createComponent(ThreeSlideHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-carousel');
    expect(el.getAttribute('aria-label')).toBe('Carousel');
  });

  it('overrides aria-label via provideSnIntl', async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideSnIntl({ carouselLabel: 'My Slider' })],
    });
    const fixture = TestBed.createComponent(ThreeSlideHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-carousel');
    expect(el.getAttribute('aria-label')).toBe('My Slider');
  });

  it('renders items with role="group" and aria-roledescription="slide"', async () => {
    const fixture = TestBed.createComponent(ThreeSlideHost);
    await fixture.whenStable();
    const items = fixture.nativeElement.querySelectorAll('sn-carousel-item');
    items.forEach((item: HTMLElement) => {
      expect(item.getAttribute('role')).toBe('group');
      expect(item.getAttribute('aria-roledescription')).toBe('slide');
    });
  });

  it('slide labels follow "Slide n of m" pattern', async () => {
    const fixture = TestBed.createComponent(ThreeSlideHost);
    await fixture.whenStable();
    const items = fixture.nativeElement.querySelectorAll('sn-carousel-item');
    expect(items[0].getAttribute('aria-label')).toBe('Slide 1 of 3');
    expect(items[1].getAttribute('aria-label')).toBe('Slide 2 of 3');
    expect(items[2].getAttribute('aria-label')).toBe('Slide 3 of 3');
  });

  it('prev button is disabled on the first slide', async () => {
    const fixture = TestBed.createComponent(ThreeSlideHost);
    await fixture.whenStable();
    const prevBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-carousel-btn-prev');
    expect(prevBtn.disabled).toBe(true);
  });

  it('next button is disabled on the last slide', async () => {
    const fixture = TestBed.createComponent(ModelHost);
    await fixture.whenStable();
    fixture.componentInstance.idx.set(1);
    await fixture.whenStable();
    const nextBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-carousel-btn-next');
    expect(nextBtn.disabled).toBe(true);
  });

  it('next button click shows the next slide', async () => {
    const fixture = TestBed.createComponent(ThreeSlideHost);
    await fixture.whenStable();
    const nextBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-carousel-btn-next');
    nextBtn.click();
    await fixture.whenStable();
    const carousel: HTMLElement = fixture.nativeElement.querySelector('sn-carousel');
    const track: HTMLElement = carousel.querySelector('.sn-carousel-track')!;
    expect(track.style.transform).toContain('1');
  });

  it('prev button click shows the previous slide', async () => {
    const fixture = TestBed.createComponent(ModelHost);
    await fixture.whenStable();
    fixture.componentInstance.idx.set(1);
    await fixture.whenStable();
    const prevBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-carousel-btn-prev');
    prevBtn.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.idx()).toBe(0);
  });

  it('dot click jumps to that slide', async () => {
    const fixture = TestBed.createComponent(ThreeSlideHost);
    await fixture.whenStable();
    const dots: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.sn-carousel-dot');
    dots[2].click();
    await fixture.whenStable();
    expect(dots[2].getAttribute('aria-current')).toBe('true');
    expect(dots[0].getAttribute('aria-current')).toBeNull();
  });

  it('the track shifts to show the active slide', async () => {
    const fixture = TestBed.createComponent(ModelHost);
    await fixture.whenStable();
    const track: HTMLElement = fixture.nativeElement.querySelector('.sn-carousel-track');
    expect(track.style.transform).toContain('0');
    fixture.componentInstance.idx.set(1);
    await fixture.whenStable();
    expect(track.style.transform).toContain('1');
  });

  it('inactive slides have aria-hidden="true"', async () => {
    const fixture = TestBed.createComponent(ThreeSlideHost);
    await fixture.whenStable();
    const items = fixture.nativeElement.querySelectorAll('sn-carousel-item');
    expect(items[0].getAttribute('aria-hidden')).toBeNull();
    expect(items[1].getAttribute('aria-hidden')).toBe('true');
    expect(items[2].getAttribute('aria-hidden')).toBe('true');
  });

  it('ArrowRight on host shows the next slide', async () => {
    const fixture = TestBed.createComponent(ThreeSlideHost);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement.querySelector('sn-carousel');
    host.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await fixture.whenStable();
    const track: HTMLElement = fixture.nativeElement.querySelector('.sn-carousel-track');
    expect(track.style.transform).toContain('1');
  });

  it('ArrowLeft on host shows the previous slide (clamped at the first)', async () => {
    const fixture = TestBed.createComponent(ModelHost);
    await fixture.whenStable();
    fixture.componentInstance.idx.set(1);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement.querySelector('sn-carousel');
    host.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.idx()).toBe(0);
  });

  it('ArrowLeft shows the next slide in rtl', async () => {
    const fixture = TestBed.createComponent(RtlHost);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement.querySelector('sn-carousel');

    host.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await fixture.whenStable();

    expect(fixture.componentInstance.idx()).toBe(1);
  });

  it('ArrowRight shows the previous slide in rtl', async () => {
    const fixture = TestBed.createComponent(RtlHost);
    fixture.componentInstance.idx.set(1);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement.querySelector('sn-carousel');

    host.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await fixture.whenStable();

    expect(fixture.componentInstance.idx()).toBe(0);
  });

  it('points the navigation chevrons the other way in rtl', async () => {
    const fixture = TestBed.createComponent(RtlHost);
    await fixture.whenStable();
    const prev = fixture.nativeElement.querySelector('.sn-carousel-btn-prev sn-icon');
    const next = fixture.nativeElement.querySelector('.sn-carousel-btn-next sn-icon');

    expect(prev.textContent.trim()).toBe('chevron_right');
    expect(next.textContent.trim()).toBe('chevron_left');
  });

  it('dot aria-labels follow carouselGoto pattern', async () => {
    const fixture = TestBed.createComponent(ThreeSlideHost);
    await fixture.whenStable();
    const dots: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.sn-carousel-dot');
    expect(dots[0].getAttribute('aria-label')).toBe('Go to slide 1');
    expect(dots[1].getAttribute('aria-label')).toBe('Go to slide 2');
    expect(dots[2].getAttribute('aria-label')).toBe('Go to slide 3');
  });

  it('snClass merges extra class onto host', async () => {
    const fixture = TestBed.createComponent(SnClassHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-carousel');
    expect(el.classList).toContain('extra-class');
  });

  it('prev/next button aria-labels from SnIntl', async () => {
    const fixture = TestBed.createComponent(ThreeSlideHost);
    await fixture.whenStable();
    const prevBtn: HTMLElement = fixture.nativeElement.querySelector('.sn-carousel-btn-prev');
    const nextBtn: HTMLElement = fixture.nativeElement.querySelector('.sn-carousel-btn-next');
    expect(prevBtn.getAttribute('aria-label')).toBe('Previous slide');
    expect(nextBtn.getAttribute('aria-label')).toBe('Next slide');
  });

  it('SnIntl override changes slide labels', async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideSnIntl({ carouselSlide: (i: number, t: number) => `Diapositive ${i} sur ${t}` })],
    });
    const fixture = TestBed.createComponent(ThreeSlideHost);
    await fixture.whenStable();
    const items = fixture.nativeElement.querySelectorAll('sn-carousel-item');
    expect(items[0].getAttribute('aria-label')).toBe('Diapositive 1 sur 3');
  });

  it('applies snStyle and allowed snAttrs to carousel root, repeated dots and a slide', async () => {
    @Component({
      template: `
        <sn-carousel
          [snStyle]="{ root: { outline: '1px solid red' }, indicator: { color: 'rgb(1, 2, 3)' } }"
          [snAttrs]="{
            root: { 'data-testid': 'car-root', role: 'presentation' },
            indicator: { 'data-testid': 'car-dot', 'aria-current': 'nope' }
          }"
        >
          <sn-carousel-item
            [snStyle]="{ root: { color: 'rgb(7, 8, 9)' } }"
            [snAttrs]="{ root: { 'data-testid': 'slide-root', role: 'presentation' } }"
          >A</sn-carousel-item>
          <sn-carousel-item>B</sn-carousel-item>
          <sn-carousel-item>C</sn-carousel-item>
        </sn-carousel>
      `,
      imports: [Carousel, CarouselItem],
    })
    class SnPartHost {}

    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const root: HTMLElement = el.querySelector('sn-carousel')!;
    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('car-root');
    // role is library-owned, so the pass-through cannot replace it.
    expect(root.getAttribute('role')).toBe('region');

    // Every dot shares the one 'indicator' section, so each is styled the same.
    const dots = el.querySelectorAll<HTMLElement>('.sn-carousel-dot');
    expect(dots.length).toBe(3);
    dots.forEach((dot) => {
      expect(dot.style.color).toBe('rgb(1, 2, 3)');
      expect(dot.getAttribute('data-testid')).toBe('car-dot');
    });
    // aria-current is reserved, so the real active state survives the override.
    expect(dots[0].getAttribute('aria-current')).toBe('true');
    expect(dots[1].getAttribute('aria-current')).toBeNull();

    const slide: HTMLElement = el.querySelector('sn-carousel-item')!;
    expect(slide.style.color).toBe('rgb(7, 8, 9)');
    expect(slide.getAttribute('data-testid')).toBe('slide-root');
    expect(slide.getAttribute('role')).toBe('group');
  });
});

@Component({
  template: `
    <sn-carousel [options]="{ navigation: false, pagination: false }">
      <sn-carousel-item>A</sn-carousel-item>
      <sn-carousel-item>B</sn-carousel-item>
    </sn-carousel>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Carousel, CarouselItem],
})
class NoChromeHost {}

@Component({
  template: `
    <sn-carousel [(activeIndex)]="idx" [options]="{ loop: true }">
      <sn-carousel-item>A</sn-carousel-item>
      <sn-carousel-item>B</sn-carousel-item>
    </sn-carousel>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Carousel, CarouselItem],
})
class LoopHost {
  readonly idx = signal(0);
}

@Component({
  template: `
    <sn-carousel [options]="{ slidesPerView: 2 }">
      <sn-carousel-item>A</sn-carousel-item>
      <sn-carousel-item>B</sn-carousel-item>
      <sn-carousel-item>C</sn-carousel-item>
    </sn-carousel>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Carousel, CarouselItem],
})
class MultiViewHost {}

@Component({
  template: `
    <sn-carousel [(activeIndex)]="idx" [options]="{ slidesPerView: 3, slidesPerGroup: 3 }">
      @for (n of [1, 2, 3, 4, 5, 6]; track n) {
        <sn-carousel-item>{{ n }}</sn-carousel-item>
      }
    </sn-carousel>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Carousel, CarouselItem],
})
class GroupHost {
  readonly idx = signal(0);
}

@Component({
  template: `
    <sn-carousel [(activeIndex)]="idx" [options]="{ autoplay: { delay: 30 }, loop: true }">
      <sn-carousel-item><button class="inner">One</button></sn-carousel-item>
      <sn-carousel-item>Two</sn-carousel-item>
      <sn-carousel-item>Three</sn-carousel-item>
    </sn-carousel>
    <button class="outside">Outside</button>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Carousel, CarouselItem],
})
class AutoplayHost {
  readonly idx = signal(0);
}

describe('Carousel autoplay', () => {
  const tick = (ms = 0) => new Promise<void>((r) => setTimeout(r, ms));

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  async function setup() {
    const fixture = TestBed.createComponent(AutoplayHost);
    await fixture.whenStable();
    const carousel = fixture.debugElement.children[0].componentInstance as Carousel;
    return { fixture, carousel };
  }

  it('advances on its own', async () => {
    const { fixture, carousel } = await setup();
    expect(carousel.playing()).toBe(true);
    await tick(80);
    expect(fixture.componentInstance.idx()).not.toBe(0);
  });

  it('pauses while keyboard focus is inside and resumes when it leaves', async () => {
    const { fixture, carousel } = await setup();
    const inner = fixture.nativeElement.querySelector('.inner') as HTMLElement;
    const outside = fixture.nativeElement.querySelector('.outside') as HTMLElement;

    inner.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await fixture.whenStable();
    expect(carousel.playing()).toBe(false);
    await tick(80);
    expect(fixture.componentInstance.idx()).toBe(0);

    inner.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: outside }));
    await fixture.whenStable();
    expect(carousel.playing()).toBe(true);
  });

  it('pause() stops autoplay until play()', async () => {
    const { fixture, carousel } = await setup();
    carousel.pause();
    await fixture.whenStable();
    expect(carousel.playing()).toBe(false);
    await tick(80);
    expect(fixture.componentInstance.idx()).toBe(0);

    carousel.play();
    await fixture.whenStable();
    expect(carousel.playing()).toBe(true);
  });
});

describe('Carousel options', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('navigation:false hides the built-in prev/next buttons', async () => {
    const fixture = TestBed.createComponent(NoChromeHost);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.sn-carousel-btn-prev')).toBeNull();
    expect(fixture.nativeElement.querySelector('.sn-carousel-btn-next')).toBeNull();
  });

  it('pagination:false hides the built-in dots', async () => {
    const fixture = TestBed.createComponent(NoChromeHost);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.sn-carousel-dots')).toBeNull();
  });

  it('loop wraps next from the last slide back to the first', async () => {
    const fixture = TestBed.createComponent(LoopHost);
    await fixture.whenStable();
    fixture.componentInstance.idx.set(1);
    await fixture.whenStable();
    const nextBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-carousel-btn-next');
    expect(nextBtn.disabled).toBe(false);
    nextBtn.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.idx()).toBe(0);
  });

  it('loop wraps prev from the first slide back to the last', async () => {
    const fixture = TestBed.createComponent(LoopHost);
    await fixture.whenStable();
    const prevBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-carousel-btn-prev');
    expect(prevBtn.disabled).toBe(false);
    prevBtn.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.idx()).toBe(1);
  });

  it('slidesPerView keeps multiple slides visible (not inert)', async () => {
    const fixture = TestBed.createComponent(MultiViewHost);
    await fixture.whenStable();
    const items = fixture.nativeElement.querySelectorAll('sn-carousel-item');
    expect(items[0].getAttribute('aria-hidden')).toBeNull();
    expect(items[1].getAttribute('aria-hidden')).toBeNull();
    expect(items[2].getAttribute('aria-hidden')).toBe('true');
  });

  it('slidesPerView renders one dot per reachable position, not per slide', async () => {
    const fixture = TestBed.createComponent(MultiViewHost);
    await fixture.whenStable();
    // 3 slides, slidesPerView 2 → 2 snap positions → 2 dots.
    const dots = fixture.nativeElement.querySelectorAll('.sn-carousel-dot');
    expect(dots.length).toBe(2);
    // Next button disables once the last position is reached (index 1).
    const nextBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-carousel-btn-next');
    nextBtn.click();
    await fixture.whenStable();
    expect(nextBtn.disabled).toBe(true);
  });

  it('slidesPerGroup advances a whole group per step and yields one dot per group', async () => {
    const fixture = TestBed.createComponent(GroupHost);
    await fixture.whenStable();
    // 6 slides, slidesPerView 3, slidesPerGroup 3 → snap points [0, 3] → 2 dots.
    const dots = fixture.nativeElement.querySelectorAll('.sn-carousel-dot');
    expect(dots.length).toBe(2);
    const nextBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-carousel-btn-next');
    nextBtn.click();
    await fixture.whenStable();
    // Advanced by a full group of 3.
    expect(fixture.componentInstance.idx()).toBe(3);
    expect(nextBtn.disabled).toBe(true);
  });
});

@Component({
  template: `
    <sn-carousel #c [(activeIndex)]="idx">
      <sn-carousel-item>A</sn-carousel-item>
      <sn-carousel-item>B</sn-carousel-item>
      <sn-carousel-item>C</sn-carousel-item>
    </sn-carousel>
    <button class="ext-next" [snCarouselNext]="c">Next</button>
    <button class="ext-prev" [snCarouselPrev]="c">Prev</button>
    <sn-carousel-pagination [carousel]="c" />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Carousel, CarouselItem, CarouselPrev, CarouselNext, CarouselPagination],
})
class ExternalNavHost {
  readonly idx = signal(0);
}

@Component({
  template: `
    <sn-carousel [(activeIndex)]="idx" [options]="{ navigation: false }">
      <sn-carousel-item>A</sn-carousel-item>
      <sn-carousel-item>B</sn-carousel-item>
      <button snCarouselNext class="proj-next">Next</button>
    </sn-carousel>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Carousel, CarouselItem, CarouselNext],
})
class ProjectedNavHost {
  readonly idx = signal(0);
}

@Component({
  template: `
    <sn-carousel>
      <sn-carousel-item>
        <p class="selectable" snCarouselNoSwipe>Selectable text</p>
      </sn-carousel-item>
      <sn-carousel-item>B</sn-carousel-item>
    </sn-carousel>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Carousel, CarouselItem, CarouselNoSwipe],
})
class NoSwipeHost {}

describe('Carousel custom navigation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('external snCarouselNext button drives the carousel via template ref', async () => {
    const fixture = TestBed.createComponent(ExternalNavHost);
    await fixture.whenStable();
    const next: HTMLButtonElement = fixture.nativeElement.querySelector('.ext-next');
    next.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.idx()).toBe(1);
  });

  it('external snCarouselPrev is disabled on the first slide', async () => {
    const fixture = TestBed.createComponent(ExternalNavHost);
    await fixture.whenStable();
    const prev: HTMLButtonElement = fixture.nativeElement.querySelector('.ext-prev');
    expect(prev.hasAttribute('disabled')).toBe(true);
  });

  it('standalone sn-carousel-pagination renders a dot per slide and navigates', async () => {
    const fixture = TestBed.createComponent(ExternalNavHost);
    await fixture.whenStable();
    const dots = fixture.nativeElement.querySelectorAll('sn-carousel-pagination .sn-carousel-dot');
    expect(dots.length).toBe(3);
    dots[2].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.idx()).toBe(2);
  });

  it('projected snCarouselNext inside the carousel wires to the enclosing carousel', async () => {
    const fixture = TestBed.createComponent(ProjectedNavHost);
    await fixture.whenStable();
    const next: HTMLButtonElement = fixture.nativeElement.querySelector('.proj-next');
    next.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.idx()).toBe(1);
  });

  it('snCarouselNoSwipe applies the swipe-exempt marker class', async () => {
    const fixture = TestBed.createComponent(NoSwipeHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('.selectable');
    expect(el.classList).toContain('sn-carousel-no-swipe');
  });
});
