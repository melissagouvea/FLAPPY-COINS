const $=s=>document.querySelector(s),cv=$('#c'),x=cv.getContext('2d'),H=640,GY=560;let W=360,K=2;
let S={coins:0,best:0,bestC:0,games:0,pipes:0,tot:0,done:0,own:['c0','h0','b0'],eq:{c:'c0',h:'h0',b:'b0'},th:'auto',mu:.4,sf:.8,name:'Jogador',sc:[],q:null};
try{Object.assign(S,JSON.parse(localStorage.fc1||'{}'))}catch(e){}
const save=()=>{try{localStorage.fc1=JSON.stringify(S)}catch(e){}};
S.eq=Object.assign({c:'c0',h:'h0',b:'b0',g:'g0',k:'k0'},S.eq);['g0','k0'].forEach(i=>S.own.includes(i)||S.own.push(i));
const esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const IT={c:[['c0','Amarelo',0,'#ffcf3a'],['c1','Azul',30,'#4aa8ff'],['c2','Rosa',40,'#ff7eb6'],['c3','Verde',50,'#5fd068']],h:[['h0','Sem chapéu',0],['h1','Laço',40],['h2','Cartola',60],['h3','Coroa',80],['h4','Boné',50],['h5','Bruxa',70],['h6','Festa',45]],b:[['b0','Dia',0,['#5cc4ff','#d6f1ff']],['b1','Entardecer',70,['#ff9a6b','#ffe0a8']],['b2','Noite',90,['#1b2a5c','#5a5fa8']]],g:[['g0','Sem óculos',0],['g1','Óculos redondo',35],['g2','Óculos escuros',55],['g3','Bigode',45]],k:[['k0','Sem cachecol',0],['k1','Cachecol vermelho',50,'#e8445a'],['k2','Cachecol azul',50,'#2677d9'],['k3','Cachecol verde',50,'#3fae4f']]};
const NM={c:'Cores',h:'Chapéus',g:'Rosto',k:'Cachecóis',b:'Cenários'},EM={h:['','🎀','🎩','👑','🧢','🧙','🎉'],g:['','👓','🕶️','🥸'],b:['☀️','🌇','🌙']};
const QD=[['a','Colete 10 moedas','coins',10,10],['b','Atravesse 15 canos','pipes',15,15],['c','Jogue 3 partidas','games',3,10],['d','25 moedas em uma partida','run',25,30],['e','Faça 20 pontos numa partida','score',20,25]];
const Q=()=>{const k=new Date().toLocaleDateString('sv');if(!S.q||S.q.d!==k){S.q={d:k,p:{},cl:{}};save()}return S.q};
const qp=(k,v,mx)=>{const q=Q();q.p[k]=mx?Math.max(q.p[k]||0,v):(q.p[k]||0)+v};
const qd=()=>{const q=Q();return[QD.filter(d=>(q.p[d[2]]||0)>=d[3]).length,QD.filter(d=>(q.p[d[2]]||0)>=d[3]&&!q.cl[d[0]]).length]};
let DK=false;const mq=matchMedia('(prefers-color-scheme:dark)');
function applyTh(){DK=S.th==='dark'||(S.th==='auto'&&mq.matches);document.documentElement.dataset.t=DK?'dark':'light'}
mq.addEventListener&&mq.addEventListener('change',applyTh);
// áudio
let ac,mi=0;const au=()=>{try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume()}catch(e){}};
function tone(f,d=.1,ty='square',v=.18,w=0,vol=S.sf){if(!vol||!ac)return;const o=ac.createOscillator(),g=ac.createGain(),n=ac.currentTime+w;o.type=ty;o.frequency.value=f;g.gain.setValueAtTime(v*vol,n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g);g.connect(ac.destination);o.start(n);o.stop(n+d)}
const N=[262,330,392,330,294,370,440,370];
setInterval(()=>{if(ac&&S.mu&&st!=='pause'&&st!=='over'&&!document.hidden)tone(N[mi++%8],.25,'sine',.14,0,S.mu*.6)},320);
// jogo
let st='menu',cur='menu',B,P,C,U,fx=[],sc=0,run=0,spd=120,ly=300,t=0,ox=0,R={sc:0,run:0,rec:0},RK={w:0,m:'s'};
const SP=()=>Math.max(190,230-sc*1.5);
const BX=()=>Math.max(90,Math.min(W*.25,200));
function reset(){B={x:BX(),y:300,v:0,r:13,sh:0,mg:0,an:0,inv:0};P=[];C=[];U=[];fx=[];sc=0;run=0;ly=300;spd=120}
function spawn(px){const g=Math.max(125,180-sc*1.6),m=Math.min(60+sc*2,120),cy=Math.min(Math.max(ly+(Math.random()*2-1)*m,g/2+45),GY-g/2-45);
 P.push({x:px,cy,g,ok:0});const mx=px-(SP()-54)/2,my=(ly+cy)/2;ly=cy;
 if(Math.random()<.12)U.push({x:mx,y:my,k:Math.random()<.5?'s':'m'});
 else{const n=Math.random()<.4?5:3;for(let i=0;i<n;i++)C.push({x:mx+(i-(n-1)/2)*26,y:my,v:1})}
 if(Math.random()<.1)C.push({x:px+27,y:cy,v:5})}
