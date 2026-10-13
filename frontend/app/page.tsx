import Link from 'next/link';
import { ArrowRight, ArrowUpRight, MessageCircle, MoveRight } from 'lucide-react';
import { api, imageUrl, whatsappLink } from '../lib/api';
import { sampleDesigns } from '../lib/sample-catalogue';
import { standardCategoryNames } from '../lib/categories';

type Item = {
  id: string;
  name: string;
  design_code: string;
  metal_type: string;
  category_id: string;
  slug: string;
  weight_range?: string;
  primary_image?: string;
  images?: { url: string }[];
};

async function getItems(): Promise<Item[]> {
  try {
    const response = await api<{ items: Item[] }>('/catalogue?limit=12');
    return response.items.length ? response.items.slice(0, 12) : sampleDesigns.slice(0, 12);
  } catch {
    return sampleDesigns.slice(0, 12);
  }
}

const collectionTiles = [
  {
    title: 'Gold jewellery',
    subtitle: 'Warmth that lasts generations',
    metal: 'Gold',
    image: '/products/bjw-g-002-pearl-jhumkas.webp',
  },
  {
    title: 'Silver jewellery',
    subtitle: 'Everyday pieces with a little meaning',
    metal: 'Silver',
    image: '/products/bjw-s-001-silver-drops.webp',
  },
] as const;

