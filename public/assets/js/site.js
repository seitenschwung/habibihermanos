'use strict';
// Shared script for all pages; every block checks that its elements exist on the current page.
const BOOKING_EMAIL = 'info@seitenschwung.com';
const $=(selector,scope=document)=>scope.querySelector(selector);
const $$=(selector,scope=document)=>Array.from(scope.querySelectorAll(selector));
document.documentElement.classList.add('js');

// Hero slider on the start page: arrows, dots, arrow keys and swipe.
const hero=$('#hero');
if(hero){
const slides=$$('.slide',hero),dots=$$('.hero-dots button',hero);let current=0;
function show(i,dir){
const next=(i+slides.length)%slides.length;if(next===current)return;
slides.forEach((s,n)=>{s.style.setProperty('--from',(n===current?-dir:dir)*48+'px');const on=n===next;s.classList.toggle('is-active',on);s.inert=!on});
dots.forEach((d,n)=>d.setAttribute('aria-current',String(n===next)));current=next}
slides.forEach((s,n)=>{s.inert=n!==0});
$('.hero-prev',hero).addEventListener('click',()=>show(current-1,-1));
$('.hero-next',hero).addEventListener('click',()=>show(current+1,1));
dots.forEach((d,n)=>d.addEventListener('click',()=>show(n,n>current?1:-1)));
document.addEventListener('keydown',e=>{if(e.target.closest('input,textarea'))return;if(e.key==='ArrowLeft')show(current-1,-1);if(e.key==='ArrowRight')show(current+1,1)});
let startX=null;
hero.addEventListener('touchstart',e=>{startX=e.touches[0].clientX},{passive:true});
hero.addEventListener('touchend',e=>{if(startX===null)return;const dx=e.changedTouches[0].clientX-startX;startX=null;if(Math.abs(dx)>50)dx<0?show(current+1,1):show(current-1,-1)});
}
// Only one medium plays at a time.
const media=$$('audio,video');
media.forEach(m=>m.addEventListener('play',()=>media.forEach(o=>{if(o!==m)o.pause()})));

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

// Photo lightbox (Fotos).
const photoDialog=$('#photo-dialog');
if(photoDialog){
const large=$('#large-photo'),caption=$('#large-photo-caption');
$$('[data-photo]').forEach(btn=>btn.addEventListener('click',()=>{const img=$('img',btn);large.src=btn.dataset.photo;large.alt=img?img.alt:'';caption.textContent=btn.dataset.caption;photoDialog.showModal();document.body.classList.add('dialog-open')}));
function closePhoto(){if(photoDialog.open)photoDialog.close();document.body.classList.remove('dialog-open')}
$('#close-photo').addEventListener('click',closePhoto);photoDialog.addEventListener('cancel',e=>{e.preventDefault();closePhoto()});photoDialog.addEventListener('click',e=>{if(e.target===photoDialog)closePhoto()});
}

// Booking uses the email client; it never transmits to a server or pretends to have done so.
const form=$('#booking-form');
if(form){
const status=$('#form-status');
function bookingText(){const d=new FormData(form);return `Hallo Habibi Hermanos,\n\nich möchte euch für eine Veranstaltung anfragen.\n\nName: ${d.get('name')||'-'}\nE-Mail: ${d.get('email')||'-'}\nOrt / Veranstaltung: ${d.get('event')||'-'}\nWunschtermin: ${d.get('date')||'noch offen'}\n\n${d.get('message')||''}\n\nViele Grüße\n${d.get('name')||''}`}
function markInvalid(){$$('input,textarea',form).forEach(f=>f.setAttribute('aria-invalid',String(!f.checkValidity())))}
$$('input,textarea',form).forEach(f=>f.addEventListener('input',()=>{if(f.hasAttribute('aria-invalid'))f.setAttribute('aria-invalid',String(!f.checkValidity()))}));
form.addEventListener('submit',e=>{e.preventDefault();markInvalid();if(!form.checkValidity()){status.textContent='Bitte fülle die markierten Felder aus (E-Mail im Format name@beispiel.de).';status.className='form-status error';const first=$(':invalid',form);if(first)first.focus();return}if(!BOOKING_EMAIL){status.textContent='Die Booking-E-Mail-Adresse fehlt noch. Bitte zunächst die Anfrage kopieren.';status.className='form-status error';return}status.textContent='Dein E-Mail-Programm öffnet sich. Bitte bestätige dort noch den Versand.';status.className='form-status success';window.location.href=`mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent('Booking-Anfrage | Habibi Hermanos')}&body=${encodeURIComponent(bookingText())}`});
$('#copy-booking').addEventListener('click',async()=>{const text=bookingText();try{await navigator.clipboard.writeText(text);status.textContent='Anfrage kopiert – jetzt in eine E-Mail oder Nachricht einfügen.';status.className='form-status success'}catch(e){const ta=document.createElement('textarea');ta.value=text;document.body.append(ta);ta.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}ta.remove();status.textContent=ok?'Anfrage kopiert.':'Automatisches Kopieren nicht möglich – bitte Nachricht manuell markieren.';status.className='form-status '+(ok?'success':'error')}});
}

// Gig cards come from assets/termine.json; past dates are hidden automatically (Live).
const box=$('#gigs');
if(box)(async()=>{
const layout=$('#dates-layout');
try{
const res=await fetch('assets/termine.json',{cache:'no-cache'});if(!res.ok)throw new Error(res.status);
const today=new Date();today.setHours(0,0,0,0);
const gigs=(await res.json()).map(g=>({...g,when:new Date(`${g.date}T00:00`)})).filter(g=>g.when>=today).sort((a,b)=>a.when-b.when);
box.replaceChildren(...gigs.map(g=>{
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n};
const meta=el('span','gig-meta');
[g.when.toLocaleDateString('de-DE',{weekday:'long'}),g.time,g.venue].filter(Boolean).forEach((t,j)=>{if(j)meta.append(document.createElement('br'));meta.append(t)});
const date=el('div','gig-date');date.append(el('span','gig-day',g.when.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'}).replace(/\.$/,'')),meta);
const body=el('div','gig-body');body.append(el('p','label',g.label||'Live'),el('p','',g.text||''));
const card=el('article','gig panel');card.append(date,body);return card}));
layout.classList.toggle('is-empty',!gigs.length);
}catch(e){layout.classList.add('is-empty')}
})();
