type SortableDesign = {
  metal_type: string;
  design_code: string;
};

const metalOrder: Record<string, number> = { gold: 0, silver: 1 };

export function sortCatalogueDesigns<T extends SortableDesign>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => {
    const metalA = metalOrder[a.metal_type.trim().toLowerCase()] ?? 2;
    const metalB = metalOrder[b.metal_type.trim().toLowerCase()] ?? 2;

    return metalA - metalB || a.design_code.localeCompare(
      b.design_code,
      undefined,
      { numeric: true, sensitivity: 'base' },
    );
  });
}
