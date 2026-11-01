(function(){'use strict';
var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
var root=document.documentElement,calm=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
var clamp=function(v,a,b){return Math.min(b,Math.max(a,v))};
function ready(fn){(function w(){root.classList.contains('intro-on')?setTimeout(w,100):fn()})()}

/* ── spring engine (tension/friction, mass 1, 1ms substeps) ── */
var S=[],raf=0;
function spring(o){o.x=0;o.v=0;o.k=o.k||170;o.c=o.c||24;o.t=performance.now()+(o.delay||0);S.push(o);if(!raf)raf=requestAnimationFrame(tick,last=performance.now())}
var last=0;
function tick(n){var dt=Math.min(64,n-last);last=n;
 for(var i=S.length;i--;){var s=S[i];if(n<s.t)continue;
  for(var j=0;j<dt;j++){s.v+=(s.k*(1-s.x)-s.c*s.v)*.001;s.x+=s.v*.001}
  s.fn(s.x);
  if(Math.abs(s.v)<.01&&Math.abs(1-s.x)<.001){s.fn(1);S.splice(i,1)}}
 raf=S.length?requestAnimationFrame(tick):0}
function inView(el,fn,th){var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){io.disconnect();ready(fn)}},{threshold:th||.2,rootMargin:'0px 0px -8% 0px'});io.observe(el)}

/* ── word-by-word text reveals ── */
function split(el){var out=[];el.setAttribute('aria-label',el.textContent.replace(/\s+/g,' ').trim());
 [].slice.call(el.childNodes).forEach(function(n){
  if(n.nodeType===3){var f=document.createDocumentFragment();
   n.textContent.split(/(\s+)/).forEach(function(w){if(!w)return;if(!w.trim()){f.appendChild(document.createTextNode(w));return}
    var s=document.createElement('span');s.className='wd';s.setAttribute('aria-hidden','true');s.textContent=w;f.appendChild(s);out.push(s)});
   el.replaceChild(f,n)}
  else if(n.nodeName!=='BR'){n.classList.add('wd');n.setAttribute('aria-hidden','true');out.push(n)}});
 return out}
if(!calm){
 root.classList.add('lv');
 $$('.hero h1,.display,.about .big').forEach(function(el){
  var u=split(el);u.forEach(function(s){s.style.opacity=0});
  inView(el,function(){u.forEach(function(s,i){spring({delay:i*(el.tagName==='H1'?130:90),k:90,c:26,fn:function(x){s.style.opacity=clamp(x,0,1);s.style.transform='translateY('+(1-x)*.35+'em)'}})})},.3)});
 var blocks='.kicker,.hero .lead,.hero .actions,.nums,.head p,.eyebrow,.tile,.steps li,.about-copy p:not(.big),.contact-card p,.contact-card .cta';
 $$(blocks).forEach(function(el,i){el.classList.add('pre');
  inView(el,function(){var d=(i%6)*70;spring({delay:d,k:150,c:24,fn:function(x){el.style.opacity=clamp(x,0,1);el.style.transform='translateY('+(1-x)*22+'px)';if(x===1){el.style.transform='';el.classList.remove('pre')}}})},.15)});
}

/* ── counters ── */
$$('.nums dd').forEach(function(el){var v=parseInt(el.textContent,10);if(!v||calm)return;el.textContent='0';
 inView(el,function(){spring({k:60,c:14,fn:function(x){el.textContent=Math.round(v*clamp(x,0,1.08))>v?v:Math.round(v*clamp(x,0,1))}})},.4)});

/* ── scroll progress bar ── */
var bar=document.createElement('div');bar.id='bar';document.body.appendChild(bar);
addEventListener('scroll',function(){var h=root.scrollHeight-innerHeight;bar.style.transform='scaleX('+(h>0?scrollY/h:0)+')'},{passive:true});

if(fine&&!calm){
 /* ── tiles: spotlight + tilt ── */
 $$('.tile').forEach(function(t){
  t.addEventListener('pointermove',function(e){var r=t.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
   t.style.setProperty('--mx',x*100+'%');t.style.setProperty('--my',y*100+'%');
   t.style.transform='translateY(-4px)'});
  t.addEventListener('pointerleave',function(){t.style.transform=''})});
 /* ── magnetic buttons ── */
 $$('.cta').forEach(function(b){
  b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+(e.clientX-r.left-r.width/2)*.12+'px,'+(e.clientY-r.top-r.height/2)*.3+'px)'});
  b.addEventListener('pointerleave',function(){b.style.transform=''})});
}

