/* SPARE PARTS UG admin dashboard */
(function(){
const S=window.SPU, C=window.SPU_CONFIG, esc=S.esc, $=id=>document.getElementById(id), app=$('app');
let tab='orders', products=[], cats=[], orders=[], settings={}, oFilter='all', pSearch='';
const STATUSES=['new','confirmed','delivered','cancelled'];
function toast(t){const e=$('toast');e.textContent=t;e.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('show'),1800);}
const fmtDate=d=>{try{return new Date(d).toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});}catch(e){return d;}};
const slugify=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,50)||('item-'+Date.now());
const intOrNull=v=>{v=String(v==null?'':v).replace(/[^\d]/g,'');return v===''?null:parseInt(v,10);};

async function boot(){
  const s=await S.session().catch(()=>null);
  if(!s){ return loginView(); }
  if(C.ADMIN_EMAIL && s.user && s.user.email && s.user.email.toLowerCase()!==C.ADMIN_EMAIL){ await S.signOut(); return loginView('This account is not the store admin.'); }
  await loadAll(); render();
}
function loginView(msg){
  app.innerHTML='<div class="login"><div class="brand" style="font-size:1.6rem;margin-bottom:6px">Spare Parts <span>UG</span><small>Admin Dashboard</small></div>'+
  '<div class="card" style="margin-top:18px"><form id="lf"><label for="le">Email</label><input id="le" type="email" autocomplete="username" required>'+
  '<label for="lp">Password</label><input id="lp" type="password" autocomplete="current-password" required>'+
  '<button class="btn" style="width:100%;margin-top:16px" id="lb">Sign In</button><div class="err" id="lerr">'+esc(msg||'')+'</div></form></div>'+
  (S.mode==='preview'?'<p class="muted" style="text-align:center">The store database is being connected. Sign-in opens once setup is complete.</p>':'')+
  '<p class="muted" style="text-align:center;margin-top:10px"><a href="../">← Back to store</a></p></div>';
  $('lf').onsubmit=async e=>{e.preventDefault();$('lb').disabled=true;$('lerr').textContent='';
    try{await S.signIn($('le').value.trim(),$('lp').value);await boot();}catch(err){$('lerr').textContent=err.message==='Invalid login credentials'?'Wrong email or password.':err.message;$('lb').disabled=false;}};
}
async function loadAll(){
  [products,cats,settings,orders]=await Promise.all([S.products(true),S.categories(true),S.settings(),S.orders()]);
}
function shell(inner){
  const t=(k,l)=>'<button class="tab'+(tab===k?' on':'')+'" data-tab="'+k+'">'+l+'</button>';
  app.innerHTML='<header><div class="wrap"><div class="brand">Spare Parts <span>UG</span><small>Admin Dashboard'+(S.mode!=='live'?' · local test mode':'')+'</small></div>'+
   '<div><a class="btn sec sm" href="../" target="_blank">View Store</a> <button class="btn sec sm" id="logout">Log out</button></div></div></header>'+
   '<div class="wrap"><div class="tabs">'+t('orders','Orders ('+orders.filter(o=>o.status==='new').length+' new)')+t('products','Products')+t('categories','Categories')+t('customers','Customers')+t('settings','Site Settings')+'</div><div id="view">'+inner+'</div></div>';
  app.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;render();});
  $('logout').onclick=async()=>{await S.signOut();loginView();};
}
function render(){ ({orders:vOrders,products:vProducts,categories:vCats,customers:vCustomers,settings:vSettings})[tab](); }

