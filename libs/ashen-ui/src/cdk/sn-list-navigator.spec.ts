import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { type FocusableOption } from '@angular/cdk/a11y';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { snListNavigator, type SnListNavigatorOrientation } from './sn-list-navigator';

class NavigationOption implements FocusableOption {
  constructor(
    readonly label: string,
    readonly disabled = false,
  ) {}

  focusCount = 0;
  active = false;

  focus(): void {
    this.focusCount += 1;
  }

  getLabel(): string {
    return this.label;
  }

  setActiveStyles(): void {
    this.active = true;
  }

  setInactiveStyles(): void {
    this.active = false;
  }
}

@Component({ changeDetection: ChangeDetectionStrategy.Eager,
 template: '' })
class NavigatorHost {
  readonly options = signal([
    new NavigationOption('Alpha'),
    new NavigationOption('Bravo', true),
    new NavigationOption('Charlie'),
  ]);
  readonly orientation = signal<SnListNavigatorOrientation>('horizontal');
  readonly direction = signal<'ltr' | 'rtl'>('ltr');
  readonly navigator = snListNavigator({
    items: this.options,
    orientation: this.orientation,
    direction: this.direction,
    wrap: true,
    homeAndEnd: true,
    typeahead: true,
    skipPredicate: (option) => option.disabled,
  });
  readonly activeDescendantNavigator = snListNavigator({
    items: this.options,
    orientation: 'vertical',
    activeDescendant: true,
  });
  readonly virtualItemCount = signal(100);
  readonly virtualNavigator = snListNavigator({
    mode: 'index',
    itemCount: this.virtualItemCount,
    getLabel: (index) => `Item ${index + 1}`,
    isDisabled: (index) => index === 1,
    orientation: 'vertical',
    homeAndEnd: true,
    typeahead: true,
    activeDescendant: true,
  });
}

describe('snListNavigator', () => {
  let fixture: ComponentFixture<NavigatorHost>;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    fixture = TestBed.createComponent(NavigatorHost);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('wraps horizontal navigation and skips disabled options', () => {
    const navigator = fixture.componentInstance.navigator;
    navigator.setActiveItem(0);

    const handled = navigator.onKeydown(new KeyboardEvent('keydown', { keyCode: 39 }));

    expect(handled).toBe(true);
    expect(navigator.activeIndex()).toBe(2);
    expect(navigator.activeItem()).toBe(fixture.componentInstance.options()[2]);
  });

  it('maps horizontal arrow keys through live RTL direction', async () => {
    const host = fixture.componentInstance;
    host.navigator.setActiveItem(0);
    host.direction.set('rtl');
    await fixture.whenStable();

    host.navigator.onKeydown(new KeyboardEvent('keydown', { keyCode: 37 }));

    expect(host.navigator.activeIndex()).toBe(2);
  });

  it('supports vertical arrow keys after orientation changes', async () => {
    const host = fixture.componentInstance;
    host.navigator.setActiveItem(0);
    host.orientation.set('vertical');
    await fixture.whenStable();

    const handled = host.navigator.onKeydown(new KeyboardEvent('keydown', { keyCode: 40 }));

    expect(handled).toBe(true);
    expect(host.navigator.activeIndex()).toBe(2);
  });

  it('handles standard key values when legacy key codes are absent', () => {
    const navigator = fixture.componentInstance.virtualNavigator;
    navigator.setActiveItem(0);

    const handled = navigator.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

    expect(handled).toBe(true);
    expect(navigator.activeIndex()).toBe(2);
  });

  it('moves to the first and last enabled options', () => {
    const navigator = fixture.componentInstance.navigator;
    navigator.setActiveItem(0);

    navigator.onKeydown(new KeyboardEvent('keydown', { keyCode: 35 }));
    expect(navigator.activeIndex()).toBe(2);

    navigator.onKeydown(new KeyboardEvent('keydown', { keyCode: 36 }));
    expect(navigator.activeIndex()).toBe(0);
  });

  // A menubar steps from inside an open submenu, where the key never reaches the bar.
  it('steps to the next and previous enabled option without a key event', () => {
    const navigator = fixture.componentInstance.navigator;
    navigator.setActiveItem(0);

    navigator.setNextItemActive();
    expect(navigator.activeIndex()).toBe(2);

    navigator.setNextItemActive();
    expect(navigator.activeIndex()).toBe(0);

    navigator.setPreviousItemActive();
    expect(navigator.activeIndex()).toBe(2);
  });

  // Typeahead moves the active item without a call from here, so the reported item must follow.
  it('reports the active option after typeahead moves it', async () => {
    const navigator = fixture.componentInstance.virtualNavigator;
    navigator.setActiveItem(0);

    const handled = navigator.onKeydown(new KeyboardEvent('keydown', { key: 'i' }));
    await new Promise((resolve) => setTimeout(resolve, 260));

    expect(handled).toBe(true);
    expect(navigator.activeIndex()).toBe(2);
    expect(navigator.activeItem()).toBe(2);
  });

  it('reports unsupported keys without changing the active option', () => {
    const navigator = fixture.componentInstance.navigator;
    navigator.setActiveItem(0);

    const handled = navigator.onKeydown(new KeyboardEvent('keydown', { keyCode: 13 }));

    expect(handled).toBe(false);
    expect(navigator.activeIndex()).toBe(0);
  });

  it('emits tab-out without taking ownership of the Tab key', () => {
    const navigator = fixture.componentInstance.navigator;
    const tabbedOut = vi.fn();
    navigator.tabOut.subscribe(tabbedOut);

    const handled = navigator.onKeydown(new KeyboardEvent('keydown', { keyCode: 9 }));

    expect(handled).toBe(false);
    expect(tabbedOut).toHaveBeenCalledOnce();
  });

  it('uses active-descendant navigation without moving DOM focus', () => {
    const host = fixture.componentInstance;
    const option = host.options()[0];

    host.activeDescendantNavigator.setFirstItemActive();

    expect(option.active).toBe(true);
    expect(option.focusCount).toBe(0);
  });

  // A reopened component builds a fresh manager over the same options, so destroy() must clear the highlight.
  it('clears the highlighted option on destroy so it does not linger across navigators', () => {
    const host = fixture.componentInstance;
    const option = host.options()[0];
    host.activeDescendantNavigator.setFirstItemActive();
    expect(option.active).toBe(true);

    host.activeDescendantNavigator.destroy();

    expect(option.active).toBe(false);
  });

  it('navigates virtual item indexes without requiring rendered option instances', () => {
    const navigator = fixture.componentInstance.virtualNavigator;

    navigator.setActiveItem(0);
    navigator.onKeydown(new KeyboardEvent('keydown', { keyCode: 40 }));

    expect(navigator.activeIndex()).toBe(2);
    expect(navigator.activeItem()).toBe(2);

    navigator.onKeydown(new KeyboardEvent('keydown', { keyCode: 35 }));
    expect(navigator.activeIndex()).toBe(99);
  });
});
