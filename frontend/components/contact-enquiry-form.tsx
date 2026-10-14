'use client';

import { useState, type FormEvent } from 'react';
import { LoaderCircle, Send } from 'lucide-react';

const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api';

type Props = { whatsapp: string };

export default function ContactEnquiryForm({ whatsapp }: Props) {
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setNotice('Opening WhatsApp with your enquiry details…');

    const form = event.currentTarget;
    const values = new FormData(form);
    const details = {
      name: String(values.get('name') || '').trim(),
      phone: String(values.get('phone') || '').trim(),
      email: String(values.get('email') || '').trim(),
      interest: String(values.get('interest') || '').trim(),
      message: String(values.get('message') || '').trim(),
      consent: values.get('consent') === 'on',
      website: String(values.get('website') || '').trim(),
    };
    const whatsappText = [
      'Hello Balaji Jewellery Works, I would like to enquire.',
      `Name: ${details.name}`,
      `Phone: ${details.phone}`,
      details.email ? `Email: ${details.email}` : '',
      details.interest ? `Interested in: ${details.interest}` : '',
      details.message ? `Message: ${details.message}` : '',
    ].filter(Boolean).join('\n');
    const whatsappNumber = whatsapp.replace(/\D/g, '');

    // Save to the catalogue inbox when possible, without delaying the WhatsApp handoff.
    void fetch(`${apiBase}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      keepalive: true,
    }).catch(() => {});

    window.location.assign(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`);
  }

  return (
    <form onSubmit={submit} className="card" style={{ padding: 24, display: 'grid', gap: 14 }}>
      <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>Your name *
        <input className="input" name="name" autoComplete="name" required minLength={2} maxLength={100} />
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
        <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>Phone number *
          <input className="input" name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={24} placeholder="Include country code if outside India" />
        </label>
        <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>Email (optional)
          <input className="input" name="email" type="email" autoComplete="email" maxLength={254} />
        </label>
      </div>
      <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>Design or category (optional)
        <input className="input" name="interest" maxLength={120} placeholder="e.g. BJW-G-002 or gold jhumkas" />
      </label>
      <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>How can we help? (optional)
        <textarea className="input" name="message" rows={4} maxLength={2000} placeholder="Share your question or customization idea" />
      </label>
      <label aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
        Website <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 12, lineHeight: 1.6, color: '#746d63' }}>
        <input type="checkbox" name="consent" required style={{ marginTop: 3 }} />
        <span>I agree that Balaji Jewellery Works may use these details to reply to my enquiry.</span>
      </label>
      <button className="btn" type="submit" disabled={sending}>
      {sending ? <><LoaderCircle size={16} /> Opening WhatsApp…</> : <><Send size={15} /> Send enquiry</>}
      </button>
      <p role="status" aria-live="polite" style={{ minHeight: 18, margin: 0, fontSize: 13, color: '#48634a' }}>{notice}</p>
      <small style={{ color: '#746d63', lineHeight: 1.6 }}>WhatsApp will open with your details filled in. Review the message and tap Send in WhatsApp to submit your enquiry. We’ll also try to save it in our catalogue inbox.</small>
    </form>
  );
}