export default async function Home() {
  const items = await getItems();

  return (
    <main>
      <section style={{ background: 'linear-gradient(90deg,rgba(36,32,27,.8),rgba(36,32,27,.12)),url(/products/bjw-g-001-temple-necklace.webp) center 38%/cover', minHeight: 570, color: 'white', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <div style={{ maxWidth: 560 }}>
            <div className="eyebrow" style={{ color: '#e2c488' }}>Made by hand, meant for you</div>
            <h1 className="serif" style={{ fontWeight: 400, fontSize: 'clamp(44px,7vw,78px)', lineHeight: 1.05, margin: '24px 0' }}>Beautiful jewellery,<br />crafted just for you.</h1>
            <p style={{ maxWidth: 440, lineHeight: 1.8, color: '#f0ece5', fontSize: 15 }}>Explore timeless gold and silver designs. Choose a piece you love, and we’ll make it yours.</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 30, flexWrap: 'wrap' }}>
              <a className="btn" href="#catalogue">Explore designs <ArrowRight size={16} /></a>
              <Link className="btn btn-light" style={{ borderColor: 'white', color: 'white' }} href="/contact">Visit our workshop</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '88px 0 30px', textAlign: 'center' }}>
        <div className="eyebrow">A collection for every moment</div>
        <h2 className="serif" style={{ fontWeight: 400, fontSize: 40, margin: '16px 0' }}>Find your kind of beautiful</h2>
        <p style={{ color: '#746d63', fontSize: 14 }}>Made to be worn, loved, and made your own.</p>
        <div className="collection-tiles" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 18, marginTop: 40, textAlign: 'left' }}>
          {collectionTiles.map((tile) => <Link key={tile.metal} href={`/catalogue?metal_type=${tile.metal}`} style={{ minHeight: 280, padding: 30, display: 'flex', flexDirection: 'column', justifyContent: 'end', background: `linear-gradient(0deg,rgba(24,22,19,.75),transparent 80%),url(${tile.image}) center/cover`, color: 'white' }}>
            <span className="eyebrow" style={{ color: '#e5c98f' }}>Explore collection</span>
            <h3 className="serif" style={{ fontSize: 32, fontWeight: 400, margin: '8px 0' }}>{tile.title}</h3>
            <span style={{ fontSize: 13 }}>{tile.subtitle} <ArrowUpRight size={15} style={{ verticalAlign: 'middle' }} /></span>
          </Link>)}
        </div>
      </section>

      <section id="catalogue" className="container" style={{ padding: '70px 0 35px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 18, marginBottom: 25 }}>
          <div>
            <div className="eyebrow">Selected for you</div>
            <h2 className="serif" style={{ fontWeight: 400, fontSize: 38, margin: '12px 0 0' }}>Latest designs</h2>
            <p style={{ fontSize: 12, color: '#746d63', margin: '8px 0 0' }}>A preview of 12 designs · weights are estimates</p>
          </div>
          <Link href="/catalogue" style={{ fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>View all <MoveRight size={15} style={{ verticalAlign: 'middle' }} /></Link>
        </div>
        {items.length ? <div className="grid-products">{items.map((item) => <Link key={item.id} href={`/catalogue/${item.slug}`} className="card">
          <img className="product-img" src={imageUrl(item.primary_image || item.images?.[0]?.url)} alt={item.name} />
          <div style={{ padding: 14 }}>
            <div style={{ fontSize: 10, color: '#a77b35', letterSpacing: '.12em' }}>{item.metal_type} · {item.design_code}</div>
            <div className="serif" style={{ fontSize: 18, marginTop: 7 }}>{item.name}</div>
            {item.weight_range && <div style={{ fontSize: 12, color: '#746d63', marginTop: 6 }}>{item.weight_range}</div>}
          </div>
        </Link>)}</div> : <div style={{ padding: 36, textAlign: 'center', border: '1px solid #eee8dc', color: '#746d63' }}>New designs are on their way. <Link href="/contact" style={{ color: '#a77b35' }}>Ask us about a custom piece →</Link></div>}
      </section>

      <section className="container" style={{ padding: '35px 0 70px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="eyebrow">Browse the full collection</div>
          <h2 className="serif" style={{ fontWeight: 400, fontSize: 38, margin: '12px 0' }}>Shop by category</h2>
          <p style={{ color: '#746d63', fontSize: 14, margin: 0 }}>Choose a category to see all matching designs.</p>
        </div>
        {(['Gold', 'Silver'] as const).map((metal) => <section key={metal} style={{ marginTop: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 14 }}>
            <h3 className="serif" style={{ fontSize: 28, fontWeight: 400, margin: 0 }}>{metal} jewellery</h3>
            <Link href={`/catalogue?metal_type=${metal}`} style={{ color: '#a77b35', fontSize: 12, whiteSpace: 'nowrap' }}>All {metal.toLowerCase()} designs <ArrowRight size={14} style={{ verticalAlign: 'middle' }} /></Link>
          </div>
          <div className="category-tiles">{standardCategoryNames.map((category) => <Link key={`${metal}-${category}`} className="card category-tile" href={`/catalogue?metal_type=${metal}&category_name=${encodeURIComponent(category)}`}>
            <span>{category}</span><ArrowUpRight size={15} color="#a77b35" />
          </Link>)}</div>
        </section>)}
      </section>

      <section id="about" style={{ background: '#eee8dc', padding: '74px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, alignItems: 'center' }}>
          <div>
            <div className="eyebrow">Our craft, your story</div>
            <h2 className="serif" style={{ fontSize: 42, fontWeight: 400, lineHeight: 1.15 }}>A little more personal.<br />A little more you.</h2>
            <p style={{ color: '#655e54', lineHeight: 1.9, fontSize: 14 }}>At Balaji Jewelry Works, every piece begins with a conversation. Select a design, tell us what you have in mind, and our goldsmith will work with you on the details.</p>
            <Link href="/contact" className="btn btn-light" style={{ marginTop: 14 }}>Meet your goldsmith <ArrowRight size={15} /></Link>
          </div>
          <img src="/products/bjw-g-003-enamel-bangles.webp" alt="Illustrative engraved gold bangles" style={{ width: '100%', maxHeight: 390, objectFit: 'cover' }} />
        </div>
      </section>

      <section className="container" style={{ padding: '68px 0', textAlign: 'center' }}>
        <div className="eyebrow">Your next favourite piece is a conversation away</div>
        <h2 className="serif" style={{ fontWeight: 400, fontSize: 37 }}>Have a design in mind?</h2>
        <p style={{ color: '#746d63' }}>Tell us what you love. We’ll help you make it yours.</p>
        <a className="btn" href={whatsappLink('Hello Balaji Jewelry Works, I would like to discuss a custom jewellery design.')}><MessageCircle size={16} /> Talk to the goldsmith</a>
      </section>
    </main>
  );
}
