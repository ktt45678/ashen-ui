import { Component, provideZonelessChangeDetection, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideSnIntl } from 'ashen-ui/core';
import { Avatar } from './avatar';
import { AvatarGroup } from './avatar-group';

@Component({
  template: `
    <sn-avatar-group [max]="max()" [size]="size()">
      @for (name of names(); track name) {
        <sn-avatar [label]="name" />
      }
    </sn-avatar-group>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Avatar, AvatarGroup],
})
class Host {
  readonly max = signal(0);
  readonly size = signal<'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly names = signal(['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson']);
}

function setup(providers: unknown[] = []) {
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection(), ...(providers as never[])],
  });
  const fixture = TestBed.createComponent(Host);
  fixture.detectChanges();
  return fixture;
}

const visible = (fixture: { nativeElement: HTMLElement }) =>
  [...fixture.nativeElement.querySelectorAll('sn-avatar')].filter(
    (a) => !a.classList.contains('sn-avatar--overflowed'),
  );

describe('AvatarGroup', () => {
  it('shows every avatar and no counter without a max', () => {
    const fixture = setup();

    expect(visible(fixture).length).toBe(4);
    expect(fixture.nativeElement.querySelector('.sn-avatar-counter')).toBeNull();
  });

  it('keeps max avatars and counts the rest', () => {
    const fixture = setup();
    fixture.componentInstance.max.set(2);
    fixture.detectChanges();

    expect(visible(fixture).length).toBe(2);
    expect(fixture.nativeElement.querySelector('.sn-avatar-counter').textContent.trim()).toBe('+2');
  });

  it('drops the counter when max covers every avatar', () => {
    const fixture = setup();
    fixture.componentInstance.max.set(4);
    fixture.detectChanges();

    expect(visible(fixture).length).toBe(4);
    expect(fixture.nativeElement.querySelector('.sn-avatar-counter')).toBeNull();
  });

  it('recounts when avatars are added or removed', () => {
    const fixture = setup();
    fixture.componentInstance.max.set(2);
    fixture.detectChanges();

    fixture.componentInstance.names.update((n) => [...n, 'Edsger Dijkstra']);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.sn-avatar-counter').textContent.trim()).toBe('+3');

    fixture.componentInstance.names.set(['Ada Lovelace', 'Grace Hopper']);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.sn-avatar-counter')).toBeNull();
  });

  it('labels the counter for assistive technology', () => {
    const fixture = setup();
    fixture.componentInstance.max.set(1);
    fixture.detectChanges();
    const counter = fixture.nativeElement.querySelector('.sn-avatar-counter');

    expect(counter.getAttribute('role')).toBe('img');
    expect(counter.getAttribute('aria-label')).toBe('3 more');
  });

  it('takes the counter label from SnAvatarIntl', () => {
    const fixture = setup([provideSnIntl({ avatar: { more: (n: number) => `noch ${n}` } })]);
    fixture.componentInstance.max.set(1);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.sn-avatar-counter').getAttribute('aria-label')).toBe(
      'noch 3',
    );
  });

  it('sizes its avatars, and the counter with them', () => {
    const fixture = setup();
    fixture.componentInstance.max.set(2);
    fixture.componentInstance.size.set('lg');
    fixture.detectChanges();

    expect(visible(fixture).every((a) => a.classList.contains('sn-avatar-lg'))).toBe(true);
    expect(
      fixture.nativeElement.querySelector('.sn-avatar-counter').classList.contains('sn-avatar-lg'),
    ).toBe(true);
  });
});

describe('AvatarGroup with per-avatar overrides', () => {
  @Component({
    template: `
      <sn-avatar-group size="lg" shape="square">
        <sn-avatar label="Ada Lovelace" />
        <sn-avatar label="Grace Hopper" size="sm" shape="circle" />
      </sn-avatar-group>
    `,
    imports: [Avatar, AvatarGroup],
  })
  class MixedHost {}

  it("lets an avatar's own size and shape win over the group's", () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(MixedHost);
    fixture.detectChanges();
    const [inherited, own] = fixture.nativeElement.querySelectorAll('sn-avatar');

    expect(inherited.getAttribute('data-sn-size')).toBe('lg');
    expect(inherited.getAttribute('data-sn-shape')).toBe('square');
    expect(own.getAttribute('data-sn-size')).toBe('sm');
    expect(own.getAttribute('data-sn-shape')).toBe('circle');
  });
});
