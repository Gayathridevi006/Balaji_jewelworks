import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import ContactEnquiryForm from '../../components/contact-enquiry-form';
import { api } from '../../lib/api';

type Business = {
  shop_name?: string;
  goldsmith_name?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  maps_url?: string;
  business_hours?: string;
  about?: string;
};

export default async function Contact() {
  let business: Business = {};
  try {
    business = await api<Business>('/business');
  } catch {}

  const phone = business.phone || process.env.NEXT_PUBLIC_WHATSAPP || '919845024348';
  const whatsapp = (business.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP || '919845024348').replace(/\D/g, '');
  const address = business.address || '#112/6, 7th Main Road, Peer Building, Srirampuram, Bangalore – 560021';
  const mapsUrl = business.maps_url || 'https://maps.app.goo.gl/nqJyhbB9HbC3RJXa8';
  const contactCards = [
    [Phone, 'Call us', phone || 'Phone details coming soon', phone ? `tel:${phone}` : '#'],
    [MessageCircle, 'WhatsApp', 'Chat directly with the goldsmith', `https://wa.me/${whatsapp}`],
    [Mail, 'Email', business.email || 'Email details coming soon', business.email ? `mailto:${business.email}` : '#'],
    [MapPin, 'Find us', address, mapsUrl],
  ] as const;

  return (
    <main className="container" style={{ padding: '70px 0' }}>
      <div className="eyebrow">Let’s talk</div>
      <h1 className="serif" style={{ fontWeight: 400, fontSize: 52, margin: '12px 0' }}>A design starts<br />with a conversation.</h1>
      <p style={{ color: '#746d63', lineHeight: 1.8, maxWidth: 550 }}>
        {business.about || 'Tell us what you are looking for, ask about a design, or plan a custom piece with our goldsmith.'}
      </p>

      <section style={{ maxWidth: 760, marginTop: 36 }}>
        <h2 className="serif" style={{ fontSize: 30, fontWeight: 400, margin: '0 0 8px' }}>Request a call back</h2>
        <p style={{ color: '#746d63', fontSize: 13, lineHeight: 1.7, margin: '0 0 16px' }}>
          Share your contact details and what you’re looking for. We’ll use them to respond to this enquiry.
        </p>
        <ContactEnquiryForm whatsapp={whatsapp} />
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 15, marginTop: 38 }}>
        {contactCards.map(([Icon, title, detail, href]) => (
          <a key={title} className="card" href={href} target={title === 'Find us' ? '_blank' : undefined} rel={title === 'Find us' ? 'noreferrer' : undefined} style={{ padding: 22, minHeight: 150 }}>
            <Icon size={20} color="#a77b35" />
            <h3 className="serif" style={{ fontWeight: 400, margin: '18px 0 8px' }}>{title} <ArrowUpRight size={14} style={{ verticalAlign: 'middle' }} /></h3>
            <p style={{ fontSize: 13, color: '#746d63', lineHeight: 1.6 }}>{detail}</p>
          </a>
        ))}
      </div>

      <div style={{ marginTop: 36, background: '#eee8dc', padding: 25, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Clock size={19} color="#a77b35" />
        <div><b>Business hours</b><p style={{ margin: '7px 0 0', fontSize: 13, color: '#746d63' }}>{business.business_hours || 'Every day, 10:00 AM–9:00 PM'}</p></div>
      </div>
    </main>
  );
}
