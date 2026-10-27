'use strict';
// Shared script for all pages; every block checks that its elements exist on the current page.
const BOOKING_EMAIL = 'aemsez08@gmail.com';
const $=(selector,scope=document)=>scope.querySelector(selector);
const $$=(selector,scope=document)=>Array.from(scope.querySelectorAll(selector));

// Scroll reveal. Sections after the first screen get their text, cards and images marked automatically
// (the start page sets its own classes via [data-reveal]); each marked element gets .is-in once it is in view.
document.documentElement.classList.add('js');
const revealParts='.kicker,.title,.lead,.story-text>p,.block-actions,.gig,.clip,.player,.photo,.occasions li,.form-card,.story-photo,.dates-empty,.social,.motto-mark,.motto-text>*,.cta-card>*,.block-grid>div>*';
$$('main>section:not(.opener):not(.home):not([data-reveal])').forEach(sec=>{let i=0;
$$(revealParts,sec).forEach(part=>{if(part.parentElement.closest('.reveal,.reveal-img'))return;
part.classList.add(part.matches('.story-photo,.photo')?'reveal-img':'reveal');part.style.setProperty('--i',Math.min(i++,4))})});
// .reveal-rise starts fully clipped, which never counts as visible; its unclipped parent is watched instead.
const watched=new Map();
const ro='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){(watched.get(en.target)||[]).forEach(part=>part.classList.add('is-in'));watched.delete(en.target);ro.unobserve(en.target)}}),{threshold:.15}):null;
const reveal=part=>{if(!ro){part.classList.add('is-in');return}const target=part.matches('.reveal-rise')?part.parentElement:part;
if(!watched.has(target)){watched.set(target,[]);ro.observe(target)}watched.get(target).push(part)};
$$('.reveal,.reveal-rise,.reveal-img').forEach(reveal);

// Fixed menu: dark with light text while the section under its middle line is dark (photo, [data-dark], footer).
// Checked on every scroll frame, so fast jumps, snapping and mobile toolbar resizes cannot leave a stale colour.
const fixedBar=$('.bar--fixed'),darkSecs=$$('.stage-photo,[data-dark],.footer');
if(fixedBar){
let queued=false;
const update=()=>{queued=false;const y=fixedBar.offsetHeight/2;fixedBar.classList.toggle('on-photo',darkSecs.some(sec=>{const r=sec.getBoundingClientRect();return r.top<=y&&r.bottom>y}))};
const queue=()=>{if(!queued){queued=true;requestAnimationFrame(update)}};
addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);addEventListener('load',queue);update();
}