function burst(px,py,c){for(let i=0;i<8;i++){const a=i*.785;fx.push({x:px,y:py,vx:Math.cos(a)*90,vy:Math.sin(a)*90,l:.45,c})}}
function flap(){au();if(st==='ready'){st='play';const h=$('#hint');h&&h.remove();B.v=-400;tone(523,.1)}else if(st==='play'){B.v=-400;tone(500,.07,'triangle')}}
function die(){if(st!=='play')return;st='dead';B.v=-260;tone(220,.5,'sawtooth',.2);
 S.coins+=run;S.tot+=run;S.games++;S.pipes+=sc;const rec=sc>S.best;if(rec)S.best=sc;if(run>S.bestC)S.bestC=run;
 S.sc.push({s:sc,c:run,t:Date.now(),k:S.eq.c,n:S.name});if(S.sc.length>300)S.sc=S.sc.slice(-300);
 qp('coins',run);qp('pipes',sc);qp('games',1);qp('run',run,1);qp('score',sc,1);save();R={sc,run,rec};
 setTimeout(()=>{if(st==='dead'){st='over';if(rec)tone(988,.3,'triangle',.2);show('over')}},750)}
function up(dt){t+=dt;if(st==='pause'||st==='over')return;
 for(const f of fx){f.x+=f.vx*dt;f.y+=f.vy*dt;f.l-=dt}fx=fx.filter(f=>f.l>0);
 B.an+=dt*(st==='dead'?0:14);
 if(st==='menu'||st==='ready'){ox+=40*dt;B.x=st==='menu'?W/2:BX();B.y=300+Math.sin(t*3)*8;B.v=0;return}
 if(st==='dead'){B.v+=1500*dt;B.y=Math.min(B.y+B.v*dt,GY-B.r);return}
 B.v+=1500*dt;B.y+=B.v*dt;spd=120+Math.min(sc*3,100);const dx=spd*dt;ox+=dx;
 for(const a of[P,C,U])for(const o of a)o.x-=dx;
 const l=P[P.length-1];if(!l||l.x<W-SP())spawn(l?l.x+SP():W+60);
 if(B.inv>0)B.inv-=dt;if(B.mg>0)B.mg-=dt;
 if(B.y+B.r>GY){if(B.sh){B.sh=0;B.inv=1.2;B.v=-420;B.y=GY-B.r-1;burst(B.x,B.y,'#7cf')}else{B.y=GY-B.r;return die()}}
 if(B.y-B.r<0){B.y=B.r;if(B.v<0)B.v=0}
 for(const p of P){if(!p.ok&&p.x+57<B.x){p.ok=1;sc++;tone(660,.08,'square',.12)}
  if(B.inv<=0&&B.x+11>p.x-3&&B.x-11<p.x+57&&(B.y-11<p.cy-p.g/2||B.y+11>p.cy+p.g/2)){if(B.sh){B.sh=0;B.inv=1.2;burst(B.x,B.y,'#7cf');tone(300,.2)}else return die()}}
 for(const c of C){const d=Math.hypot(c.x-B.x,c.y-B.y);if(B.mg>0&&d<120){c.x+=(B.x-c.x)*Math.min(1,dt*8);c.y+=(B.y-c.y)*Math.min(1,dt*8)}
  if(d<B.r+12){c.g=1;run+=c.v;burst(c.x,c.y,'#ffc928');tone(880,.06,'square',.12);tone(1320,.1,'square',.1,.05)}}
 for(const u of U)if(Math.hypot(u.x-B.x,u.y-B.y)<B.r+14){u.g=1;if(u.k==='s')B.sh=1;else B.mg=8;tone(700,.1,'triangle',.2);tone(1000,.15,'triangle',.2,.08)}
 P=P.filter(p=>p.x>-80);C=C.filter(c=>!c.g&&c.x>-30);U=U.filter(u=>!u.g&&u.x>-30)}
