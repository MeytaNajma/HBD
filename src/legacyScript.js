
/* ============================================================
   KONFIGURASI — ganti bagian ini dulu ya!
============================================================ */
const CONFIG = {
  name: "Sayang",             // nama dia
  dateText: "10 · 10 · 2004", // tanggal lahir (di cover)
  month: "Oktober",           // bulan ultah
  bday: 10,                   // tanggal ultah
  startOffset: 3,             // 1 Oktober jatuh hari Kamis (Senin=0)
  daysInMonth: 31,
  letterDate: "October 10",
};

const HEART_D = "M16 29C8 22 0 15 0 8.5 0 3.8 3.8 0 8.5 0c3.1 0 5.9 1.7 7.5 4.3C17.6 1.7 20.4 0 23.5 0 28.2 0 32 3.8 32 8.5 32 15 24 22 16 29Z";
const HEART_SVG = `<svg viewBox="0 0 32 29"><path d="${HEART_D}"/></svg>`;
const PAL = ['#f4eee1','#d9a69d','#c56b6d','#8f2f33','#e8c9a0'];

/* ============================================================ FX: confetti hearts */
const fx = document.getElementById('fx'), fctx = fx.getContext('2d');
let parts = [];
function sizeFx(){ fx.width = innerWidth; fx.height = innerHeight; }
sizeFx(); addEventListener('resize', sizeFx);

function heartPath(c,s){ c.beginPath(); c.moveTo(0,-.32*s);
  c.bezierCurveTo(.5*s,-.95*s,1.1*s,-.15*s,0,.65*s);
  c.bezierCurveTo(-1.1*s,-.15*s,-.5*s,-.95*s,0,-.32*s); c.closePath(); c.fill(); }

function burst(x,y,o={}){
  const n = o.n||46;
  for(let i=0;i<n;i++){
    const a=(o.base??-Math.PI/2)+(Math.random()-.5)*(o.spread??Math.PI*1.7);
    const sp=(o.power||7)*(.35+Math.random()*.75);
    parts.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-2,g:.16,rot:Math.random()*6.28,
      vr:(Math.random()-.5)*.3,s:(o.hearts?5:6)+Math.random()*(o.hearts?5:8),
      life:1,dk:.006+Math.random()*.01,heart:o.hearts||Math.random()<.45,
      c:PAL[(Math.random()*PAL.length)|0]});
  }
}
function heartPop(x,y,n=9){ burst(x,y,{n,hearts:true,power:3.4,spread:Math.PI*2}); }
function fireworks(){
  for(let k=0;k<5;k++) setTimeout(()=>burst(
    innerWidth*(0.15+Math.random()*0.7), innerHeight*(0.12+Math.random()*0.35),
    {n:60,power:9,hearts:Math.random()<.5}), k*260);
}
function rain(){
  let k=0; const iv=setInterval(()=>{
    burst(Math.random()*innerWidth,-12,{n:22,power:2.4,base:Math.PI/2,spread:.7,hearts:Math.random()<.6});
    if(++k>14) clearInterval(iv);
  },180);
}
(function tick(){
  fctx.clearRect(0,0,fx.width,fx.height);
  for(let i=parts.length-1;i>=0;i--){
    const p=parts[i]; p.vy+=p.g; p.vx*=.985; p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr; p.life-=p.dk;
    if(p.life<=0||p.y>fx.height+40){ parts.splice(i,1); continue; }
    fctx.save(); fctx.translate(p.x,p.y); fctx.rotate(p.rot);
    fctx.globalAlpha=Math.max(0,Math.min(1,p.life*1.4)); fctx.fillStyle=p.c;
    if(p.heart) heartPath(fctx,p.s); else fctx.fillRect(-p.s/2,-p.s/3,p.s,p.s*.66);
    fctx.restore();
  }
  requestAnimationFrame(tick);
})();

function floatHeart(x,y){
  const s=document.createElement('span'); s.className='fheart';
  s.style.left=x+'px'; s.style.top=y+'px';
  s.style.setProperty('--s',(9+Math.random()*13)+'px');
  s.style.setProperty('--dx',((Math.random()-.5)*60)+'px');
  s.style.color=PAL[(Math.random()*PAL.length)|0];
  s.innerHTML=HEART_SVG; document.body.appendChild(s);
  setTimeout(()=>s.remove(),1100);
}

