'use strict';
// Shared script for all pages; every block checks that its elements exist on the current page.
const BOOKING_EMAIL = 'info@seitenschwung.com';
const $=(selector,scope=document)=>scope.querySelector(selector);
const $$=(selector,scope=document)=>Array.from(scope.querySelectorAll(selector));

// Start page: a small scroll (wheel, swipe, keys) glides on to the next section.
if(document.documentElement.classList.contains('snap')){
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
let busy=false,lastInput=0,acc=0,fired=false,touchY=null;
// Stop at each section's top, and at its bottom too when it is taller than the screen (phones).
const stops=()=>{const max=document.documentElement.scrollHeight-innerHeight,out=[];
$$('.home,.stage-photo').forEach(sec=>{out.push(sec.offsetTop);if(sec.offsetHeight>innerHeight+10)out.push(sec.offsetTop+sec.offsetHeight-innerHeight)});
out.push(max);return [...new Set(out.map(t=>Math.min(Math.round(t),max)))].sort((a,b)=>a-b)};
// html has scroll-behavior:smooth, which would turn each animation step into its own smooth scroll;
// switch it off on this page (behavior:'instant' is not understood by every browser).
document.documentElement.style.scrollBehavior='auto';
const jump=y=>scrollTo(0,y);
function nearest(){const s=stops();let best=0;s.forEach((t,i)=>{if(Math.abs(scrollY-t)<Math.abs(scrollY-s[best]))best=i});return best}
function glide(dir){
const s=stops(),target=s[Math.max(0,Math.min(s.length-1,nearest()+dir))];
if(Math.abs(target-scrollY)<2)return;
if(reduce){jump(target);return}
busy=true;const from=scrollY,dist=target-from,dur=650,t0=performance.now();
const ease=t=>1-Math.pow(1-t,4);
let done=false;const finish=()=>{if(!done){done=true;jump(target);busy=false}};
(function step(now){if(done)return;const t=Math.min(1,(now-t0)/dur);jump(from+dist*ease(t));if(t<1)requestAnimationFrame(step);else finish()})(t0);
setTimeout(finish,dur+80); // in case frames are throttled (background tab)
}
// Trackpads fire a long momentum tail after each swipe, and a new swipe often starts before the tail ends,
// so a pause cannot mark a new gesture. A new swipe shows as deltas rising again above the decaying tail.
const hist=[];
addEventListener('wheel',e=>{if(e.ctrlKey)return;e.preventDefault();const now=performance.now(),gap=now-lastInput;lastInput=now;
const dy=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1),v=Math.abs(dy);
const prevDir=hist.length?Math.sign(hist[hist.length-1]):0;
if(gap>200)hist.length=0;hist.push(dy);if(hist.length>12)hist.shift();
const avg=a=>a.reduce((x,y)=>x+Math.abs(y),0)/a.length;
const rising=hist.length>=6&&avg(hist.slice(-3))>avg(hist.slice(0,-3))*1.3&&v>6;
if(hist.length===1||rising||(prevDir&&Math.sign(dy)!==prevDir&&v>6)){acc=0;fired=false}
if(busy||fired)return;
acc+=dy;if(Math.abs(acc)<25)return;fired=true;glide(acc>0?1:-1)},{passive:false});
addEventListener('touchstart',e=>{touchY=e.touches.length===1?e.touches[0].clientY:null},{passive:true});
addEventListener('touchmove',e=>{if(e.touches.length>1)touchY=null;else if(touchY!==null)e.preventDefault()},{passive:false}); // pinch zoom stays native
addEventListener('touchend',e=>{if(touchY===null)return;const dy=touchY-e.changedTouches[0].clientY;touchY=null;if(!busy&&Math.abs(dy)>24)glide(dy>0?1:-1)});
addEventListener('keydown',e=>{if(e.target.closest('input,textarea'))return;const down=['ArrowDown','PageDown',' '].includes(e.key),up=['ArrowUp','PageUp'].includes(e.key);if(!down&&!up)return;e.preventDefault();if(!busy)glide(down?1:-1)});
}

// Start page menu: light text while it sits over the stage photo.
const fixedBar=$('.bar--fixed'),stage=$('.stage-photo');
if(fixedBar&&stage&&'IntersectionObserver' in window){
let io;const watch=()=>{if(io)io.disconnect();
io=new IntersectionObserver(([en])=>fixedBar.classList.toggle('on-photo',en.isIntersecting),{rootMargin:`0px 0px -${Math.max(0,innerHeight-fixedBar.offsetHeight)}px 0px`});io.observe(stage)};
watch();addEventListener('resize',watch);
}

// Subpage tabs scroll sideways on phones: keep the current page in view.
const currentTab=$('.pages [aria-current=page]');
if(currentTab)currentTab.scrollIntoView({inline:'center',block:'nearest'});

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

// Gigs come from assets/termine.json; past dates are hidden automatically.
// Live page lists all upcoming gigs (#gigs), the start page shows the next one (#next-gig).
const box=$('#gigs'),nextGig=$('#next-gig');
if(box||nextGig)(async()=>{
const layout=$('#dates-layout');
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n};
const day=g=>g.when.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'}).replace(/\.$/,'');
const meta=g=>{const m=el('span','gig-meta');[g.when.toLocaleDateString('de-DE',{weekday:'long'}),g.time,g.venue].filter(Boolean).forEach((t,j)=>{if(j)m.append(document.createElement('br'));m.append(t)});return m};
try{
const res=await fetch('assets/termine.json',{cache:'no-cache'});if(!res.ok)throw new Error(res.status);
const today=new Date();today.setHours(0,0,0,0);
const gigs=(await res.json()).map(g=>({...g,when:new Date(`${g.date}T00:00`)})).filter(g=>g.when>=today).sort((a,b)=>a.when-b.when);
if(box){
box.replaceChildren(...gigs.map(g=>{const body=el('div','gig-body');body.append(el('p','label',g.label||'Live'),el('p','',g.text||''));
const card=el('article','gig');card.append(el('span','gig-day',day(g)),meta(g),body);return card}));
layout.classList.toggle('is-empty',!gigs.length);
}
if(nextGig&&gigs.length){const g=gigs[0],info=meta(g);info.className='ticket-info';nextGig.replaceChildren(el('span','ticket-date',day(g)),info,$('.ticket-more',nextGig));nextGig.setAttribute('aria-label',`Nächster Auftritt: ${day(g)}, ${g.venue||''}. Alle Termine`)}
}catch(e){if(layout)layout.classList.add('is-empty')}
})();