// desenho
function bird(c,cx,cy,rot,fl,s){const col=IT.c.find(i=>i[0]===S.eq.c)[3];c.save();c.translate(cx,cy);c.scale(s,s);c.rotate(rot);
 c.fillStyle=col;c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=1.5;c.beginPath();c.ellipse(0,0,17,14,0,0,7);c.fill();c.stroke();
 c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.ellipse(2,6,10,6,0,0,7);c.fill();
 c.save();c.translate(-6,2);c.rotate(fl);c.fillStyle='rgba(0,0,0,.2)';c.beginPath();c.ellipse(0,0,10,5,0,0,7);c.fill();c.restore();
 c.fillStyle='#fff';c.beginPath();c.arc(7,-5,6,0,7);c.fill();c.fillStyle='#18324a';c.beginPath();c.arc(9,-5,3,0,7);c.fill();
 c.fillStyle='#ff7a1a';c.beginPath();c.moveTo(14,-1);c.lineTo(25,3);c.lineTo(14,7);c.fill();
 const h=S.eq.h;if(h==='h1'){c.fillStyle='#ff3d8b';c.beginPath();c.moveTo(2,-14);c.lineTo(-6,-21);c.lineTo(-6,-9);c.moveTo(2,-14);c.lineTo(10,-21);c.lineTo(10,-9);c.fill();c.beginPath();c.arc(2,-14,3,0,7);c.fill()}
 if(h==='h2'){c.fillStyle='#222';c.fillRect(-6,-30,16,17);c.fillRect(-10,-15,24,4);c.fillStyle='#e33';c.fillRect(-6,-19,16,3)}
 if(h==='h3'){c.fillStyle='#ffc928';c.beginPath();c.moveTo(-8,-13);c.lineTo(-8,-25);c.lineTo(-3,-19);c.lineTo(2,-27);c.lineTo(7,-19);c.lineTo(12,-25);c.lineTo(12,-13);c.fill();c.stroke()}
 if(h==='h4'){c.fillStyle='#2677d9';c.beginPath();c.arc(2,-12,10,Math.PI,0);c.fill();c.fillRect(2,-13,18,3)}
 if(h==='h5'){c.fillStyle='#4b2a7a';c.beginPath();c.moveTo(-8,-13);c.lineTo(3,-36);c.lineTo(12,-13);c.fill();c.fillRect(-13,-15,30,4)}
 if(h==='h6'){c.fillStyle='#ff5bd1';c.beginPath();c.moveTo(-3,-13);c.lineTo(4,-33);c.lineTo(11,-13);c.fill();c.fillStyle='#ffd23f';c.beginPath();c.arc(4,-33,3,0,7);c.fill()}
 const gg=S.eq.g,kk=IT.k.find(i=>i[0]===S.eq.k);
 if(kk&&kk[3]){c.fillStyle=kk[3];c.fillRect(-9,7,19,5);c.fillRect(-9,10,6,10)}
 if(gg==='g1'){c.strokeStyle='#222';c.lineWidth=2;c.beginPath();c.arc(7,-5,7.5,0,7);c.moveTo(-.5,-5);c.lineTo(-12,-7);c.stroke()}
 if(gg==='g2'){c.fillStyle='#111';c.fillRect(-1,-11,17,10);c.fillRect(-12,-8,12,2)}
 if(gg==='g3'){c.fillStyle='#4a2a10';c.beginPath();c.ellipse(13,2,5,2.5,0,0,7);c.ellipse(19,3,4,2,0,0,7);c.fill()}
 c.restore()}
