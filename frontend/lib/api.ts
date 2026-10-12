function apiBase(){
  if(typeof window!=='undefined')return process.env.NEXT_PUBLIC_API_URL||`${window.location.origin}/api`;
  return process.env.API_URL||process.env.NEXT_PUBLIC_API_URL||'';
}
export async function api<T>(path:string,init?:RequestInit):Promise<T>{const base=apiBase();if(!base)throw new Error('Backend API URL is not configured');const res=await fetch(`${base}${path}`,{...init,headers:{'Content-Type':'application/json',...(init?.headers||{})},cache:'no-store'});if(!res.ok)throw new Error((await res.text())||'Request failed');return res.json()}
export function imageUrl(path?:string){if(!path)return '/placeholder.svg';if(path.startsWith('http'))return path;const base=(process.env.NEXT_PUBLIC_API_URL||'').replace(/\/api$/,'');return `${base}${path}`}
export function whatsappLink(message:string){return `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP||'919845024348'}?text=${encodeURIComponent(message)}`}
