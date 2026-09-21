"use client";
import {useEffect,useState,type ReactNode} from 'react';
export function GameViewport({children}:{children:ReactNode}){
 const [size,S]=useState({scale:1,portrait:false});
 useEffect(()=>{const resize=()=>{const w=window.innerWidth,h=window.innerHeight,portrait=w/h<.95;S({portrait,scale:Math.min(w/(portrait?820:1280),h/(portrait?1100:800))})};resize();window.addEventListener('resize',resize);return()=>window.removeEventListener('resize',resize)},[]);
 return <div className={'game-viewport '+(size.portrait?'portrait':'')} style={{width:size.portrait?820:1280,height:size.portrait?1100:800,transform:`translate(-50%, -50%) scale(${size.scale})`}}>{children}</div>;
}