function bg(){let c=IT.b.find(i=>i[0]===S.eq.b)[3];if(DK&&S.eq.b==='b0')c=['#1a3566','#5f8fcf'];if(DK&&S.eq.b==='b1')c=['#5a2d4a','#c77a6a'];
 const g=x.createLinearGradient(0,0,0,GY);g.addColorStop(0,c[0]);g.addColorStop(1,c[1]);x.fillStyle=g;x.fillRect(0,0,W,H);
 x.fillStyle=DK||S.eq.b==='b2'?'#fff7c8':'#fff3a0';x.beginPath();x.arc(W-75,90,24,0,7);x.fill();
 x.fillStyle=DK?'rgba(255,255,255,.2)':'rgba(255,255,255,.85)';
 const nc=Math.ceil(W/130)+1,pc=nc*130;for(let i=0;i<nc;i++){const cx=((i*130-ox*.25)%pc+pc)%pc-80,cy=130+(i*53%150);x.beginPath();x.ellipse(cx,cy,34,13,0,0,7);x.ellipse(cx+20,cy-8,22,13,0,0,7);x.fill()}
 x.fillStyle=DK?'#1c4a52':'#8fd68a';x.beginPath();x.moveTo(0,GY);for(let i=0;i<=W;i+=10)x.lineTo(i,GY-34-16*Math.sin((i+ox*.4)/45));x.lineTo(W,GY);x.fill();
 x.fillStyle=DK?'#7a5a3a':'#d9b46c';x.fillRect(0,GY,W,H-GY);x.fillStyle=DK?'#2f8f45':'#5cc24c';x.fillRect(0,GY,W,12);
 x.fillStyle='rgba(0,0,0,.12)';const ns=Math.ceil(W/32)+2,ps=ns*32;for(let i=0;i<ns;i++)x.fillRect(((i*32-ox)%ps+ps)%ps-32,GY+12,16,H-GY)}
function pipe(p){const t1=p.cy-p.g/2,b1=p.cy+p.g/2;x.fillStyle=DK?'#6edc5a':'#4cc33f';x.strokeStyle='#1d5a24';x.lineWidth=3;
 for(const r of[[p.x,-5,54,t1-17],[p.x-3,t1-22,60,22],[p.x-3,b1,60,22],[p.x,b1+22,54,GY-b1-22]]){x.fillRect(...r);x.strokeRect(...r)}
 x.fillStyle='rgba(255,255,255,.28)';x.fillRect(p.x+6,0,8,t1-22);x.fillRect(p.x+6,b1+22,8,GY-b1-22)}
function dr(){x.setTransform(K,0,0,K,0,0);bg();P.forEach(pipe);
 for(const c of C){x.save();x.translate(c.x,c.y);x.scale(Math.abs(Math.cos(t*4+c.x*.02))*.8+.2,1);const r=c.v>1?13:10;x.fillStyle=c.v>1?'#ff8a1f':'#ffc928';x.strokeStyle='#8a5200';x.lineWidth=2;x.beginPath();x.arc(0,0,r,0,7);x.fill();x.stroke();x.fillStyle='rgba(255,255,255,.65)';x.fillRect(-2,-r+4,3,r);x.restore()}
 x.font='20px serif';x.textAlign='center';x.textBaseline='middle';for(const u of U){x.fillStyle=u.k==='s'?'#4aa8ff':'#ff5470';x.beginPath();x.arc(u.x,u.y,15,0,7);x.fill();x.fillStyle='#fff';x.fillText(u.k==='s'?'🛡':'🧲',u.x,u.y+1)}
 if(!(B.inv>0&&Math.floor(t*14)%2)){bird(x,B.x,B.y,Math.max(-.5,Math.min(1.2,B.v/500)),Math.sin(B.an)*.8,1);
  if(B.sh){x.strokeStyle='rgba(120,200,255,.95)';x.lineWidth=3;x.beginPath();x.arc(B.x,B.y,23,0,7);x.stroke()}
  if(B.mg>0){x.strokeStyle='rgba(255,84,112,.5)';x.lineWidth=2;x.beginPath();x.arc(B.x,B.y,26+Math.sin(t*8)*3,0,7);x.stroke()}}
 for(const f of fx){x.globalAlpha=Math.min(1,f.l*2);x.fillStyle=f.c;x.beginPath();x.arc(f.x,f.y,3,0,7);x.fill()}x.globalAlpha=1}
