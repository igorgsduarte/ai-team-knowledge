export type EntityFilterState = {
  authorId: string;
  query: string;
  tag: string;
};

export type AuthorOption = {
  id: string;
  name: string;
};

export function collectTags(items: Array<{ tags?: string[] }>): string[] {
  const seen = new Map<string, string>();
  for (const item of items) {
    for (const raw of item.tags ?? []) {
      const tag = raw.trim();
      if (!tag) {
        continue;
      }
      const key = tag.toLowerCase();
      if (!seen.has(key)) {
        seen.set(key, tag);
      }
    }
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}

export function collectAuthors<T extends { createdBy: string }>(
  items: T[],
  authorNames: Record<string, string>,
  unknownLabel: string
): AuthorOption[] {
  const seen = new Map<string, AuthorOption>();
  for (const item of items) {
    if (seen.has(item.createdBy)) {
      continue;
    }
    seen.set(item.createdBy, {
      id: item.createdBy,
      name: authorNames[item.createdBy] ?? unknownLabel,
    });
  }
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
}

export function matchesEntityFilters<T extends { createdBy: string; tags?: string[] }>(
  item: T,
  filters: EntityFilterState,
  getHaystack: (item: T) => string
): boolean {
  if (filters.authorId && item.createdBy !== filters.authorId) {
    return false;
  }

  if (filters.tag) {
    const normalizedTag = filters.tag.trim().toLowerCase();
    const hasTag = (item.tags ?? []).some((tag) => tag.trim().toLowerCase() === normalizedTag);
    if (!hasTag) {
      return false;
    }
  }

  const normalizedQuery = filters.query.trim().toLowerCase();
  if (normalizedQuery && !getHaystack(item).toLowerCase().includes(normalizedQuery)) {
    return false;
  }

  return true;
}