/* ============================================================ audio (kotak musik, tanpa file) */
let AC=null, musicOn=false, seqToken=0, loopTimer=null;
function ac(){ try{ if(!AC) AC=new (window.AudioContext||window.webkitAudioContext)();
  if(AC.state==='suspended') AC.resume(); }catch(e){} return AC; }
function note(m,t,dur,vol=.13){
  const a=ac(); if(!a) return;
  const f=440*Math.pow(2,(m-69)/12);
  const o=a.createOscillator(),g=a.createGain();
  o.type='triangle'; o.frequency.value=f;
  g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+.02);
  g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g).connect(a.destination); o.start(t); o.stop(t+dur+.05);
  const o2=a.createOscillator(),g2=a.createGain(); o2.type='sine'; o2.frequency.value=f*2;
  g2.gain.setValueAtTime(0,t); g2.gain.linearRampToValueAtTime(vol*.22,t+.02);
  g2.gain.exponentialRampToValueAtTime(.0001,t+dur*.8);
  o2.connect(g2).connect(a.destination); o2.start(t); o2.stop(t+dur);
}
function playSeq(seq,tempo=.42,vol=.13){
  const a=ac(); if(!a) return 0;
  const t0=a.currentTime+.05; let t=t0;
  for(const [m,b] of seq){ if(m) note(m,t,Math.max(.3,b*tempo*.95),vol); t+=b*tempo; }
  return t-t0;
}
function pop(){
  if(!musicOn) return; const a=ac(); if(!a) return;
  const t=a.currentTime,o=a.createOscillator(),g=a.createGain();
  o.type='sine'; o.frequency.setValueAtTime(520,t);
  o.frequency.exponentialRampToValueAtTime(880,t+.06);
  g.gain.setValueAtTime(.07,t); g.gain.exponentialRampToValueAtTime(.0001,t+.12);
  o.connect(g).connect(a.destination); o.start(t); o.stop(t+.14);
}
const HB=[[62,.75],[62,.25],[64,1],[62,1],[67,1],[66,1.9],[0,.35],
[62,.75],[62,.25],[64,1],[62,1],[69,1],[67,1.9],[0,.35],
[62,.75],[62,.25],[74,1],[71,1],[67,1],[66,1],[64,1.9],[0,.35],
[72,.75],[72,.25],[71,1],[67,1],[69,1],[67,2.4]];
function startLoop(){
  const token=++seqToken;
  const dur=playSeq(HB,.5,.09);
  loopTimer=setTimeout(()=>{ if(musicOn&&token===seqToken) startLoop(); },(dur+1.8)*1000);
}
const musicBtn=document.getElementById('musicBtn');
musicBtn.addEventListener('click',()=>{
  musicOn=!musicOn; musicBtn.classList.toggle('on',musicOn);
  if(musicOn){ pop(); startLoop(); } else { seqToken++; clearTimeout(loopTimer); }
});

/* ============================================================ love o' meter */
const MILE=['locket','cal','candle','letter','reasons','song','scratch','wish'];
const done=new Set();
const meter=document.getElementById('loveMeter');
meter.innerHTML=MILE.map(()=>`<span>${HEART_SVG}</span>`).join('');
const meterSpans=[...meter.children];
function milestone(id){
  if(done.has(id)) return;
  done.add(id);
  const i=MILE.indexOf(id), sp=meterSpans[i];
  if(sp){ sp.classList.add('fill');
    const r=sp.getBoundingClientRect();
    heartPop(r.left+r.width/2, r.top+r.height/2, 5); }
  pop();
  if(done.size===MILE.length) setTimeout(showBonus,900);
}
function showBonus(){
  const b=document.getElementById('bonus'); b.hidden=false;
  rain(); fireworks();
  const a=ac(),t=a.currentTime+.05;
  [64,68,71,76,80].forEach(m=>note(m,t,1.7,.07));
}
document.getElementById('bonusClose').addEventListener('click',()=>{
  document.getElementById('bonus').hidden=true;
  burst(innerWidth/2,innerHeight/2,{n:70,power:8,hearts:true}); pop();
});

