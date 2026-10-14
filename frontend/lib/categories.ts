export type MetalType = 'Gold' | 'Silver';

export type CatalogueCategory = {
  id: string;
  name: string;
  metal_type?: MetalType | 'Both';
};

export const standardCategoryNames = [
  'Bangles',
  'Chains',
  'Necklaces',
  'Earrings',
  'Bracelets',
  'Finger Rings',
  'Pendants',
  'Anklets',
  'Nose Pins',
  'Toe Rings',
  'Jhumkas',
  'Harams',
  'Mangalsutra',
  'Bridal Jewellery',
  'Kids Jewellery',
  'Thali',
  'Other',
] as const;

export function categoriesForMetal(categories: CatalogueCategory[], metal: MetalType) {
  const exact = categories.filter((category) => category.metal_type === metal);
  const exactNames = new Set(exact.map((category) => category.name.trim().toLowerCase()));
  const shared = categories.filter((category) =>
    (!category.metal_type || category.metal_type === 'Both') &&
    !exactNames.has(category.name.trim().toLowerCase()),
  );

  return [...exact, ...shared].sort((a, b) => a.name.localeCompare(b.name));
}
