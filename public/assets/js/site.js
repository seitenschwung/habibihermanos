'use strict';
// REPLACE WITH THE BAND'S REAL BOOKING EMAIL BEFORE PUBLISHING.
const BOOKING_EMAIL = '';
const $=(selector,scope=document)=>scope.querySelector(selector);
const $$=(selector,scope=document)=>Array.from(scope.querySelectorAll(selector));
const menu=$('.menu-toggle'), nav=$('.topnav');
menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!expanded));menu.setAttribute('aria-label',expanded?'Menü öffnen':'Menü schließen');nav.classList.toggle('is-open',!expanded)});
$$('.topnav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Menü öffnen')}));

const hero=$('#hero-video'),heroToggle=$('#hero-sound'),heroText=$('#hero-sound-text');
const audio=$('#song-audio'),audioBtn=$('#audio-play'),audioIcon=$('#audio-play-symbol'),wave=$('#waveform'),bars=$('#wave-bars'),now=$('#audio-now'),end=$('#audio-end'),fill=$('#wave-highlight');
const videoDialog=$('#video-dialog'),modalVideo=$('#modal-video'),photoDialog=$('#photo-dialog');
hero.play().catch(()=>{});
function silenceHero(){hero.muted=true;heroToggle.setAttribute('aria-pressed','false');heroText.textContent='TON AN'}
function stopAudio(){audio.pause()}
function stopDialog(){modalVideo.pause()}
heroToggle.addEventListener('click',async()=>{
 if(hero.muted){stopAudio();stopDialog();hero.muted=false;try{await hero.play()}catch(e){silenceHero();return}heroToggle.setAttribute('aria-pressed','true');heroText.textContent='TON AUS'}else{silenceHero()}
});
const waves=[86,90,82,85,96,86,88,80,86,79,76,84,67,72,66,68,71,60,81,71,77,74,82,73,64,80,66,66,68,62,68,85,81,68,55,76,87,83,65,71,82,87,71,51,71,90,79,70,59,58,55,79,80,74,62,63,56,51,91,78,71,69,61,65,60,69,65,69,71,79];
waves.forEach(h=>{const bar=document.createElement('span');bar.style.height=h+'%';bars.append(bar)});
const fmt=t=>{const n=Math.floor(Number.isFinite(t)?Math.max(t,0):0);return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`};
function syncAudio(){let progress=audio.currentTime/(audio.duration||1);if(!Number.isFinite(progress))progress=0;now.textContent=fmt(audio.currentTime);if(Number.isFinite(audio.duration))end.textContent=fmt(audio.duration);audioIcon.textContent=audio.paused?'▶':'Ⅱ';audioBtn.setAttribute('aria-label',audio.paused?'Audiomitschnitt abspielen':'Audiomitschnitt pausieren');wave.classList.toggle('is-playing',!audio.paused);wave.setAttribute('aria-valuenow',String(Math.round(progress*100)));fill.style.width=`${progress*100}%`;[...bars.children].forEach((node,i)=>node.classList.toggle('played',i/waves.length<=progress));}
audioBtn.addEventListener('click',async()=>{if(audio.paused){silenceHero();stopDialog();try{await audio.play()}catch(e){console.warn('Audio nicht verfügbar',e)}}else audio.pause();syncAudio()});
['timeupdate','play','pause','loadedmetadata','ended'].forEach(event=>audio.addEventListener(event,syncAudio));
function seek(pct){if(Number.isFinite(audio.duration)){audio.currentTime=audio.duration*Math.max(0,Math.min(1,pct));syncAudio()}}
wave.addEventListener('click',ev=>seek((ev.clientX-wave.getBoundingClientRect().left)/wave.clientWidth));
wave.addEventListener('keydown',ev=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(ev.key)){ev.preventDefault();let p=audio.currentTime/(audio.duration||1);if(ev.key==='ArrowLeft')p-=.05;if(ev.key==='ArrowRight')p+=.05;if(ev.key==='Home')p=0;if(ev.key==='End')p=1;seek(p)}});
const vids={main:{file:'assets/media/live-session.mp4',label:'Habbibi Hermanos / Live aus dem Café'},second:{file:'assets/media/second-session.mp4',label:'Habbibi Hermanos / Zweiter Live-Mitschnitt'}};
$$('[data-video]').forEach(btn=>btn.addEventListener('click',()=>{const item=vids[btn.dataset.video];if(!item)return;silenceHero();stopAudio();modalVideo.pause();modalVideo.src=item.file;$('#modal-video-label').textContent=item.label;videoDialog.showModal();document.body.classList.add('dialog-open');modalVideo.play().catch(()=>{});}));
function closeVideo(){modalVideo.pause();modalVideo.removeAttribute('src');modalVideo.load();if(videoDialog.open)videoDialog.close();document.body.classList.remove('dialog-open')}
$('#close-video').addEventListener('click',closeVideo);videoDialog.addEventListener('cancel',e=>{e.preventDefault();closeVideo()});videoDialog.addEventListener('click',e=>{if(e.target===videoDialog)closeVideo()});
$$('[data-photo]').forEach(btn=>btn.addEventListener('click',()=>{$('#large-photo').src=btn.dataset.photo;$('#large-photo').alt=btn.dataset.caption;$('#large-photo-caption').textContent=btn.dataset.caption;photoDialog.showModal();document.body.classList.add('dialog-open')}));
function closePhoto(){if(photoDialog.open)photoDialog.close();document.body.classList.remove('dialog-open')}
$('#close-photo').addEventListener('click',closePhoto);photoDialog.addEventListener('cancel',e=>{e.preventDefault();closePhoto()});photoDialog.addEventListener('click',e=>{if(e.target===photoDialog)closePhoto()});
// Booking uses email client, never transmits to a server or pretends to have done so.
const form=$('#booking-form'),status=$('#form-status');
function bookingText(){const d=new FormData(form);return `Hallo Habbibi Hermanos,\n\nich möchte euch für eine Veranstaltung anfragen.\n\nName: ${d.get('name')||'-'}\nE-Mail: ${d.get('email')||'-'}\nOrt / Veranstaltung: ${d.get('event')||'-'}\nWunschtermin: ${d.get('date')||'noch offen'}\n\n${d.get('message')||''}\n\nViele Grüße\n${d.get('name')||''}`}
form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;if(!BOOKING_EMAIL){status.textContent='Die Booking-E-Mail-Adresse fehlt noch. Bitte zunächst die Anfrage kopieren; die Adresse muss vor der Veröffentlichung in assets/js/site.js ergänzt werden.';status.className='form-status error';return;}status.textContent='Dein E-Mail-Programm öffnet sich. Bitte bestätige dort noch den Versand.';status.className='form-status success';window.location.href=`mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent('Booking-Anfrage | Habbibi Hermanos')}&body=${encodeURIComponent(bookingText())}`});
$('#copy-booking').addEventListener('click',async()=>{const text=bookingText();try{await navigator.clipboard.writeText(text);status.textContent='Anfrage kopiert – jetzt in eine E-Mail oder Nachricht einfügen.';status.className='form-status success'}catch(e){const ta=document.createElement('textarea');ta.value=text;document.body.append(ta);ta.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}ta.remove();status.textContent=ok?'Anfrage kopiert.':'Automatisches Kopieren nicht möglich – bitte Nachricht manuell markieren.';status.className='form-status '+(ok?'success':'error')}});