/* ============================================================ book / navigation */
const pages=[...document.querySelectorAll('.page')], PAGES=pages.length;
const dotsEl=document.getElementById('dots');
dotsEl.innerHTML=pages.map(()=>'<span></span>').join('');
const dots=[...dotsEl.children];
let cur=0;
function goTo(i){
  i=Math.max(0,Math.min(PAGES-1,i));
  if(i===cur && pages[i].classList.contains('active')) return;
  cur=i;
  pages.forEach((p,idx)=>{
    p.classList.toggle('active',idx===cur);
    p.classList.toggle('left',idx<cur);
  });
  dots.forEach((d,idx)=>d.classList.toggle('on',idx===cur));
  document.getElementById('prevBtn').disabled=cur===0;
  document.getElementById('nextBtn').disabled=cur===PAGES-1;
  onEnter(cur);
}
dots.forEach((d,i)=>d.addEventListener('click',()=>goTo(i)));
document.getElementById('prevBtn').addEventListener('click',()=>goTo(cur-1));
document.getElementById('nextBtn').addEventListener('click',()=>goTo(cur+1));
addEventListener('keydown',e=>{
  if(e.key==='ArrowRight') goTo(cur+1);
  if(e.key==='ArrowLeft') goTo(cur-1);
});
let sw=null;
const pagesEl=document.getElementById('pagesEl');
pagesEl.addEventListener('pointerdown',e=>{
  if(e.target.closest('.polaroid,canvas,button')) return;
  sw={x:e.clientX,y:e.clientY};
});
addEventListener('pointerup',e=>{
  if(!sw||window.__drag) { sw=null; return; }
  const dx=e.clientX-sw.x, dy=e.clientY-sw.y; sw=null;
  if(Math.abs(dx)>70&&Math.abs(dy)<60){ dx<0?goTo(cur+1):goTo(cur-1); }
});
function onEnter(i){
  if(i===3) startTyping();
  if(i===7) initScratch();
}

/* klik di mana pun → hati kecil muncul */
let lastH=0;
addEventListener('pointerdown',e=>{
  const now=Date.now(); if(now-lastH<130) return; lastH=now;
  if(e.target.closest('button,canvas,.polaroid,.fheart')) return;
  floatHeart(e.clientX,e.clientY);
});

/* ============================================================ intro */
const env=document.getElementById('env'), intro=document.getElementById('intro');
env.addEventListener('click',()=>{
  if(env.classList.contains('open')) return;
  env.classList.add('open'); pop();
  const r=env.getBoundingClientRect();
  burst(r.left+r.width/2, r.top+r.height/2, {n:60,hearts:true,power:6});
  musicOn=true; musicBtn.classList.add('on'); startLoop();
  setTimeout(()=>{
    intro.classList.add('gone');
    document.getElementById('book').classList.add('ready');
    goTo(0);
    burst(innerWidth/2,innerHeight*0.35,{n:80,power:9});
  },1000);
});

/* ============================================================ page 1 : cover */
document.getElementById('tbName').textContent=CONFIG.name;
document.getElementById('coverDate').textContent=CONFIG.dateText;
document.getElementById('finName').textContent=CONFIG.name;
document.getElementById('letterDate').textContent=CONFIG.letterDate;

const coverCard=document.getElementById('coverCard');
for(let i=0;i<16;i++){
  const s=document.createElement('span'); s.className='mini-heart';
  const sz=7+Math.random()*11;
  s.style.cssText=`left:${4+Math.random()*92}%;top:${3+Math.random()*90}%;width:${sz}px;opacity:${.25+Math.random()*.4}`;
  s.innerHTML=HEART_SVG; coverCard.appendChild(s);
}
const locket=document.getElementById('locket'), locketCap=document.getElementById('locketCap');
locket.addEventListener('click',()=>{
  const first=!locket.classList.contains('open');
  locket.classList.add('open'); locketCap.textContent='us, always';
  const r=locket.getBoundingClientRect();
  heartPop(r.left+r.width/2, r.top+r.height/2, first?16:8);
  pop(); if(first) milestone('locket');
});

