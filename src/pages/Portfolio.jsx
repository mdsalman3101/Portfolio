import { useEffect, useMemo, useRef, useState } from 'react'
import { FaArrowRight, FaDownload, FaGithub, FaLinkedinIn, FaXmark } from 'react-icons/fa6'
import { fallbackCertificates, fallbackJourney, fallbackProjects, fallbackSkills, defaults } from '../data'
import { isSupabaseConfigured, publicUrl, supabase } from '../lib/supabase'
import { Reveal, SpecularButton, SpotlightCard } from '../components/UI'

function Navbar({ resume }) {
  const [open, setOpen] = useState(false)
  return <header className="nav-wrap"><nav className="nav shell" aria-label="Main navigation">
    <a className="brand" href="#home">salman<span>.</span></a>
    <button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>{open ? 'Close' : 'Menu'}</button>
    <div className={`nav-links ${open ? 'open' : ''}`}>{['Home','Work','About','Skills','Journey','Contact'].map(x => <a key={x} href={`#${x.toLowerCase()}`} onClick={() => setOpen(false)}>{x}</a>)}</div>
    {resume?.file_path ? <a className="resume" href={publicUrl(resume.file_path)} target="_blank" rel="noreferrer">Resume <span>↗</span></a> : <a className="resume" href="#contact">Resume <span>↗</span></a>}
  </nav></header>
}

function Hero({ content, resume }) {
  const hero = content.hero || defaults.hero
  const socials = content.socials || defaults.socials
  return <section id="home" className="hero shell"><div className="hero-panel">
    <div className="hero-copy"><span className="eyebrow"><i /> {hero.eyebrow}</span><p className="hero-name">MD SALMAN</p>
      <h1>{hero.headline || 'Creative Developer'}</h1><p>{hero.description}</p>
      <div className="hero-actions"><SpecularButton href="#work">View work</SpecularButton>{resume?.file_path ? <SpecularButton href={publicUrl(resume.file_path)} secondary external>View resume</SpecularButton> : <SpecularButton href="#contact" secondary>Resume</SpecularButton>}</div>
      <div className="social-row"><a href={socials.github} target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a><a href={socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a><span><b>{hero.availability || 'Open to opportunities'}</b> · Internships, freelance and collaboration</span></div>
    </div>
    <div className="portrait-stage" tabIndex="0" aria-label="Professional portrait of MD Salman"><div className="portrait-ring"/><img src="/assets/profile/portfolio-portrait.png" alt="MD Salman in a black blazer and white shirt"/><div className="cyber-overlay" aria-hidden="true"><i/><i/><i/><span>01 / HUMAN + CODE</span></div></div>
    <div className="hero-index">01 / PORTFOLIO 2026</div>
  </div></section>
}

function Featured({ project, onOpen }) {
  if (!project) return null
  const media = project.project_media?.find(m => m.media_type === 'image')
  return <section className="featured shell"><div className="section-kicker">02 / FEATURED CLIENT WORK</div>
    <div className="featured-head"><h2>Built for a real<br/><em>creative studio.</em></h2><p>{project.summary}</p></div>
    <button className="featured-frame" onClick={() => onOpen(project)} aria-label={`View ${project.title} case study`}>
      <img src={media ? publicUrl(media.file_path) : project.cover_path ? publicUrl(project.cover_path) : '/assets/lucky-fx-homepage.png'} alt="Lucky FX Studio homepage"/>
      <span>REAL CLIENT WORK</span><div><small>Responsive portfolio · Visual storytelling · 2026</small><b>Open case study <FaArrowRight/></b></div>
    </button>
    <div className="featured-meta"><div><span>CLIENT PROJECT · 2026</span><h3>{project.title}</h3></div>{project.live_url && <SpecularButton href={project.live_url} external>View live</SpecularButton>}</div>
  </section>
}

function ProjectModal({ project, onClose }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!project) return
    const previous = document.activeElement
    const key = e => { if (e.key === 'Escape') onClose(); if (e.key === 'Tab') { const items = [...ref.current.querySelectorAll('button,a[href]')]; if (!items.length) return; const first=items[0], last=items.at(-1); if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus()} else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus()} } }
    document.addEventListener('keydown', key); document.body.classList.add('modal-open'); ref.current?.querySelector('button')?.focus()
    return () => { document.removeEventListener('keydown', key); document.body.classList.remove('modal-open'); previous?.focus() }
  }, [project, onClose])
  if (!project) return null
  const media = project.project_media || []
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}><article className="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={ref}>
    <button className="modal-close" onClick={onClose} aria-label="Close case study"><FaXmark/></button><span className="section-kicker">{project.project_type || 'PROJECT'} · {project.year || '2026'}</span><h2 id="modal-title">{project.title}</h2><p className="modal-lead">{project.description || project.summary}</p>
    <div className="case-grid">{project.problem && <div><b>Purpose</b><p>{project.problem}</p></div>}{project.built && <div><b>What I built</b><p>{project.built}</p></div>}{project.role && <div><b>My role</b><p>{project.role}</p></div>}<div><b>Tech stack</b><p>{project.tags?.join(' · ')}</p></div></div>
    {media.length > 0 && <div className="modal-media">{media.map(m => m.media_type === 'video' ? <video key={m.id} controls preload="metadata" src={publicUrl(m.file_path)}/> : <img key={m.id} src={publicUrl(m.file_path)} alt={m.alt_text || `${project.title} screenshot`}/>)}</div>}
    <div className="project-links">{project.live_url && <SpecularButton href={project.live_url} external>Live demo</SpecularButton>}{project.github_url && <SpecularButton href={project.github_url} secondary external>GitHub</SpecularButton>}</div>
  </article></div>
}

