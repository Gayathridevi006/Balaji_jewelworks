'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { api, imageUrl } from '../../lib/api';
import { filterSampleDesigns, sampleCategories, sampleDesigns } from '../../lib/sample-catalogue';

type Item = (typeof sampleDesigns)[number];
type Category = { id: string; name: string };

export default function Catalogue() {
  const [items, setItems] = useState<Item[]>(sampleDesigns);
  const [cats, setCats] = useState<Category[]>(sampleCategories);
  const [metal, setMetal] = useState('');
  const [category, setCategory] = useState('');
  const [style, setStyle] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get('metal_type');
    if (initial === 'Gold' || initial === 'Silver') setMetal(initial);
  }, []);

  useEffect(() => {
    api<Category[]>('/categories').then((rows) => {
      if (rows.length) setCats(rows);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const query = new URLSearchParams();
    if (metal) query.set('metal_type', metal);
    if (category) query.set('category_id', category);
    if (style) query.set('style', style);
    if (search) query.set('search', search);

    const fallback = () => filterSampleDesigns({
      metal,
      category,
      categoryName: cats.find((entry) => entry.id === category)?.name,
      style,
      search,
    });

    api<{ items: Item[] }>(`/catalogue?${query}`)
      .then((response) => setItems(response.items.length ? response.items : fallback()))
      .catch(() => setItems(fallback()));
  }, [metal, category, style, search, cats]);

  return (
    <main className="container" style={{ padding: '60px 0' }}>
      <div className="eyebrow">The Balaji collection</div>
      <h1 className="serif" style={{ fontSize: 48, fontWeight: 400, margin: '10px 0' }}>Jewellery catalogue</h1>
      <p style={{ color: '#746d63', marginBottom: 12 }}>Explore designs, then speak with our goldsmith about making them your own.</p>
      <p style={{ color: '#8b7653', fontSize: 12, marginBottom: 28 }}>Illustrative sample designs · generated images · approximate weights only</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(155px,1fr))', gap: 10, marginBottom: 28 }}>
        <label className="input" style={{ display: 'flex', gap: 8 }}>
          <Search size={17} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name or design code" style={{ border: 0, outline: 0, width: '100%', background: 'transparent' }} />
        </label>
        <select className="input" value={metal} onChange={(event) => setMetal(event.target.value)}>
          <option value="">Gold &amp; Silver</option><option>Gold</option><option>Silver</option>
        </select>
        <select className="input" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">All categories</option>{cats.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
        </select>
        <select className="input" value={style} onChange={(event) => setStyle(event.target.value)}>
          <option value="">All styles</option>{['Traditional', 'Modern', 'Bridal', 'Classic', 'Contemporary'].map((entry) => <option key={entry}>{entry}</option>)}
        </select>
      </div>

      {items.length ? <div className="grid-products">
        {items.map((item) => <Link key={item.id} href={`/catalogue/${item.slug}`} className="card">
          <img className="product-img" src={imageUrl(item.primary_image || item.images?.[0]?.url)} alt={item.name} />
          <div style={{ padding: 14 }}>
            <div style={{ fontSize: 10, color: '#a77b35', letterSpacing: '.12em' }}>{item.metal_type} · {item.design_code}</div>
            <div className="serif" style={{ fontSize: 18, marginTop: 7 }}>{item.name}</div>
            {item.weight_range && <div style={{ fontSize: 12, color: '#746d63', marginTop: 6 }}>{item.weight_range}</div>}
          </div>
        </Link>)}
      </div> : <p style={{ padding: 30, textAlign: 'center', background: 'white' }}>No designs match those filters yet. <Link href="/contact" style={{ color: '#a77b35' }}>Ask about a custom design.</Link></p>}
    </main>
  );
}
