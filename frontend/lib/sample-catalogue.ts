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
  Thali: { Gold: 'Confirm with workshop', Silver: 'Confirm with workshop' },
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
    Thali: '/products/bjw-gold-thali-01.webp',
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
    Thali: '/products/bjw-gold-thali-01.webp',
    Other: '/products/bjw-silver-other.webp',
  },
};

const sampleImageFor = (metal: 'Gold' | 'Silver', category: string) =>
  sampleImages[metal][category] ?? '/products/bjw-g-001-temple-necklace.webp';

const extraSampleDesigns: CatalogueDesign[] = (['Gold', 'Silver'] as const).flatMap((metal) =>
  standardCategoryNames
    .filter((category) => category !== 'Thali' && !sampleDesigns.some((item) => item.metal_type === metal && item.category_name === category))
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

export const providedPhotoDesigns: CatalogueDesign[] = [
  design('BJW-G-REF-117', 'Classic Line Thali', 'gold-classic-line-thali-bjw-g-ref-117', 'Gold', 'gold-thali', 'Thali', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-thali-01.webp', 'Gold thali design with a fine central line and beaded border. Photo is a design reference; confirm gold purity, weight, and availability with the workshop.'),
  design('BJW-G-REF-118', 'Floral Vine Thali', 'gold-floral-vine-thali-bjw-g-ref-118', 'Gold', 'gold-thali', 'Thali', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-thali-02.webp', 'Gold thali design with a floral top and scrolling vine engraving. Confirm gold purity, weight, and availability with the workshop.'),
  design('BJW-G-REF-119', 'Geometric Band Thali', 'gold-geometric-band-thali-bjw-g-ref-119', 'Gold', 'gold-thali', 'Thali', 'Classic', 'Confirm with workshop', '/products/bjw-gold-thali-03.webp', 'Gold thali design with a rounded crown and horizontal geometric bands. Confirm gold purity, weight, and availability with the workshop.'),
  design('BJW-G-REF-120', 'Temple Emblem Thali', 'gold-temple-emblem-thali-bjw-g-ref-120', 'Gold', 'gold-thali', 'Thali', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-thali-04.webp', 'Gold thali design with a darkened central temple emblem and fine beaded edging. Confirm gold purity, weight, and availability with the workshop.'),
  design('BJW-G-REF-121', 'Flower Crest Thali', 'gold-flower-crest-thali-bjw-g-ref-121', 'Gold', 'gold-thali', 'Thali', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-thali-05.webp', 'Gold thali design with a flower crest, scrolling details, and a bright central accent. Confirm gold purity, stone, weight, and availability with the workshop.'),
  design('BJW-G-REF-122', 'Beaded Temple Pair Thali', 'gold-beaded-temple-pair-thali-bjw-g-ref-122', 'Gold', 'gold-thali', 'Thali', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-thali-06.webp', 'Matching pair of gold thali designs with a raised temple motif and beaded borders. Confirm gold purity, weight, and availability with the workshop.'),
  design('BJW-G-REF-101', 'Layered Ribbed Cuffs', 'gold-layered-ribbed-cuffs-bjw-g-ref-101', 'Gold', 'gold-bangles', 'Bangles', 'Classic', 'Confirm with workshop', '/products/bjw-user-gold-ribbed-cuffs.webp', 'Gold-tone cuff bangle reference photo. Confirm metal, purity, weight, and availability with the workshop.'),
  design('BJW-G-REF-102', 'Colourstone Blossom Studs', 'gold-colourstone-blossom-studs-bjw-g-ref-102', 'Gold', 'gold-earrings', 'Earrings', 'Traditional', 'Confirm with workshop', '/products/bjw-user-gold-colourstone-studs.webp', 'Floral studs with colourstone accents. Photo is for design reference; confirm metal, stones, weight, and availability with the workshop.'),
  design('BJW-G-REF-103', 'Triple Petal Studs', 'gold-triple-petal-studs-bjw-g-ref-103', 'Gold', 'gold-earrings', 'Earrings', 'Contemporary', 'Confirm with workshop', '/products/bjw-user-gold-triple-petal-studs.webp', 'Small looped-petal stud earrings. Photo is for design reference; confirm metal, weight, and availability with the workshop.'),
  design('BJW-G-REF-104', 'Temple Motif Hoop Bangles', 'gold-temple-motif-hoop-bangles-bjw-g-ref-104', 'Gold', 'gold-bangles', 'Bangles', 'Traditional', 'Confirm with workshop', '/products/bjw-user-gold-temple-hoop-bangles.webp', 'Pair of slim hoop bangles with raised floral details. Confirm metal, purity, weight, and availability with the workshop.'),
  design('BJW-G-REF-105', 'Ruby Mosaic Studs', 'gold-ruby-mosaic-studs-bjw-g-ref-105', 'Gold', 'gold-earrings', 'Earrings', 'Traditional', 'Confirm with workshop', '/products/bjw-user-gold-ruby-mosaic-studs.webp', 'Round floral studs with red and green accents. Confirm metal, stone type, weight, and availability with the workshop.'),
  design('BJW-G-REF-106', 'Filigree Cascade Jhumkas', 'gold-filigree-cascade-jhumkas-bjw-g-ref-106', 'Gold', 'gold-jhumkas', 'Jhumkas', 'Traditional', 'Confirm with workshop', '/products/bjw-user-gold-filigree-jhumkas.webp', 'Filigree dome earrings with a cascading silhouette. Confirm metal, purity, weight, and availability with the workshop.'),
  design('BJW-G-REF-107', 'Sunburst Flower Studs', 'gold-sunburst-flower-studs-bjw-g-ref-107', 'Gold', 'gold-earrings', 'Earrings', 'Classic', 'Confirm with workshop', '/products/bjw-user-gold-sunburst-studs.webp', 'Textured flower-shaped gold-tone studs. Confirm metal, purity, weight, and availability with the workshop.'),
  design('BJW-G-REF-108', 'Emerald Temple Jhumkas', 'gold-emerald-temple-jhumkas-bjw-g-ref-108', 'Gold', 'gold-jhumkas', 'Jhumkas', 'Traditional', 'Confirm with workshop', '/products/bjw-user-gold-emerald-jhumkas.webp', 'Temple-style drop earrings with green centre stones. Confirm metal, stones, weight, and availability with the workshop.'),
  design('BJW-G-REF-109', 'Everyday Pendant Necklace', 'gold-everyday-pendant-necklace-bjw-g-ref-109', 'Gold', 'gold-necklaces', 'Necklaces', 'Classic', 'Confirm with workshop', '/products/bjw-user-gold-pendant-necklace.webp', 'Fine necklace reference photo. The original product number remains visible in the image; confirm metal, pendant details, weight, and availability with the workshop.'),
  design('BJW-G-REF-110', 'Lotus Pearl Drop Earrings', 'gold-lotus-pearl-drop-earrings-bjw-g-ref-110', 'Gold', 'gold-earrings', 'Earrings', 'Traditional', 'Confirm with workshop', '/products/bjw-user-gold-lotus-drop-earrings.webp', 'Lotus-inspired earrings with a pearl-style drop. Confirm metal, pearl type, weight, and availability with the workshop.'),
  design('BJW-G-REF-111', 'Pearl Lattice Earrings', 'gold-pearl-lattice-earrings-bjw-g-ref-111', 'Gold', 'gold-earrings', 'Earrings', 'Classic', 'Confirm with workshop', '/products/bjw-user-gold-pearl-lattice-earrings.webp', 'Interwoven gold-tone earrings with pearl-style accents. Confirm metal, pearl type, weight, and availability with the workshop.'),
  design('BJW-G-REF-112', 'Heritage Bell Jhumkas', 'gold-heritage-bell-jhumkas-bjw-g-ref-112', 'Gold', 'gold-jhumkas', 'Jhumkas', 'Traditional', 'Confirm with workshop', '/products/bjw-user-gold-heritage-jhumkas.webp', 'Traditional bell-shaped jhumkas with fine drop details. Confirm metal, purity, weight, and availability with the workshop.'),
  design('BJW-G-REF-115', 'Filigree Bead Drop Jhumkas', 'gold-filigree-bead-drop-jhumkas-bjw-g-ref-115', 'Gold', 'gold-jhumkas', 'Jhumkas', 'Traditional', 'Confirm with workshop', '/products/bjw-user-gold-filigree-bead-jhumkas.webp', 'Traditional round-stud jhumkas with an ornate filigree dome and bead drops. Image supplied as a design reference; confirm gold purity, weight, and availability with the workshop.'),
  design('BJW-G-REF-116', 'Engraved Dome Jhumkas', 'gold-engraved-dome-jhumkas-bjw-g-ref-116', 'Gold', 'gold-jhumkas', 'Jhumkas', 'Traditional', 'Confirm with workshop', '/products/bjw-user-gold-engraved-dome-jhumkas.webp', 'Traditional jhumkas with a pointed decorative stud, engraved dome, and beaded edge. Image supplied as a design reference; confirm gold purity, weight, and availability with the workshop.'),
  design('BJW-G-REF-113', 'Textured Rope Chain', 'gold-textured-rope-chain-bjw-g-ref-113', 'Gold', 'gold-chains', 'Chains', 'Classic', 'Confirm with workshop', '/products/bjw-user-gold-rope-chain.webp', 'Textured rope-link chain reference photo. The original product number remains visible; confirm metal, purity, weight, and availability with the workshop.'),
  design('BJW-G-REF-114', 'Medallion Panel Cuff', 'gold-medallion-panel-cuff-bjw-g-ref-114', 'Gold', 'gold-bracelets', 'Bracelets', 'Contemporary', 'Confirm with workshop', '/products/bjw-user-gold-medallion-cuff.webp', 'Hinged cuff bracelet with a row of patterned medallion panels. Confirm metal, purity, weight, and availability with the workshop.'),
];

sampleDesigns.push(...extraSampleDesigns, ...providedPhotoDesigns);

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
