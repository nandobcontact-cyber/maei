(()=>{
'use strict';
const S=window.SHOP,P=window.PRODUCTEN,C=window.CATEGORIEEN;
const $=id=>document.getElementById(id);
const eur=n=>new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR'}).format(n);
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const METAAL={goud:{naam:'Goud',a:'#F6E2A8',b:'#C9A25B',c:'#9C7631'},zilver:{naam:'Zilver',a:'#FAFAFA',b:'#B9BDC3',c:'#80858C'}};
const catNaam=id=>(C.find(c=>c.id===id)||{}).naam||'';

/* ---------- illustraties (tot er echte foto's zijn) ---------- */
let gid=0;
function art(p,m){
  if(p&&p.foto)return `<img src="${esc(p.foto)}" alt="${esc(p.naam)}" loading="lazy">`;
  const k=METAAL[m||(p&&p.metaal[0])||'goud'],id='g'+(++gid),cat=p?p.cat:'ringen',v=p?P.filter(x=>x.cat===cat).indexOf(p):0;
  const defs=`<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${k.a}"/><stop offset=".55" stop-color="${k.b}"/><stop offset="1" stop-color="${k.c}"/></linearGradient>
    <radialGradient id="${id}b" cx=".5" cy=".42" r=".7"><stop offset="0" stop-color="#FCEFF2"/><stop offset="1" stop-color="#F2C9D3"/></radialGradient>
    <radialGradient id="${id}p" cx=".35" cy=".35" r=".7"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#EADFD6"/></radialGradient></defs>`;
  const g=`url(#${id})`,bg=`<rect width="400" height="500" fill="url(#${id}b)"/><ellipse cx="200" cy="430" rx="120" ry="14" fill="#5C0A14" opacity=".08"/>`;
  const star=(x,y,r)=>`<path d="M${x} ${y-r} Q${x+r*.12} ${y-r*.12} ${x+r} ${y} Q${x+r*.12} ${y+r*.12} ${x} ${y+r} Q${x-r*.12} ${y+r*.12} ${x-r} ${y} Q${x-r*.12} ${y-r*.12} ${x} ${y-r}Z" fill="${g}"/>`;
  const gem=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${g}" stroke-width="4"/><path d="M${x-r*.5} ${y-r*.2} L${x} ${y-r*.6} L${x+r*.5} ${y-r*.2}" stroke="#E7D7DD" stroke-width="2" fill="none"/>`;
  const pearl=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${id}p)"/><circle cx="${x-r*.35}" cy="${y-r*.35}" r="${r*.22}" fill="#fff" opacity=".9"/>`;
  const kompas=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${g}"/><circle cx="${x}" cy="${y}" r="${r*.78}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>${star(x,y,r*.62).replace(g,'#fff').replace('fill="#fff"','fill="#fff" opacity=".85"')}`;
  let s='';
  if(cat==='ringen'){
    s=`<ellipse cx="200" cy="300" rx="110" ry="40" fill="none" stroke="${g}" stroke-width="16"/><path d="M90 300 Q90 360 200 368 Q310 360 310 300" fill="none" stroke="${g}" stroke-width="16"/>`;
    s+=v===0?`<g transform="translate(0 -6)">${kompas(200,252,30)}</g>`:v===1?gem(200,250,24):star(200,248,34);
  }else if(cat==='kettingen'){
    const ch=`<path d="M70 70 Q90 300 200 330 Q310 300 330 70" fill="none" stroke="${g}" stroke-width="4" stroke-dasharray="7 5" stroke-linecap="round"/>`;
    s=ch+(v===0?kompas(200,368,40):v===1?star(200,362,34):pearl(200,360,28));
    s+=`<line x1="200" y1="330" x2="200" y2="${v===0?328:330}" stroke="${g}" stroke-width="4"/>`;
  }else if(cat==='oorbellen'){
    const one=x=>v===0?star(x,230,38):v===1?`<circle cx="${x}" cy="250" r="54" fill="none" stroke="${g}" stroke-width="14"/>`:`<line x1="${x}" y1="180" x2="${x}" y2="250" stroke="${g}" stroke-width="5"/><circle cx="${x}" cy="180" r="10" fill="${g}"/>${pearl(x,280,32)}`;
    s=one(135)+one(265);
  }else{
    s=v===2?`<ellipse cx="200" cy="270" rx="140" ry="70" fill="none" stroke="${g}" stroke-width="18" stroke-dasharray="760 60"/><circle cx="85" cy="232" r="12" fill="${g}"/><circle cx="318" cy="232" r="12" fill="${g}"/>`
      :`<ellipse cx="200" cy="270" rx="140" ry="70" fill="none" stroke="${g}" stroke-width="7" stroke-dasharray="12 6" stroke-linecap="round"/>`+(v===1?[0,1,2,3,4].map(i=>star(110+i*45,330+Math.sin(i/4*Math.PI)*12,13)).join(''):star(200,340,26));
  }
  return `<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(p?p.naam:'')}">${defs}${bg}${s}</svg>`;
}

