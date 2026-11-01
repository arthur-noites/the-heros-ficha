const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const d=n=>1+Math.floor(Math.random()*n);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const A=['for','agi','int','von','pre'];
const S=[['Acrobacia','agi'],['Adestramento','pre'],['Arremessar','agi'],['Artes','pre'],['Atletismo','agi'],['Atuação','pre'],['Atualidades','int'],['Ciência','int'],['Crime','agi'],['Diplomacia','pre'],['Disfarce','pre'],['Enganação','pre'],['Furtividade','agi'],['Iniciativa','agi'],['Intimidação','pre'],['Intuição','pre'],['Investigação','int'],['Luta','for'],['Mecânica','int'],['Medicina','int'],['Ocultismo','pre'],['Percepção','pre'],['Pilotagem','agi'],['Pontaria','agi'],['Profissão','int'],['Proteção','von'],['Reflexo','agi'],['Resistência','von'],['Saltar','agi'],['Sobrevivência','int'],['Tática','int'],['Tecnologia','int'],['Vontade','pre']];
const C={
'Guardião':{p:'Proteção, Resistência, Luta',h:'Instinto Heroico: rola 1d100 se a vida chegar a 1 (1x por sessão).'},
'Catalisador':{p:'Reflexo, Vontade, Intuição',h:'Explosão Escarlate: ataque massivo em área, dano variável (1x por sessão).'},
'Espectro':{p:'Furtividade, Crime, Percepção',h:'Sombra Viva: desaparece por 1 turno e reaparece em outra posição, 1d20 de DES (1x por sessão).'},
'Arquivista':{p:'Furtividade, Crime, Percepção',h:'Protocolo Babel: identifica um ponto fraco nos inimigos (1x por sessão).'},
'Anômalo':{p:'Resistência, Vontade, Ocultismo',h:'Ruína Hex: onda de energia que causa dano em todos os lados, inclusive no usuário (1x por sessão).'}};
const O={'Militar':'Tática,Resistência','Cientista':'Ciência,Tecnologia','Cidadão Comum':'Vontade,Diplomacia','Criminoso / Fora da Lei':'Crime,Furtividade','Estudante do Arkhé':'ENR,Intuição','Agente da AURA':'Investigação,Intimidação','Místico / Espiritualista':'Ocultismo','Sobrevivente / Vítima da Explosão':'Resistência,Intuição','Mutante Espontâneo':'Resistência,Medicina','Atleta / Ídolo Caído':'Atletismo,Atuação','Mercenário / Caçador de Recompensas':'Pontaria,Tática','Inventor Independente':'Mecânica,Tecnologia','Relíquia Viva':'Vontade,Ocultismo','Filho da Helios':'Ciência,Profissão','Experimento da Helios':'Resistência,Intuição','Prodígio da AURA':'Tática,Diplomacia','Descendente dos Primeiros':'Intuição,Vontade','Andarilho':'Sobrevivência,Percepção'};
const nova=()=>({nome:'',idade:'',raca:'Desperto',classe:'Guardião',origem:'Cidadão Comum',exp:0,cr:0,sor:0,defx:0,vc:3,for:0,agi:0,int:0,von:0,pre:0,sanB:0,enrB:0,pv:0,san:0,enr:0,p:{},armas:[],pod:[],inv:'',hist:''});
let db,cur=0,c;
try{const s=JSON.parse(localStorage.getItem('heros'));db=s.db;cur=s.cur}catch{}
if(!db||!db.length){db=[nova()];cur=0}
cur=Math.min(cur,db.length-1);
const save=()=>{try{localStorage.setItem('heros',JSON.stringify({db,cur}))}catch{}};
const ob=()=>(O[c.origem]||'').split(',');
const mx=()=>({pv:(+c.for||0)+(+c.agi||0)+(+c.von||0)+(c.raca=='Comum'?100:80),san:Math.max(0,(+c.sanB||0)-(c.raca=='Comum'?0:20)),enr:c.raca=='Comum'?0:(+c.enrB||0)+(ob().includes('ENR')?2:0)});
function log(m){const l=$('#log');l.insertAdjacentHTML('afterbegin','<div>'+m+'</div>');while(l.children.length>30)l.lastChild.remove()}
function go(e,l){const det=[];const ex=String(e||'').replace(/\s/g,'').replace(/(\d*)d(\d+)/gi,(m,n,f)=>{const a=[];for(let i=0;i<(+n||1);i++)a.push(d(+f));det.push(a);return a.reduce((x,y)=>x+y,0)});
 let t;try{if(!/^[\d+\-*()]+$/.test(ex))throw 0;t=Function('return '+ex)()}catch{log((l||'Rolagem')+': expressão inválida');return}
 const fl=/^1d20/i.test(String(e).replace(/\s/g,''))?(det[0][0]==20?' ⭐ Crítico':det[0][0]==1?' 💀 Falha crítica':''):'';
 log(`<small>${esc(l||'Rolagem')}</small> ${esc(e)} → [${det.map(x=>x.join('+')).join(' | ')}] = <b>${t}</b>${fl}`)}