/* ============================================================ page 2 : calendar */
const calGrid=document.getElementById('calGrid');
const DOW=['Sen','Sel','Rab','Kam','Jum','Sab','Min'];
document.getElementById('calMonth').textContent=CONFIG.month;
let html=DOW.map(d=>`<span class="dow">${d}</span>`).join('');
html+='<span></span>'.repeat(CONFIG.startOffset);
for(let d=1;d<=CONFIG.daysInMonth;d++){
  html += d===CONFIG.bday
    ? `<button class="day bday" data-b>${d}<svg viewBox="0 0 32 29"><path d="${HEART_D}"/></svg></button>`
    : `<button class="day">${d}</button>`;
}
calGrid.innerHTML=html;
const calNote=document.getElementById('calNote');
calGrid.addEventListener('click',e=>{
  const b=e.target.closest('.day'); if(!b) return;
  if(b.hasAttribute('data-b')){
    calNote.textContent=`${CONFIG.month} ${CONFIG.bday} — hari di mana dunia resmi jadi tempat yang lebih lunak.`;
    calNote.classList.add('show');
    const r=b.getBoundingClientRect();
    burst(r.left+r.width/2,r.top+r.height/2,{n:36,hearts:true,power:5});
    milestone('cal');
  }else{
    b.classList.remove('wig'); void b.offsetWidth; b.classList.add('wig');
    calNote.textContent='bukan hari itu hehe — cari yang merah.'; calNote.classList.add('show');
  }
});

/* ============================================================ page 3 : cake */
const candlesEl=document.getElementById('candles');
candlesEl.innerHTML=Array.from({length:5},()=>
  `<div class="candle"><span class="flame"></span><span class="smoke"></span></div>`).join('');
const cakeHint=document.getElementById('cakeHint'), wishNote=document.getElementById('wishNote');
let lit=5;
candlesEl.addEventListener('click',e=>{
  const f=e.target.closest('.flame'); if(!f||f.classList.contains('out')) return;
  f.classList.add('out');
  f.nextElementSibling.classList.add('rise');
  lit--; pop();
  cakeHint.textContent=`tiup lilinnya — sisa ${lit} api`;
  if(lit===0){
    cakeHint.style.display='none'; wishNote.classList.add('show');
    const c=candlesEl.getBoundingClientRect();
    burst(c.left+c.width/2,c.top,{n:80,hearts:true,power:8});
    playSeq(HB,.42,.12);
    milestone('candle');
  }
});
document.getElementById('relight').addEventListener('click',()=>{
  lit=5; wishNote.classList.remove('show'); cakeHint.style.display='';
  cakeHint.textContent='tiup lilinnya — klik apinya satu-satu';
  candlesEl.querySelectorAll('.flame').forEach(f=>f.classList.remove('out'));
  candlesEl.querySelectorAll('.smoke').forEach(s=>s.classList.remove('rise'));
  pop();
});

/* ============================================================ page 4 : letter (typewriter) */
const LETTER = `happy 22nd birthday 🤍

semoga di usia baru ini, hidup lebih banyak kasih kamu hal-hal baik. semoga apa pun yang lagi kamu usahakan satu per satu nemuin jalannya, rezekimu dilancarkan, sehat selalu, dan hatimu selalu punya cukup tenang buat menghadapi apa pun yang datang.

semoga kamu tumbuh jadi seseorang yang lebih baik dari hari ke hari, makin bijak dalam mengambil keputusan, makin dewasa dalam memahami banyak hal, dan selalu punya alasan buat bersyukur meski hidup nggak selalu berjalan sesuai mau kamu.

aku juga berharap semoga hal-hal baik yang kamu doakan diam-diam bisa segera jadi nyata. semoga langkahmu selalu dimudahkan, dikelilingi orang-orang yang tulus, dan dijauhkan dari hal-hal yang bisa bikin kamu kehilangan arah.

di usia yang baru ini, semoga kita juga bisa belajar banyak hal, jadi lebih dewasa, lebih mengerti satu sama lain, dan sama-sama memperbaiki apa yang memang perlu diperbaiki. semoga ke depannya lebih banyak hal baik yang bisa kita temui, dengan hati yang lebih tenang dan cara yang lebih baik dalam menjaga satu sama lain.

enjoy your day, yaa. i hope 22 treats you well, in ways you never expected ♡`;
const letterBody=document.getElementById('letterBody'), caret=document.getElementById('caret');
const letterSig=document.getElementById('letterSig'), skipType=document.getElementById('skipType');
let typing=false, typed=false, typeTimer=null;
const txtNode=document.createTextNode('');
letterBody.insertBefore(txtNode, caret);
function finishLetter(){
  typed=true; typing=false; clearTimeout(typeTimer);
  txtNode.nodeValue=LETTER; caret.remove();
  letterSig.style.opacity=1; letterBody.scrollTop=0;
  milestone('letter');
}
function startTyping(){
  if(typed||typing) return;
  typing=true; let i=0;
  (function step(){
    if(!typing) return;
    i++;
    txtNode.nodeValue=LETTER.slice(0,i);
    letterBody.scrollTop=letterBody.scrollHeight;
    if(i>=LETTER.length){ finishLetter(); return; }
    const ch=LETTER[i-1];
    typeTimer=setTimeout(step, (ch==='.'||ch===','||ch==='?')? 60 : 11+Math.random()*14);
  })();
}
skipType.addEventListener('click',()=>{ finishLetter(); pop(); });