/* ---------- winkelmandje ---------- */
let cart=[];
try{cart=JSON.parse(localStorage.getItem('maei-mandje')||'[]').filter(x=>P.some(p=>p.id===x.id))}catch(e){cart=[]}
const save=()=>{try{localStorage.setItem('maei-mandje',JSON.stringify(cart))}catch(e){}};
const prod=id=>P.find(p=>p.id===id);
const count=()=>cart.reduce((a,x)=>a+x.n,0);
const sub=()=>cart.reduce((a,x)=>a+x.n*prod(x.id).prijs,0);
const ship=()=>!cart.length||sub()>=S.gratisVerzendingVanaf?0:S.verzendkosten;
function add(id,m,n){const ex=cart.find(x=>x.id===id&&x.m===m);if(ex)ex.n=Math.min(20,ex.n+n);else cart.push({id,m,n});save();renderCart();
  const c=$('cartCount');c.classList.remove('bump');void c.offsetWidth;c.classList.add('bump');toast(`${prod(id).naam} is toegevoegd aan je winkelmandje`)}
function renderCart(){
  const n=count();$('cartCount').textContent=n;$('cartCount').hidden=!n;
  $('cartBtn').setAttribute('aria-label',`Winkelmandje openen, ${n} ${n===1?'artikel':'artikelen'}`);
  const rest=S.gratisVerzendingVanaf-sub();
  $('shipBar').innerHTML=!cart.length?'':rest>0?`Nog ${eur(rest)} tot gratis verzending<div class="bar"><i style="width:${Math.min(100,sub()/S.gratisVerzendingVanaf*100)}%"></i></div>`:'Je bestelling wordt gratis verzonden ✦<div class="bar"><i style="width:100%"></i></div>';
  $('shipBar').hidden=!cart.length;
  $('cartItems').innerHTML=cart.length?cart.map((x,i)=>{const p=prod(x.id);return `<div class="item"><div class="thumb">${art(p,x.m)}</div><div><b>${esc(p.naam)}</b><small>${METAAL[x.m].naam} · ${eur(p.prijs)}</small>
    <div class="qty"><button type="button" data-dec="${i}" aria-label="Eén minder">−</button><output>${x.n}</output><button type="button" data-inc="${i}" aria-label="Eén meer">+</button></div>
    <button class="rm" type="button" data-rm="${i}">Verwijderen</button></div><div class="p">${eur(p.prijs*x.n)}</div></div>`}).join('')
    :`<div class="empty"><svg><use href="#kompas"/></svg><p>Je winkelmandje is nog leeg.</p><a class="btn ghost" href="#collectie" id="emptyShop">Ontdek de collectie</a></div>`;
  $('cartFoot').hidden=!cart.length;$('cartSub').textContent=eur(sub());
  $('cartItems').querySelectorAll('[data-inc]').forEach(b=>b.onclick=()=>{const x=cart[+b.dataset.inc];x.n=Math.min(20,x.n+1);save();renderCart()});
  $('cartItems').querySelectorAll('[data-dec]').forEach(b=>b.onclick=()=>{const x=cart[+b.dataset.dec];x.n--;if(x.n<1)cart.splice(+b.dataset.dec,1);save();renderCart()});
  $('cartItems').querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{cart.splice(+b.dataset.rm,1);save();renderCart()});
  const e=$('emptyShop');if(e)e.onclick=closeDrawer;
}
let lastFocus=null;
function openDrawer(){lastFocus=document.activeElement;$('drawerBg').hidden=false;$('drawer').classList.add('open');$('drawer').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';setTimeout(()=>$('drawerClose').focus(),50)}
function closeDrawer(){$('drawer').classList.remove('open');$('drawer').setAttribute('aria-hidden','true');$('drawerBg').hidden=true;document.body.style.overflow='';if(lastFocus)lastFocus.focus()}
$('cartBtn').onclick=openDrawer;$('drawerClose').onclick=closeDrawer;$('drawerBg').onclick=closeDrawer;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('drawer').classList.contains('open'))closeDrawer()});