function ContactForm() {
  const [status, setStatus] = useState('idle')
  const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT || (import.meta.env.VITE_FORMSPREE_FORM_ID ? `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_FORM_ID}` : '')
  async function submit(e) {
    e.preventDefault(); const form = e.currentTarget; const fd = new FormData(form); if (fd.get('_gotcha')) return
    if (!endpoint) { setStatus('setup'); return }
    setStatus('sending')
    try {
      const response = await fetch(endpoint, { method:'POST', body:fd, headers:{ Accept:'application/json' } })
      if (!response.ok) throw new Error('Email delivery failed')
      if (supabase) { const payload = Object.fromEntries(['name','email','subject','message'].map(k => [k, fd.get(k)])); const { error } = await supabase.from('contact_messages').insert(payload); if (error) console.warn('Inbox copy failed', error.message) }
      form.reset(); setStatus('success')
    } catch { setStatus('error') }
  }
  return <form className="contact-form" onSubmit={submit}><div className="form-row"><label>Name<input name="name" autoComplete="name" required/></label><label>Email<input name="email" type="email" autoComplete="email" required/></label></div><label>Subject<input name="subject" required/></label><label>Message<textarea name="message" rows="6" required/></label><input className="honeypot" name="_gotcha" tabIndex="-1" autoComplete="off"/><button className="submit-button" disabled={status==='sending'}>{status==='sending' ? 'Sending…' : 'Send message'} <FaArrowRight/></button><p className="form-status" aria-live="polite">{status==='success' && 'Thanks — your message has been sent.'}{status==='error' && 'Email delivery failed. Please try again.'}{status==='setup' && 'Contact delivery is ready for your existing Formspree endpoint.'}</p></form>
}

