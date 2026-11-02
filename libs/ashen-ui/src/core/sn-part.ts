import {
  Directive,
  ElementRef,
  InjectionToken,
  Renderer2,
  RendererStyleFlags2,
  effect,
  inject,
  input,
} from '@angular/core';

export type SnStyleValue = Readonly<Record<string, string | number>>;

export interface SnStyleMap {
  [section: string]: SnStyleValue;
}

export type SnStyle = SnStyleValue | SnStyleMap;

export type SnAttrValue = Readonly<Record<string, string | number | boolean | null>>;

export interface SnAttrsMap {
  [section: string]: SnAttrValue;
}

export type SnAttrs = SnAttrValue | SnAttrsMap;

export interface SnPartSource {
  readonly snStyle: () => SnStyle | undefined;
  readonly snAttrs: () => SnAttrs | undefined;
  reservedAttrs?(section: string): readonly string[];
}

export const SN_PART_SOURCE = new InjectionToken<SnPartSource>('SN_PART_SOURCE');

const EMPTY_STYLE: SnStyleValue = {};
const EMPTY_ATTRS: SnAttrValue = {};

export function resolveSnStyle(
  value: SnStyle | undefined,
  section: string,
  isRoot: boolean,
): SnStyleValue {
  if (value == null) return EMPTY_STYLE;
  if (isSnStyleValue(value)) return isRoot ? value : EMPTY_STYLE;
  return value[section] ?? EMPTY_STYLE;
}

export function resolveSnAttrs(
  value: SnAttrs | undefined,
  section: string,
  isRoot: boolean,
): SnAttrValue {
  if (value == null) return EMPTY_ATTRS;
  if (isSnAttrValue(value)) return isRoot ? value : EMPTY_ATTRS;
  return value[section] ?? EMPTY_ATTRS;
}

function isSnStyleValue(value: SnStyle): value is SnStyleValue {
  return Object.values(value).every((entry) => typeof entry === 'string' || typeof entry === 'number');
}

function isSnAttrValue(value: SnAttrs): value is SnAttrValue {
  return Object.values(value).every(
    (entry) =>
      entry === null ||
      typeof entry === 'string' ||
      typeof entry === 'number' ||
      typeof entry === 'boolean',
  );
}

@Directive({
  selector: '[snPart]',
  standalone: true,
})
export class SnPart {
  readonly snPart = input('root');

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly source = inject(SN_PART_SOURCE, { optional: true });
  private readonly appliedStyles = new Set<string>();
  private readonly appliedAttrs = new Set<string>();

  private readonly synchronize = effect(() => {
    if (this.source == null) return;
    const section = this.snPart();
    this.syncStyles(resolveSnStyle(this.source.snStyle(), section, section === 'root'));
    this.syncAttrs(resolveSnAttrs(this.source.snAttrs(), section, section === 'root'), section);
  });

  private syncStyles(styles: SnStyleValue): void {
    const nextNames = new Set(Object.keys(styles));

    for (const name of this.appliedStyles) {
      if (!nextNames.has(name)) this.removeStyle(name);
    }

    for (const [name, value] of Object.entries(styles)) {
      this.renderer.setStyle(this.element.nativeElement, name, String(value), this.styleFlags(name));
    }

    this.appliedStyles.clear();
    for (const name of nextNames) this.appliedStyles.add(name);
  }

  private syncAttrs(attrs: SnAttrValue, section: string): void {
    const nextEntries = Object.entries(attrs).filter(([name]) => this.isAllowedAttr(name, section));
    const nextNames = new Set(nextEntries.map(([name]) => name));

    for (const name of this.appliedAttrs) {
      if (!nextNames.has(name)) this.renderer.removeAttribute(this.element.nativeElement, name);
    }

    for (const [name, value] of nextEntries) {
      if (value === null) {
        this.renderer.removeAttribute(this.element.nativeElement, name);
      } else {
        this.renderer.setAttribute(this.element.nativeElement, name, String(value));
      }
    }

    this.appliedAttrs.clear();
    for (const name of nextNames) this.appliedAttrs.add(name);
  }

  private removeStyle(name: string): void {
    this.renderer.removeStyle(this.element.nativeElement, name, this.styleFlags(name));
  }

  private styleFlags(name: string): RendererStyleFlags2 | undefined {
    return name.startsWith('--') || name.includes('-') ? RendererStyleFlags2.DashCase : undefined;
  }

  private isAllowedAttr(name: string, section: string): boolean {
    const normalized = name.toLowerCase();
    if (normalized === 'class' || normalized === 'style' || normalized.startsWith('on')) return false;
    if (normalized.startsWith('data-sn-')) return false;
    return !this.source?.reservedAttrs?.(section).some((reserved) => reserved.toLowerCase() === normalized);
  }
}