/* ============================================================ page 5 : reasons */
const REASONS=[
["his face","ya mau gimana, udah terlanjur suka. now look what you did."],
["tawamu","apalagi kalau udah ketawa lepas, ikutan seneng jadinya."],
["cerita random","topiknya kadang ngga jelas, tapi kalau dari pretty boy ya dengerin aja."],
["perhatian kecil","ternyata sesimpel itu bikin aku seneng. noted, kan?"],
["tingkah absurd","setengah bikin gemes, setengah bikin geleng-geleng. paket lengkap."],
["little moments","hal receh yang entah kenapa selalu punya tempat sendiri di ingatan."],
["your hugs","ngga tau kenapa, tapi yang satu ini selalu jadi nilai plus."],
["usahamu","ngga harus langsung sempurna, yang penting selalu ada niat buat jadi lebih baik."],
["sisi soft-mu","yang nggak semua orang tahu. a little secret, maybe."],
["the person you are","with all your flaws and all your good sides, still someone special to me."],
];
const reasonsEl=document.getElementById('reasons');
reasonsEl.innerHTML=REASONS.map((r,i)=>
  `<li class="reason"><span class="num serif">${String(i+1).padStart(2,'0')}.</span><span class="what">${r[0]}</span>
   <span class="stamp">${HEART_SVG}</span><span class="why">${r[1]}</span></li>`).join('');
const openedR=new Set(), reasonDone=document.getElementById('reasonDone');
reasonsEl.addEventListener('click',e=>{
  const li=e.target.closest('.reason'); if(!li) return;
  li.classList.toggle('open'); pop();
  if(li.classList.contains('open')){
    const r=li.getBoundingClientRect();
    heartPop(r.right-20,r.top+10,4);
    openedR.add(li);
    if(openedR.size===REASONS.length){
      reasonDone.innerHTML='<span class="script sm">and reason no. ∞</span>masih banyak hal yang perlu kita perbaiki, semoga kali ini bisa lebih baik ya ♡';
      burst(innerWidth/2,innerHeight/2,{n:50,hearts:true,power:6});
      milestone('reasons');
    }
  }
});

/* ============================================================ page 6 : playlist */
const SONGS=[
{t:"Teman Hidup",by:"Tulus",s:"buat cerita yang masih pengin dilanjutin.",
 seq:[[67,.5],[69,.5],[71,1],[72,1],[71,1],[69,2]]},
{t:"Kali Kedua",by:"Raisa",s:"some things deserve another chance.",
 seq:[[72,.5],[74,.5],[76,1],[74,1],[72,1],[69,2]]},
{t:"Kita",by:"Sheila on 7",s:"tentang aku, kamu, dan cerita kita sejauh ini.",
 seq:[[69,.5],[67,.5],[64,1],[67,1],[69,1],[72,2]]},
{t:"Nothing",by:"Bruno Major",s:"hari biasa yang jadi punya cerita.",
 seq:[[64,.75],[66,.25],[67,1],[71,1],[69,2]]},
{t:"Every Summertime",by:"NIKI",s:"buat kenangan kecil yang bakal selalu punya tempat sendiri. ♡",
 seq:[[78,.5],[76,.5],[74,1],[76,1],[78,1],[81,1],[79,2]]},
];
const songsEl=document.getElementById('songs');
songsEl.innerHTML=SONGS.map((s,i)=>
  `<li><span class="idx serif">${i+1}.</span><span><span class="t">${s.t}</span><span class="by">— ${s.by}</span><span class="s">${s.s}</span></span>
   <span class="eq"><i></i><i></i><i></i></span></li>`).join('');