export default function Portfolio() {
  const [projects,setProjects]=useState(fallbackProjects), [certificates,setCertificates]=useState(fallbackCertificates), [skills,setSkills]=useState(fallbackSkills), [journey,setJourney]=useState(fallbackJourney), [resume,setResume]=useState(null), [content,setContent]=useState(defaults), [selected,setSelected]=useState(null)
  useEffect(() => { if(!supabase) return; (async()=>{ const [p,c,s,j,r,sc]=await Promise.all([
    supabase.from('projects').select('*,project_media(*)').eq('published',true).order('sort_order'), supabase.from('certificates').select('*').eq('published',true).order('sort_order'), supabase.from('skills').select('*').eq('published',true).order('sort_order'), supabase.from('journey').select('*').eq('published',true).order('sort_order'), supabase.from('resumes').select('*').eq('published',true).order('created_at',{ascending:false}).limit(1).maybeSingle(), supabase.from('site_content').select('*') ]); if(p.data?.length) setProjects(p.data.filter(x=>x.slug!=='weathergpt')); if(c.data?.length)setCertificates(c.data); if(s.data?.length)setSkills(s.data); if(j.data?.length)setJourney(j.data); if(r.data)setResume(r.data); if(sc.data?.length)setContent(x=>({...x,...Object.fromEntries(sc.data.map(v=>[v.key,v.value]))})) })() },[])
  const featured=useMemo(()=>projects.find(p=>p.featured)||projects[0],[projects]); const others=projects.filter(p=>p.id!==featured?.id)
  const groupedSkills=useMemo(()=>Object.entries(skills.reduce((a,s)=>{(a[s.category]??=[]).push(s.name);return a},{})),[skills])
  return <><Navbar resume={resume}/><main><Hero content={content} resume={resume}/><Featured project={featured} onOpen={setSelected}/>
    <section id="work" className="section shell"><Reveal><div className="section-head"><div><span>03 / SELECTED WORK</span><h2>Useful ideas,<br/>built with care.</h2></div><p>Client, personal and academic work—presented honestly and ready to inspect.</p></div></Reveal><div className="project-grid">{others.map((p,i)=><SpotlightCard key={p.id} className={i===0?'wide':''}><button className="project-open" onClick={()=>setSelected(p)}><div className="project-art">{p.cover_path?<img loading="lazy" src={publicUrl(p.cover_path)} alt={`${p.title} cover`}/>:<div className="project-monogram">{p.title.split(' ').map(x=>x[0]).join('').slice(0,2)}</div>}<span>{p.project_type||p.category||'PROJECT'} · {p.year||'2026'}</span></div><div className="project-info"><div><h3>{p.title}</h3><p>{p.summary}</p><div className="tags">{p.tags?.map(t=><span key={t}>{t}</span>)}</div></div><span className="round-link"><FaArrowRight/></span></div></button></SpotlightCard>)}</div></section>
    <section id="about" className="section shell about"><Reveal className="portrait-card"><img loading="lazy" src="/assets/profile/about_professional_office.webp" alt="MD Salman in a professional setting"/><div className="portrait-label"><span>Based in India</span><b>Building with curiosity</b></div></Reveal><Reveal className="about-copy"><span className="section-kicker">04 / ABOUT ME</span><h2>Not just code.<br/><em>Curiosity too.</em></h2><p>{content.about?.text||defaults.about.text}</p><p className="proximity">Curious by nature. Thoughtful by design.</p><div className="facts"><div><strong>2nd Year</strong><span>B.Tech CSE</span></div><div><strong>∞</strong><span>Always Learning</span></div></div></Reveal></section>
    <section id="skills" className="section shell"><Reveal><div className="section-head"><div><span>05 / TOOLKIT</span><h2>Skills that turn<br/>ideas into products.</h2></div></div></Reveal><div className="skills-grid">{groupedSkills.map(([group,items],i)=><Reveal className="skill-card" key={group}><span>0{i+1}</span><h3>{group}</h3><div>{items.map(x=><b key={x}>{x}</b>)}</div></Reveal>)}</div></section>
    <section id="journey" className="section shell journey"><Reveal><div className="section-head"><div><span>06 / JOURNEY</span><h2>Learning by<br/>building.</h2></div></div></Reveal><div className="timeline">{journey.map((x,i)=><Reveal className="milestone" key={x.id||x.title}><div className="dot">{i+1}</div><span>{x.label||x.year}</span><h3>{x.title}</h3><p>{x.description}</p></Reveal>)}</div></section>
    <section className="section shell certificates"><Reveal><div className="section-head"><div><span>07 / CREDENTIALS</span><h2>Certificates &<br/>achievements.</h2></div><p>Meaningful learning milestones, available to verify.</p></div></Reveal><div className="certificate-grid">{certificates.map(c=><a key={c.id} href={publicUrl(c.pdf_path)||c.pdf_path} target="_blank" rel="noreferrer" className="certificate"><div>PDF</div><span>{c.issuer||'Certificate'} · {c.issue_date?.slice(0,4)||''}</span><h3>{c.title}</h3><b>View certificate ↗</b></a>)}</div></section>
    <section id="contact" className="contact shell"><Reveal><div className="contact-card"><div><span className="section-kicker">08 / LET'S TALK</span><h2>Let’s build something<br/><em>thoughtful.</em></h2><p>Have an internship, client project, or idea worth exploring? Tell me about it.</p><div className="contact-links"><a href={`mailto:${defaults.contact.email}`}>{defaults.contact.email}</a><a href={defaults.socials.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={defaults.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></div>{resume?.file_path&&<a className="download-link" href={publicUrl(resume.file_path)} download><FaDownload/> Download resume PDF</a>}</div><ContactForm/></div></Reveal></section>
  </main><footer className="shell"><a className="brand" href="#home">salman<span>.</span></a><p>© 2026 MD Salman · Designed and built with intention.</p><span>{isSupabaseConfigured?'CMS connected':'CMS-ready'}</span></footer><ProjectModal project={selected} onClose={()=>setSelected(null)}/></>
}
