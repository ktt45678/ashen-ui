import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { COMPONENT_API } from './component-api.generated';

interface ApiMember {
  readonly bindingName: string;
  readonly type: string;
  readonly required: boolean;
  readonly default: string | null;
  readonly description: string;
}

interface ApiSurface {
  readonly symbol: string;
  readonly kind: string;
  readonly selector?: string;
  readonly inputs: readonly ApiMember[];
  readonly models: readonly ApiMember[];
  readonly outputs: readonly ApiMember[];
}

/** A description split so `backticked` spans can render as real code. */
export interface DescriptionPart {
  readonly text: string;
  readonly code: boolean;
}

interface UnionType {
  readonly name: string;
  readonly values: readonly { readonly value: string; readonly description: string }[];
}

/**
 * Inputs every Ashen component accepts. They were repeated on each surface of
 * every page, which buried the handful of inputs that are actually specific to
 * the component, so they are stated once per page instead.
 */
const PASS_THROUGH = new Set(['snClass', 'snStyle', 'snAttrs']);

@Component({
  selector: 'doc-api',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './doc-api.html',
  styleUrl: './doc-api.scss',
})
export class DocApi {
  readonly slug = input.required<string>();
  readonly section = input.required<'api' | 'theming'>();

  protected readonly data = computed(() => COMPONENT_API[this.slug() as keyof typeof COMPONENT_API]);

  /** Components before directives, and the one named after the page first. */
  protected readonly surfaces = computed<readonly ApiSurface[]>(() => {
    const api = this.data() as { surfaces?: readonly ApiSurface[] } | undefined;
    const all = (api?.surfaces ?? []).map((surface) => ({
      ...surface,
      inputs: surface.inputs.filter((member) => !PASS_THROUGH.has(member.bindingName)),
    }));
    const primary = this.primaryName();
    return [...all]
      .filter((surface) => surface.inputs.length || surface.models.length || surface.outputs.length || surface.selector)
      .sort((a, b) => rank(a, primary) - rank(b, primary));
  });

  protected readonly types = computed<readonly UnionType[]>(() => {
    const api = this.data() as { types?: Record<string, UnionType> } | undefined;
    return Object.values(api?.types ?? {}).sort((a, b) => a.name.localeCompare(b.name));
  });

  protected readonly tokens = computed(() => {
    const api = this.data() as { tokens?: readonly { name: string; default: string | null; source: string | null }[] };
    return api?.tokens ?? [];
  });

  protected readonly intl = computed(() => {
    const api = this.data() as { intl?: readonly { group: string; key: string; englishDefault: string }[] };
    return api?.intl ?? [];
  });

  protected readonly importPath = computed(() => (this.data() as { importPath?: string } | undefined)?.importPath ?? '');

  /** Surfaces that only contribute a selector, listed rather than tabled. */
  protected readonly plainSurfaces = computed(() =>
    this.surfaces().filter((surface) => !surface.inputs.length && !surface.models.length && !surface.outputs.length),
  );

  protected readonly documentedSurfaces = computed(() =>
    this.surfaces().filter((surface) => surface.inputs.length || surface.models.length || surface.outputs.length),
  );

  protected describe(description: string): readonly DescriptionPart[] {
    return description
      .split(/`([^`]+)`/)
      .map((text, index) => ({ text, code: index % 2 === 1 }))
      .filter((part) => part.text);
  }

  /** The union behind a type name, when the page documents one. */
  protected unionFor(type: string): UnionType | undefined {
    return this.types().find((item) => item.name === type);
  }

  protected memberDefault(member: ApiMember): string {
    return member.default ?? (member.required ? 'required' : '—');
  }

  private primaryName(): string {
    return this.slug()
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  }
}

function rank(surface: ApiSurface, primary: string): number {
  if (surface.symbol === primary) return 0;
  return surface.kind === 'component' ? 1 : 2;
}