/* ── the face: depth parallax + cursor-drawn contour reveal (WebGL) ── */
var fig=$('.portrait');if(fig)fig.style.position='relative';
if(fig&&window.REA_IMG&&!calm)(function(){
 var img=$('img',fig),wrap=document.createElement('div');wrap.className='face';img.parentNode.insertBefore(wrap,img);wrap.appendChild(img);
 var cv=document.createElement('canvas');cv.setAttribute('aria-hidden','true');wrap.appendChild(cv);
 var gl=cv.getContext('webgl',{antialias:false});if(!gl)return;
 var vs='attribute vec2 a;varying vec2 u;void main(){u=a*.5+.5;gl_Position=vec4(a,0.,1.);}';
 var fs=[
 'precision highp float;varying vec2 u;uniform sampler2D T;uniform vec2 M,P[20];uniform float t,pace,burn,A;',
 'float fld(vec2 p,float t){float f=sin(p.x+t*.6)*.5+sin(p.y*.85-t*.45)*.45+sin((p.x+p.y)*.65+t*.35)*.35+sin((p.x-p.y)*.95-t*.55)*.25;return f*.5+.5;}',
 'float seg(vec2 p,vec2 a,vec2 b){vec2 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/max(dot(ba,ba),1e-6),0.,1.);return length(pa-ba*h);}',
 'void main(){vec2 uv=u;vec3 bgc=vec3(.902,.89,.867),ground=vec3(.984,.98,.973),ac=vec3(.18,.78,.7);',
 ' vec2 fl=vec2(uv.x,1.-uv.y);vec3 c0=texture2D(T,fl).rgb;float m=smoothstep(.06,.15,distance(c0,bgc));',
 ' float hd=exp(-dot((uv-vec2(.5,.62))*vec2(2.6,2.),(uv-vec2(.5,.62))*vec2(2.6,2.)));float d=m*(.35+.65*hd);',
 ' vec2 s=fl+vec2(M.x,-M.y)*(d-.35)*.035;vec3 col=texture2D(T,s).rgb;float sm=smoothstep(.04,.11,distance(col,bgc));',
 ' float L=exp(-pow(distance(uv,M*.5+.5)*2.2,2.));col*=1.+(L-.3)*.24*sm;',
 ' vec2 p=(uv*2.-1.)*vec2(A,1.)*3.8;float T2=t*1.66;vec2 q=p;q.x+=sin(p.y*.8+T2*.7)*.37;q.y+=cos(p.x*.7-T2*.6)*.37;',
 ' float f=fld(q,T2)*2.5;float ln=1.-smoothstep(0.,.07,abs(fract(f)-.5));',
 ' vec3 ph=mix(mix(ground,vec3(.9,.92,.9),ln*.85),col,sm);',
 ' float lum=dot(col,vec3(.3,.59,.11));vec3 du=mix(vec3(.03,.07,.08),ac,smoothstep(.12,.95,lum));',
 ' du+=ac*.45*(1.-smoothstep(0.,.06,abs(fract(lum*9.)-.5)));',
 ' vec3 dk=mix(mix(vec3(.04,.09,.1),ac*.4,ln*.8),du,sm);',
 ' vec2 asp=vec2(A,1.);vec2 pt=uv*asp+(vec2(fld(uv*7.+t*.3,1.),fld(uv*7.-t*.4+3.,2.))-.5)*.09;',
 ' float tr=0.;for(int i=0;i<19;i++){float w=pow(1.-float(i)/19.,1.7);float r=.2*w*(.35+.65*pace);tr=max(tr,w*smoothstep(r,r*.35,seg(pt,P[i]*asp,P[i+1]*asp)));}',
 ' float rv=smoothstep(.07,.09,tr)*smoothstep(.06,.21,pace);',
 ' float bf=burn*1.3-.1;float at=mix(1.-uv.y,fld(uv*5.,0.),.35);float it=smoothstep(bf-.03,bf+.03,at);',
 ' vec3 o=mix(ph,dk,max(rv,it));o+=ac*2.*it*(1.-it);gl_FragColor=vec4(o,1.);}'].join('\n');
 function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS)){console.warn(gl.getShaderInfoLog(o));return null}return o}
 var v=sh(gl.VERTEX_SHADER,vs),f=sh(gl.FRAGMENT_SHADER,fs);if(!v||!f)return;
 var pg=gl.createProgram();gl.attachShader(pg,v);gl.attachShader(pg,f);gl.linkProgram(pg);if(!gl.getProgramParameter(pg,gl.LINK_STATUS))return;gl.useProgram(pg);
 var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 var al=gl.getAttribLocation(pg,'a');gl.enableVertexAttribArray(al);gl.vertexAttribPointer(al,2,gl.FLOAT,false,0,0);
 var U=function(n){return gl.getUniformLocation(pg,n)};var uM=U('M'),uP=U('P'),ut=U('t'),up=U('pace'),ub=U('burn'),uA=U('A');
 var tex=gl.createTexture(),im=new Image();
 im.onload=function(){gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,im);
  [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER].forEach(function(k){gl.texParameteri(gl.TEXTURE_2D,k,gl.LINEAR)});
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  wrap.classList.add('gl');size();start()};
 im.src=window.REA_IMG;
 var dpr=Math.min(devicePixelRatio||1,1.5);
 function size(){var w=wrap.clientWidth,h=wrap.clientHeight;cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);gl.viewport(0,0,cv.width,cv.height);gl.uniform1f(uA,w/h)}
 addEventListener('resize',function(){if(wrap.classList.contains('gl'))size()});
 /* pointer state */
 var tgt={x:.5,y:.5},sm={x:.5,y:.5},prev={x:.5,y:.5},pace=0,lastMove=-1e5,trail=[],i;
 for(i=0;i<20;i++)trail.push([.5,.5]);
 var big=new Float32Array(40);
 addEventListener('pointermove',function(e){var r=wrap.getBoundingClientRect();tgt.x=(e.clientX-r.left)/r.width;tgt.y=1-(e.clientY-r.top)/r.height;lastMove=performance.now()},{passive:true});
 // floating chips ride the same depth
 var chips=[['Flutter',-6,14,1.3],['Python',70,4,.9],['Computer vision',58,80,1.6],['Cybersecurity',-8,66,.7]].map(function(c){var e=document.createElement('span');e.className='chip';e.textContent=c[0];e.style.left=c[1]+'%';e.style.top=c[2]+'%';fig.appendChild(e);return{e:e,d:c[3],p:c[2]}});
 var vis=true,t0=0,burnStart=-1,clock=performance.now();
 new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(fig);
 function start(){requestAnimationFrame(frame)}
 function frame(now){requestAnimationFrame(frame);if(!vis||document.hidden)return;
  if(burnStart<0&&!root.classList.contains('intro-on'))burnStart=now+350;
  var burn=burnStart<0?0:clamp((now-burnStart)/3000,0,1);burn=burn*burn*(3-2*burn);
  var idle=now-lastMove>3500||!fine;
  if(idle){var s=now/1000;tgt.x=.5+.34*Math.sin(s*.8);tgt.y=.52+.26*Math.sin(s*1.25+1)}
  sm.x+=(tgt.x-sm.x)*.17;sm.y+=(tgt.y-sm.y)*.17;
  var step=Math.hypot(sm.x-prev.x,sm.y-prev.y)/.012;prev.x=sm.x;prev.y=sm.y;
  var tp=burn<1?0:Math.min(1,step);pace+=(tp-pace)*(tp>pace?.09:.205);
  trail.pop();trail.unshift([sm.x,sm.y]);
  for(i=0;i<20;i++){big[i*2]=trail[i][0];big[i*2+1]=trail[i][1]}
  var mx=clamp(sm.x*2-1,-1.3,1.3),my=clamp(sm.y*2-1,-1.3,1.3);
  gl.uniform2f(uM,mx,my);gl.uniform2fv(uP,big);gl.uniform1f(ut,(now-clock)/1000);gl.uniform1f(up,pace);gl.uniform1f(ub,burn);
  gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  chips.forEach(function(c){c.e.style.transform='translate('+(-mx*10*c.d)+'px,'+(my*8*c.d+Math.sin(now/900+c.p)*4)+'px)'})}
})();
})();