function setv(k,v){c[k]=v;const el=$(`[data-k="${k}"]`);if(el)el.value=v}
function rr(k){let v;if(A.includes(k))v=d(6)+d(6)+d(6);else if(k=='sanB')v=(d(6)+d(6)+d(6))*5;else{v=d(100);if(k=='enrB'&&v<=10)v+=d(20);if(k=='sor'&&c.raca=='Comum')v=Math.max(0,v-20)}
 setv(k,v);log(`${k.replace('B',' base').toUpperCase()} rolado: <b>${v}</b>`);calc();save()}
function calc(){const m=mx(),b=ob(),com=c.raca=='Comum';
 ['pv','san','enr'].forEach(k=>{$('#m-'+k).textContent=m[k];$('#f-'+k).style.width=Math.min(100,m[k]?(+c[k]||0)/m[k]*100:0)+'%'});
 $$('.enrb').forEach(x=>x.hidden=com);
 $('#des').textContent=Math.ceil((+c.agi||0)/2);
 let used=0;
 S.forEach(([n])=>{const p=+c.p[n]||0,o=b.includes(n)?2:0;used+=p;
  $(`[data-o="${n}"]`).textContent=o?'+'+o:'';$(`[data-t="${n}"]`).textContent=p+o;
  $(`[data-row="${n}"]`).classList.toggle('req',C[c.classe].p.includes(n))});
 const I=+c.int||0,pp=I*(I<=6?5:I<=9?6:I<=12?7:I<=15?8:I<=17?9:10);
 $('#pp').textContent=used+' / '+pp;$('#pp').className=used>pp?'bad':'';
 $('#def').textContent=(+$('[data-t="Proteção"]').textContent)+(+c.defx||0);
 $('#hab').innerHTML=`<b>${c.classe}</b> – perícias obrigatórias: ${C[c.classe].p}.<br>${C[c.classe].h}`}
function lst(id,key,cols,ico){$(id).innerHTML='<table><tr>'+cols.map(x=>`<th>${x[1]}</th>`).join('')+'<th></th></tr>'+c[key].map((r,i)=>'<tr>'+cols.map(x=>`<td><input data-l="${key}" data-i="${i}" data-f="${x[0]}" value="${esc(r[x[0]]||'')}"></td>`).join('')+`<td class="ac"><button data-a="${key}" data-i="${i}" title="Usar">${ico}</button><button data-x="${key}" data-i="${i}" title="Remover">✕</button></td></tr>`).join('')+'</table>'}
function lists(){lst('#armas','armas',[['n','Nome'],['cl','Classe'],['des','DES'],['dado','Dado'],['desc','Descrição']],'🎲');
 lst('#pod','pod',[['n','Poder e nível'],['dado','Dado'],['tipo','Tipo'],['alc','Alcance'],['enr','ENR'],['desc','Descrição']],'⚡')}
function load(){c=db[cur]=Object.assign(nova(),db[cur]);
 $('#sel').innerHTML=db.map((x,i)=>`<option value="${i}"${i==cur?' selected':''}>${esc(x.nome||'Sem nome')}</option>`).join('');
 $$('[data-k]').forEach(el=>el.value=c[el.dataset.k]);
 $$('[data-p]').forEach(el=>el.value=c.p[el.dataset.p]||'');
 lists();calc();save()}
