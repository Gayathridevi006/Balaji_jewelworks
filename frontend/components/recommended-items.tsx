import Link from 'next/link';
import { api, imageUrl } from '../lib/api';
import { sampleDesigns } from '../lib/sample-catalogue';

type Item = (typeof sampleDesigns)[number];

export default async function RecommendedItems({ current }: { current: Pick<Item, 'slug' | 'metal_type' | 'category_id'> }) {
  let catalogue: Item[] = sampleDesigns;

  try {
    const response = await api<{ items: Item[] }>(`/catalogue?metal_type=${encodeURIComponent(current.metal_type)}&limit=60`);
    if (response.items.length) {
      catalogue = [...response.items, ...sampleDesigns].filter((item, index, all) =>
        all.findIndex((candidate) => candidate.design_code === item.design_code) === index,
      );
    }
  } catch {
    // Keep the recommendations useful when the catalogue API is unavailable.
  }

  const candidates = catalogue.filter((item) => item.slug !== current.slug && item.metal_type === current.metal_type);
  const recommendations = [
    ...candidates.filter((item) => item.category_id === current.category_id),
    ...candidates.filter((item) => item.category_id !== current.category_id),
  ].slice(0, 10);

  if (!recommendations.length) return null;

  return (
    <section className="recommended-items" aria-labelledby="recommended-items-title">
      <div className="recommended-items-heading">
        <div>
          <div className="eyebrow">Continue exploring</div>
          <h2 id="recommended-items-title" className="serif">You may also like</h2>
        </div>
        <Link href={`/catalogue?metal_type=${encodeURIComponent(current.metal_type)}`} className="recommended-items-link">
          View all {current.metal_type.toLowerCase()} designs
        </Link>
      </div>
      <div className="recommended-items-track" aria-label="Recommended jewellery designs">
        {recommendations.map((item) => (
          <Link key={item.design_code} href={`/catalogue/${item.slug}`} className="card recommended-item-card">
            <img className="product-img" src={imageUrl(item.primary_image || item.images?.[0]?.url)} alt={item.name} loading="lazy" />
            <div className="recommended-item-copy">
              <div className="recommended-item-meta">{item.metal_type} · {item.design_code}</div>
              <div className="serif recommended-item-name">{item.name}</div>
              {item.weight_range && <div className="recommended-item-weight">{item.weight_range}</div>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