function pv(){const c=$('#pv');if(!c)return;const g=c.getContext('2d');g.clearRect(0,0,300,130);bird(g,150,70,0,Math.sin(t*5)*.6,2.2)}
function hu(){if(st!=='play'&&st!=='ready')return;const set=(i,v)=>{const e=$(i);if(e&&e.textContent!==v)e.textContent=v};set('#hs',sc);set('#hc','🪙 '+run);set('#hp',(B.sh?'🛡 Escudo ':'')+(B.mg>0?'🧲 '+Math.ceil(B.mg)+'s':''))}
let lt=0;function loop(ts){const dt=Math.min((ts-lt)/1000||0,.05);lt=ts;up(dt);dr();hu();if(cur==='shop'||cur==='prof')pv();requestAnimationFrame(loop)}
// interface
const hd=n=>`<div class=row><button class="btn g" data-a="go:menu" aria-label="Voltar">←</button><b class=ttl>${n}</b><div class=card>🪙 ${S.coins}</div></div>`;
const V={
menu(){const[,cl]=qd(),nv=(a,i,l)=>`<button class="btn g nv" data-a="go:${a}">${i}<small>${l}</small></button>`;
 return`<div class=scr><div class=row><div class=card>🪙 ${S.coins}</div><div class=row><button class="btn g" data-a=tq aria-label="Alternar tema">${DK?'🌙':'☀️'}</button><button class="btn g" data-a="go:set" aria-label="Configurações">⚙️</button></div></div><h1 class=logo>Flappy<br>Coins</h1><div style="flex:1"></div><div class=chip style="font-size:1.2em">Recorde: ${S.best}</div><div style="text-align:center"><button class="btn big" data-a=ask>JOGAR</button></div><div class=row style="margin-top:1cqw">${nv('shop','🛍️','Lojinha')}${nv('quest','🎯','Missões'+(cl?' ('+cl+')':''))}${nv('rank','🏆','Ranking')}${nv('prof','👤','Perfil')}</div></div>`},
name(){return`<div class=scr style="justify-content:center"><div class=card style="text-align:center"><h2>Qual é o seu nome?</h2><small>Ele aparece no ranking junto com a sua pontuação.</small><div class=col><input class=in id=nm maxlength=14 value="${esc(S.name)}" aria-label="Seu nome" style="text-align:center"><button class=btn data-a=start>COMEÇAR</button><button class="btn g" data-a="go:menu">Voltar</button></div></div></div>`},
game(){return`<div class=scr><div class=row><div class=card id=hc style="pointer-events:none">🪙 0</div><button class="btn g" data-a=pause aria-label="Pausar">⏸</button></div><div class=score id=hs>0</div><div class=chip id=hp></div>${st==='ready'?'<div class=chip id=hint style="margin-top:auto;margin-bottom:12cqw;font-size:1.3em">Toque, clique ou use Espaço</div>':''}</div>`},
pause(){return`<div class=scr style="justify-content:center"><div class=card style="text-align:center"><h2>Pausado</h2><div class=col><button class=btn data-a=resume>CONTINUAR</button><button class="btn g" data-a="go:menu">MENU PRINCIPAL</button></div></div></div>`},
over(){const[n,cl]=qd();return`<div class=scr style="justify-content:center"><div class=card style="text-align:center"><h2>${R.rec?'🎉 Novo recorde!':R.sc>0?'Boa jogada!':'Quase lá!'}</h2><div class=score style="color:var(--tx);text-shadow:none">${R.sc}</div><div class=row><span>Recorde</span><b>${S.best}</b></div><div class=row><span>Moedas na partida</span><b>+${R.run} 🪙</b></div><div class=row><span>Saldo total</span><b>🪙 ${S.coins}</b></div><div class=row><span>Missões</span><b>${n}/${QD.length}${cl?' · '+cl+' a resgatar':''}</b></div><div class=col><button class=btn data-a=ask>JOGAR NOVAMENTE</button><button class="btn g" data-a="go:menu">MENU PRINCIPAL</button></div></div></div>`},
shop(){let h=`<div class=scr>${hd('Lojinha')}<div class=card style="padding:1cqw"><canvas id=pv width=300 height=130 style="width:100%;height:auto"></canvas></div><div class="card body">`;
 for(const k in IT){h+=`<h3>${NM[k]}</h3><div class=grid>`;for(const i of IT[k]){const o=S.own.includes(i[0]),e=S.eq[k]===i[0];h+=`<button class="it${e?' on':''}" data-a="buy:${i[0]}"><span class=sw style="background:${k==='c'||k==='k'?i[3]||'var(--bg)':'var(--bg)'}">${EM[k]?EM[k][+i[0][1]]:''}</span>${i[1]}<small>${e?'Equipado':o?'Equipar':'🪙 '+i[2]}</small></button>`}h+='</div>'}
 return h+'<small>Itens são só visuais e não dão vantagem no jogo.</small></div></div>'},
quest(){const q=Q();return`<div class=scr>${hd('Missões diárias')}<div class="card body">`+QD.map(d=>{const p=Math.min(q.p[d[2]]||0,d[3]),ok=p>=d[3];return`<div class=qs><div class=row><b>${d[1]}</b><span>🪙 ${d[4]}</span></div><div class=bar><i style="width:${p/d[3]*100}%"></i></div><div class=row><small>${p}/${d[3]}</small>${q.cl[d[0]]?'<small>Resgatada ✓</small>':ok?`<button class="btn s" data-a="claim:${d[0]}">Resgatar</button>`:'<small>Em andamento</small>'}</div></div>`}).join('')+'<small>Renovam à meia-noite, no horário do seu aparelho.</small></div></div>'},
rank(){const m=RK.m,L=S.sc.filter(e=>!RK.w||Date.now()-e.t<6048e5).sort((a,b)=>b[m]-a[m]).slice(0,10),tb=(a,l,on)=>`<button class="btn ${on?'s':'g'}" data-a="rk:${a}">${l}</button>`;
 return`<div class=scr>${hd('Ranking')}<div class=row>${tb('w0','Geral',!RK.w)}${tb('w1','Semanal',RK.w)}${tb('ms','Pontos',m==='s')}${tb('mc','Moedas',m==='c')}</div><div class="card body"><b>${m==='s'?'Vence quem faz mais pontos':'Vence quem coleta mais moedas'} em uma única partida.</b><small>${m==='s'?'1 ponto por cano atravessado.':'Conta só as moedas pegas na partida, não o saldo da loja.'} ${RK.w?'Semanal: só partidas dos últimos 7 dias.':'Geral: todas as partidas salvas.'} Em caso de empate, vale o resultado mais antigo. Ranking local: só resultados deste aparelho; o global precisa de servidor e ainda não existe.</small>`+
 (L.length?L.map((e,i)=>`<div class=rw><b>${['🥇','🥈','🥉'][i]||i+1}</b><i class=dot style="background:${IT.c.find(c=>c[0]===e.k)[3]}"></i><span>${esc(e.n||S.name)}</span><b>${e[m]}</b><small>${m==='s'?'🪙'+e.c:'⭐'+e.s}</small></div>`).join(''):'<p>Jogue uma partida para entrar no ranking.</p>')+`<button class="btn${RK.c?'':' g'}" data-a=clr>${RK.c?'Tem certeza? Toque de novo':'Limpar ranking'}</button></div></div>`},
prof(){const r=[['Recorde',S.best],['Mais moedas em uma partida',S.bestC],['Saldo atual','🪙 '+S.coins],['Moedas coletadas no total',S.tot],['Partidas jogadas',S.games],['Canos atravessados',S.pipes],['Missões concluídas',S.done],['Itens desbloqueados',S.own.length],['Melhor colocação','só com ranking global']];
 return`<div class=scr>${hd('Perfil')}<div class="card body"><canvas id=pv width=300 height=130 style="width:60%;align-self:center"></canvas><input class=in data-i=name maxlength=14 value="${esc(S.name)}" aria-label="Nome de exibição">`+r.map(a=>`<div class=row><span>${a[0]}</span><b>${a[1]}</b></div>`).join('')+'</div></div>'},
set(){const sl=(k,l)=>`<b>${l}</b><input type=range data-i=${k} min=0 max=1 step=.05 value=${S[k]} aria-label="${l}">`;
 return`<div class=scr>${hd('Configurações')}<div class="card body"><b>Tema</b><div class=row>${[['light','☀️ Claro'],['dark','🌙 Escuro'],['auto','Auto']].map(a=>`<button class="btn ${S.th===a[0]?'s':'g'}" data-a="th:${a[0]}">${a[1]}</button>`).join('')}</div>${sl('mu','Música')}${sl('sf','Efeitos sonoros')}<b>Nome de exibição</b><input class=in data-i=name maxlength=14 value="${esc(S.name)}"><h3>Como jogar</h3><small>Toque, clique ou Espaço para voar. P ou Esc pausa. Passe pelos canos, pegue moedas, 🛡 aguenta uma batida e 🧲 atrai moedas por 8 s.</small><h3>Privacidade</h3><small>O progresso fica salvo só neste aparelho. Nenhum dado é enviado.</small><h3>Créditos</h3><small>Arte e sons criados por código, originais.</small></div></div>`}};