/* ---------- collectie ---------- */
let filt='',sort='';
$('catGrid').innerHTML=C.map(c=>{const p=P.find(x=>x.cat===c.id);return `<button class="cat" type="button" data-cat="${c.id}"><div class="art">${art(p)}</div><span>${esc(c.naam)}</span><small>${P.filter(x=>x.cat===c.id).length} sieraden</small></button>`}).join('');
$('chips').innerHTML=[{id:'',naam:'Alles'}].concat(C).map(c=>`<button class="chip" type="button" data-f="${c.id}" aria-pressed="${c.id===''}">${esc(c.naam)}</button>`).join('');
function setFilter(f,scroll){filt=f;$('chips').querySelectorAll('.chip').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.f===f)));
  document.querySelectorAll('.nav a[data-cat]').forEach(a=>a.setAttribute('aria-current',String(a.dataset.cat===f&&f!=='')));
  $('colTitel').textContent=f?catNaam(f):'Alle sieraden';renderGrid();if(scroll)$('collectie').scrollIntoView({behavior:'smooth'})}
function renderGrid(){
  let l=P.filter(p=>!filt||p.cat===filt);
  if(sort==='laag')l=l.slice().sort((a,b)=>a.prijs-b.prijs);else if(sort==='hoog')l=l.slice().sort((a,b)=>b.prijs-a.prijs);else if(sort==='nieuw')l=l.slice().sort((a,b)=>(b.nieuw?1:0)-(a.nieuw?1:0));
  $('grid').innerHTML=l.map(p=>`<article class="card"><div class="card-img" role="button" tabindex="0" data-open="${p.id}" aria-label="${esc(p.naam)} bekijken">${art(p)}${p.nieuw?'<span class="badge">Nieuw</span>':''}<button class="quick" type="button" data-quick="${p.id}">In winkelmandje</button></div>
    <h3><button type="button" data-open="${p.id}">${esc(p.naam)}</button></h3><div class="meta"><span class="prijs">${eur(p.prijs)}</span><span class="dots" aria-label="Verkrijgbaar in ${p.metaal.map(m=>METAAL[m].naam.toLowerCase()).join(' en ')}">${p.metaal.map(m=>`<i class="${m}"></i>`).join('')}</span></div></article>`).join('');
  $('grid').querySelectorAll('[data-open]').forEach(el=>{el.onclick=e=>{if(e.target.closest('[data-quick]'))return;openProduct(el.dataset.open)};el.onkeydown=e=>{if((e.key==='Enter'||e.key===' ')&&e.target===el){e.preventDefault();openProduct(el.dataset.open)}}});
  $('grid').querySelectorAll('[data-quick]').forEach(b=>b.onclick=e=>{e.stopPropagation();const p=prod(b.dataset.quick);add(p.id,p.metaal[0],1)});
}
$('chips').onclick=e=>{const b=e.target.closest('.chip');if(b)setFilter(b.dataset.f)};
$('sort').onchange=e=>{sort=e.target.value;renderGrid()};
$('catGrid').onclick=e=>{const b=e.target.closest('.cat');if(b)setFilter(b.dataset.cat,true)};
document.querySelectorAll('a[data-cat]').forEach(a=>a.addEventListener('click',()=>{setFilter(a.dataset.cat);closeMenu()}));