// Debug panel: ?debug=1 opens it on every page for this browser tab, ?debug=0 closes it.
// It toggles the section snapping (html.snap / html.snap-soft), the drifting background (html.bg-still) and the text/scroll animations (html.no-anim); choices are kept for the tab.
const store={get:k=>{try{return sessionStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{v===null?sessionStorage.removeItem(k):sessionStorage.setItem(k,v)}catch(e){}}};
const debugParam=new URLSearchParams(location.search).get('debug');
if(debugParam==='1')store.set('hh-debug','1');else if(debugParam==='0'){store.set('hh-debug',null);store.set('hh-snap',null);store.set('hh-flow',null);store.set('hh-anim',null)}
if(store.get('hh-debug')==='1'){
const root=document.documentElement,snapClass=['snap','snap-soft'].find(c=>root.classList.contains(c));
const setSnap=on=>{if(snapClass)root.classList.toggle(snapClass,on);store.set('hh-snap',on?null:'off')};
const panel=document.createElement('aside');panel.className='debug';panel.setAttribute('aria-label','Debug');
panel.innerHTML='<strong>Debug</strong><label><input type="checkbox" name="snap"> Auto-Scroll</label><span class="debug-note"></span><label><input type="checkbox" name="flow"> Hintergrund fließt</label><label><input type="checkbox" name="anim"> Animationen</label><a href="?debug=0">Schließen</a>';
const box=$('[name=snap]',panel),note=$('.debug-note',panel),flow=$('[name=flow]',panel);
const setFlow=on=>{root.classList.toggle('bg-still',!on);store.set('hh-flow',on?null:'off')};
flow.checked=store.get('hh-flow')!=='off';setFlow(flow.checked);
flow.addEventListener('change',()=>setFlow(flow.checked));
const anim=$('[name=anim]',panel),setAnim=on=>{root.classList.toggle('no-anim',!on);store.set('hh-anim',on?null:'off')};
anim.checked=store.get('hh-anim')!=='off';setAnim(anim.checked);
anim.addEventListener('change',()=>setAnim(anim.checked));
box.checked=store.get('hh-snap')!=='off';box.disabled=!snapClass;
note.textContent=snapClass?(snapClass==='snap'?'Einrasten: stark':'Einrasten: sanft'):'Kein Einrasten auf dieser Seite';
box.addEventListener('change',()=>setSnap(box.checked));
if(snapClass&&!box.checked)root.classList.remove(snapClass);
document.body.append(panel);
window.habibiDebug={setSnap:on=>{box.checked=!!on;setSnap(!!on)},setFlow:on=>{flow.checked=!!on;setFlow(!!on)},setAnim:on=>{anim.checked=!!on;setAnim(!!on)}};
}

// Muted background loops (start page music block, Musik opener): play while visible;
// a [data-sound-for="<video id>"] button unmutes. Reduced motion or Save-Data keeps the poster until sound is asked for.
const still=matchMedia('(prefers-reduced-motion:reduce)').matches||(navigator.connection&&navigator.connection.saveData);
$$('video[data-loop]').forEach(v=>{
const btn=$(`[data-sound-for="${v.id}"]`);let visible=false;
const run=()=>{if(visible&&(!still||!v.muted))v.play().catch(()=>{});else v.pause()};
if('IntersectionObserver' in window)new IntersectionObserver(([en])=>{visible=en.isIntersecting;run()},{threshold:.25}).observe(v);
if(!btn)return;
const label=()=>{btn.setAttribute('aria-pressed',String(!v.muted));btn.textContent=v.muted?'Ton an':'Ton aus'};
btn.addEventListener('click',()=>{v.muted=!v.muted;label();if(!v.muted){visible=true;v.play().catch(()=>{})}else run()});
v.addEventListener('pause',()=>{if(!v.muted&&!visible){v.muted=true;label()}});
});

// Cinema overlay for the videos on the music page.
const cinema=$('#video-dialog');
if(cinema){
const cv=$('#cinema-video');
const close=()=>{cv.pause();cv.removeAttribute('src');cv.load();if(cinema.open)cinema.close();document.body.classList.remove('dialog-open')};
$$('[data-video]').forEach(btn=>btn.addEventListener('click',()=>{cv.src=btn.dataset.video;$('#cinema-caption').textContent=btn.dataset.caption||'';cinema.showModal();document.body.classList.add('dialog-open');cv.play().catch(()=>{})}));
$('#close-video').addEventListener('click',close);cinema.addEventListener('cancel',e=>{e.preventDefault();close()});cinema.addEventListener('click',e=>{if(e.target===cinema)close()});
}

// Subpage tabs scroll sideways on phones: keep the current page in view.
const currentTab=$('.pages [aria-current=page]');
if(currentTab)currentTab.scrollIntoView({inline:'center',block:'nearest'});

// Only one medium plays at a time.
const media=$$('audio,video');
media.forEach(m=>m.addEventListener('play',()=>{if(m.muted)return;media.forEach(o=>{if(o!==m&&!o.muted)o.pause()})})); // muted loops keep running

// Audio player with waveform (Musik).
const audio=$('#song-audio');
if(audio){
const audioBtn=$('#audio-play'),wave=$('#waveform'),bars=$('#wave-bars'),now=$('#audio-now'),end=$('#audio-end');
const playIcon='<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M6 4l11 6-11 6z"/></svg>',pauseIcon='<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5 4h3.5v12H5zM11.5 4H15v12h-3.5z"/></svg>';
const waves=[86,90,82,85,96,86,88,80,86,79,76,84,67,72,66,68,71,60,81,71,77,74,82,73,64,80,66,66,68,62,68,85,81,68,55,76,87,83,65,71,82,87,71,51,71,90,79,70,59,58,55,79,80,74,62,63,56,51,91,78,71,69,61,65,60,69,65,69,71,79];
waves.forEach(h=>{const bar=document.createElement('span');bar.style.height=h+'%';bars.append(bar)});
const fmt=t=>{const n=Math.floor(Number.isFinite(t)?Math.max(t,0):0);return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`};
function syncAudio(){let progress=audio.currentTime/(audio.duration||1);if(!Number.isFinite(progress))progress=0;now.textContent=fmt(audio.currentTime);if(Number.isFinite(audio.duration))end.textContent=fmt(audio.duration);audioBtn.innerHTML=audio.paused?playIcon:pauseIcon;audioBtn.setAttribute('aria-label',audio.paused?'Audiomitschnitt abspielen':'Audiomitschnitt pausieren');wave.classList.toggle('is-playing',!audio.paused);wave.setAttribute('aria-valuenow',String(Math.round(progress*100)));[...bars.children].forEach((node,i)=>node.classList.toggle('played',i/waves.length<=progress))}
audioBtn.addEventListener('click',async()=>{if(audio.paused){try{await audio.play()}catch(e){console.warn('Audio nicht verfügbar',e)}}else audio.pause();syncAudio()});
['timeupdate','play','pause','loadedmetadata','ended'].forEach(event=>audio.addEventListener(event,syncAudio));
function seek(pct){if(Number.isFinite(audio.duration)){audio.currentTime=audio.duration*Math.max(0,Math.min(1,pct));syncAudio()}}
wave.addEventListener('click',ev=>seek((ev.clientX-wave.getBoundingClientRect().left)/wave.clientWidth));
wave.addEventListener('keydown',ev=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(ev.key)){ev.preventDefault();let p=audio.currentTime/(audio.duration||1);if(ev.key==='ArrowLeft')p-=.05;if(ev.key==='ArrowRight')p+=.05;if(ev.key==='Home')p=0;if(ev.key==='End')p=1;seek(p)}});
syncAudio();
}

// Photo lightbox (Fotos). Photos from the CMS (fotos.json; termine-style demo file on localhost / ?demo) are put in
// front of the fixed ones, newest first; their date and description show under the large photo.
const photoDialog=$('#photo-dialog');
if(photoDialog){
const large=$('#large-photo'),caption=$('#large-photo-caption'),details=$('#large-photo-text'),gallery=$('.gallery');
const openPhoto=btn=>{const img=$('img',btn);large.src=btn.dataset.photo;large.alt=img?img.alt:'';caption.textContent=btn.dataset.caption;details.textContent=[btn.dataset.date,btn.dataset.text].filter(Boolean).join(' · ');details.hidden=!details.textContent;photoDialog.showModal();document.body.classList.add('dialog-open')};
gallery.addEventListener('click',e=>{const btn=e.target.closest('[data-photo]');if(btn)openPhoto(btn)});
function closePhoto(){if(photoDialog.open)photoDialog.close();document.body.classList.remove('dialog-open')}
$('#close-photo').addEventListener('click',closePhoto);photoDialog.addEventListener('cancel',e=>{e.preventDefault();closePhoto()});photoDialog.addEventListener('click',e=>{if(e.target===photoDialog)closePhoto()});
(async()=>{try{
const q=new URLSearchParams(location.search),local=/^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$|\.localhost$/.test(location.hostname);
const demo=q.has('demo')?q.get('demo')!=='0':local;
const res=await fetch(demo?'assets/fotos.demo.json':'assets/fotos.json',{cache:'no-cache'});if(!res.ok)return;
const photos=(await res.json()).filter(p=>p&&typeof p.image==='string'&&/^\/assets\/images\//.test(p.image)&&!p.image.includes('..')&&p.title).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
gallery.prepend(...photos.map(p=>{const when=/^\d{4}-\d{2}-\d{2}$/.test(p.date||'')?new Date(`${p.date}T00:00`).toLocaleDateString('de-DE',{day:'numeric',month:'long',year:'numeric'}):'';
const btn=document.createElement('button');btn.type='button';btn.className='photo';btn.dataset.photo=p.image;btn.dataset.caption=p.title;btn.dataset.date=when;btn.dataset.text=p.text||'';btn.setAttribute('aria-label',`Foto vergrößern: ${p.title}`);
const frame=document.createElement('span');frame.className='frame';const img=document.createElement('img');img.src=p.image;img.alt=p.text||p.title;img.loading='lazy';img.decoding='async';frame.append(img);
const label=document.createElement('span');label.className='label';label.textContent=p.title;btn.append(frame,label);return btn}));
}catch(e){}})();
}

// Booking form posts JSON to /api/anfrage (mailer service, see mailer/); if that fails it offers the address and the copy button.
const form=$('#booking-form');
if(form){
const status=$('#form-status');
function bookingText(){const d=new FormData(form);return `Hallo Habibi Hermanos,\n\nich möchte euch für eine Veranstaltung anfragen.\n\nName: ${d.get('name')||'-'}\nE-Mail: ${d.get('email')||'-'}\nOrt / Veranstaltung: ${d.get('event')||'-'}\nWunschtermin: ${d.get('date')||'noch offen'}\n\n${d.get('message')||''}\n\nViele Grüße\n${d.get('name')||''}`}
function markInvalid(){$$('input,textarea',form).forEach(f=>f.setAttribute('aria-invalid',String(!f.checkValidity())))}
$$('input,textarea',form).forEach(f=>f.addEventListener('input',()=>{if(f.hasAttribute('aria-invalid'))f.setAttribute('aria-invalid',String(!f.checkValidity()))}));
const labels={name:'Name',email:'E-Mail',event:'Ort / Veranstaltung',date:'Wunschtermin',message:'Nachricht'};
const say=(cls,...parts)=>{status.replaceChildren(...parts);status.className='form-status'+(cls?' '+cls:'')};
form.addEventListener('submit',async e=>{e.preventDefault();markInvalid();if(!form.checkValidity()){say('error','Bitte fülle die markierten Felder aus (E-Mail im Format name@beispiel.de).');const first=$(':invalid',form);if(first)first.focus();return}
const button=$('button[type=submit]',form),d=new FormData(form);
const data=Object.fromEntries(['name','email','event','date','message','website'].map(k=>[k,String(d.get(k)??'')]));
button.disabled=true;say('','Wird gesendet …');
let res=null;try{res=await fetch('/api/anfrage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout?AbortSignal.timeout(25000):undefined})}catch(err){}
button.disabled=false;
if(res&&res.ok){form.reset();$$('[aria-invalid]',form).forEach(f=>f.removeAttribute('aria-invalid'));return say('success','Danke! Deine Anfrage ist angekommen. Wir melden uns per E-Mail.')}
if(res&&res.status===400){const field=(await res.json().catch(()=>({}))).field,f=labels[field]&&form.elements[field];if(f){f.setAttribute('aria-invalid','true');f.focus()}return say('error',`Bitte prüfe deine Angaben${labels[field]?` (${labels[field]})`:''}.`)}
if(res&&res.status===429)return say('error','Zu viele Anfragen in kurzer Zeit. Bitte versuch es in ein paar Minuten noch einmal.');
// Mailer unreachable or failing: offer the address directly (as a link with the request filled in) and the copy button.
const link=document.createElement('a');link.href=`mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent('Booking-Anfrage | Habibi Hermanos')}&body=${encodeURIComponent(bookingText())}`;link.textContent=BOOKING_EMAIL;
say('error','Gerade klappt der Versand nicht. Schreib uns direkt an ',link,' oder kopiere deine Anfrage mit „Als Text kopieren“.')});
$('#copy-booking').addEventListener('click',async()=>{const text=bookingText();try{await navigator.clipboard.writeText(text);status.textContent='Anfrage kopiert – jetzt in eine E-Mail oder Nachricht einfügen.';status.className='form-status success'}catch(e){const ta=document.createElement('textarea');ta.value=text;document.body.append(ta);ta.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}ta.remove();status.textContent=ok?'Anfrage kopiert.':'Automatisches Kopieren nicht möglich – bitte Nachricht manuell markieren.';status.className='form-status '+(ok?'success':'error')}});
}

// Gigs come from assets/termine.json; past dates are hidden automatically.
// #gigs lists upcoming gigs (data-limit caps the count); #next-gig in the Live opener teases the next one.
// Made-up example gigs (termine.demo.json) show on localhost and with ?demo, for layout reviews only; ?demo=0 turns them off.
const box=$('#gigs'),nextGig=$('#next-gig');
if(box||nextGig)(async()=>{
const layout=$('#dates-layout');
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n};
const day=g=>g.when.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'}).replace(/\.$/,'');
// Ticket links come from the CMS: only full https addresses become a button, anything else is ignored.
const tickets=g=>{let url;try{url=new URL(g.tickets)}catch{return null}if(url.protocol!=='https:')return null;
const a=el('a','btn btn--ticket','Tickets buchen');a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';
a.setAttribute('aria-label',`Tickets buchen: ${g.venue||'Auftritt'}, ${day(g)} (externe Seite)`);
a.insertAdjacentHTML('beforeend','<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 11l6-6M6 5h5v5"/></svg>');return a};
const meta=g=>{const m=el('span','gig-meta');[g.when.toLocaleDateString('de-DE',{weekday:'long'}),g.time,g.venue].filter(Boolean).forEach((t,j)=>{if(j)m.append(document.createElement('br'));m.append(t)});return m};
try{
const q=new URLSearchParams(location.search),local=/^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$|\.localhost$/.test(location.hostname);
const demo=q.has('demo')?q.get('demo')!=='0':local;
const res=await fetch(demo?'assets/termine.demo.json':'assets/termine.json',{cache:'no-cache'});if(!res.ok)throw new Error(res.status);
const today=new Date();today.setHours(0,0,0,0);
const gigs=(await res.json()).map(g=>({...g,when:new Date(`${g.date}T00:00`)})).filter(g=>g.when>=today).sort((a,b)=>a.when-b.when);
if(box){
const shown=box.dataset.limit?gigs.slice(0,+box.dataset.limit):gigs;
box.replaceChildren(...(demo?[el('p','label','Demo · Beispieltermine, nicht echt')]:[]),...shown.map((g,i)=>{const body=el('div','gig-body');body.append(el('p','label',g.label||'Live'),el('p','',g.text||''));const t=g.tickets&&tickets(g);if(t)body.append(t);
const card=el('article','gig reveal');card.style.setProperty('--i',Math.min(i+2,5));card.append(el('span','gig-day',day(g)),meta(g),body);reveal(card);return card}));
layout.classList.toggle('is-empty',!gigs.length);
}
if(nextGig&&gigs.length){const g=gigs[0],info=meta(g);info.className='ticket-info';nextGig.replaceChildren(el('span','ticket-date',day(g)),info,$('.ticket-more',nextGig));nextGig.setAttribute('aria-label',`Nächster Auftritt: ${day(g)}, ${g.venue||''}. Alle Termine`);nextGig.classList.add('is-set')}
}catch(e){if(layout)layout.classList.add('is-empty')}
})();