const vinyl=document.getElementById('vinyl'), tonearm=document.getElementById('tonearm'), np=document.getElementById('np');
let songToken=0;
songsEl.addEventListener('click',e=>{
  const li=e.target.closest('li'); if(!li) return;
  const wasActive=li.classList.contains('active');
  songsEl.querySelectorAll('li').forEach(x=>x.classList.remove('active'));
  li.classList.add('active');
  const i=[...songsEl.children].indexOf(li), s=SONGS[i];
  np.textContent=`now playing — ${s.t} · ${s.by}`;
  vinyl.classList.add('spin'); tonearm.classList.add('down');
  const token=++songToken;
  const dur=playSeq(s.seq,.4,.11);
  setTimeout(()=>{ if(token===songToken) tonearm.classList.remove('down'); }, dur*1000);
  milestone('song'); pop();
});
vinyl.addEventListener('click',()=>{
  vinyl.classList.toggle('spin');
  tonearm.classList.toggle('down',vinyl.classList.contains('spin'));
  pop();
});

/* ============================================================ page 7 : memories (draggable polaroids) */
const MEMOS=[
{seed:"lovestory1",cap:"lima tahun kita"},
{seed:"lovestory2",cap:"our dinner date"},
{seed:"lovestory3",cap:"kecil-kecilan buatmu"},
{seed:"lovestory4",cap:"kamu lagi, kamu lagi"},
{seed:"lovestory5",cap:"genre romantic"},
{seed:"lovestory6",cap:"4pm with u"},
];
const POS=[{x:2,y:2,r:-7},{x:32,y:8,r:4},{x:62,y:2,r:-4},{x:6,y:50,r:5},{x:36,y:46,r:-3},{x:64,y:52,r:7}];
const board=document.getElementById('board');
let zTop=10;
MEMOS.forEach((m,i)=>{
  const f=document.createElement('figure');
  f.className='polaroid';
  f.style.left=POS[i].x+'%'; f.style.top=POS[i].y+'%';
  f.style.setProperty('--r',POS[i].r+'deg');
  f.style.zIndex=++zTop;
  // GANTI src di bawah dengan foto kalian (bisa file lokal: foto1.jpg, dst.)
  const photoFiles = ["anniv.jpeg", "dinner.jpeg", "kado.jpeg", "randompict.jpeg", "romantic.jpeg", "sore.jpeg"];
  f.innerHTML=`<img src="/images/${photoFiles[i]}" alt="${m.cap}"><figcaption>${m.cap}</figcaption>`;
  board.appendChild(f);
  let drag=null;
  f.addEventListener('pointerdown',e=>{
    e.preventDefault();
    f.setPointerCapture(e.pointerId);
    drag={sx:e.clientX,sy:e.clientY,
      ox:parseFloat(f.style.getPropertyValue('--tx'))||0,
      oy:parseFloat(f.style.getPropertyValue('--ty'))||0, moved:0};
    f.style.zIndex=++zTop; window.__drag=true;
  });
  f.addEventListener('pointermove',e=>{
    if(!drag) return;
    const dx=e.clientX-drag.sx, dy=e.clientY-drag.sy;
    drag.moved=Math.max(drag.moved,Math.abs(dx)+Math.abs(dy));
    f.style.setProperty('--tx',(drag.ox+dx)+'px');
    f.style.setProperty('--ty',(drag.oy+dy)+'px');
  });
  f.addEventListener('pointerup',()=>{
    if(drag&&drag.moved<8) openLB(m);
    drag=null; window.__drag=false;
  });
});
const lightbox=document.getElementById('lightbox');
function openLB(m){
  document.getElementById('lbImg').src=`/images/${["anniv.jpeg", "dinner.jpeg", "kado.jpeg", "randompict.jpeg", "romantic.jpeg", "sore.jpeg"][MEMOS.indexOf(m)]}`;
  document.getElementById('lbCap').textContent=m.cap;
  lightbox.hidden=false; pop();
}
lightbox.addEventListener('click',()=>lightbox.hidden=true);