// ---------- Orders ----------
function vOrders(){
  const active=orders.filter(o=>o.status!=='cancelled');
  const revenue=orders.filter(o=>o.status==='delivered').reduce((a,o)=>a+(+o.total||0),0);
  const pending=orders.filter(o=>o.status==='new'||o.status==='confirmed').reduce((a,o)=>a+(+o.total||0),0);
  const today=new Date().toDateString(), todayN=orders.filter(o=>new Date(o.created_at).toDateString()===today).length;
  const list=orders.filter(o=>oFilter==='all'||o.status===oFilter);
  shell('<div class="stats"><div class="stat"><b>'+orders.length+'</b><span>Total orders</span></div><div class="stat"><b>'+todayN+'</b><span>Orders today</span></div>'+
   '<div class="stat"><b>'+S.ugx(revenue)+'</b><span>Revenue (delivered)</span></div><div class="stat"><b>'+S.ugx(pending)+'</b><span>Pending value</span></div></div>'+
   '<div class="row" style="margin-bottom:10px"><div class="tabs" style="border:0;padding:0;margin:0">'+['all'].concat(STATUSES).map(s=>'<button class="tab'+(oFilter===s?' on':'')+'" data-of="'+s+'">'+s+'</button>').join('')+'</div>'+
   '<div><button class="btn sec sm" id="oRefresh">Refresh</button> <button class="btn sec sm" id="oCsv">Export CSV</button></div></div>'+
   (list.length?list.map(o=>{
     const items=(typeof o.items==='string'?JSON.parse(o.items):o.items)||[];
     const phone=String(o.customer_phone||'').replace(/\D/g,'').replace(/^0/,'256');
     return '<div class="card"><div class="row"><div><b>'+esc(o.id)+'</b> <span class="pill '+esc(o.status)+'">'+esc(o.status)+'</span><div class="muted">'+fmtDate(o.created_at)+'</div></div><b style="color:var(--red)">'+S.ugx(o.total||0)+'</b></div>'+
      '<div style="margin-top:6px"><b>'+esc(o.customer_name)+'</b> · <a href="tel:'+esc(o.customer_phone)+'">'+esc(o.customer_phone)+'</a><div class="muted">📍 '+esc(o.location)+(o.car?' · 🚗 '+esc(o.car):'')+'</div>'+
      '<div class="muted">💵 '+(o.payment_method==='momo'?'Mobile Money (manual)':'Cash on Delivery')+'</div>'+(o.notes?'<div class="muted">📝 '+esc(o.notes)+'</div>':'')+'</div>'+
      '<div class="items">'+items.map(i=>'<div class="row"><span>'+i.qty+' × '+esc(i.name)+'</span><span>'+(i.price!=null?S.ugx(i.price*i.qty):'TBC')+'</span></div>').join('')+'</div>'+
      '<div class="row"><select data-os="'+esc(o.id)+'" style="width:auto">'+STATUSES.map(s=>'<option'+(s===o.status?' selected':'')+'>'+s+'</option>').join('')+'</select>'+
      '<div><a class="btn sm" style="background:#25D366" target="_blank" rel="noopener" href="https://wa.me/'+phone+'?text='+encodeURIComponent('Hello '+o.customer_name+', thank you for your order '+o.id+' with Spare Parts UG. ')+'">WhatsApp</a> <button class="btn danger sm" data-od="'+esc(o.id)+'">Delete</button></div></div></div>';
   }).join(''):'<p class="muted">No orders yet. New orders from the website appear here automatically.</p>'));
  document.querySelectorAll('[data-of]').forEach(b=>b.onclick=()=>{oFilter=b.dataset.of;vOrders();});
  document.querySelectorAll('[data-os]').forEach(s=>s.onchange=async()=>{try{await S.setOrderStatus(s.dataset.os,s.value);orders.find(o=>o.id===s.dataset.os).status=s.value;toast('Status updated');vOrders();}catch(e){toast(e.message);}});
  document.querySelectorAll('[data-od]').forEach(b=>b.onclick=async()=>{if(!confirm('Delete order '+b.dataset.od+'?'))return;await S.deleteOrder(b.dataset.od);orders=orders.filter(o=>o.id!==b.dataset.od);vOrders();});
  $('oRefresh').onclick=async()=>{orders=await S.orders();vOrders();toast('Orders refreshed');};
  $('oCsv').onclick=()=>{const rows=[['Order ID','Date','Name','Phone','Location','Car','Payment','Items','Total','Status']].concat(orders.map(o=>[o.id,o.created_at,o.customer_name,o.customer_phone,o.location,o.car||'',o.payment_method,((typeof o.items==='string'?JSON.parse(o.items):o.items)||[]).map(i=>i.qty+'x '+i.name).join('; '),o.total,o.status]));
    const csv=rows.map(r=>r.map(c=>'"'+String(c==null?'':c).replace(/"/g,'""')+'"').join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='spare-parts-ug-orders.csv';a.click();};
}
// ---------- Customers ----------
function vCustomers(){
  const m={};orders.forEach(o=>{const k=String(o.customer_phone||'').replace(/\D/g,'').replace(/^256/,'0');const c=m[k]||(m[k]={name:o.customer_name,phone:o.customer_phone,location:o.location,n:0,spent:0,last:o.created_at});c.n++;if(o.status!=='cancelled')c.spent+=(+o.total||0);if(o.created_at>c.last){c.last=o.created_at;c.name=o.customer_name;c.location=o.location;}});
  const list=Object.values(m).sort((a,b)=>b.last>a.last?1:-1);
  shell('<p class="muted" style="margin-bottom:10px">'+list.length+' customers (from website orders)</p>'+(list.length?list.map(c=>{const ph=String(c.phone).replace(/\D/g,'').replace(/^0/,'256');return '<div class="card"><div class="row"><div><b>'+esc(c.name)+'</b><div class="muted">'+esc(c.phone)+' · 📍 '+esc(c.location)+'</div><div class="muted">'+c.n+' order(s) · '+S.ugx(c.spent)+' · last '+fmtDate(c.last)+'</div></div><a class="btn sm" style="background:#25D366" target="_blank" href="https://wa.me/'+ph+'">WhatsApp</a></div></div>';}).join(''):'<p class="muted">No customers yet.</p>'));
}
// ---------- Products ----------
function vProducts(){
  const q=pSearch.toLowerCase(), list=products.filter(p=>!q||p.name.toLowerCase().includes(q));
  const cn=s=>(cats.find(c=>c.slug===s)||{}).name||s;
  shell('<div class="row" style="margin-bottom:10px"><b>'+products.length+' products</b><button class="btn" id="pNew">+ Add Product</button></div>'+
   '<input class="search" id="pSearch" placeholder="Search products…" value="'+esc(pSearch)+'">'+
   '<div class="plist">'+list.map(p=>'<div class="card" style="'+(p.hidden?'opacity:.55':'')+'"><div class="thumb"><img src="'+esc((p.images||[])[0]||'')+'" alt=""></div>'+
    '<div style="flex:1;min-width:0"><div class="pname">'+esc(p.name)+'</div><div class="muted">'+esc(cn(p.category))+(p.stock!=null?' · stock '+p.stock:'')+'</div>'+
    '<div class="price">'+(S.ugx(p.price)||'Contact for price')+(p.show_old_price&&p.old_price?'<s>'+S.ugx(p.old_price)+'</s>':'')+'</div>'+
    '<div>'+(p.hidden?'<span class="pill">Hidden</span> ':'')+(p.featured?'<span class="pill">Featured</span> ':'')+(p.badge?'<span class="pill new">'+esc(p.badge)+'</span>':'')+'</div></div>'+
    '<div style="display:flex;flex-direction:column;gap:6px"><button class="btn sm" data-pe="'+esc(p.id)+'">Edit</button><button class="btn sec sm" data-ph="'+esc(p.id)+'">'+(p.hidden?'Unhide':'Hide')+'</button></div></div>').join('')+'</div>');
  $('pSearch').oninput=e=>{pSearch=e.target.value;const pos=e.target.selectionStart;vProducts();$('pSearch').focus();$('pSearch').setSelectionRange(pos,pos);};
  $('pNew').onclick=()=>editProduct(null);
  document.querySelectorAll('[data-pe]').forEach(b=>b.onclick=()=>editProduct(products.find(p=>p.id===b.dataset.pe)));
  document.querySelectorAll('[data-ph]').forEach(b=>b.onclick=async()=>{const p=Object.assign({},products.find(x=>x.id===b.dataset.ph));p.hidden=!p.hidden;try{await S.saveProduct(p);Object.assign(products.find(x=>x.id===p.id),p);toast(p.hidden?'Hidden from store':'Visible on store');vProducts();}catch(e){toast(e.message);}});
}
function editProduct(p){
  const isNew=!p; p=p?JSON.parse(JSON.stringify(p)):{id:'',name:'',category:(cats[0]||{}).slug||'',price:null,old_price:null,show_old_price:false,description:'',badge:'',images:[],stock:null,hidden:false,featured:false,sort:(products.length+1)};
  const box=$('modalBox');
  const draw=()=>{
   box.innerHTML='<div class="row"><h2 style="font-size:1.3rem">'+(isNew?'Add product':'Edit product')+'</h2><button class="btn sec sm" id="mx">✕</button></div>'+
   '<label>Product name *</label><input id="fName" value="'+esc(p.name)+'">'+
   '<div class="g2"><div><label>Price (UGX)</label><input id="fPrice" inputmode="numeric" placeholder="blank = Contact for price" value="'+(p.price??'')+'"></div>'+
   '<div><label>Old price (UGX)</label><input id="fOld" inputmode="numeric" value="'+(p.old_price??'')+'"></div></div>'+
   '<label class="check"><input type="checkbox" id="fShowOld"'+(p.show_old_price?' checked':'')+'> Show old price with strike-through (discount)</label>'+
   '<div class="g2"><div><label>Category</label><select id="fCat">'+cats.map(c=>'<option value="'+esc(c.slug)+'"'+(c.slug===p.category?' selected':'')+'>'+esc(c.name)+'</option>').join('')+'</select></div>'+
   '<div><label>Label / badge</label><input id="fBadge" list="badges" placeholder="e.g. Popular, New, Sale" value="'+esc(p.badge||'')+'"><datalist id="badges"><option>Popular<option>New<option>In Stock<option>Sale<option>Order Now<option>Limited</datalist></div></div>'+
   '<div class="g2"><div><label>Stock qty</label><input id="fStock" inputmode="numeric" placeholder="blank = not tracked" value="'+(p.stock??'')+'"></div>'+
   '<div><label>Sort order</label><input id="fSort" inputmode="numeric" value="'+(p.sort??'')+'"></div></div>'+
   '<label>Description</label><textarea id="fDesc" rows="5">'+esc(p.description||'')+'</textarea>'+
   '<label class="check"><input type="checkbox" id="fHidden"'+(p.hidden?' checked':'')+'> Hidden (not shown on store)</label>'+
   '<label class="check"><input type="checkbox" id="fFeat"'+(p.featured?' checked':'')+'> Featured (shown first)</label>'+
   '<label>Images (first = main photo)</label><div class="imgs">'+(p.images||[]).map((u,i)=>'<div class="imgbox"><img src="'+esc(u)+'" alt="">'+(i?'':'<span class="first">MAIN</span>')+'<div class="ctl"><button data-il="'+i+'" title="Move left">◀</button><button data-ix="'+i+'" title="Remove">🗑</button><button data-ir="'+i+'" title="Move right">▶</button></div></div>').join('')+
   '<label class="upl" id="uplLbl">+ Add photos<input type="file" id="fFile" accept="image/*" multiple hidden></label></div>'+
   '<div class="row" style="margin-top:8px"><input id="fUrl" placeholder="…or paste an image link" style="flex:1"><button class="btn sec sm" id="fUrlAdd">Add link</button></div>'+
   '<div class="err" id="fErr"></div>'+
   '<div class="sticky-actions"><button class="btn" id="fSave" style="flex:1">Save product</button>'+(isNew?'':'<button class="btn danger" id="fDel">Delete</button>')+'</div>';
   const grab=()=>{p.name=$('fName').value.trim();p.price=intOrNull($('fPrice').value);p.old_price=intOrNull($('fOld').value);p.show_old_price=$('fShowOld').checked;p.category=$('fCat').value;p.badge=$('fBadge').value.trim();p.stock=intOrNull($('fStock').value);p.sort=intOrNull($('fSort').value)||0;p.description=$('fDesc').value;p.hidden=$('fHidden').checked;p.featured=$('fFeat').checked;};
   $('mx').onclick=()=>$('modal').classList.remove('open');
   box.querySelectorAll('[data-ix]').forEach(b=>b.onclick=()=>{grab();p.images.splice(+b.dataset.ix,1);draw();});
   box.querySelectorAll('[data-il]').forEach(b=>b.onclick=()=>{grab();const i=+b.dataset.il;if(i>0){[p.images[i-1],p.images[i]]=[p.images[i],p.images[i-1]];}draw();});
   box.querySelectorAll('[data-ir]').forEach(b=>b.onclick=()=>{grab();const i=+b.dataset.ir;if(i<p.images.length-1){[p.images[i+1],p.images[i]]=[p.images[i],p.images[i+1]];}draw();});
   $('fUrlAdd').onclick=()=>{grab();const u=$('fUrl').value.trim();if(/^https?:\/\//.test(u)){p.images.push(u);draw();}};
   $('fFile').onchange=async e=>{grab();const files=[...e.target.files];$('uplLbl').firstChild.textContent='Uploading…';
     for(const f of files){try{p.images.push(await S.uploadImage(f));}catch(err){$('fErr').textContent='Upload failed: '+err.message;}} draw();};
   $('fSave').onclick=async()=>{grab();if(!p.name){$('fErr').textContent='Please enter a product name.';return;}
     if(p.show_old_price&&(!p.old_price||!p.price)){$('fErr').textContent='To show a strike-through price, enter both the price and the old price.';return;}
     if(isNew){let id=slugify(p.name);while(products.some(x=>x.id===id))id+='-'+Math.random().toString(36).slice(2,5);p.id=id;}
     $('fSave').disabled=true;try{await S.saveProduct(p);const i=products.findIndex(x=>x.id===p.id);if(i>=0)products[i]=p;else products.push(p);products.sort((a,b)=>(a.sort||0)-(b.sort||0));$('modal').classList.remove('open');toast('Product saved ✓');vProducts();}catch(err){$('fErr').textContent=err.message;$('fSave').disabled=false;}};
   if($('fDel'))$('fDel').onclick=async()=>{if(!confirm('Delete "'+p.name+'" permanently? (Tip: use Hidden to remove it temporarily)'))return;await S.deleteProduct(p.id);products=products.filter(x=>x.id!==p.id);$('modal').classList.remove('open');toast('Deleted');vProducts();};
  };
  draw();$('modal').classList.add('open');$('modal').scrollTop=0;
}
// ---------- Categories ----------
function vCats(){
  shell('<div class="card"><b>Add category</b><div class="row" style="margin-top:8px"><input id="cNew" placeholder="e.g. Tyres & Rims" style="flex:1"><button class="btn" id="cAdd">Add</button></div></div>'+
   cats.map(c=>'<div class="card"><div class="row"><input data-cn="'+esc(c.slug)+'" value="'+esc(c.name)+'" style="flex:1"><input data-cs="'+esc(c.slug)+'" value="'+(c.sort||0)+'" style="width:60px" inputmode="numeric"></div>'+
    '<div class="row" style="margin-top:8px"><span class="muted">'+products.filter(p=>p.category===c.slug).length+' products'+(c.hidden?' · hidden':'')+'</span><div><button class="btn sm" data-csave="'+esc(c.slug)+'">Save</button> <button class="btn sec sm" data-ch="'+esc(c.slug)+'">'+(c.hidden?'Unhide':'Hide')+'</button> <button class="btn danger sm" data-cd="'+esc(c.slug)+'">Delete</button></div></div></div>').join(''));
  $('cAdd').onclick=async()=>{const n=$('cNew').value.trim();if(!n)return;const c={slug:slugify(n),name:n,sort:cats.length+1,hidden:false};await S.saveCategory(c);cats.push(c);toast('Category added');vCats();};
  document.querySelectorAll('[data-csave]').forEach(b=>b.onclick=async()=>{const c=cats.find(x=>x.slug===b.dataset.csave);c.name=document.querySelector('[data-cn="'+c.slug+'"]').value.trim()||c.name;c.sort=intOrNull(document.querySelector('[data-cs="'+c.slug+'"]').value)||0;await S.saveCategory(c);toast('Saved');});
  document.querySelectorAll('[data-ch]').forEach(b=>b.onclick=async()=>{const c=cats.find(x=>x.slug===b.dataset.ch);c.hidden=!c.hidden;await S.saveCategory(c);vCats();});
  document.querySelectorAll('[data-cd]').forEach(b=>b.onclick=async()=>{const n=products.filter(p=>p.category===b.dataset.cd).length;if(n){alert('Move or delete the '+n+' product(s) in this category first.');return;}if(!confirm('Delete category?'))return;await S.deleteCategory(b.dataset.cd);cats=cats.filter(c=>c.slug!==b.dataset.cd);vCats();});
}
// ---------- Settings ----------
const FIELDS=[['announcement','Announcement bar (blank = hidden)'],['whatsapp','WhatsApp order number (e.g. 256774188097)'],['hero_tag','Hero tag'],['hero_title','Hero heading'],['hero_text','Hero text',1],['hero_image','Hero banner image link',0,1],
 ['strip_location','Location (top strip)'],['phones','Phone numbers'],['hours','Opening hours'],['why_title','"Why us" heading'],['about','About (footer)',1],['contact','Contact block (footer)',1],['footer','Footer copyright'],
 ['delivery_info','Delivery info (product page)',1],['momo_instructions','Mobile Money payment instructions',1],['cod_instructions','Cash on Delivery instructions',1],['price_note','Text when no price is set']];
function vSettings(){
  const st=Object.assign({},S.DEFAULT_SETTINGS,settings);
  shell('<div class="card">'+FIELDS.map(([k,l,ta,img])=>'<label>'+l+'</label>'+(ta?'<textarea data-k="'+k+'" rows="3">'+esc(st[k])+'</textarea>':'<input data-k="'+k+'" value="'+esc(st[k])+'">')+
   (img?'<label class="btn sec sm" style="display:inline-block;margin-top:6px">Upload banner<input type="file" id="heroFile" accept="image/*" hidden></label>':'')).join('')+
   '<label>"Why us" points</label>'+(st.why||[]).map((w,i)=>'<div class="g2"><input data-wt="'+i+'" value="'+esc(w.t)+'"><input data-wd="'+i+'" value="'+esc(w.d)+'"></div>').join('<div style="height:6px"></div>')+
   '<div class="sticky-actions"><button class="btn" id="sSave" style="flex:1">Save site settings</button></div></div>');
  $('heroFile').onchange=async e=>{try{toast('Uploading…');document.querySelector('[data-k=hero_image]').value=await S.uploadImage(e.target.files[0]);toast('Uploaded — press Save');}catch(err){toast(err.message);}};
  $('sSave').onclick=async()=>{const v=Object.assign({},st);document.querySelectorAll('[data-k]').forEach(i=>v[i.dataset.k]=i.value);v.whatsapp=v.whatsapp.replace(/\D/g,'').replace(/^0/,'256');
    v.why=(st.why||[]).map((w,i)=>({t:document.querySelector('[data-wt="'+i+'"]').value,d:document.querySelector('[data-wd="'+i+'"]').value}));
    try{await S.saveSettings(v);settings=v;toast('Settings saved ✓');}catch(e){toast(e.message);}};
}
$('modal').onclick=e=>{if(e.target.id==='modal')$('modal').classList.remove('open');};
boot();
})();