/* montagem inicial */
$('#classe').innerHTML=Object.keys(C).map(x=>`<option>${x}</option>`).join('');
$('#origem').innerHTML=Object.keys(O).map(x=>`<option>${x}</option>`).join('');
$('#attrs').innerHTML=[...A.map(k=>[k,k.toUpperCase()]),['sanB','SAN base'],['enrB','ENR base']].map(([k,l])=>`<div class="attr${k=='enrB'?' enrb':''}"><label>${l}<input type="number" data-k="${k}"></label><button data-r="${k}">${k=='sanB'?'3d6×5':k=='enrB'?'1d100':'3d6'}</button></div>`).join('');
$('#cond').innerHTML=[['pv','PV','red'],['san','SAN','blue'],['enr','ENR','gold enrb']].map(([k,l,col])=>`<div class="cd ${col}"><b>${l}</b><div class="bar"><i id="f-${k}"></i></div><div class="row"><button data-b="${k}:-5">−5</button><button data-b="${k}:-1">−1</button><input type="number" data-k="${k}"><span>/ <b id="m-${k}"></b></span><button data-b="${k}:1">+1</button><button data-b="${k}:5">+5</button></div></div>`).join('');
$('#skills tbody').innerHTML=S.map(([n,a])=>`<tr data-row="${n}"><td>${n} <small>(${a.toUpperCase()})</small></td><td><input type="number" min="0" data-p="${n}"></td><td data-o="${n}"></td><td class="tt" data-t="${n}"></td><td><button data-s="${n}" title="Rolar 1d20 + ${a.toUpperCase()} + perícia">🎲</button></td></tr>`).join('');
/* eventos */
document.addEventListener('input',e=>{const t=e.target,D=t.dataset;
 if(D.k){c[D.k]=t.value;if(D.k=='nome')$('#sel').selectedOptions[0].textContent=t.value||'Sem nome'}
 else if(D.p)c.p[D.p]=t.value;
 else if(D.l)c[D.l][D.i][D.f]=t.value;
 else if(t.id=='q'){$$('[data-row]').forEach(r=>r.hidden=!r.dataset.row.toLowerCase().includes(t.value.toLowerCase()));return}
 else return;
 calc();save()});
document.addEventListener('keydown',e=>{if(e.key=='Enter'&&e.target.id=='dx')go($('#dx').value,'Rolagem')});
$('#sel').addEventListener('change',e=>{cur=+e.target.value;load()});
$('#file').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{db.push(JSON.parse(r.result));cur=db.length-1;load()}catch{alert('Arquivo inválido.')}};r.readAsText(f);e.target.value=''});
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const D=t.dataset;
 if(t.id=='rx')go($('#dx').value,'Rolagem');
 else if(D.r)rr(D.r);
 else if('all' in D)A.forEach(rr);
 else if(D.s){const s=S.find(x=>x[0]==D.s);go(`1d20+${+c[s[1]]||0}+${$(`[data-t="${s[0]}"]`).textContent}`,s[0])}
 else if(D.b){const[k,n]=D.b.split(':');setv(k,Math.max(0,(+c[k]||0)+ +n));calc();save()}
 else if('full' in D){const m=mx();['pv','san','enr'].forEach(k=>setv(k,m[k]));calc();save()}
 else if('rest' in D){const m=mx();setv('pv',Math.min(m.pv,(+c.pv||0)+Math.round(m.pv*.1)));setv('san',Math.min(m.san,(+c.san||0)+5));if(m.enr)setv('enr',Math.min(m.enr,(+c.enr||0)+5));log('Descanso de 8h: +10% PV, +5 ENR, +5 SAN');calc();save()}
 else if(D.add){c[D.add].push({});lists();save()}
 else if(D.x){c[D.x].splice(D.i,1);lists();save()}
 else if(D.a){const r=c[D.a][D.i];if(D.a=='pod'&&+r.enr){setv('enr',Math.max(0,(+c.enr||0)-r.enr));calc();save()}go(r.dado,r.n||'Rolagem')}
 else if('new' in D){db.push(nova());cur=db.length-1;load()}
 else if('del' in D){if(!confirm('Excluir esta ficha?'))return;db.splice(cur,1);if(!db.length)db.push(nova());cur=Math.max(0,cur-1);load()}
 else if('exp' in D){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(c,null,1)],{type:'application/json'}));a.download=(c.nome||'ficha')+'.json';a.click()}
 else if('imp' in D)$('#file').click()});
load();