function show(n){cur=n;const b=$('.body'),s=b?b.scrollTop:0;$('#ui').innerHTML=V[n]();const nb=$('.body');if(nb&&n===cur)nb.scrollTop=s;pv()}
const toast=m=>{const e=$('#toast');e.textContent=m;e.style.opacity=1;clearTimeout(toast.t);toast.t=setTimeout(()=>e.style.opacity=0,1800)};
const A={
go(n){if(n==='menu'){st='menu';reset()}show(n)},
play(){au();reset();st='ready';show('game');tone(523,.1);tone(784,.15,'square',.18,.1)},
pause(){if(st==='play'){st='pause';show('pause')}},resume(){if(st==='pause'){st='play';show('game')}},
tq(){S.th=DK?'light':'dark';save();applyTh();show(cur)},th(v){S.th=v;save();applyTh();show(cur)},
rk(v){if(v[0]==='w')RK.w=+v[1];else RK.m=v[1];show('rank')},
ask(){au();show('name');setTimeout(()=>{const e=$('#nm');e&&e.focus()},60)},start(){const v=($('#nm').value||'').trim().slice(0,14);if(!v)return toast('Digite seu nome');S.name=v;save();A.play()},
clr(){if(!RK.c){RK.c=1;show('rank');setTimeout(()=>{RK.c=0;cur==='rank'&&show('rank')},4000);return}RK.c=0;S.sc=[];save();toast('Ranking limpo');show('rank')},
buy(id){const k=id[0],it=IT[k].find(i=>i[0]===id);if(!S.own.includes(id)){if(S.coins<it[2])return toast('Faltam '+(it[2]-S.coins)+' moedas');S.coins-=it[2];S.own.push(id);tone(880,.1);tone(1175,.15,'square',.18,.1)}
 S.eq[k]='hgk'.includes(k)&&S.eq[k]===id?k+'0':id;save();show('shop')},
claim(id){const q=Q(),d=QD.find(i=>i[0]===id);if(!d||q.cl[id]||(q.p[d[2]]||0)<d[3])return;q.cl[id]=1;S.coins+=d[4];S.done++;save();tone(784,.1);tone(1047,.2,'square',.18,.1);show('quest')}};
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;au();const[a,v]=b.dataset.a.split(':');A[a](v);if(document.activeElement&&document.activeElement.tagName==='BUTTON')document.activeElement.blur()});
document.addEventListener('input',e=>{const i=e.target.dataset.i;if(!i)return;S[i]=i==='name'?e.target.value.slice(0,14):+e.target.value;save();au()});
cv.addEventListener('pointerdown',e=>{e.preventDefault();flap()});
addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'){if(e.target.id==='nm'&&e.key==='Enter')A.start();return}if(e.code==='Space'){e.preventDefault();if(!e.repeat)flap()}if(e.code==='KeyP'||e.code==='Escape')st==='pause'?A.resume():A.pause()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)A.pause()});
function resize(){const a=innerWidth/innerHeight;W=Math.round(Math.max(300,Math.min(1400,H*a)));const s=Math.min(innerWidth/W,innerHeight/H);K=Math.min(3,Math.max(2,Math.ceil(s*(devicePixelRatio||1))));cv.width=W*K;cv.height=H*K;cv.style.width=W*s+'px';cv.style.height=H*s+'px'}
addEventListener('resize',resize);resize();
applyTh();Q();reset();show('menu');requestAnimationFrame(loop);