import { useEffect, useRef, useState } from 'react'

export function Reveal({children,className=''}){
  const ref=useRef(null); const [shown,setShown]=useState(false)
  useEffect(()=>{const el=ref.current;const observer=new IntersectionObserver(([e])=>{if(e.isIntersecting){setShown(true);observer.disconnect()}},{threshold:.12});if(el)observer.observe(el);return()=>observer.disconnect()},[])
  return <div ref={ref} className={`reveal ${shown?'shown':''} ${className}`}>{children}</div>
}

export function SpecularButton({href,children,secondary=false,external=false}){
  const move=e=>{const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--x',`${e.clientX-r.left}px`);e.currentTarget.style.setProperty('--y',`${e.clientY-r.top}px`)}
  return <a className={`specular ${secondary?'secondary':''}`} href={href} onPointerMove={move} {...(external?{target:'_blank',rel:'noreferrer'}:{})}>{children}<span aria-hidden="true">↗</span></a>
}

export function SpotlightCard({children,className=''}){
  const move=e=>{const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--mx',`${e.clientX-r.left}px`);e.currentTarget.style.setProperty('--my',`${e.clientY-r.top}px`)}
  return <article className={`spotlight ${className}`} onPointerMove={move}>{children}</article>
}