/* ---------- product ---------- */
let cur=null,curM='goud',curN=1;
function openProduct(id){
  cur=prod(id);curM=cur.metaal[0];curN=1;
  $('pdNaam').textContent=cur.naam;$('pdCat').textContent=catNaam(cur.cat);$('pdPrijs').textContent=eur(cur.prijs);$('pdTekst').textContent=cur.tekst;$('pdAantal').textContent='1';
  $('pdMetaal').innerHTML=cur.metaal.map((m,i)=>`<label><input type="radio" name="metaal" value="${m}"${i?'':' checked'}><i style="background:linear-gradient(135deg,${METAAL[m].a},${METAAL[m].b})"></i>${METAAL[m].naam}</label>`).join('');
  $('pdMetaal').querySelectorAll('input').forEach(r=>r.onchange=()=>{curM=r.value;$('pdImg').innerHTML=art(cur,curM)});
  $('pdImg').innerHTML=art(cur,curM);$('productDlg').showModal();
  try{history.replaceState(null,'','#'+cur.id)}catch(e){}
}
$('pdMin').onclick=()=>{curN=Math.max(1,curN-1);$('pdAantal').textContent=curN};
$('pdPlus').onclick=()=>{curN=Math.min(20,curN+1);$('pdAantal').textContent=curN};
$('pdAdd').onclick=()=>{add(cur.id,curM,curN);$('productDlg').close();openDrawer()};
$('productDlg').addEventListener('close',()=>{try{history.replaceState(null,'',location.pathname)}catch(e){}});

/* ---------- dialogen ---------- */
document.querySelectorAll('dialog').forEach(d=>{d.addEventListener('click',e=>{if(e.target===d||e.target.closest('[data-close]'))d.close()})});

/* ---------- afrekenen ---------- */
const MODE=S.betalenActief?'pay':S.email?'mail':'off';
$('toCheckout').onclick=()=>{closeDrawer();openCheckout()};
function openCheckout(){
  $('coForm').hidden=false;$('coDone').hidden=true;$('coErr').textContent='';
  $('coItems').innerHTML=cart.map(x=>{const p=prod(x.id);return `<div class="item"><div class="thumb">${art(p,x.m)}</div><div><b>${esc(p.naam)}</b><small>${METAAL[x.m].naam} · ${x.n}×</small></div><div class="p">${eur(p.prijs*x.n)}</div></div>`}).join('');
  $('coSub').textContent=eur(sub());$('coShip').textContent=ship()?eur(ship()):'Gratis';$('coTotal').textContent=eur(sub()+ship());
  $('coSubmit').textContent=MODE==='pay'?'Doorgaan naar betalen':MODE==='mail'?'Bestelling plaatsen':'Bestellen opent binnenkort';
  $('coSubmit').disabled=MODE==='off';
  $('coNote').textContent=MODE==='pay'?'Je betaalt veilig met iDEAL, creditcard of Bancontact.':MODE==='mail'?'Je ontvangt van ons een bevestiging met een betaallink. Pas na betaling versturen we je sieraden.':'Online bestellen is binnenkort mogelijk. Houd ons in de gaten!';
  $('checkoutDlg').showModal();
}
$('coFormEl').onsubmit=e=>{
  e.preventDefault();const f=e.target,d=Object.fromEntries(new FormData(f));let bad=null;
  f.querySelectorAll('[required]').forEach(i=>{const ok=i.type==='email'?/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value.trim()):!!i.value.trim();i.setAttribute('aria-invalid',String(!ok));if(!ok&&!bad)bad=i});
  if(bad){$('coErr').textContent='Vul de gemarkeerde velden in.';bad.focus();return}
  if(!cart.length){$('coErr').textContent='Je winkelmandje is leeg.';return}
  $('coErr').textContent='';
  const nr='M'+Date.now().toString(36).toUpperCase().slice(-6);
  const regels=cart.map(x=>{const p=prod(x.id);return `${x.n}× ${p.naam} (${METAAL[x.m].naam}) – ${eur(p.prijs*x.n)}`}).join('\n');
  const body=`Bestelling ${nr}\n\n${regels}\n\nSubtotaal: ${eur(sub())}\nVerzending: ${ship()?eur(ship()):'Gratis'}\nTotaal: ${eur(sub()+ship())}\n\nNaam: ${d.voornaam} ${d.achternaam}\nE-mail: ${d.email}\nTelefoon: ${d.telefoon||'-'}\nAdres: ${d.adres}, ${d.postcode} ${d.plaats}, ${d.land}\nCadeau: ${d.cadeau?'ja':'nee'}\nOpmerking: ${d.opmerking||'-'}`;
  if(MODE==='mail'){location.href=`mailto:${S.email}?subject=${encodeURIComponent('Bestelling '+nr+' – MAÉI')}&body=${encodeURIComponent(body)}`}
  $('coDoneTekst').textContent=MODE==='mail'?`Je e-mailprogramma opent met je bestelling ${nr}. Verstuur die mail, dan ontvang je van ons zo snel mogelijk een bevestiging en een betaallink.`:`Je bestelling ${nr} is ontvangen.`;
  cart=[];save();renderCart();f.reset();$('coForm').hidden=true;$('coDone').hidden=false;
};

