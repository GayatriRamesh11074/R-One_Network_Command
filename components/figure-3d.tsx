"use client";
import {useEffect,useRef,useState} from 'react';
import type * as Three from 'three';
import type {SVGRenderer} from 'three/addons/renderers/SVGRenderer.js';

type Props={kind:'charger'|'buddy';active?:boolean;scanning?:boolean;celebrate?:boolean;className?:string};
/** Live, lit geometry. No image planes or mascot photographs. */
export function Figure3D({kind,active=false,scanning=false,celebrate=false,className=''}:Props){
 const host=useRef<HTMLDivElement>(null),state=useRef({active,scanning,celebrate});
 const [failed,setFailed]=useState(false);
 state.current={active,scanning,celebrate};
 useEffect(()=>{
  let disposed=false,cleanup=()=>{};
  async function start(){
   const T=await import('three');
   const {RoundedBoxGeometry}=await import('three/addons/geometries/RoundedBoxGeometry.js');
   if(disposed||!host.current)return;
   const el=host.current;
   let renderer:Three.WebGLRenderer|SVGRenderer,gpu=true;
   try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));renderer.setClearColor(0,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.5;}
   catch{const {SVGRenderer}=await import('three/addons/renderers/SVGRenderer.js');if(disposed)return;renderer=new SVGRenderer();renderer.setClearColor(new T.Color(0xffffff),0);renderer.setQuality('low');gpu=false;}
   el.appendChild(renderer.domElement);
   renderer.domElement.setAttribute('aria-hidden','true');
   const scene=new T.Scene(),camera=new T.PerspectiveCamera(32,1,.1,50);
   camera.position.set(kind==='charger'?4.2:2,3.2,8.5);camera.lookAt(0,1.7,0);
   scene.add(new T.HemisphereLight(0xe3f3ff,0x665477,gpu?3:1));
   if(!gpu)scene.add(new T.AmbientLight(0xffffff,.6));
   const key=new T.DirectionalLight(0xffffff,gpu?4:.8);key.position.set(-3,6,5);scene.add(key);
   const rim=new T.DirectionalLight(0xff754f,gpu?2:.25);rim.position.set(4,3,-3);scene.add(rim);
   const root=new T.Group();scene.add(root);
   const mat=(c:number,metal=.25,rough=.35)=>gpu?new T.MeshStandardMaterial({color:c,metalness:metal,roughness:rough}):new T.MeshLambertMaterial({color:c});
   const white=mat(0xf8f7f4,.3,.23),black=mat(0x141723,.45,.2),orange=mat(0xff4d25,.5,.23),grey=mat(0x565c59,.55,.4),dark=mat(0x2e3433,.5,.5);
   const glow=new T.MeshLambertMaterial({color:kind==='charger'?0x39ded9:0xff6e36,emissive:kind==='charger'?0x20c8c4:0xff4b12,emissiveIntensity:1.8});
   const mesh=(parent:Three.Object3D,g:Three.BufferGeometry,m:Three.Material,x=0,y=0,z=0)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);parent.add(o);return o};
   const box=(p:Three.Object3D,w:number,h:number,d:number,m:Three.Material,x:number,y:number,z:number,r=.08)=>mesh(p,new RoundedBoxGeometry(w,h,d,gpu?3:1,r),m,x,y,z);
   const sphere=(p:Three.Object3D,r:number,m:Three.Material,x:number,y:number,z:number,sx=1,sy=1,sz=1)=>{const o=mesh(p,new T.SphereGeometry(r,gpu?24:12,gpu?16:8),m,x,y,z);o.scale.set(sx,sy,sz);return o};
   const tube=(p:Three.Object3D,pts:number[][],r:number,m:Three.Material)=>mesh(p,new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(a=>new T.Vector3(...a as [number,number,number]))),gpu?40:16,r,gpu?8:4,false),m);
   const platform=mesh(scene,new T.CylinderGeometry(1.45,1.55,.12,48),mat(0xdce2e8,.2,.6),0,-.08,0);
   const halo=mesh(scene,new T.TorusGeometry(1.35,.025,8,64),glow,0,.01,0);halo.rotation.x=Math.PI/2;
   let head:Three.Group|undefined,arm:Three.Group|undefined,eyes:Three.Group|undefined,scan:Three.Mesh|undefined;
   if(kind==='charger'){
    // Reference-inspired cabinet: grey housing, cyan rim, louvres and twin overhead cables.
    box(root,1.55,3.42,1.05,grey,0,1.72,0,.15);
    box(root,1.36,3.21,.07,glow,0,1.75,.55,.13);
    box(root,1.3,3.15,.09,dark,0,1.75,.60,.12);
    box(root,1.52,.14,1.1,grey,0,3.51,-.04,.025);
    box(root,1.02,.50,.08,black,0,2.94,.67,.04);
    box(root,.76,.035,.025,glow,0,2.92,.724,.01);
    for(let n=0;n<19;n++)box(root,1.12,.035,.12,grey,0,.27+n*.125,.66,.009);
    for(const side of [-1,1]){
     box(root,.065,.16,1.7,grey,side*.62,3.51,.23,.02);
     tube(root,[[side*.64,3.45,1.04],[side*.91,2.8,1.02],[side*1.02,.35,.64],[side*.72,.12,.8],[side*.51,1.28,.87]],.043,black);
     box(root,.27,.30,.13,mat(0x38bc47),side*.43,1.62,.75,.055);
     const gun=box(root,.14,.30,.16,black,side*.43,1.64,.86,.04);gun.rotation.z=side*.3;
     box(root,.82,2.3,.04,dark,side*.785,1.75,-.02,.04).rotation.y=Math.PI/2;
    }
    scan=mesh(root,new T.CylinderGeometry(1.08,1.08,.018,48),new T.MeshBasicMaterial({color:0xf0447b,transparent:true,opacity:.35}),0,1.7,0);
    scan.visible=false;
   }else{
    for(const s of [-1,1]){
     box(root,.47,.27,.78,black,s*.32,.15,.15,.10);
     box(root,.48,.26,.70,white,s*.32,.25,.14,.10);
     box(root,.31,.045,.045,glow,s*.32,.22,.51,.01);
     sphere(root,.21,black,s*.30,.70,0);
     const leg=box(root,.38,.72,.40,white,s*.30,.73,0,.13);leg.rotation.z=s*-.09;
    }
    sphere(root,.67,white,0,1.46,0,.92,1.04,.65);
    box(root,.48,.48,.14,orange,0,1.52,.44,.11);
    // Raised geometric R badge.
    box(root,.06,.29,.04,white,-.1,1.52,.53,.01);box(root,.20,.05,.04,white,-.02,1.64,.53,.01);box(root,.05,.13,.04,white,.075,1.59,.53,.01);box(root,.17,.045,.04,white,-.015,1.53,.53,.01);const stem=box(root,.06,.16,.04,white,.045,1.45,.53,.01);stem.rotation.z=.5;
    mesh(root,new T.CylinderGeometry(.21,.21,.2,24),black,0,2.02,0);
    head=new T.Group();head.position.y=2.53;root.add(head);
    box(head,1.52,1.2,1.03,white,0,0,0,.35);
    box(head,1.34,.95,.18,black,0,-.02,.51,.26);
    box(head,.46,.07,.20,glow,0,.57,.1,.025);
    for(const s of [-1,1]){const ear=mesh(head,new T.CylinderGeometry(.29,.29,.19,32),orange,s*.82,0,0);ear.rotation.z=Math.PI/2;const ring=mesh(head,new T.CylinderGeometry(.23,.23,.22,32),white,s*.84,0,0);ring.rotation.z=Math.PI/2;}
    eyes=new T.Group();head.add(eyes);
    for(const s of [-1,1])tube(eyes,[[s*.30-.15,-.02,.63],[s*.30-.1,.11,.66],[s*.30,.15,.67],[s*.30+.1,.11,.66],[s*.30+.15,-.02,.63]],.034,glow);
    tube(head,[[-.17,-.20,.65],[0,-.27,.67],[.17,-.20,.65]],.03,glow);
    for(const s of [-1,1]){
     const a=new T.Group();a.position.set(s*.55,1.81,0);root.add(a);
     sphere(a,.23,orange,0,0,0);
     box(a,.27,.49,.31,white,s*.08,-.25,0,.10);
     sphere(a,.18,black,s*.08,-.5,0);
     box(a,.26,.40,.30,white,s*.10,-.66,.05,.10);
     const hand=new T.Group();hand.position.set(s*.1,-.92,.08);a.add(hand);
     sphere(hand,.19,black,0,0,0,1,1.2,.65);
     for(let f=0;f<4;f++)box(hand,.065,.20,.08,black,-.11+f*.074,-.17,0,.03);
     box(hand,.07,.18,.09,black,-s*.18,-.01,0,.03).rotation.z=s*.8;
     if(s===1){arm=a;a.rotation.z=2.6;}else a.rotation.z=-.35;
    }
   }
   let pointer=0;
   const track=(e:PointerEvent)=>{const r=el.getBoundingClientRect();pointer=(e.clientX-r.left)/r.width-.5};
   const leave=()=>{pointer=0};el.addEventListener('pointermove',track);el.addEventListener('pointerleave',leave);
   const resize=()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;if(renderer instanceof T.WebGLRenderer)renderer.setSize(w,h,false);else renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()};
   const observer=new ResizeObserver(resize);observer.observe(el);resize();
   const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   const started=performance.now();let last=0,frame=0;
   const animate=(now:number)=>{
    if(disposed)return;frame=requestAnimationFrame(animate);if(now-last<(gpu?32:100))return;last=now;
    const t=reduced?0:(now-started)/1000,st=state.current;
    root.rotation.y+=(pointer*.35+(kind==='charger'?-.12:0)-root.rotation.y)*.06;
    if(kind==='buddy'){
     root.position.y=Math.sin(t*2)*.045+(st.celebrate?Math.abs(Math.sin(t*3))*.15:0);
     if(head){head.rotation.z=Math.sin(t*1.4)*.06;head.rotation.y=Math.sin(t*.9)*.08;}
     if(arm)arm.rotation.z=(st.scanning?1.55:2.6)+Math.sin(t*(st.celebrate?7:4))*.22;
     if(eyes)eyes.scale.y=Math.sin(t*1.7)> .99?.16:1;
    }else{
     root.position.y+=( (st.active?.1:0)-root.position.y)*.1;
     if(scan){scan.visible=st.scanning;scan.position.y=.2+(t*.85%3.2);}
    }
    halo.scale.setScalar(1+(st.active||st.scanning?Math.sin(t*3)*.04:0));
    glow.emissiveIntensity=st.scanning?2.2:1.3;
    renderer.render(scene,camera);
   };frame=requestAnimationFrame(animate);
   const lost=(e:Event)=>{e.preventDefault();setFailed(true)};renderer.domElement.addEventListener('webglcontextlost',lost);
   cleanup=()=>{observer.disconnect();cancelAnimationFrame(frame);el.removeEventListener('pointermove',track);el.removeEventListener('pointerleave',leave);renderer.domElement.removeEventListener('webglcontextlost',lost);scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose()}});if(renderer instanceof T.WebGLRenderer)renderer.dispose();renderer.domElement.remove()};
  }
  start().catch(()=>{if(!disposed)setFailed(true)});
  return()=>{disposed=true;cleanup()};
 },[kind]);
 return <div ref={host} className={'figure-3d '+className} role="img" aria-label={kind==='buddy'?'Animated 3D R-One Buddy':'3D charging cabinet with two cables'}>{failed&&<span className="model-fallback">3D unavailable on this device</span>}</div>;
}