/* ============================================================ page 8 : scratch */
const sWrap=document.getElementById('scratchWrap'), sCv=document.getElementById('scratchCv');
let sInit=false, scratching=false, sLast=null, sMoves=0, sDone=false;
function heartPath2(c,x,y,s,rot){
  c.save(); c.translate(x,y); c.rotate(rot);
  c.beginPath(); c.moveTo(x,y-.32*s);
  c.bezierCurveTo(x+.5*s,y-.95*s,x+1.1*s,y-.15*s,x,y+.65*s);
  c.bezierCurveTo(x-1.1*s,y-.15*s,x-.5*s,y-.95*s,x,y-.32*s);
  c.closePath(); c.fill(); c.restore();
}
function initScratch(){
  if(sInit||!sWrap.clientWidth) return; sInit=true;
  sCv.width=sWrap.clientWidth; sCv.height=sWrap.clientHeight;
  const c=sCv.getContext('2d');
  c.fillStyle='#f4eee1'; c.fillRect(0,0,sCv.width,sCv.height);
  c.fillStyle='rgba(197,107,109,.35)';
  for(let y=14;y<sCv.height;y+=42)
    for(let x=14+((y/42)%2)*21;x<sCv.width;x+=42)
      heartPath2(c,x,y,7,Math.random()*.6-.3);
  c.fillStyle='#5a1e21'; c.textAlign='center'; c.textBaseline='middle';
  c.font='15px "Special Elite", monospace';
  c.fillText('G O S O K   P E L A N - P E L A N', sCv.width/2, sCv.height/2-12);
  c.font='11px "Special Elite", monospace';
  c.fillText('di sini, pakai jari ya', sCv.width/2, sCv.height/2+14);
}
function sPos(e){ const r=sCv.getBoundingClientRect(); return {x:e.clientX-r.left,y:e.clientY-r.top}; }
sCv.addEventListener('pointerdown',e=>{
  e.preventDefault(); scratching=true; sLast=sPos(e);
  sCv.setPointerCapture(e.pointerId);
});
sCv.addEventListener('pointermove',e=>{
  if(!scratching||sDone) return;
  const p=sPos(e), c=sCv.getContext('2d');
  c.globalCompositeOperation='destination-out';
  c.lineWidth=30; c.lineCap='round';
  c.beginPath(); c.moveTo(sLast.x,sLast.y); c.lineTo(p.x,p.y); c.stroke();
  sLast=p; sMoves++;
  if(sMoves%12===0) checkScratch();
});
addEventListener('pointerup',()=>scratching=false);
function checkScratch(){
  const c=sCv.getContext('2d'), d=c.getImageData(0,0,sCv.width,sCv.height).data;
  let cl=0,tot=0;
  for(let y=0;y<sCv.height;y+=14) for(let x=0;x<sCv.width;x+=14){
    tot++; if(d[(y*sCv.width+x)*4+3]<40) cl++;
  }
  if(cl/tot>0.52){
    sDone=true; sCv.classList.add('done');
    const r=sWrap.getBoundingClientRect();
    burst(r.left+r.width/2,r.top+r.height/2,{n:70,hearts:true,power:7});
    milestone('scratch');
  }
}

/* ============================================================ page 9 : finale */
const wishBtn=document.getElementById('wishBtn');
wishBtn.addEventListener('click',()=>{
  wishBtn.hidden=true;
  document.getElementById('afterWish').hidden=false;
  document.getElementById('replayBtn').hidden=false;
  const st=document.createElement('span'); st.className='shoot';
  document.body.appendChild(st); setTimeout(()=>st.remove(),1200);
  setTimeout(fireworks,650);
  playSeq(HB,.38,.12);
  milestone('wish');
});
document.getElementById('replayBtn').addEventListener('click',()=>location.reload());

/* init */
goTo(0);
