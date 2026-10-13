import { standardCategoryNames, type CatalogueCategory } from './categories';

export type CatalogueDesign = {
  id: string;
  name: string;
  slug: string;
  design_code: string;
  metal_type: 'Gold' | 'Silver';
  category_id: string;
  category_name: string;
  description: string;
  style: 'Traditional' | 'Modern' | 'Bridal' | 'Classic' | 'Contemporary';
  weight_range: string;
  primary_image: string;
  images: { id: string; url: string; alt: string }[];
  featured: boolean;
  sample: true;
};

const design = (
  id: string,
  name: string,
  slug: string,
  metal_type: CatalogueDesign['metal_type'],
  category_id: string,
  category_name: string,
  style: CatalogueDesign['style'],
  weight_range: string,
  image: string,
  description: string,
): CatalogueDesign => ({
  id: `sample-${id}`,
  name,
  slug,
  design_code: id,
  metal_type,
  category_id,
  category_name,
  description,
  style,
  weight_range,
  primary_image: image,
  images: [{ id: `${id}-image`, url: image, alt: name }],
  featured: true,
  sample: true,
});

// Illustrative catalogue starters. Names, images, metal and weight ranges are samples;
// confirm actual specifications before treating any as an available product.
export const sampleDesigns: CatalogueDesign[] = [
  design(
    'BJW-G-001',
    'Lakshmi Temple Necklace',
    'gold-lakshmi-temple-necklace-bjw-g-001',
    'Gold',
    'necklaces',
    'Necklaces',
    'Traditional',
    'Approx. 26–32 g',
    '/products/bjw-g-001-temple-necklace.webp',
    'An illustrative temple-style necklace with Lakshmi motifs and ruby-coloured accents.',
  ),
  design(
    'BJW-G-002',
    'Heritage Pearl Jhumkas',
    'gold-heritage-pearl-jhumkas-bjw-g-002',
    'Gold',
    'jhumkas',
    'Jhumkas',
    'Traditional',
    'Approx. 18–22 g',
    '/products/bjw-g-002-pearl-jhumkas.webp',
    'An illustrative pair of filigree jhumkas finished with pearl-style drops.',
  ),
  design(
    'BJW-S-001',
    'Silver Blossom Drops',
    'silver-blossom-drop-earrings-bjw-s-001',
    'Silver',
    'earrings',
    'Earrings',
    'Contemporary',
    'Approx. 6–8 g per pair',
    '/products/bjw-s-001-silver-drops.webp',
    'An illustrative pair of floral silver drop earrings with clear stone details.',
  ),
  design(
    'BJW-G-003',
    'Gulmohar Engraved Bangles',
    'gold-gulmohar-engraved-bangles-bjw-g-003',
    'Gold',
    'bangles',
    'Bangles',
    'Classic',
    'Approx. 18–22 g per pair',
    '/products/bjw-g-003-enamel-bangles.webp',
    'An illustrative pair of engraved gold bangles with small red enamel-style flowers.',
  ),
];

const sampleWeights: Record<string, { Gold: string; Silver: string }> = {
  Bangles: { Gold: 'Approx. 18–22 g per pair', Silver: 'Approx. 20–30 g per pair' },
  Chains: { Gold: 'Approx. 12–18 g', Silver: 'Approx. 15–25 g' },
  Necklaces: { Gold: 'Approx. 26–32 g', Silver: 'Approx. 30–45 g' },
  Earrings: { Gold: 'Approx. 6–9 g per pair', Silver: 'Approx. 6–8 g per pair' },
  Bracelets: { Gold: 'Approx. 10–16 g', Silver: 'Approx. 15–25 g' },
  'Finger Rings': { Gold: 'Approx. 4–7 g each', Silver: 'Approx. 5–8 g each' },
  Pendants: { Gold: 'Approx. 3–6 g each', Silver: 'Approx. 4–8 g each' },
  Anklets: { Gold: 'Approx. 18–25 g per pair', Silver: 'Approx. 25–40 g per pair' },
  'Nose Pins': { Gold: 'Approx. 0.5–1 g each', Silver: 'Approx. 1–2 g each' },
  'Toe Rings': { Gold: 'Approx. 2–4 g per pair', Silver: 'Approx. 3–6 g per pair' },
  Jhumkas: { Gold: 'Approx. 18–22 g', Silver: 'Approx. 10–16 g per pair' },
  Harams: { Gold: 'Approx. 40–60 g', Silver: 'Approx. 50–80 g' },
  Mangalsutra: { Gold: 'Approx. 15–25 g', Silver: 'Approx. 20–35 g' },
  'Bridal Jewellery': { Gold: 'Approx. 80–120 g per set', Silver: 'Approx. 120–180 g per set' },
  'Kids Jewellery': { Gold: 'Approx. 8–14 g per set', Silver: 'Approx. 12–20 g per set' },
  Other: { Gold: 'Approx. 5–10 g', Silver: 'Approx. 8–15 g' },
};

