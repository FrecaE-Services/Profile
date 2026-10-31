/* SPARE PARTS UG data layer: Supabase backend, with a built-in preview fallback. */
(function(){
const C = window.SPU_CONFIG || {};
const T = {p:'sparepartsug_products', c:'sparepartsug_categories', s:'sparepartsug_settings', o:'sparepartsug_orders'};
const U = 'https://images.unsplash.com/';
const DEFAULT_SETTINGS = {
  whatsapp:'256774188097',
  announcement:'',
  hero_tag:'No.1 Automotive Spare Parts Mega Store',
  hero_title:'Your Reliable Auto Parts Partner.',
  hero_text:'Car facelifting, body parts, Android radios, security systems, and every accessory in between — genuine parts, fitted to your exact model.',
  hero_image:U+'photo-1648892936786-de40bb1080a6?w=1200&auto=format&fit=crop&q=80',
  strip_location:'William Street, Kampala',
  phones:'0774 188097 / 0752 127553',
  hours:'Open 8:30 AM – 6:00 PM',
  why_title:'Why Spare Parts UG',
  why:[
    {t:'Model-Specific Fit',d:'Radios and parts listed by exact make, model, and year — no guesswork.'},
    {t:'3,000+ Followers Strong',d:'A trusted name across Kampala for facelifts, body parts, and upgrades.'},
    {t:'One Stop Shop',d:'From headlamps to GPS trackers — everything your car needs, in one place.'}],
  about:'Your reliable auto parts partner for quality car parts, facelifts, and accessories.',
  contact:'William Street, Kampala, Uganda\nCall / WhatsApp: 0774 188097 / 0752 127553\nOpen Mon–Sat, 8:30 AM – 6:00 PM',
  footer:'© 2026 Spare Parts UG',
  delivery_info:'Delivery within Kampala is arranged after we confirm your order. Upcountry orders go by bus/courier. Pick-up is free at our shop.',
  momo_instructions:'After we confirm stock and price on WhatsApp, send the payment by Mobile Money to the number we share in the chat, then send us the transaction ID.',
  cod_instructions:'Pay cash when your part is delivered or when you pick it up at the shop.',
  price_note:'Contact for price'
};
const DEFAULT_CATS = [
  {slug:'radios',name:'Android / CarPlay Radios',sort:1,hidden:false},
  {slug:'body',name:'Car Body Parts',sort:2,hidden:false},
  {slug:'security',name:'Security Systems',sort:3,hidden:false},
  {slug:'facelift',name:'Facelift Body Kits',sort:4,hidden:false}];
const P=(id,name,cat,img,badge,desc,sort)=>({id,name,category:cat,price:null,old_price:null,show_old_price:false,description:desc,badge,images:[img],stock:null,hidden:false,featured:!!badge,sort});
const DEFAULT_PRODUCTS = [
  P('prado-fj150-radio','Prado FJ150 9" Android Radio','radios',U+'photo-1648892936786-de40bb1080a6?w=900&auto=format&fit=crop&q=80','Popular','9-inch Android touchscreen head unit made for the Prado FJ150. Wireless CarPlay & Android Auto, GPS navigation, Bluetooth calls, reverse camera input and steering-wheel control support. Direct-fit frame — no cutting.',1),
  P('markx-radio','Mark X 2010–2023 9" Radio','radios',U+'photo-1648892936786-de40bb1080a6?w=900&auto=format&fit=crop&q=80&sat=-20','','9-inch Android radio for Toyota Mark X (2010–2023). CarPlay / Android Auto, YouTube & maps over Wi-Fi or hotspot, Bluetooth, USB and reverse camera support.',2),
  P('forester-lamps','Subaru Forester Headlamps / Taillights','body',U+'photo-1557775209-a640976a712f?w=900&auto=format&fit=crop&q=80','In Stock','Headlamps and taillights for Subaru Forester. Tell us your model year so we confirm the exact fit before you pay.',3),
  P('hilux-vigo-lamps','Hilux Vigo Headlamps / Rearlamps','body',U+'photo-1557775209-a640976a712f?w=900&auto=format&fit=crop&q=80&sat=-40','','Headlamps and rear lamps for Toyota Hilux Vigo. Available as single side or pair.',4),
  P('keyless-entry','Keyless Entry System','security',U+'photo-1710006548781-eff5670376fa?w=900&auto=format&fit=crop&q=80','','Keyless entry with remote lock/unlock and alarm. Fitting available at our shop.',5),
  P('gps-tracker','Car GPS Tracker','security',U+'photo-1710006548781-eff5670376fa?w=900&auto=format&fit=crop&q=80&sat=-30','Order Now','Real-time GPS tracking on your phone, engine cut-off and movement alerts. Ideal for personal cars, taxis and fleets.',6),
  P('lc-v8-facelift','Landcruiser V8 Facelift Kit','facelift',U+'photo-1557775209-a640976a712f?w=900&auto=format&fit=crop&q=80&hue=200','','Complete facelift kit to give your Land Cruiser V8 the latest look: bumper, grille and lamps.',7),
  P('markx-bumper','Mark X Facelift Front Bumper','facelift',U+'photo-1557775209-a640976a712f?w=900&auto=format&fit=crop&q=80&hue=280','','Facelift front bumper for Toyota Mark X. Primed and ready for spraying.',8)];

let sb = null;
const live = !!(C.SUPABASE_URL && C.SUPABASE_ANON_KEY);
// Local preview store: only on localhost (testing) — never on the public site.
const isLocal = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
const LS = k => 'spu_local_'+k;
const lget = (k,d) => { try{ const v = JSON.parse(localStorage.getItem(LS(k))); return v==null?d:v; }catch(e){ return d; } };
const lset = (k,v) => localStorage.setItem(LS(k), JSON.stringify(v));

async function client(){
  if(!live) return null;
  if(sb) return sb;
  if(!window.supabase){
    await new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';s.onload=res;s.onerror=rej;document.head.appendChild(s);});
  }
  sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY);
  return sb;
}
const chk = r => { if(r.error) throw new Error(r.error.message); return r.data; };
const bySort = (a,b) => (a.sort||0)-(b.sort||0);

const API = {
  mode: live ? 'live' : (isLocal ? 'local' : 'preview'),
  DEFAULT_SETTINGS,
  async settings(){
    if(live){ const s=await client(); const d=chk(await s.from(T.s).select('value').eq('key','site').maybeSingle()); return Object.assign({},DEFAULT_SETTINGS,d&&d.value||{}); }
    return Object.assign({},DEFAULT_SETTINGS, isLocal?lget('settings',{}):{});
  },
  async categories(all){
    let list;
    if(live){ const s=await client(); list=chk(await s.from(T.c).select('*').order('sort')); }
    else list = isLocal?lget('cats',DEFAULT_CATS):DEFAULT_CATS;
    list = list.slice().sort(bySort);
    return all?list:list.filter(c=>!c.hidden);
  },
  async products(all){
    let list;
    if(live){ const s=await client(); let q=s.from(T.p).select('*').order('sort'); if(!all) q=q.eq('hidden',false); list=chk(await q); }
    else list = isLocal?lget('products',DEFAULT_PRODUCTS):DEFAULT_PRODUCTS;
    list = list.slice().sort(bySort);
    return all?list:list.filter(p=>!p.hidden);
  },
  async createOrder(o){
    if(live){ const s=await client(); chk(await s.from(T.o).insert(o,{returning:'minimal'})); return o; }
    if(isLocal){ const l=lget('orders',[]); l.unshift(Object.assign({created_at:new Date().toISOString()},o)); lset('orders',l); }
    return o;
  },
  // ---- admin ----
  async session(){
    if(live){ const s=await client(); const {data}=await s.auth.getSession(); return data.session; }
    return isLocal && sessionStorage.getItem('spu_local_admin') ? {user:{email:C.ADMIN_EMAIL}} : null;
  },
  async signIn(email,password){
    if(live){ const s=await client(); const r=await s.auth.signInWithPassword({email,password}); if(r.error) throw new Error(r.error.message); return r.data.session; }
    if(isLocal){ if(email.trim().toLowerCase()!==C.ADMIN_EMAIL||password.length<8) throw new Error('Invalid login credentials'); sessionStorage.setItem('spu_local_admin','1'); return {user:{email}}; }
    throw new Error('The store database is not connected yet. Please contact Freca E-Services.');
  },
  async signOut(){ if(live){ const s=await client(); await s.auth.signOut(); } sessionStorage.removeItem('spu_local_admin'); },
  async saveProduct(p){
    if(live){ const s=await client(); return chk(await s.from(T.p).upsert(p).select().single()); }
    const l=lget('products',DEFAULT_PRODUCTS); const i=l.findIndex(x=>x.id===p.id); if(i>=0) l[i]=p; else l.push(p); lset('products',l); return p;
  },
  async deleteProduct(id){
    if(live){ const s=await client(); chk(await s.from(T.p).delete().eq('id',id)); return; }
    lset('products', lget('products',DEFAULT_PRODUCTS).filter(x=>x.id!==id));
  },
  async saveCategory(c){
    if(live){ const s=await client(); return chk(await s.from(T.c).upsert(c).select().single()); }
    const l=lget('cats',DEFAULT_CATS); const i=l.findIndex(x=>x.slug===c.slug); if(i>=0) l[i]=c; else l.push(c); lset('cats',l); return c;
  },
  async deleteCategory(slug){
    if(live){ const s=await client(); chk(await s.from(T.c).delete().eq('slug',slug)); return; }
    lset('cats', lget('cats',DEFAULT_CATS).filter(x=>x.slug!==slug));
  },
  async saveSettings(v){
    if(live){ const s=await client(); chk(await s.from(T.s).upsert({key:'site',value:v})); return; }
    lset('settings',v);
  },
  async orders(){
    if(live){ const s=await client(); return chk(await s.from(T.o).select('*').order('created_at',{ascending:false})); }
    return lget('orders',[]);
  },
  async setOrderStatus(id,status){
    if(live){ const s=await client(); chk(await s.from(T.o).update({status}).eq('id',id)); return; }
    const l=lget('orders',[]); const o=l.find(x=>x.id===id); if(o) o.status=status; lset('orders',l);
  },
  async deleteOrder(id){
    if(live){ const s=await client(); chk(await s.from(T.o).delete().eq('id',id)); return; }
    lset('orders', lget('orders',[]).filter(x=>x.id!==id));
  },
  async uploadImage(file){
    const fd=new FormData(); fd.append('file',file); fd.append('upload_preset',C.CLOUDINARY_PRESET); fd.append('folder','spare-parts-ug');
    const r=await fetch('https://api.cloudinary.com/v1_1/'+C.CLOUDINARY_CLOUD+'/image/upload',{method:'POST',body:fd});
    const j=await r.json(); if(!r.ok) throw new Error((j.error&&j.error.message)||'Upload failed');
    return j.secure_url.replace('/upload/','/upload/f_auto,q_auto,w_1000/');
  },
  ugx(n){ return n==null||n==='' ? null : 'UGX '+Number(n).toLocaleString('en-US'); },
  esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
};
window.SPU = API;
})();
