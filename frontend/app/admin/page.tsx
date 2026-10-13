'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { ImagePlus, LoaderCircle, LogOut, PackagePlus, Trash2, Upload } from 'lucide-react';
import { imageUrl } from '../../lib/api';

const base = process.env.NEXT_PUBLIC_API_URL || '/api';
const imageLimit = 8 * 1024 * 1024;

type Category = { id: string; name: string };
type Item = {
  id: string;
  name: string;
  design_code: string;
  metal_type: string;
  weight_range?: string;
  published: boolean;
  featured: boolean;
  images?: { id: string; url: string; alt?: string }[];
};
type DesignForm = {
  name: string;
  design_code: string;
  metal_type: 'Gold' | 'Silver';
  category_id: string;
  subcategory: string;
  description: string;
  style: string;
  weight_range: string;
  featured: boolean;
  published: boolean;
};

const blankForm: DesignForm = {
  name: '', design_code: '', metal_type: 'Gold', category_id: '', subcategory: '',
  description: '', style: 'Traditional', weight_range: '', featured: false, published: false,
};

function sortDesigns(items: Item[]) {
  const metalOrder: Record<string, number> = { Gold: 0, Silver: 1 };
  return [...items].sort((a, b) =>
    (metalOrder[a.metal_type] ?? 2) - (metalOrder[b.metal_type] ?? 2) ||
    a.design_code.localeCompare(b.design_code, undefined, { numeric: true, sensitivity: 'base' }),
  );
}

function apiConfigurationError() {
  return 'The catalogue API is not connected. Set NEXT_PUBLIC_API_URL to your deployed FastAPI URL (ending in /api) in the Cloudflare Worker build variables, then rebuild and deploy.';
}

async function readJson<T>(response: Response, fallback: string): Promise<T> {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    if (contentType.toLowerCase().includes('text/html')) throw new Error(apiConfigurationError());
    throw new Error(fallback);
  }
  try {
    return await response.json() as T;
  } catch {
    throw new Error(fallback);
  }
}

async function responseError(response: Response, fallback: string) {
  try {
    const data = await readJson<{ detail?: unknown }>(response, fallback);
    return typeof data.detail === 'string' ? data.detail : fallback;
  } catch (cause) {
    return cause instanceof Error ? cause.message : fallback;
  }
}