const sampleImages: Record<'Gold' | 'Silver', Record<string, string>> = {
  Gold: {
    Bangles: '/products/bjw-g-003-enamel-bangles.webp',
    Chains: '/products/bjw-gold-chains.webp',
    Necklaces: '/products/bjw-g-001-temple-necklace.webp',
    Earrings: '/products/bjw-gold-earrings.webp',
    Bracelets: '/products/bjw-gold-bracelets.webp',
    'Finger Rings': '/products/bjw-gold-finger-rings.webp',
    Pendants: '/products/bjw-gold-pendants.webp',
    Anklets: '/products/bjw-gold-anklets.webp',
    'Nose Pins': '/products/bjw-gold-nose-pins.webp',
    'Toe Rings': '/products/bjw-gold-toe-rings.webp',
    Jhumkas: '/products/bjw-g-002-pearl-jhumkas.webp',
    Harams: '/products/bjw-gold-harams.webp',
    Mangalsutra: '/products/bjw-gold-mangalsutra.webp',
    'Bridal Jewellery': '/products/bjw-gold-bridal-jewellery.webp',
    'Kids Jewellery': '/products/bjw-gold-kids-jewellery.webp',
    Other: '/products/bjw-gold-other.webp',
  },
  Silver: {
    Bangles: '/products/bjw-silver-bangles.webp',
    Chains: '/products/bjw-silver-chains.webp',
    Necklaces: '/products/bjw-silver-necklaces.webp',
    Earrings: '/products/bjw-s-001-silver-drops.webp',
    Bracelets: '/products/bjw-silver-bracelets.webp',
    'Finger Rings': '/products/bjw-silver-finger-rings.webp',
    Pendants: '/products/bjw-silver-pendants.webp',
    Anklets: '/products/bjw-silver-anklets.webp',
    'Nose Pins': '/products/bjw-silver-nose-pins.webp',
    'Toe Rings': '/products/bjw-silver-toe-rings.webp',
    Jhumkas: '/products/bjw-silver-jhumkas.webp',
    Harams: '/products/bjw-silver-harams.webp',
    Mangalsutra: '/products/bjw-silver-mangalsutra.webp',
    'Bridal Jewellery': '/products/bjw-silver-bridal-jewellery.webp',
    'Kids Jewellery': '/products/bjw-silver-kids-jewellery.webp',
    Other: '/products/bjw-silver-other.webp',
  },
};

const sampleImageFor = (metal: 'Gold' | 'Silver', category: string) =>
  sampleImages[metal][category] ?? '/products/bjw-g-001-temple-necklace.webp';

const extraSampleDesigns: CatalogueDesign[] = (['Gold', 'Silver'] as const).flatMap((metal) =>
  standardCategoryNames
    .filter((category) => !sampleDesigns.some((item) => item.metal_type === metal && item.category_name === category))
    .map((category, index) => {
      const code = `BJW-${metal === 'Gold' ? 'G' : 'S'}-CAT-${String(index + 1).padStart(3, '0')}`;
      const slug = `${metal.toLowerCase()}-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${code.toLowerCase()}`;
      return design(
        code,
        `${metal} ${category} Sample`,
        slug,
        metal,
        `${metal.toLowerCase()}-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        category,
        'Traditional',
        sampleWeights[category][metal],
        sampleImageFor(metal, category),
        `Illustrative ${metal.toLowerCase()} ${category.toLowerCase()} catalogue sample. Confirm the design, image, and approximate weight with the workshop before treating it as an actual product.`,
      );
    }),
);

sampleDesigns.push(...extraSampleDesigns);

export const sampleCategories: CatalogueCategory[] = (['Gold', 'Silver'] as const).flatMap((metal) =>
  standardCategoryNames.map((name, index) => ({
    id: `sample-${metal.toLowerCase()}-${index + 1}`,
    name,
    metal_type: metal,
  })),
);

export function filterSampleDesigns(filters: {
  metal?: string;
  category?: string;
  categoryName?: string;
  style?: string;
  search?: string;
}) {
  const search = filters.search?.trim().toLowerCase();
  return sampleDesigns.filter((item) =>
    (!filters.metal || item.metal_type === filters.metal) &&
    (!filters.category || item.category_id === filters.category || item.category_name === filters.categoryName) &&
    (!filters.style || item.style === filters.style) &&
    (!search || `${item.name} ${item.design_code}`.toLowerCase().includes(search)),
  );
}

export function getSampleDesign(slug: string) {
  return sampleDesigns.find((item) => item.slug === slug) ?? null;
}
