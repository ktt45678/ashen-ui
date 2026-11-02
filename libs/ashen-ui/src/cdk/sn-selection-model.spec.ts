import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { snSelectionModel } from './sn-selection-model';

interface Item {
  id: number;
  label: string;
}

const FIRST: Item = { id: 1, label: 'First' };
const SECOND: Item = { id: 2, label: 'Second' };
const THIRD: Item = { id: 3, label: 'Third' };

@Component({ changeDetection: ChangeDetectionStrategy.Eager,
 template: '' })
class SelectionHost {
  readonly items = signal<readonly Item[]>([FIRST, SECOND, THIRD]);
  readonly useId = signal(false);
  readonly value = signal<Item[]>([]);
  readonly selection = snSelectionModel<Item>(() => ({
    multiple: true,
    unique: true,
    trackBy: this.useId() ? (item) => item.id : undefined,
    orderBy: this.items,
    value: this.value,
  }));
}

describe('snSelectionModel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('uses reference equality when trackBy is not configured', () => {
    const fixture = TestBed.createComponent(SelectionHost);
    const clone = { ...FIRST };

    fixture.componentInstance.selection.select(FIRST, clone);

    expect(fixture.componentInstance.selection.selected()).toEqual([FIRST, clone]);
  });

  it('re-reads a lazy trackBy configuration after bindings change', () => {
    const fixture = TestBed.createComponent(SelectionHost);
    const clone = { ...FIRST };
    const { selection, useId } = fixture.componentInstance;
    selection.select(FIRST, clone);

    useId.set(true);

    expect(selection.selected()).toEqual([FIRST]);
    expect(selection.isSelected(clone)).toBe(true);
  });

  it('enforces a single latest selection when multiple is disabled', () => {
    const model = snSelectionModel<Item>({ multiple: false });

    model.select(FIRST, SECOND);

    expect(model.selected()).toEqual([SECOND]);
  });

  it('toggles and clears selection using trackBy identity', () => {
    const model = snSelectionModel<Item>({
      multiple: true,
      unique: true,
      trackBy: (item) => item.id,
    });
    model.select(FIRST);

    model.toggle({ ...FIRST });
    expect(model.selected()).toEqual([]);

    model.select(FIRST, SECOND);
    model.clear();
    expect(model.selected()).toEqual([]);
  });

  it('orders selected items by the configured source list', () => {
    const fixture = TestBed.createComponent(SelectionHost);
    const { selection, value } = fixture.componentInstance;

    selection.select(THIRD, FIRST, SECOND);

    expect(selection.selected()).toEqual([FIRST, SECOND, THIRD]);
    expect(value()).toEqual([FIRST, SECOND, THIRD]);
  });

  it('keeps items absent from the ordering source after ordered items', () => {
    const fixture = TestBed.createComponent(SelectionHost);
    const extra: Item = { id: 4, label: 'Extra' };

    fixture.componentInstance.selection.select(extra, SECOND, FIRST);

    expect(fixture.componentInstance.selection.selected()).toEqual([FIRST, SECOND, extra]);
  });
});
