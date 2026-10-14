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
  audience?: 'Men' | 'Women' | 'Unisex';
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
  design('BJW-G-REF-133', 'Pearl Grapevine Earrings', 'gold-pearl-grapevine-earrings-bjw-g-ref-133', 'Gold', 'gold-earrings', 'Earrings', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-grape-earrings-01.webp', 'Gold-tone grape cluster earrings with leaf details and pearl-style accents. Supplied photo is a design reference; confirm metal, purity, pearl type, weight, and availability with the workshop.'),
  design('BJW-G-REF-134', 'Grape Cluster Drop Earrings', 'gold-grape-cluster-drop-earrings-bjw-g-ref-134', 'Gold', 'gold-earrings', 'Earrings', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-grape-earrings-02.webp', 'Gold-tone grape cluster earrings with leaf motifs and a small hanging drop. Supplied photo is a design reference; confirm metal, purity, stone details, weight, and availability with the workshop.'),
  design('BJW-G-REF-123', 'Blue Eye Kids Kada', 'gold-blue-eye-kids-kada-bjw-g-ref-123', 'Gold', 'gold-kids-jewellery', 'Kids Jewellery', 'Contemporary', 'Confirm with workshop', '/products/bjw-kids-kada-01.webp', 'Gold-tone kids kada with a blue eye motif. Supplied photo is a design reference; confirm gold purity, size, weight, and availability with the workshop.'),
  design('BJW-G-REF-124', 'Sunburst Bell Kids Kadas', 'gold-sunburst-bell-kids-kadas-bjw-g-ref-124', 'Gold', 'gold-kids-jewellery', 'Kids Jewellery', 'Traditional', 'Confirm with workshop', '/products/bjw-kids-kada-02.webp', 'Pair of gold-tone kids kadas with sunburst charms and hanging bells. Confirm gold purity, size, weight, and availability with the workshop.'),
  design('BJW-S-REF-125', 'Floral Silver Kids Kada', 'silver-floral-kids-kada-bjw-s-ref-125', 'Silver', 'silver-kids-jewellery', 'Kids Jewellery', 'Traditional', 'Confirm with workshop', '/products/bjw-kids-kada-03.webp', 'Silver-tone kids kada with a floral raised pattern. Supplied photo is a design reference; confirm silver purity, size, weight, and availability with the workshop.'),
  design('BJW-G-REF-126', 'Medallion Kids Kada', 'gold-medallion-kids-kada-bjw-g-ref-126', 'Gold', 'gold-kids-jewellery', 'Kids Jewellery', 'Classic', 'Confirm with workshop', '/products/bjw-kids-kada-04.webp', 'Fine gold-tone kids kada with a circular central medallion. Confirm gold purity, size, weight, and availability with the workshop.'),
  design('BJW-G-REF-127', 'Turtle Motif Kids Kada', 'gold-turtle-motif-kids-kada-bjw-g-ref-127', 'Gold', 'gold-kids-jewellery', 'Kids Jewellery', 'Contemporary', 'Confirm with workshop', '/products/bjw-kids-kada-05.webp', 'Gold-tone kids kada with small turtle motifs. Supplied photo is a design reference; confirm gold purity, size, weight, and availability with the workshop.'),
  design('BJW-G-REF-128', 'Enamel Teardrop Kids Kada', 'gold-enamel-teardrop-kids-kada-bjw-g-ref-128', 'Gold', 'gold-kids-jewellery', 'Kids Jewellery', 'Traditional', 'Confirm with workshop', '/products/bjw-kids-kada-06.webp', 'Gold-tone kids kada with a teardrop-shaped enamel detail. Supplied photo is a design reference; confirm gold purity, materials, size, weight, and availability with the workshop.'),
  design('BJW-G-REF-129', 'Link Chain Kids Kada', 'gold-link-chain-kids-kada-bjw-g-ref-129', 'Gold', 'gold-kids-jewellery', 'Kids Jewellery', 'Contemporary', 'Confirm with workshop', '/products/bjw-kids-kada-07.webp', 'Gold-tone kids kada with a chunky linked chain design. Confirm gold purity, size, weight, and availability with the workshop.'),
  design('BJW-S-REF-130', 'Engraved Silver Kids Kada', 'silver-engraved-kids-kada-bjw-s-ref-130', 'Silver', 'silver-kids-jewellery', 'Kids Jewellery', 'Traditional', 'Confirm with workshop', '/products/bjw-kids-kada-08.webp', 'Silver-tone kids kada with engraved floral details. Supplied photo is a design reference; confirm silver purity, size, weight, and availability with the workshop.'),
  design('BJW-S-REF-131', 'Multicolour Stone Kids Kadas', 'silver-multicolour-stone-kids-kadas-bjw-s-ref-131', 'Silver', 'silver-kids-jewellery', 'Kids Jewellery', 'Contemporary', 'Confirm with workshop', '/products/bjw-kids-kada-09.webp', 'Pair of silver-tone kids kadas with multicolour stone details. Supplied photo is a design reference; confirm silver purity, stone type, size, weight, and availability with the workshop.'),
  design('BJW-G-REF-132', 'Leaf Motif Open Kids Kada', 'gold-leaf-motif-open-kids-kada-bjw-g-ref-132', 'Gold', 'gold-kids-jewellery', 'Kids Jewellery', 'Traditional', 'Confirm with workshop', '/products/bjw-kids-kada-10.webp', 'Open gold-tone kids kada with a leaf-shaped decorative end and pink accent. Confirm gold purity, stone, size, weight, and availability with the workshop.'),
  design('BJW-G-REF-117', 'Classic Line Thali', 'gold-classic-line-thali-bjw-g-ref-117', 'Gold', 'gold-thali', 'Thali', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-thali-01.webp', 'Gold thali design with a fine central line and beaded border. Photo is a design reference; confirm gold purity, weight, and availability with the workshop.'),
  design('BJW-G-REF-118', 'Floral Vine Thali', 'gold-floral-vine-thali-bjw-g-ref-118', 'Gold', 'gold-thali', 'Thali', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-thali-02.webp', 'Gold thali design with a floral top and scrolling vine engraving. Confirm gold purity, weight, and availability with the workshop.'),
  design('BJW-G-REF-119', 'Geometric Band Thali', 'gold-geometric-band-thali-bjw-g-ref-119', 'Gold', 'gold-thali', 'Thali', 'Classic', 'Confirm with workshop', '/products/bjw-gold-thali-03.webp', 'Gold thali design with a rounded crown and horizontal geometric bands. Confirm gold purity, weight, and availability with the workshop.'),
  design('BJW-G-REF-120', 'Temple Emblem Thali', 'gold-temple-emblem-thali-bjw-g-ref-120', 'Gold', 'gold-thali', 'Thali', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-thali-04.webp', 'Gold thali design with a darkened central temple emblem and fine beaded edging. Confirm gold purity, weight, and availability with the workshop.'),
  design('BJW-G-REF-121', 'Flower Crest Thali', 'gold-flower-crest-thali-bjw-g-ref-121', 'Gold', 'gold-thali', 'Thali', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-thali-05.webp', 'Gold thali design with a flower crest, scrolling details, and a bright central accent. Confirm gold purity, stone, weight, and availability with the workshop.'),
  design('BJW-G-REF-122', 'Beaded Temple Pair Thali', 'gold-beaded-temple-pair-thali-bjw-g-ref-122', 'Gold', 'gold-thali', 'Thali', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-thali-06.webp', 'Matching pair of gold thali designs with a raised temple motif and beaded borders. Confirm gold purity, weight, and availability with the workshop.'),
  design('BJW-G-REF-101', 'Layered Ribbed Earrings', 'gold-layered-ribbed-cuffs-bjw-g-ref-101', 'Gold', 'gold-earrings', 'Earrings', 'Classic', 'Confirm with workshop', '/products/bjw-user-gold-ribbed-cuffs.webp', 'Layered ribbed gold-tone earrings. Confirm metal, purity, weight, and availability with the workshop.'),
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

const newWorkshopDesigns: CatalogueDesign[] = [
  design('BJW-G-REF-135', 'Pearl Crescent Earrings', 'gold-pearl-crescent-earrings-bjw-g-ref-135', 'Gold', 'gold-earrings', 'Earrings', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-pearl-crescent-earrings.webp', 'Gold-tone crescent earrings with pearl-style accents. Supplied photo is a design reference; confirm metal, purity, stone details, weight, and availability with the workshop.'),
  design('BJW-G-REF-136', 'Crystal Cascade Earrings', 'gold-crystal-cascade-earrings-bjw-g-ref-136', 'Gold', 'gold-earrings', 'Earrings', 'Contemporary', 'Confirm with workshop', '/products/bjw-gold-crystal-cascade-earrings.webp', 'Gold-tone earrings with a crystal cluster and cascading drops. Supplied photos are design references; confirm metal, purity, stone details, weight, and availability with the workshop.'),
  design('BJW-G-REF-137', 'Temple Peacock Bangles', 'gold-temple-peacock-bangles-bjw-g-ref-137', 'Gold', 'gold-bangles', 'Bangles', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-temple-peacock-bangles.webp', 'Pair of ornate gold-tone temple bangles with peacock motifs and red accents. Supplied photo is a design reference; confirm metal, purity, size, weight, and availability with the workshop.'),
  design('BJW-G-REF-138', 'Ornate Rope Chain', 'gold-ornate-rope-chain-bjw-g-ref-138', 'Gold', 'gold-chains', 'Chains', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-ornate-rope-chain.webp', 'Gold-tone chain with a dense, textured braided-link design. Supplied photo is a design reference; confirm metal, purity, length, weight, and availability with the workshop.'),
  design('BJW-G-REF-139', 'Multicolour Bead Necklace', 'gold-multicolour-bead-necklace-bjw-g-ref-139', 'Gold', 'gold-necklaces', 'Necklaces', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-multicolour-bead-necklace.webp', 'Gold-tone necklace with red, green, and pearl-style beads. Supplied photo is cropped to the product image; confirm metal, materials, length, weight, and availability with the workshop.'),
  design('BJW-G-REF-140', 'Punjabi Wave Open Kada', 'gold-punjabi-wave-open-kada-bjw-g-ref-140', 'Gold', 'gold-bangles', 'Bangles', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-punjabi-wave-kada.webp', 'Open gold kada with an engraved wave pattern and beaded edge. Supplied photo is a design reference; confirm metal, purity, size, weight, and availability with the workshop.'),
  design('BJW-G-REF-141', 'Twist Ribbon Kada', 'gold-twist-ribbon-kada-bjw-g-ref-141', 'Gold', 'gold-bangles', 'Bangles', 'Contemporary', 'Confirm with workshop', '/products/bjw-gold-twist-band-kada.webp', 'Open gold kada with a softly twisted ribbon-style band. Supplied photo is a design reference; confirm metal, purity, size, weight, and availability with the workshop.'),
  design('BJW-G-REF-142', 'Diamond Lattice Kada', 'gold-diamond-lattice-kada-bjw-g-ref-142', 'Gold', 'gold-bangles', 'Bangles', 'Classic', 'Confirm with workshop', '/products/bjw-gold-diamond-grid-kada.webp', 'Gold kada with a repeating diamond lattice engraving and polished inner band. Supplied photo is a design reference; confirm metal, purity, size, weight, and availability with the workshop.'),
  design('BJW-G-REF-143', 'Geometric Punjabi Kada', 'gold-geometric-punjabi-kada-bjw-g-ref-143', 'Gold', 'gold-bangles', 'Bangles', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-geometric-punjabi-kada.webp', 'Open gold kada with geometric engraved panels and a beaded border. Supplied photo is cropped to remove the prominent logo; confirm metal, purity, size, weight, and availability with the workshop.'),
  design('BJW-G-REF-144', 'Diagonal Cut Kada', 'gold-diagonal-cut-kada-bjw-g-ref-144', 'Gold', 'gold-bangles', 'Bangles', 'Classic', 'Confirm with workshop', '/products/bjw-gold-crosshatch-kada.webp', 'Open gold kada with diagonal engraved sections and a textured finish. Supplied photo is a design reference; confirm metal, purity, size, weight, and availability with the workshop.'),
  design('BJW-G-REF-145', 'Diamond Crosshatch Kada', 'gold-diamond-crosshatch-kada-bjw-g-ref-145', 'Gold', 'gold-bangles', 'Bangles', 'Contemporary', 'Confirm with workshop', '/products/bjw-gold-lattice-open-kada.webp', 'Open gold kada with a crosshatch band, shown with a matching ring in the supplied image; the photo is cropped to the kada. Confirm metal, purity, size, weight, and availability with the workshop.'),
  design('BJW-G-REF-146', 'Emerald Drop Necklace', 'gold-emerald-drop-necklace-bjw-g-ref-146', 'Gold', 'gold-necklaces', 'Necklaces', 'Contemporary', 'Confirm with workshop', '/products/bjw-gold-emerald-drop-necklace.webp', 'Fine gold-tone necklace with a green teardrop pendant and clear stone accents. Supplied photo is a design reference; confirm metal, purity, stone details, length, weight, and availability with the workshop.'),
  design('BJW-G-REF-147', 'Peacock Pendant Necklace', 'gold-peacock-pendant-necklace-bjw-g-ref-147', 'Gold', 'gold-necklaces', 'Necklaces', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-peacock-pendant-necklace.webp', 'Traditional gold-tone necklace with an ornate peacock pendant and coloured accents. Supplied photo is a design reference; confirm metal, purity, stone details, length, weight, and availability with the workshop.'),
  design('BJW-G-REF-148', 'Beaded Gold Necklace', 'gold-beaded-necklace-bjw-g-ref-148', 'Gold', 'gold-necklaces', 'Necklaces', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-beaded-necklace.webp', 'Gold-tone necklace with a rounded beaded front and decorative center beads. Supplied photo is a design reference; confirm metal, purity, length, weight, and availability with the workshop.'),
  design('BJW-G-REF-149', 'Heart Drop Motif Necklace', 'gold-heart-drop-necklace-bjw-g-ref-149', 'Gold', 'gold-necklaces', 'Necklaces', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-heart-drop-necklace.webp', 'Gold-tone necklace with repeating heart-shaped motifs and a central drop ornament. Supplied photo is a design reference; confirm metal, purity, length, weight, and availability with the workshop.'),
  design('BJW-G-REF-150', 'Fan Motif Necklace', 'gold-fan-motif-necklace-bjw-g-ref-150', 'Gold', 'gold-necklaces', 'Necklaces', 'Classic', 'Confirm with workshop', '/products/bjw-gold-fan-motif-necklace.webp', 'Delicate gold-tone necklace with repeating fan-shaped details. Supplied photo is a design reference; confirm metal, purity, length, weight, and availability with the workshop.'),
  design('BJW-G-REF-151', 'Floral Front Necklace', 'gold-floral-front-necklace-bjw-g-ref-151', 'Gold', 'gold-necklaces', 'Necklaces', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-floral-front-necklace.webp', 'Fine gold-tone necklace with a delicate floral cluster across the front. Supplied photo is a design reference; confirm metal, purity, length, weight, and availability with the workshop.'),
  design('BJW-G-REF-152', 'Halo Circle Drop Earrings', 'gold-halo-circle-drop-earrings-bjw-g-ref-152', 'Gold', 'gold-earrings', 'Earrings', 'Contemporary', 'Confirm with workshop', '/products/bjw-gold-halo-drop-earrings.webp', 'Two-tone gold and stone-set circular drop earrings. Supplied photo is a design reference; confirm metal, purity, stone details, weight, and availability with the workshop.'),
  design('BJW-G-REF-153', 'Ganesha Gold Pendant', 'gold-ganesha-pendant-bjw-g-ref-153', 'Gold', 'gold-pendants', 'Pendants', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-ganesha-pendant.webp', 'Gold-tone Ganesha pendant with clear stone accents. Supplied photo is a design reference; confirm metal, purity, stone details, weight, and availability with the workshop.'),
  design('BJW-G-REF-154', 'Filigree Chandbali Earrings', 'gold-filigree-chandbali-earrings-bjw-g-ref-154', 'Gold', 'gold-earrings', 'Earrings', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-filigree-chandbali-earrings.webp', 'Ornate gold-tone chandbali earrings with fine filigree and dangling bead details. Supplied photo is a design reference; confirm metal, purity, weight, and availability with the workshop.'),
  design('BJW-G-REF-155', 'Floral Lotus Pendant Necklace', 'gold-floral-lotus-pendant-necklace-bjw-g-ref-155', 'Gold', 'gold-pendants', 'Pendants', 'Contemporary', 'Confirm with workshop', '/products/bjw-gold-floral-lotus-pendant.webp', 'Gold-tone necklace with an openwork floral lotus pendant and bright stone center. Supplied photo is a design reference; confirm metal, purity, length, weight, and availability with the workshop.'),
  design('BJW-G-REF-156', 'Diamond Band Ring', 'gold-diamond-band-ring-bjw-g-ref-156', 'Gold', 'gold-finger-rings', 'Finger Rings', 'Classic', 'Confirm with workshop', '/products/bjw-gold-diamond-band-ring.webp', 'Slim gold-tone band ring with a row of small clear stones. Supplied photo is a design reference; confirm metal, purity, ring size, stone details, and availability with the workshop.'),
  design('BJW-G-REF-157', 'Pearl Knot Drop Earrings', 'gold-pearl-knot-drop-earrings-bjw-g-ref-157', 'Gold', 'gold-earrings', 'Earrings', 'Classic', 'Confirm with workshop', '/products/bjw-gold-pearl-knot-drop-earrings.webp', 'Gold-tone knot earrings with pearl-style drops. Supplied photo is a design reference; confirm metal, pearl type, weight, and availability with the workshop.'),
  design('BJW-G-REF-158', 'Diamond Panel Open Kada', 'gold-diamond-panel-open-kada-bjw-g-ref-158', 'Gold', 'gold-bangles', 'Bangles', 'Contemporary', 'Confirm with workshop', '/products/bjw-gold-diamond-panel-cuff.webp', 'Open gold-tone kada with a geometric panel set with clear stones. Supplied photo is a design reference; confirm metal, purity, size, stone details, weight, and availability with the workshop.'),
  design('BJW-G-REF-159', 'Speckled Long Drop Earrings', 'gold-speckled-long-drop-earrings-bjw-g-ref-159', 'Gold', 'gold-earrings', 'Earrings', 'Contemporary', 'Confirm with workshop', '/products/bjw-gold-speckled-drop-earrings.webp', 'Long tapered gold-tone drop earrings with contrasting speckled detailing. Supplied photo is a design reference; confirm metal, purity, weight, and availability with the workshop.'),
  design('BJW-G-REF-160', 'Textured Rectangle Stud Earrings', 'gold-textured-rectangle-stud-earrings-bjw-g-ref-160', 'Gold', 'gold-earrings', 'Earrings', 'Classic', 'Confirm with workshop', '/products/bjw-gold-textured-rectangle-studs.webp', 'Minimal rectangular gold-tone stud earrings shown worn. Supplied photo is a design reference; confirm metal, purity, size, weight, and availability with the workshop.'),
  design('BJW-G-REF-161', 'Openwork Hexagon Ring', 'gold-openwork-hexagon-ring-bjw-g-ref-161', 'Gold', 'gold-finger-rings', 'Finger Rings', 'Contemporary', 'Confirm with workshop', '/products/bjw-gold-openwork-hexagon-ring.webp', 'Gold-tone ring with a geometric openwork hexagon face. Supplied photo is a design reference; confirm metal, purity, ring size, weight, and availability with the workshop.'),
  design('BJW-G-REF-162', 'Leaf Openwork Ring', 'gold-leaf-openwork-ring-bjw-g-ref-162', 'Gold', 'gold-finger-rings', 'Finger Rings', 'Contemporary', 'Confirm with workshop', '/products/bjw-gold-leaf-openwork-ring.webp', 'Gold-tone ring with an airy leaf-inspired openwork design. Supplied photo is a design reference; confirm metal, purity, ring size, weight, and availability with the workshop.'),
  design('BJW-G-REF-163', 'Pearl Centre Flower Ring', 'gold-pearl-centre-flower-ring-bjw-g-ref-163', 'Gold', 'gold-finger-rings', 'Finger Rings', 'Classic', 'Confirm with workshop', '/products/bjw-gold-pearl-flower-ring.webp', 'Gold-tone flower ring with a pearl-style center. Supplied photo is a design reference; confirm metal, pearl type, ring size, weight, and availability with the workshop.'),
  design('BJW-G-REF-164', 'Braided Leaf Ring', 'gold-braided-leaf-ring-bjw-g-ref-164', 'Gold', 'gold-finger-rings', 'Finger Rings', 'Classic', 'Confirm with workshop', '/products/bjw-gold-braided-leaf-ring.webp', 'Gold-tone ring with a braided band and raised leaf details. Supplied photo is a design reference; confirm metal, purity, ring size, weight, and availability with the workshop.'),
  design('BJW-G-REF-165', 'Gold Net Pattern Ring', 'gold-net-pattern-ring-bjw-g-ref-165', 'Gold', 'gold-finger-rings', 'Finger Rings', 'Contemporary', 'Confirm with workshop', '/products/bjw-gold-net-pattern-ring.webp', 'Gold-tone ring with a raised open net pattern across the center. Supplied photo is a design reference; confirm metal, purity, ring size, weight, and availability with the workshop.'),
  design('BJW-G-REF-166', 'Flower Arc Ring', 'gold-flower-arc-ring-bjw-g-ref-166', 'Gold', 'gold-finger-rings', 'Finger Rings', 'Classic', 'Confirm with workshop', '/products/bjw-gold-flower-arc-ring.webp', 'Gold-tone ring with a floral centerpiece and dotted arc detail. Supplied photo is a design reference; confirm metal, purity, ring size, weight, and availability with the workshop.'),
  design('BJW-G-REF-167', 'Open Oval Hoop Earrings', 'gold-open-oval-hoop-earrings-bjw-g-ref-167', 'Gold', 'gold-earrings', 'Earrings', 'Contemporary', 'Confirm with workshop', '/products/bjw-gold-open-oval-hoop-earrings.webp', 'Gold-tone oval hoop earrings with openwork edge detailing. Supplied photo is a design reference; confirm metal, purity, size, weight, and availability with the workshop.'),
  design('BJW-G-REF-168', 'Floral Filigree Ring', 'gold-floral-filigree-ring-bjw-g-ref-168', 'Gold', 'gold-finger-rings', 'Finger Rings', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-floral-filigree-ring.webp', 'Ornate gold-tone ring with a floral filigree face. Supplied photo is a design reference; confirm metal, purity, ring size, weight, and availability with the workshop.'),
  design('BJW-G-REF-169', 'Geometric Lattice Pendant', 'gold-geometric-lattice-pendant-bjw-g-ref-169', 'Gold', 'gold-pendants', 'Pendants', 'Contemporary', 'Confirm with workshop', '/products/bjw-gold-geometric-lattice-pendant.webp', 'Gold-tone necklace with a large geometric openwork pendant. Supplied photo is a design reference; confirm metal, purity, chain length, weight, and availability with the workshop.'),
  design('BJW-G-REF-170', 'Classic Round Gold Bangle', 'gold-classic-round-bangle-bjw-g-ref-170', 'Gold', 'gold-bangles', 'Bangles', 'Classic', 'Confirm with workshop', '/products/bjw-gold-classic-round-bangle.webp', 'Plain polished round gold-tone bangle. Supplied photo is a design reference; confirm metal, purity, size, weight, and availability with the workshop.'),
  design('BJW-G-REF-171', 'Flower Centre Stud Earrings', 'gold-flower-centre-stud-earrings-bjw-g-ref-171', 'Gold', 'gold-earrings', 'Earrings', 'Classic', 'Confirm with workshop', '/products/bjw-gold-flower-stud-earrings.webp', 'Gold-tone flower stud earrings with a bright center accent. Supplied photo is a design reference; confirm metal, purity, stone details, weight, and availability with the workshop.'),
  design('BJW-G-REF-172', 'Spiral Disc Stud Earrings', 'gold-spiral-disc-stud-earrings-bjw-g-ref-172', 'Gold', 'gold-earrings', 'Earrings', 'Contemporary', 'Confirm with workshop', '/products/bjw-gold-spiral-stud-earrings.webp', 'Circular gold-tone stud earrings with a raised spiral design and center accent. Supplied photo is a design reference; confirm metal, purity, weight, and availability with the workshop.'),
  design('BJW-G-REF-173', 'Two Tone Link Chain', 'gold-two-tone-link-chain-bjw-g-ref-173', 'Gold', 'gold-chains', 'Chains', 'Contemporary', 'Confirm with workshop', '/products/bjw-gold-two-tone-link-chain.webp', 'Gold-tone chain with alternating bright and contrasting link details. Supplied photo is a design reference; confirm metal, purity, length, weight, and availability with the workshop.'),
  design('BJW-G-REF-174', 'Fine Gold Chain', 'gold-fine-chain-bjw-g-ref-174', 'Gold', 'gold-chains', 'Chains', 'Classic', 'Confirm with workshop', '/products/bjw-gold-fine-chain.webp', 'Simple fine gold-tone chain. Supplied photo is a design reference; confirm metal, purity, length, weight, and availability with the workshop.'),
  design('BJW-G-REF-175', 'Segment Link Gold Chain', 'gold-segment-link-chain-bjw-g-ref-175', 'Gold', 'gold-chains', 'Chains', 'Classic', 'Confirm with workshop', '/products/bjw-gold-segment-link-chain.webp', 'Gold-tone chain with repeating short segment links. Supplied photo is a design reference; confirm metal, purity, length, weight, and availability with the workshop.'),
  design('BJW-G-REF-176', 'Engraved Floral Gold Bangle', 'gold-engraved-floral-bangle-bjw-g-ref-176', 'Gold', 'gold-bangles', 'Bangles', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-engraved-floral-bangle.webp', 'Gold-tone bangle with an ornate engraved floral border. Supplied photo is a design reference; confirm metal, purity, size, weight, and availability with the workshop.'),
  design('BJW-G-REF-177', 'Pearl Cone Jhumkas', 'gold-pearl-cone-jhumkas-bjw-g-ref-177', 'Gold', 'gold-jhumkas', 'Jhumkas', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-pearl-cone-jhumkas.webp', 'Traditional gold-tone jhumkas with textured cone drops and pearl-style details. Supplied photo is a design reference; confirm metal, pearl type, weight, and availability with the workshop.'),
  design('BJW-G-REF-178', 'Openwork Statement Ring', 'gold-openwork-statement-ring-bjw-g-ref-178', 'Gold', 'gold-finger-rings', 'Finger Rings', 'Contemporary', 'Confirm with workshop', '/products/bjw-gold-openwork-statement-ring.webp', 'Bold gold-tone ring with a raised openwork centerpiece and textured detailing. Supplied photo is a design reference; confirm metal, purity, ring size, weight, and availability with the workshop.'),
  design('BJW-G-REF-179', 'Four Petal Stud Earrings', 'gold-four-petal-stud-earrings-bjw-g-ref-179', 'Gold', 'gold-earrings', 'Earrings', 'Classic', 'Confirm with workshop', '/products/bjw-gold-four-petal-stud-earrings.webp', 'Gold-tone four-petal stud earrings with a textured center. Supplied photo is a design reference; confirm metal, purity, size, weight, and availability with the workshop.'),
  design('BJW-G-REF-180', 'Double Row Diamond Ring', 'gold-double-row-diamond-ring-bjw-g-ref-180', 'Gold', 'gold-finger-rings', 'Finger Rings', 'Contemporary', 'Confirm with workshop', '/products/bjw-gold-double-row-diamond-ring.webp', 'Gold-tone ring with two curved rows of clear stones. Supplied photo is a design reference; confirm metal, purity, ring size, stone details, and availability with the workshop.'),
  design('BJW-G-REF-181', 'Floral Diamond Ring', 'gold-floral-diamond-ring-bjw-g-ref-181', 'Gold', 'gold-finger-rings', 'Finger Rings', 'Classic', 'Confirm with workshop', '/products/bjw-gold-floral-diamond-ring.webp', 'Gold-tone multi-band ring with a small floral stone setting. Supplied photo is a design reference; confirm metal, purity, ring size, stone details, and availability with the workshop.'),
  design('BJW-G-REF-182', 'Pearl Leaf Drop Necklace', 'gold-pearl-leaf-drop-necklace-bjw-g-ref-182', 'Gold', 'gold-necklaces', 'Necklaces', 'Contemporary', 'Confirm with workshop', '/products/bjw-gold-pearl-leaf-pendant.webp', 'Gold-tone necklace with a leaf-inspired pendant, clear stones, and a pearl-style drop. Supplied photo is a design reference; confirm metal, purity, materials, length, and availability with the workshop.'),
  design('BJW-G-REF-183', 'Two Tone Wave Ring', 'gold-two-tone-wave-ring-bjw-g-ref-183', 'Gold', 'gold-finger-rings', 'Finger Rings', 'Contemporary', 'Confirm with workshop', '/products/bjw-gold-two-tone-wave-ring.webp', 'Gold-tone crossover ring with a contrasting stone-set wave. Supplied photo is a design reference; confirm metal, purity, ring size, stone details, and availability with the workshop.'),
  design('BJW-G-REF-184', 'Cluster Diamond Stud Earrings', 'gold-cluster-diamond-stud-earrings-bjw-g-ref-184', 'Gold', 'gold-earrings', 'Earrings', 'Classic', 'Confirm with workshop', '/products/bjw-gold-cluster-stud-earrings.webp', 'Gold-tone stud earrings with a round clear-stone cluster. Supplied photo is a design reference; confirm metal, purity, stone details, and availability with the workshop.'),
  design('BJW-G-REF-185', "Men's Rope Chain", 'gold-mens-rope-chain-bjw-g-ref-185', 'Gold', 'gold-chains', 'Chains', 'Classic', 'Confirm with workshop', '/products/bjw-gold-mens-rope-chain.webp', 'Gold-tone rope chain shown worn. Supplied photo is a design reference; confirm metal, purity, chain length, weight, and availability with the workshop.'),
  design('BJW-G-REF-186', 'Modern Ring Duo', 'gold-modern-ring-duo-bjw-g-ref-186', 'Gold', 'gold-finger-rings', 'Finger Rings', 'Contemporary', 'Confirm with workshop', '/products/bjw-gold-modern-ring-duo.webp', 'Two modern gold-tone rings with contrasting dark and clear stone details. Supplied photo is a design reference; confirm whether sold as a set, metal, purity, ring sizes, and availability with the workshop.'),
  design('BJW-G-REF-187', 'Ganesha Pendant Necklace', 'gold-ganesha-pendant-necklace-bjw-g-ref-187', 'Gold', 'gold-necklaces', 'Necklaces', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-ganesha-pendant-necklace-model.webp', 'Gold-tone necklace with a small Ganesha pendant and coloured accents. Supplied photo is a design reference; confirm metal, purity, chain length, weight, and availability with the workshop.'),
  design('BJW-G-REF-188', 'Fine Gold Chain', 'gold-fine-lifestyle-chain-bjw-g-ref-188', 'Gold', 'gold-chains', 'Chains', 'Classic', 'Confirm with workshop', '/products/bjw-gold-fine-chain-lifestyle.webp', 'Fine gold-tone chain shown worn. Supplied photo is a design reference; confirm metal, purity, chain length, weight, and availability with the workshop.'),
  design('BJW-G-REF-189', 'Floral Accent Ring', 'gold-floral-accent-ring-bjw-g-ref-189', 'Gold', 'gold-finger-rings', 'Finger Rings', 'Classic', 'Confirm with workshop', '/products/bjw-gold-flower-ring-lifestyle.webp', 'Delicate gold-tone ring with a floral detail, shown worn. Supplied photo is a design reference; confirm metal, purity, ring size, and availability with the workshop.'),
  design('BJW-G-REF-190', 'Heart Row Ring', 'gold-heart-row-ring-bjw-g-ref-190', 'Gold', 'gold-finger-rings', 'Finger Rings', 'Contemporary', 'Confirm with workshop', '/products/bjw-gold-heart-row-ring.webp', 'Gold-tone ring with a row of small heart motifs, shown worn. Supplied photo is a design reference; confirm metal, purity, ring size, and availability with the workshop.'),
  design('BJW-G-REF-191', 'Crescent Diamond Hoop Earrings', 'gold-crescent-diamond-hoop-earrings-bjw-g-ref-191', 'Gold', 'gold-earrings', 'Earrings', 'Contemporary', 'Confirm with workshop', '/products/bjw-gold-crescent-diamond-hoops.webp', 'Gold-tone open hoop earrings with a crescent and clear stone accent. Supplied photo is a design reference; confirm metal, purity, stone details, and availability with the workshop.'),
  design('BJW-G-REF-192', 'Temple Pendant Necklace', 'gold-temple-pendant-necklace-bjw-g-ref-192', 'Gold', 'gold-necklaces', 'Necklaces', 'Traditional', 'Confirm with workshop', '/products/bjw-gold-temple-necklace-red.webp', 'Traditional gold-tone necklace with an ornate temple-style pendant. Supplied photo is a design reference; confirm metal, purity, length, weight, and availability with the workshop.'),
  design('BJW-G-REF-193', 'Crosshatch Gold Bangle', 'gold-crosshatch-bangle-bjw-g-ref-193', 'Gold', 'gold-bangles', 'Bangles', 'Classic', 'Confirm with workshop', '/products/bjw-gold-crosshatch-bangle.webp', 'Gold-tone bangle with a repeating crosshatch pattern. Supplied photo is a design reference; confirm metal, purity, size, weight, and availability with the workshop.'),
  design('BJW-G-REF-194', 'Leaf Drop Earrings', 'gold-leaf-drop-earrings-bjw-g-ref-194', 'Gold', 'gold-earrings', 'Earrings', 'Contemporary', 'Confirm with workshop', '/products/bjw-gold-leaf-drop-earrings.webp', 'Long gold-tone leaf earrings with a clear stone and pearl-style drop. Supplied photo is a design reference; confirm metal, purity, pearl type, and availability with the workshop.'),
  design('BJW-G-REF-195', 'Pearl Lattice Drop Earrings', 'gold-pearl-lattice-drop-earrings-bjw-g-ref-195', 'Gold', 'gold-earrings', 'Earrings', 'Contemporary', 'Confirm with workshop', '/products/bjw-gold-pearl-lattice-drop-earrings.webp', 'Gold-tone open lattice drop earrings with pearl-style centers. Supplied photo is a design reference; confirm metal, pearl type, weight, and availability with the workshop.'),
  design('BJW-G-REF-196', 'Feather Pearl Earrings', 'gold-feather-pearl-earrings-bjw-g-ref-196', 'Gold', 'gold-earrings', 'Earrings', 'Contemporary', 'Confirm with workshop', '/products/bjw-gold-feather-pearl-earrings.webp', 'Gold-tone feather-shaped earrings with clear stones and pearl-style drops. Supplied photo is a design reference; confirm metal, pearl type, stone details, and availability with the workshop.'),
  design('BJW-G-REF-197', 'Diamond Halo Drop Earrings', 'gold-diamond-halo-drop-earrings-bjw-g-ref-197', 'Gold', 'gold-earrings', 'Earrings', 'Classic', 'Confirm with workshop', '/products/bjw-gold-diamond-hoop-drop-earrings.webp', 'Gold-tone drop earrings with clear stone clusters above open oval hoops. Supplied photo is a design reference; confirm metal, purity, stone details, and availability with the workshop.'),
];
const audienceByDesignCode: Record<string, NonNullable<CatalogueDesign['audience']>> = {
  'BJW-G-REF-180': 'Women', 'BJW-G-REF-181': 'Women', 'BJW-G-REF-182': 'Women',
  'BJW-G-REF-183': 'Women', 'BJW-G-REF-184': 'Women', 'BJW-G-REF-185': 'Men',
  'BJW-G-REF-186': 'Women', 'BJW-G-REF-187': 'Women', 'BJW-G-REF-188': 'Women',
  'BJW-G-REF-189': 'Women', 'BJW-G-REF-190': 'Women', 'BJW-G-REF-191': 'Women',
  'BJW-G-REF-192': 'Women', 'BJW-G-REF-193': 'Women', 'BJW-G-REF-194': 'Women',
  'BJW-G-REF-195': 'Women', 'BJW-G-REF-196': 'Women', 'BJW-G-REF-197': 'Women',
};
for (const item of newWorkshopDesigns) {
  const audience = audienceByDesignCode[item.design_code];
  if (audience) item.audience = audience;
}
newWorkshopDesigns.find((item) => item.design_code === 'BJW-G-REF-136')?.images.push({
  id: 'bjw-g-ref-136-image-2',
  url: '/products/bjw-gold-crystal-cascade-earrings-detail.webp',
  alt: 'Crystal Cascade Earrings, alternate view',
});

sampleDesigns.push(...extraSampleDesigns, ...providedPhotoDesigns, ...newWorkshopDesigns);

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