export default function Admin() {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<DesignForm>(blankForm);
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);

  const previews = useMemo(() => files.map((file) => ({ file, url: URL.createObjectURL(file) })), [files]);
  const sortedItems = sortDesigns(items);
  const itemGroups = ['Gold', 'Silver'].map((metal) => ({
    metal,
    items: sortedItems.filter((item) => item.metal_type === metal),
  })).filter((group) => group.items.length > 0);

  useEffect(() => {
    setToken(localStorage.getItem('bjw-admin') || '');
  }, []);

  useEffect(() => () => previews.forEach(({ url }) => URL.revokeObjectURL(url)), [previews]);

  async function load(currentToken = token) {
    if (!currentToken) return;
    setLoading(true);
    setError('');
    try {
      const headers = { Authorization: `Bearer ${currentToken}` };
      const [itemsResponse, categoryResponse] = await Promise.all([
        fetch(`${base}/admin/catalogue`, { headers, cache: 'no-store' }),
        fetch(`${base}/categories`, { cache: 'no-store' }),
      ]);
      if (itemsResponse.status === 401) throw new Error('Your admin session expired. Sign in again.');
      if (!itemsResponse.ok) throw new Error(await responseError(itemsResponse, 'Could not load saved designs.'));
      if (!categoryResponse.ok) throw new Error('Could not load catalogue categories.');
      setItems(await readJson<Item[]>(itemsResponse, 'Could not load saved designs.'));
      setCategories(await readJson<Category[]>(categoryResponse, 'Could not load catalogue categories.'));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load admin data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) void load(token);
  }, [token]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(`${base}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const fallback = 'Sign in failed. Check the email and password.';
      if (!response.ok) throw new Error(await responseError(response, fallback));
      const data = await readJson<{ access_token?: string }>(response, fallback);
      if (!data.access_token) throw new Error('The server did not return an admin session.');
      localStorage.setItem('bjw-admin', data.access_token);
      setPassword('');
      setToken(data.access_token);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not sign in.');
    } finally {
      setBusy(false);
    }
  }

  function chooseImages(event: ChangeEvent<HTMLInputElement>) {
    setError('');
    const selected = Array.from(event.target.files || []);
    const invalid = selected.find((file) => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > imageLimit);
    if (invalid) {
      setFiles([]);
      event.target.value = '';
      setError(`${invalid.name} must be a JPEG, PNG, or WebP image under 8 MB.`);
      return;
    }
    setFiles(selected);
  }

  async function createDesign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!files.length) {
      setError('Add at least one product photo before saving this design.');
      return;
    }
    if (!token) return;
    setBusy(true);
    setError('');
    setMessage('');
    let createdItem: Item | null = null;
    try {
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
      const response = await fetch(`${base}/admin/catalogue`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...form, published: false }),
      });
      if (!response.ok) throw new Error(await responseError(response, 'Could not save the design. Check the design code and required fields.'));
      const newItem = await readJson<Item>(response, 'The server did not return the saved design.');
      if (!newItem?.id) throw new Error('The server did not return the saved design ID.');
      createdItem = newItem;

      const upload = new FormData();
      files.forEach((file) => upload.append('files', file));
      const uploadResponse = await fetch(`${base}/admin/catalogue/${newItem.id}/images`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: upload,
      });
      if (!uploadResponse.ok) {
        const uploadError = await responseError(uploadResponse, 'Photo upload failed.');
        throw new Error(`The design was saved as a draft, but its photos did not upload: ${uploadError}`);
      }

      if (form.published || form.featured) {
        const publishResponse = await fetch(`${base}/admin/catalogue/${newItem.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ ...form, published: form.published }),
        });
        if (!publishResponse.ok) throw new Error(await responseError(publishResponse, 'Photos uploaded, but the final publish settings could not be saved. The design remains a draft.'));
      }

      setForm(blankForm);
      setFiles([]);
      const input = document.getElementById('design-images') as HTMLInputElement | null;
      if (input) input.value = '';
      setMessage(form.published ? 'Design and photos saved and published.' : 'Design and photos saved as a draft.');
      await load(token);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save the design.');
      if (createdItem) await load(token);
    } finally {
      setBusy(false);
    }
  }

  async function deleteDesign(item: Item) {
    if (!confirm(`Move “${item.name}” to deleted designs?`)) return;
    setError('');
    try {
      const response = await fetch(`${base}/admin/catalogue/${item.id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(await responseError(response, 'Could not delete this design.'));
      setMessage(`${item.name} moved to deleted designs.`);
      await load(token);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not delete this design.');
    }
  }

  function logout() {
    localStorage.removeItem('bjw-admin');
    setToken('');
    setItems([]);
    setPassword('');
    setMessage('');
    setError('');
  }

  if (!token) return (
    <main className="container" style={{ maxWidth: 480, padding: '80px 0' }}>
      <div className="eyebrow">Administration</div>
      <h1 className="serif" style={{ fontWeight: 400 }}>Sign in to manage designs</h1>
      <p style={{ color: '#746d63', lineHeight: 1.7 }}>Use the admin account configured for the catalogue backend.</p>
      <form onSubmit={login} style={{ display: 'grid', gap: 12 }}>
        <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>Admin email
          <input className="input" type="email" autoComplete="username" required placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>Password
          <input className="input" type="password" autoComplete="current-password" required placeholder="Admin password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error && <p role="alert" style={{ color: '#9b3428', margin: 0 }}>{error}</p>}
        <button className="btn" disabled={busy}>{busy && <LoaderCircle size={16} />} Sign in securely</button>
      </form>
      <p style={{ fontSize: 12, color: '#746d63', marginTop: 18 }}>Admin access is supplied by the separately hosted backend.</p>
    </main>
  );

  return (
    <main className="container" style={{ padding: '42px 0 70px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div><div className="eyebrow">Administration</div><h1 className="serif" style={{ fontWeight: 400, margin: '8px 0' }}>Catalogue manager</h1><p style={{ color: '#746d63', margin: 0 }}>Add a design, upload its photos, then publish it to the public catalogue.</p></div>
        <button className="btn btn-light" onClick={logout}><LogOut size={15} /> Log out</button>
      </header>

      {error && <div role="alert" style={{ padding: 14, marginTop: 22, border: '1px solid #e6b6ae', background: '#fff5f3', color: '#812c22' }}>{error}</div>}
      {message && <div role="status" style={{ padding: 14, marginTop: 22, border: '1px solid #b8d5bd', background: '#f3faf3', color: '#315d38' }}>{message}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(300px,.9fr)', gap: 24, marginTop: 26, alignItems: 'start' }}>
        <section className="card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 18 }}><PackagePlus color="#a77b35" /><div><h2 className="serif" style={{ fontWeight: 400, margin: 0 }}>Add a catalogue design</h2><small style={{ color: '#746d63' }}>Fields marked * are required.</small></div></div>
          <form onSubmit={createDesign} style={{ display: 'grid', gap: 14 }}>
            <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>Design name *
              <input className="input" required minLength={2} maxLength={120} placeholder="e.g. Lakshmi Temple Necklace" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>Unique design code *
              <input className="input" required minLength={3} maxLength={40} pattern="[A-Za-z0-9-]+" placeholder="e.g. BJW-GE-001" value={form.design_code} onChange={(event) => setForm({ ...form, design_code: event.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '') })} />
              <small style={{ color: '#746d63' }}>Use letters, numbers, and hyphens. Each code must be unique.</small>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12 }}>
              <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>Metal *
                <select className="input" value={form.metal_type} onChange={(event) => setForm({ ...form, metal_type: event.target.value as DesignForm['metal_type'] })}><option>Gold</option><option>Silver</option></select>
              </label>
              <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>Category *
                <select className="input" required value={form.category_id} onChange={(event) => setForm({ ...form, category_id: event.target.value })}><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
              </label>
              <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>Style
                <select className="input" value={form.style} onChange={(event) => setForm({ ...form, style: event.target.value })}>{['Traditional', 'Modern', 'Bridal', 'Classic', 'Contemporary'].map((style) => <option key={style}>{style}</option>)}</select>
              </label>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12 }}>
              <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>Subcategory
                <input className="input" maxLength={80} placeholder="e.g. Temple or Jhumka" value={form.subcategory} onChange={(event) => setForm({ ...form, subcategory: event.target.value })} />
              </label>
              <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>Approx. weight (grams) *
                <input className="input" required maxLength={60} placeholder="e.g. 8–10 g per pair" value={form.weight_range} onChange={(event) => setForm({ ...form, weight_range: event.target.value })} />
                <small style={{ color: '#746d63' }}>Enter an estimate, including a range if needed.</small>
              </label>
            </div>
            <label style={{ display: 'grid', gap: 6, fontSize: 13 }}>Description
              <textarea className="input" rows={4} maxLength={2000} placeholder="Materials, details, and customization options" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </label>

            <div style={{ border: '1px dashed #cfc4b2', padding: 16, background: '#fcfbf8' }}>
              <label htmlFor="design-images" style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }}><ImagePlus color="#a77b35" /><span><b style={{ display: 'block', fontSize: 13 }}>Product photos *</b><small style={{ color: '#746d63' }}>JPEG, PNG or WebP · up to 8 MB per photo</small></span></label>
              <input id="design-images" type="file" accept="image/jpeg,image/png,image/webp" multiple required style={{ marginTop: 14, maxWidth: '100%' }} onChange={chooseImages} />
              {previews.length > 0 && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(90px,1fr))', gap: 9, marginTop: 14 }}>{previews.map(({ file, url }) => <div key={`${file.name}-${file.lastModified}`}><img src={url} alt={`Preview of ${file.name}`} style={{ width: '100%', height: 112, objectFit: 'cover', background: '#eee8dc' }} /><small style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#746d63' }}>{file.name}</small></div>)}</div>}
            </div>

            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 13 }}>
              <label><input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} /> Feature on homepage</label>
              <label><input type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} /> Publish after upload</label>
            </div>
            <button className="btn" disabled={busy || categories.length === 0}>{busy ? <><LoaderCircle size={16} /> Saving design…</> : <><Upload size={15} /> Save design and photos</>}</button>
            {categories.length === 0 && <small style={{ color: '#8c4f3c' }}>Categories could not be loaded; reconnect the catalogue API before adding designs.</small>}
          </form>
        </section>

        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}><h2 className="serif" style={{ fontWeight: 400, marginTop: 0 }}>Saved designs ({items.length})</h2><button className="btn btn-light" onClick={() => void load()} disabled={loading}>{loading ? 'Refreshing…' : 'Refresh'}</button></div>
          {items.length ? itemGroups.map((group) => <div key={group.metal}>
            <h3 className="serif" style={{ fontWeight: 400, margin: '0 0 12px' }}>{group.metal} designs</h3>
            {group.items.map((item) => <article className="card" key={item.id} style={{ padding: 12, marginBottom: 10, display: 'flex', gap: 12, alignItems: 'center' }}>
              {item.images?.[0]?.url ? <img src={imageUrl(item.images[0].url)} alt={item.images[0].alt || item.name} style={{ width: 68, height: 78, objectFit: 'cover', background: '#eee8dc' }} /> : <div style={{ width: 68, height: 78, display: 'grid', placeItems: 'center', background: '#eee8dc', color: '#a77b35' }}><ImagePlus size={20} /></div>}
              <div style={{ flex: 1, minWidth: 0 }}><b>{item.name}</b><small style={{ display: 'block', marginTop: 5, color: '#746d63' }}>{item.metal_type} · {item.design_code}</small><small style={{ display: 'block', marginTop: 4, color: '#746d63' }}>{item.weight_range || 'Weight not set'} · {item.published ? 'Published' : 'Draft'}</small></div>
              <button type="button" aria-label={`Delete ${item.name}`} title="Move to deleted designs" onClick={() => void deleteDesign(item)} style={{ border: 0, background: 'transparent', color: '#8c4f3c', cursor: 'pointer', padding: 8 }}><Trash2 size={17} /></button>
            </article>)}
          </div>) : <div className="card" style={{ padding: 22, color: '#746d63' }}>{loading ? 'Loading saved designs…' : 'No saved designs yet. Add your first design using the form.'}</div>}
          <p style={{ fontSize: 12, color: '#746d63', marginTop: 20 }}>Supplier imports are reviewed separately at <a href="/admin/imports" style={{ color: '#a77b35' }}>Import review →</a></p>
        </section>
      </div>
      <style>{'@media(max-width:780px){main>div:nth-of-type(2){grid-template-columns:1fr!important}}'}</style>
    </main>
  );
}
