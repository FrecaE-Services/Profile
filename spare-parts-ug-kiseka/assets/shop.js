/* SPARE PARTS UG storefront */
(function(){
const S = window.SPU, esc = S.esc, $ = id => document.getElementById(id);
let settings = S.DEFAULT_SETTINGS, cats = [], products = [], curCat = 'all', query = '';
let cart = []; try{ cart = JSON.parse(localStorage.getItem('spu_cart')) || []; }catch(e){}
let pay = 'cod';

const waNum = () => String(settings.whatsapp||'256774188097').replace(/\D/g,'');
const waLink = t => 'https://wa.me/'+waNum()+'?text='+encodeURIComponent(t);
const priceHtml = p => {
  const n = S.ugx(p.price);
  if(!n) return esc(settings.price_note||'Contact for price');
  return n + (p.show_old_price && p.old_price ? ' <s>'+S.ugx(p.old_price)+'</s>' : '');
};
const img = p => (p.images && p.images[0]) || settings.hero_image;
const catName = slug => (cats.find(c=>c.slug===slug)||{}).name || '';
const outOfStock = p => p.stock !== null && p.stock !== undefined && p.stock !== '' && Number(p.stock) <= 0;
function toast(t){ const el=$('toast'); el.textContent=t; el.classList.add('show'); clearTimeout(toast.t); toast.t=setTimeout(()=>el.classList.remove('show'),1600); }

function applySettings(){
  document.querySelectorAll('[data-s]').forEach(el=>{ const v=settings[el.dataset.s]; if(v!=null) el.textContent=v; });
  document.querySelectorAll('[data-wa]').forEach(a=>{ a.href=waLink(a.dataset.wa); a.target='_blank'; a.rel='noopener'; });
  if(settings.hero_image) $('heroImg').src = settings.hero_image;
  const an=$('announce'); an.hidden=!settings.announcement; an.textContent=settings.announcement||'';
  $('whyGrid').innerHTML = (settings.why||[]).map(w=>'<div class="why-item"><h3>'+esc(w.t)+'</h3><p>'+esc(w.d)+'</p></div>').join('');
}
function renderCats(){
  $('catRow').innerHTML = '<span class="cat-pill'+(curCat==='all'?' active':'')+'" data-cat="all">All Parts</span>' +
    cats.map(c=>'<span class="cat-pill'+(curCat===c.slug?' active':'')+'" data-cat="'+esc(c.slug)+'">'+esc(c.name)+'</span>').join('');
}
function renderGrid(){
  const q = query.trim().toLowerCase();
  const list = products.filter(p => (curCat==='all'||p.category===curCat) &&
    (!q || (p.name+' '+(p.description||'')+' '+catName(p.category)).toLowerCase().includes(q)))
    .sort((a,b)=> (curCat==='all' && !q ? (b.featured?1:0)-(a.featured?1:0) : 0) || (a.sort||0)-(b.sort||0));
  $('productGrid').innerHTML = list.length ? list.map(p=>{
    const out = outOfStock(p);
    const badge = out ? '<span class="card-badge out">Sold Out</span>' : (p.badge?'<span class="card-badge">'+esc(p.badge)+'</span>':'');
    return '<div class="card" data-id="'+esc(p.id)+'" data-cat="'+esc(p.category)+'"><div class="card-img">'+badge+
      '<img src="'+esc(img(p))+'" alt="'+esc(p.name)+'" loading="lazy"></div><div class="card-body"><span class="card-cat">'+esc(catName(p.category))+
      '</span><h3>'+esc(p.name)+'</h3><div class="card-price">'+priceHtml(p)+'</div><button class="add-btn" data-add="'+esc(p.id)+'"'+(out?' disabled':'')+'>'+(out?'Sold Out':'Add to Cart')+'</button></div></div>';
  }).join('') : '<p class="empty-note">No parts match your search. <a href="#" data-wa="Hi Spare Parts UG, I am looking for: '+esc(query)+'" style="color:var(--red)">Ask us on WhatsApp</a></p>';
  document.querySelectorAll('#productGrid [data-wa]').forEach(a=>{a.href=waLink(a.dataset.wa);a.target='_blank';});
}

// ---------- product detail (#/p/<id>) ----------
let pdQty = 1;
function showProduct(id){
  const p = products.find(x=>x.id===id);
  if(!p){ document.body.classList.remove('view-product'); return; }
  pdQty = 1;
  const imgs = (p.images&&p.images.length)?p.images:[img(p)];
  const out = outOfStock(p);
  let stock = '';
  if(p.stock===null||p.stock===undefined||p.stock==='') stock='<b>Available</b> · confirm fit on WhatsApp';
  else if(out) stock='<b class="out">Out of stock</b>';
  else if(Number(p.stock)<=3) stock='<b class="low">Only '+Number(p.stock)+' left</b>';
  else stock='<b>In stock</b> ('+Number(p.stock)+' available)';
  $('pdWrap').innerHTML =
   '<button class="pd-back" onclick="history.length>1?history.back():(location.hash=\'\')">← Back to all parts</button>'+
   '<div class="pd-grid"><div><div class="pd-main">'+(p.badge&&!out?'<span class="card-badge" style="z-index:2">'+esc(p.badge)+'</span>':'')+'<img id="pdImg" src="'+esc(imgs[0])+'" alt="'+esc(p.name)+'"></div>'+
   (imgs.length>1?'<div class="pd-thumbs">'+imgs.map((u,i)=>'<button class="'+(i?'':'on')+'" data-img="'+esc(u)+'"><img src="'+esc(u)+'" alt=""></button>').join('')+'</div>':'')+
   '</div><div><span class="card-cat">'+esc(catName(p.category))+'</span><h1>'+esc(p.name)+'</h1><div class="pd-price">'+priceHtml(p)+'</div>'+
   '<div class="pd-stock">'+stock+'</div><div class="pd-desc">'+esc(p.description||'')+'</div>'+
   '<div class="pd-actions"><div class="qty"><button data-q="-1" aria-label="Less">−</button><span id="pdQty">1</span><button data-q="1" aria-label="More">+</button></div>'+
   '<button class="btn-red" id="pdAdd"'+(out?' disabled style="opacity:.5"':'')+'>'+(out?'Sold Out':'Add to Cart')+'</button></div>'+
   '<a class="btn-outline" style="display:block;text-align:center" target="_blank" rel="noopener" href="'+esc(waLink('Hi Spare Parts UG, I am interested in: '+p.name+'\n'+location.href.split('#')[0]+'#/p/'+p.id+'\nMy car model & year: '))+'">Ask about this part on WhatsApp</a>'+
   ' <button class="pd-share" id="pdShare">Share this part</button>'+
   '<div class="pd-info">🚚 '+esc(settings.delivery_info||'')+'<br>💵 Pay Cash on Delivery or by Mobile Money.</div></div></div>';
  document.body.classList.add('view-product');
  document.title = p.name+' | Spare Parts UG';
  window.scrollTo(0,0);
  $('pdWrap').onclick = e=>{
    const t=e.target.closest('[data-img]'); if(t){ $('pdImg').src=t.dataset.img; document.querySelectorAll('.pd-thumbs button').forEach(b=>b.classList.toggle('on',b===t)); }
    const q=e.target.closest('[data-q]'); if(q){ pdQty=Math.max(1,pdQty+Number(q.dataset.q)); if(p.stock!=null&&p.stock!=='') pdQty=Math.min(pdQty,Math.max(1,Number(p.stock))); $('pdQty').textContent=pdQty; }
    if(e.target.id==='pdAdd' && !out){ addToCart(p.id,pdQty); }
    if(e.target.id==='pdShare'){ const url=location.href; if(navigator.share) navigator.share({title:p.name,url}).catch(()=>{}); else { navigator.clipboard&&navigator.clipboard.writeText(url); toast('Link copied'); } }
  };
}
function route(){
  const m = location.hash.match(/^#\/p\/(.+)$/);
  if(m) showProduct(decodeURIComponent(m[1]));
  else { document.body.classList.remove('view-product'); document.title='Spare Parts UG | Your Reliable Auto Parts Partner'; }
}

// ---------- cart ----------
function saveCart(){ localStorage.setItem('spu_cart', JSON.stringify(cart)); }
function cartLines(){ return cart.map(c=>({c, p:products.find(p=>p.id===c.id)})).filter(x=>x.p); }
function totals(){ let total=0, unpriced=0, count=0; cartLines().forEach(({c,p})=>{ count+=c.qty; if(p.price==null||p.price==='') unpriced++; else total+=Number(p.price)*c.qty; }); return {total,unpriced,count}; }
function addToCart(id,qty){
  qty=qty||1; const it=cart.find(c=>c.id===id); if(it) it.qty+=qty; else cart.push({id,qty});
  saveCart(); renderCart(); toast('Added to cart ✓');
  const b=document.querySelector('[data-add="'+CSS.escape(id)+'"]'); if(b){ b.textContent='Added ✓'; b.classList.add('added'); setTimeout(()=>{b.textContent='Add to Cart';b.classList.remove('added');},1200); }
}
window.addToCart = addToCart;
function renderCart(){
  cart = cart.filter(c=>products.some(p=>p.id===c.id) || !products.length);
  const t = totals();
  $('cartBadge').textContent = t.count; $('cartCount').textContent = t.count;
  $('cartTotal').textContent = S.ugx(t.total);
  $('cartNote').hidden = !t.unpriced; $('cartNote').textContent = t.unpriced ? '+ '+t.unpriced+' item(s) priced on confirmation via WhatsApp' : '';
  $('checkoutBtn').disabled = !t.count;
  const lines = cartLines();
  $('cartItems').innerHTML = lines.length ? lines.map(({c,p})=>
    '<div class="cart-item"><div class="ci-img"><img src="'+esc(img(p))+'" alt=""></div><div class="ci-mid"><div class="ci-name">'+esc(p.name)+'</div><div class="ci-price">'+(S.ugx(p.price)?S.ugx(p.price*c.qty):esc(settings.price_note))+'</div>'+
    '<div class="qty"><button data-cq="-1" data-id="'+esc(p.id)+'">−</button><span>'+c.qty+'</span><button data-cq="1" data-id="'+esc(p.id)+'">+</button></div></div>'+
    '<button class="cart-item-remove" data-rm="'+esc(p.id)+'">Remove</button></div>').join('')
    : '<p class="cart-empty">Your cart is empty. Browse parts and tap "Add to Cart".</p>';
}
window.toggleCart = function(open){
  $('cartDrawer').classList.toggle('open', open); $('cartOverlay').classList.toggle('open', open);
  if(!open){ $('cartDrawer').classList.remove('step-details'); $('drawerTitle').textContent='Your Cart'; }
};
$('cartItems').addEventListener('click', e=>{
  const q=e.target.closest('[data-cq]'), r=e.target.closest('[data-rm]');
  if(q){ const it=cart.find(c=>c.id===q.dataset.id); it.qty+=Number(q.dataset.cq); if(it.qty<1) cart=cart.filter(c=>c!==it); }
  if(r){ cart=cart.filter(c=>c.id!==r.dataset.rm); }
  if(q||r){ saveCart(); renderCart(); }
});

// ---------- checkout: details form → record order → WhatsApp ----------
let cust = {}; try{ cust = JSON.parse(localStorage.getItem('spu_customer'))||{}; }catch(e){}
window.goDetails = function(){
  if(!totals().count) return;
  $('cartDrawer').classList.add('step-details'); $('drawerTitle').textContent='Your Details';
  const t = totals();
  $('co').innerHTML =
   '<h4>Almost done — fill in your details</h4><p class="lead">Your order will be sent to our WhatsApp. We confirm stock, fit and delivery with you there. No online card payment needed.</p>'+
   '<label for="cName">Full name *</label><input id="cName" autocomplete="name" value="'+esc(cust.name||'')+'">'+
   '<label for="cPhone">Phone / WhatsApp number *</label><input id="cPhone" type="tel" autocomplete="tel" placeholder="07XX XXX XXX" value="'+esc(cust.phone||'')+'">'+
   '<label for="cLoc">Delivery location *</label><input id="cLoc" placeholder="e.g. Ntinda, Kampala — or Pick up at shop" value="'+esc(cust.location||'')+'">'+
   '<label for="cCar">Car model & year</label><input id="cCar" placeholder="e.g. Prado TX 2012" value="'+esc(cust.car||'')+'">'+
   '<label for="cNotes">Notes</label><textarea id="cNotes" rows="2" placeholder="Anything we should know"></textarea>'+
   '<label>Payment method *</label>'+
   '<div class="pay-opt'+(pay==='cod'?' on':'')+'" data-pay="cod"><input type="radio" name="pay" value="cod"'+(pay==='cod'?' checked':'')+'><div><b>Cash on Delivery</b><br><small style="color:var(--steel)">Pay when you receive your part</small></div></div>'+
   '<div class="pay-opt'+(pay==='momo'?' on':'')+'" data-pay="momo"><input type="radio" name="pay" value="momo"'+(pay==='momo'?' checked':'')+'><div><b>Mobile Money (MTN / Airtel)</b><br><small style="color:var(--steel)">Pay manually by MoMo</small></div></div>'+
   '<div class="pay-help" id="payHelp"></div>'+
   '<div class="co-sum">'+cartLines().map(({c,p})=>'<div><span>'+c.qty+' × '+esc(p.name)+'</span><span>'+(S.ugx(p.price)?S.ugx(p.price*c.qty):'TBC')+'</span></div>').join('')+
   '<div class="tot"><span>Total</span><span>'+S.ugx(t.total)+(t.unpriced?' + TBC':'')+'</span></div></div>'+
   '<button class="checkout-btn" id="placeBtn">Place Order on WhatsApp</button><div class="co-err" id="coErr"></div>'+
   '<button class="co-back" onclick="backToCart()">← Back to cart</button>';
  const help=()=>{ $('payHelp').textContent = pay==='momo' ? settings.momo_instructions : settings.cod_instructions; };
  help();
  $('co').querySelectorAll('.pay-opt').forEach(o=>o.onclick=()=>{ pay=o.dataset.pay; $('co').querySelectorAll('.pay-opt').forEach(x=>{x.classList.toggle('on',x===o); x.querySelector('input').checked = x===o;}); help(); });
  $('placeBtn').onclick = placeOrder;
};
window.backToCart = function(){ $('cartDrawer').classList.remove('step-details'); $('drawerTitle').textContent='Your Cart'; };

function orderId(){ const d=new Date(), p=n=>String(n).padStart(2,'0'); const r=Math.random().toString(36).slice(2,6).toUpperCase(); return 'SPU-'+String(d.getFullYear()).slice(2)+p(d.getMonth()+1)+p(d.getDate())+'-'+r; }
function buildMessage(o){
  const L=['*NEW ORDER — SPARE PARTS UG*','Order ID: *'+o.id+'*',''];
  o.items.forEach((it,i)=>L.push((i+1)+'. '+it.name+' × '+it.qty+' — '+(it.price!=null?S.ugx(it.price*it.qty):'price to confirm')));
  L.push('', (o.total>0?'*Total: '+S.ugx(o.total)+'*'+(o.items.some(i=>i.price==null)?' (+ items to confirm)':''):'*Total: to be confirmed*'), '',
    '*Customer details*','Name: '+o.customer_name,'Phone: '+o.customer_phone,'Delivery location: '+o.location);
  if(o.car) L.push('Car: '+o.car);
  if(o.notes) L.push('Notes: '+o.notes);
  L.push('', 'Payment method: *'+(o.payment_method==='momo'?'Mobile Money (manual)':'Cash on Delivery')+'*','', 'Please confirm availability and delivery. Thank you!');
  return L.join('\n');
}
async function placeOrder(){
  const v=id=>$(id).value.trim();
  const o={ id:orderId(), customer_name:v('cName'), customer_phone:v('cPhone'), location:v('cLoc'), car:v('cCar'), notes:v('cNotes'), payment_method:pay, status:'new' };
  if(!o.customer_name||!o.customer_phone||!o.location){ $('coErr').textContent='Please fill in your name, phone number and delivery location.'; return; }
  if(o.customer_phone.replace(/\D/g,'').length<9){ $('coErr').textContent='Please enter a valid phone number.'; return; }
  o.items = cartLines().map(({c,p})=>({id:p.id,name:p.name,qty:c.qty,price:(p.price==null||p.price==='')?null:Number(p.price)}));
  o.total = totals().total;
  localStorage.setItem('spu_customer', JSON.stringify({name:o.customer_name,phone:o.customer_phone,location:o.location,car:o.car}));
  const btn=$('placeBtn'); btn.disabled=true; btn.textContent='Sending your order…'; $('coErr').textContent='';
  const url = waLink(buildMessage(o));
  window.__lastOrderUrl = url;
  try{ await Promise.race([S.createOrder(o), new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),6000))]); }
  catch(e){ console.warn('Order record failed:', e.message); }
  cart=[]; saveCart(); renderCart();
  $('co').innerHTML='<div class="co-done"><h4>Opening WhatsApp…</h4><p class="lead">Your order <b>'+o.id+'</b> is ready. Press <b>Send</b> in WhatsApp so we receive it.</p><a class="checkout-btn" href="'+esc(url)+'" target="_blank" rel="noopener">Open WhatsApp again</a></div>';
  if(!window.__noRedirect) location.href = url;
}

// ---------- events / boot ----------
$('catRow').addEventListener('click', e=>{ const p=e.target.closest('.cat-pill'); if(!p) return; curCat=p.dataset.cat; renderCats(); renderGrid(); });
$('search').addEventListener('input', e=>{ query=e.target.value; renderGrid(); });
$('productGrid').addEventListener('click', e=>{
  const a=e.target.closest('[data-add]'); if(a){ e.stopPropagation(); if(!a.disabled) addToCart(a.dataset.add,1); return; }
  if(e.target.closest('a')) return;
  const c=e.target.closest('.card'); if(c) location.hash='#/p/'+encodeURIComponent(c.dataset.id);
});
window.addEventListener('hashchange', route);
applySettings(); renderCart();
(async()=>{
  try{ [settings,cats,products] = await Promise.all([S.settings(),S.categories(),S.products()]); }
  catch(e){ console.error(e); $('productGrid').innerHTML='<p class="empty-note">Could not load parts. Please refresh or chat with us on WhatsApp.</p>'; return; }
  applySettings(); renderCats(); renderGrid(); renderCart(); route();
})();
})();