/* ---------- info ---------- */
const INFO={
  verzending:['Verzending & retour',`<p>We versturen binnen Nederland en België. Verzendkosten zijn ${eur(S.verzendkosten)}; vanaf ${eur(S.gratisVerzendingVanaf)} is verzending gratis.</p><p>We versturen je bestelling zo snel mogelijk, meestal binnen 1–2 werkdagen.</p><p>Je hebt ${S.retourDagen} dagen bedenktijd. Stuur het sieraad ongedragen en in de originele verpakking terug, dan krijg je het aankoopbedrag terug. Oorbellen kunnen om hygiënische redenen alleen ongeopend retour.</p>`],
  verzorging:['Verzorging',`<ul><li>Doe je sieraden af bij het sporten, zwemmen en douchen.</li><li>Vermijd contact met parfum, crème en schoonmaakmiddelen.</li><li>Bewaar elk sieraad apart in het MAÉI fluwelen zakje.</li><li>Poets zacht met een droog, zacht doekje.</li></ul>`],
  voorwaarden:['Algemene voorwaarden','<p>De algemene voorwaarden van MAÉI worden binnenkort hier gepubliceerd.</p>'],
  privacy:['Privacy','<p>We gebruiken je gegevens alleen om je bestelling te verwerken en te versturen. We verkopen je gegevens nooit aan anderen. Je winkelmandje wordt alleen in je eigen browser bewaard.</p>'],
};
document.querySelectorAll('[data-info]').forEach(b=>b.onclick=()=>{const [t,h]=INFO[b.dataset.info];$('infoTitel').textContent=t;$('infoTekst').innerHTML=h;$('infoDlg').showModal()});

/* ---------- menu, contact, overig ---------- */
function closeMenu(){$('nav').classList.remove('open');$('menuBtn').setAttribute('aria-expanded','false')}
$('menuBtn').onclick=()=>{const o=$('nav').classList.toggle('open');$('menuBtn').setAttribute('aria-expanded',String(o))};
document.addEventListener('click',e=>{if($('nav').classList.contains('open')&&!e.target.closest('#nav,#menuBtn'))closeMenu()});
$('topbarTekst').textContent=`Gratis verzending vanaf ${eur(S.gratisVerzendingVanaf).replace(',00','')}`;
$('uspVerzending').textContent=`Vanaf ${eur(S.gratisVerzendingVanaf).replace(',00','')} in Nederland en België.`;
if(S.email){const a=$('contactMail');a.href='mailto:'+S.email;a.textContent=S.email;a.hidden=false}
if(S.instagram){const a=$('contactInsta');a.href=S.instagram;a.hidden=false}
$('jaar').textContent=new Date().getFullYear();
let tt;function toast(t){const el=$('toast');el.textContent=t;el.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>el.classList.remove('show'),2600)}

renderGrid();renderCart();
const h=location.hash.slice(1);if(prod(h))openProduct(h);else if(C.some(c=>c.id===h))setFilter(h,true);
})();
