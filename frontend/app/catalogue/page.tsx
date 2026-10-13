'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { api, imageUrl } from '../../lib/api';
import { filterSampleDesigns, sampleCategories, sampleDesigns } from '../../lib/sample-catalogue';
import { sortCatalogueDesigns } from '../../lib/sort-catalogue';
import { categoriesForMetal, type CatalogueCategory } from '../../lib/categories';

type Item = (typeof sampleDesigns)[number];
type Category = CatalogueCategory;

export default function Catalogue() {
  const [items, setItems] = useState<Item[]>(sampleDesigns);
  const [cats, setCats] = useState<Category[]>(sampleCategories);
  const [metal, setMetal] = useState('');
  const [category, setCategory] = useState('');
  const [requestedCategoryName, setRequestedCategoryName] = useState('');
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [urlCategoryApplied, setUrlCategoryApplied] = useState(false);
  const [style, setStyle] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialMetal = params.get('metal_type');
    if (initialMetal === 'Gold' || initialMetal === 'Silver') setMetal(initialMetal);
    setRequestedCategoryName(params.get('category_name') || '');
  }, []);

  useEffect(() => {
    api<Category[]>('/categories').then((rows) => {
      if (rows.length) setCats(rows);
    }).catch(() => {}).finally(() => setCategoriesLoaded(true));
  }, []);

  useEffect(() => {
    if (!categoriesLoaded || urlCategoryApplied || !requestedCategoryName) return;
    const selected = cats.find((entry) =>
      entry.name.toLowerCase() === requestedCategoryName.toLowerCase() &&
      (!metal || !entry.metal_type || entry.metal_type === metal),
    );
    if (selected) setCategory(selected.id);
    setUrlCategoryApplied(true);
  }, [categoriesLoaded, cats, metal, requestedCategoryName, urlCategoryApplied]);

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
      .then((response) => setItems(sortCatalogueDesigns(response.items.length ? response.items : fallback())))
      .catch(() => setItems(fallback()));
  }, [metal, category, style, search, cats]);

  const visibleItems = sortCatalogueDesigns(items);
  const categoryOptions = metal
    ? categoriesForMetal(cats, metal as 'Gold' | 'Silver')
    : cats;
  const groupedItems = metal
    ? [{ title: '', items: visibleItems }]
    : ['Gold', 'Silver'].map((title) => ({
      title,
      items: visibleItems.filter((item) => item.metal_type === title),
    })).filter((group) => group.items.length > 0);

  function productCard(item: Item) {
    return <Link key={item.id} href={`/catalogue/${item.slug}`} className="card">
      <img className="product-img" src={imageUrl(item.primary_image || item.images?.[0]?.url)} alt={item.name} />
      <div style={{ padding: 14 }}>
        <div style={{ fontSize: 10, color: '#a77b35', letterSpacing: '.12em' }}>{item.metal_type} · {item.design_code}</div>
        <div className="serif" style={{ fontSize: 18, marginTop: 7 }}>{item.name}</div>
        {item.weight_range && <div style={{ fontSize: 12, color: '#746d63', marginTop: 6 }}>{item.weight_range}</div>}
      </div>
    </Link>;
  }

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
        <select className="input" value={metal} onChange={(event) => { setMetal(event.target.value); setCategory(''); }}>
          <option value="">Gold &amp; Silver</option><option>Gold</option><option>Silver</option>
        </select>
        <select className="input" value={category} onChange={(event) => {
          const selected = cats.find((entry) => entry.id === event.target.value);
          setCategory(event.target.value);
          if (selected?.metal_type === 'Gold' || selected?.metal_type === 'Silver') setMetal(selected.metal_type);
        }}>
          <option value="">All categories</option>{categoryOptions.map((entry) => <option key={entry.id} value={entry.id}>{!metal && entry.metal_type && entry.metal_type !== 'Both' ? `${entry.metal_type} · ` : ''}{entry.name}</option>)}
        </select>
        <select className="input" value={style} onChange={(event) => setStyle(event.target.value)}>
          <option value="">All styles</option>{['Traditional', 'Modern', 'Bridal', 'Classic', 'Contemporary'].map((entry) => <option key={entry}>{entry}</option>)}
        </select>
      </div>

      {visibleItems.length ? groupedItems.map((group) => <section key={group.title || 'filtered'} style={{ marginTop: group.title ? 34 : 0 }}>
        {group.title && <h2 className="serif" style={{ fontSize: 30, fontWeight: 400, margin: '0 0 16px' }}>{group.title} jewellery</h2>}
        <div className="grid-products">{group.items.map(productCard)}</div>
      </section>) : <p style={{ padding: 30, textAlign: 'center', background: 'white' }}>No designs match those filters yet. <Link href="/contact" style={{ color: '#a77b35' }}>Ask about a custom design.</Link></p>}
    </main>
  );
}
