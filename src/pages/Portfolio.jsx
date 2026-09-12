import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaArrowRight,
  FaCode,
  FaGithub,
  FaJava,
  FaLinkedinIn,
  FaReact,
} from "react-icons/fa6";
import { SiCplusplus, SiGit, SiJavascript, SiMysql } from "react-icons/si";
import { fallbackCertificates, fallbackProjects, defaults } from "../data";
import { isSupabaseConfigured, publicUrl, supabase } from "../lib/supabase";
import { Reveal, SpecularButton, SpotlightCard } from "../components/UI";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const fn = () => setSmall(scrollY > 30);
    addEventListener("scroll", fn, { passive: true });
    return () => removeEventListener("scroll", fn);
  }, []);
  return (
    <header className={`nav-wrap ${small ? "small" : ""}`}>
      <nav className="nav shell" aria-label="Main navigation">
        <a className="brand" href="#home">
          salman<span>.</span>
        </a>
        <button
          className="menu"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          ☰
        </button>
        <div className={`nav-links ${open ? "open" : ""}`}>
          {["Home", "Work", "About", "Skills", "Journey", "Contact"].map(
            (x) => (
              <a
                key={x}
                href={`#${x.toLowerCase()}`}
                onClick={() => setOpen(false)}
              >
                {x}
              </a>
            ),
          )}
        </div>
        <a className="resume" href="#contact">
          Available to connect <span>↗</span>
        </a>
      </nav>
    </header>
  );
}

function Hero({ content }) {
  const hero = content.hero || defaults.hero;
  return (
    <section id="home" className="hero shell">
      <div className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">
            <i /> {hero.eyebrow}
          </span>
          <h1 className="pressure" aria-label={hero.headline}>
            {hero.headline.split(" ").map((w, i) => (
              <span key={w} className={i === 1 ? "orange" : ""}>
                {w}
              </span>
            ))}
          </h1>
          <p>{hero.description}</p>
          <div className="hero-actions">
            <div className="magnet">
              <SpecularButton href="#work">View work</SpecularButton>
            </div>
            <SpecularButton href="#about" secondary>
              About me
            </SpecularButton>
          </div>
          <div className="status">
            <b>Open to opportunities</b>
            <span>Internships · freelance · collaborations</span>
          </div>
        </div>
        <div className="portrait-stage">
          <div className="orbit one" />
          <div className="orbit two" />
          <img
            src={`${import.meta.env.BASE_URL}assets/profile/hero_main_orange_ring.webp`}
            alt="MD Salman"
          />
          <div className="float-icon f1">
            <FaReact />
            <span>React</span>
          </div>
          <div className="float-icon f2">
            <SiJavascript />
            <span>JavaScript</span>
          </div>
          <div className="float-icon f3">
            <FaJava />
            <span>Java</span>
          </div>
          <div className="float-icon f4">
            <SiCplusplus />
            <span>C++</span>
          </div>
          <div className="float-icon f5">
            <SiMysql />
            <span>MySQL</span>
          </div>
          <div className="float-icon f6">
            <SiGit />
            <span>Git</span>
          </div>
        </div>
        <div className="hero-index">01 / PORTFOLIO 2026</div>
      </div>
    </section>
  );
}

function Featured({ project }) {
  const ref = useRef(null);
  useEffect(() => {
    const fn = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect(),
        p = Math.max(
          0,
          Math.min(1, (innerHeight - r.top) / (innerHeight + r.height * 0.35)),
        );
      ref.current.style.setProperty("--expand", p);
    };
    addEventListener("scroll", fn, { passive: true });
    fn();
    return () => removeEventListener("scroll", fn);
  }, []);
  const media = project?.project_media?.[0];
  return (
    <section className="featured shell" ref={ref}>
      <div className="section-kicker">02 / FEATURED PROJECT</div>
      <div className="featured-head">
        <h2>
          Forecasting,
          <br />
          <em>reimagined.</em>
        </h2>
        <p>{project?.summary}</p>
      </div>
      <div className="expand-frame">
        {media ? (
          media.media_type === "video" ? (
            <video
              controls
              preload="metadata"
              src={publicUrl(media.file_path)}
            />
          ) : (
            <img
              src={publicUrl(media.file_path)}
              alt={media.alt_text || project.title}
            />
          )
        ) : (
          <div className="weather-placeholder">
            <div className="weather-top">
              <span>WeatherGPT</span>
              <span>Live weather, explained simply.</span>
            </div>
            <div className="weather-temp">
              24°<small>Ahmedabad · Clear</small>
            </div>
            <div className="weather-note">
              Project media is ready to be added from the CMS.
            </div>
          </div>
        )}
      </div>
      <div className="featured-meta">
        <div>
          <span>AI · WEATHER · PRODUCT</span>
          <h3>{project?.title || "WeatherGPT"}</h3>
        </div>
        <div className="project-links">
          {project?.live_url && (
            <SpecularButton href={project.live_url} external>
              Live demo
            </SpecularButton>
          )}
          {project?.github_url && (
            <SpecularButton href={project.github_url} secondary external>
              GitHub
            </SpecularButton>
          )}
        </div>
      </div>
    </section>
  );
}

const skills = [
  ["Frontend", ["React", "JavaScript", "HTML", "CSS"]],
  ["Core programming", ["Java", "C++", "DSA"]],
  ["Data & tools", ["MySQL", "Git", "Linux"]],
  ["Sharpening now", ["REST APIs", "Database design", "Accessible UI"]],
];
function Portfolio() {
  const [projects, setProjects] = useState(fallbackProjects),
    [certificates, setCertificates] = useState(fallbackCertificates),
    [content, setContent] = useState(defaults);
  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const [p, c, s] = await Promise.all([
        supabase
          .from("projects")
          .select("*,project_media(*)")
          .eq("published", true)
          .order("sort_order"),
        supabase
          .from("certificates")
          .select("*")
          .eq("published", true)
          .order("sort_order"),
        supabase.from("site_content").select("*"),
      ]);
      if (p.data?.length) setProjects(p.data);
      if (c.data?.length) setCertificates(c.data);
      if (s.data?.length)
        setContent((x) => ({
          ...x,
          ...Object.fromEntries(s.data.map((v) => [v.key, v.value])),
        }));
    })();
  }, []);
  const featured = useMemo(
    () => projects.find((p) => p.featured) || projects[0],
    [projects],
  );
  const selected = projects.filter((p) => p.id !== featured?.id);
  const contact = content.contact || defaults.contact;
  return (
    <>
      <Navbar />
      <main>
        <Hero content={content} />
        <Featured project={featured} />
        <section id="work" className="section shell">
          <Reveal>
            <div className="section-head">
              <div>
                <span>03 / SELECTED WORK</span>
                <h2>
                  Useful ideas,
                  <br />
                  built with care.
                </h2>
              </div>
              <p>
                Real projects from my learning and development journey—presented
                simply, without made-up metrics.
              </p>
            </div>
          </Reveal>
          <div className="project-grid">
            {selected.map((p, i) => (
              <SpotlightCard key={p.id} className={i === 0 ? "wide" : ""}>
                <div className="project-art">
                  {p.cover_path ? (
                    <img
                      loading="lazy"
                      src={publicUrl(p.cover_path)}
                      alt={`${p.title} cover`}
                    />
                  ) : (
                    <div className="project-monogram">
                      {p.title
                        .split(" ")
                        .map((x) => x[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                  )}
                  <span>{p.category || "WEB · DEVELOPMENT"}</span>
                </div>
                <div className="project-info">
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.summary}</p>
                    <div className="tags">
                      {p.tags?.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="round-link">
                    {p.live_url ? (
                      <a
                        href={p.live_url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${p.title}`}
                      >
                        <FaArrowRight />
                      </a>
                    ) : (
                      <FaCode />
                    )}
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </section>
        <section id="about" className="section shell about">
          <Reveal className="portrait-card">
            <img
              loading="lazy"
              src={`${import.meta.env.BASE_URL}assets/profile/about_professional_office.webp`}
              alt="MD Salman in a professional setting"
            />
            <div className="portrait-label">
              <span>Based in India</span>
              <b>Building with curiosity</b>
            </div>
          </Reveal>
          <Reveal className="about-copy">
            <span className="section-kicker">04 / ABOUT ME</span>
            <h2>
              Not just code.
              <br />
              <em>Personality too.</em>
            </h2>
            <p>{content.about?.text || defaults.about.text}</p>
            <p className="proximity">
              Curious by nature. Thoughtful by design.
            </p>
            <div className="facts">
              <div>
                <strong>02</strong>
                <span>Year · B.Tech CSE</span>
              </div>
              <div>
                <strong>∞</strong>
                <span>Room to learn</span>
              </div>
            </div>
          </Reveal>
        </section>
        <section id="skills" className="section shell">
          <Reveal>
            <div className="section-head">
              <div>
                <span>05 / TOOLKIT</span>
                <h2>
                  Skills that turn
                  <br />
                  ideas into products.
                </h2>
              </div>
            </div>
          </Reveal>
          <div className="skills-grid">
            {skills.map((s, i) => (
              <Reveal className={`skill-card s${i}`} key={s[0]}>
                <span>0{i + 1}</span>
                <h3>{s[0]}</h3>
                <div>
                  {s[1].map((x) => (
                    <b key={x}>{x}</b>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </section>
        <section id="journey" className="section shell journey">
          <Reveal>
            <div className="section-head">
              <div>
                <span>06 / JOURNEY</span>
                <h2>
                  Learning by
                  <br />
                  building.
                </h2>
              </div>
            </div>
          </Reveal>
          <div className="timeline">
            {[
              [
                "Now",
                "B.Tech Computer Science Engineering",
                "Studying at Ganpat University, Gujarat, while building practical web projects.",
              ],
              [
                "Projects",
                "From foundations to useful products",
                "E-commerce, task management, cyber-safety and weather experiences built through hands-on practice.",
              ],
              [
                "Growth",
                "Frontend, systems and data",
                "Strengthening React, JavaScript, Java, C++, MySQL, Git, Linux and data structures.",
              ],
              [
                "Next",
                "Open to meaningful work",
                "Looking for internships, creative web projects and collaborative teams.",
              ],
            ].map((x, i) => (
              <Reveal className="milestone" key={x[0]}>
                <div className="dot">{i + 1}</div>
                <span>{x[0]}</span>
                <h3>{x[1]}</h3>
                <p>{x[2]}</p>
              </Reveal>
            ))}
          </div>
        </section>
        <section className="section shell certificates">
          <Reveal>
            <div className="section-head">
              <div>
                <span>07 / CREDENTIALS</span>
                <h2>
                  Certificates &<br />
                  achievements.
                </h2>
              </div>
              <p>
                Documents open only when requested, keeping the page light and
                focused.
              </p>
            </div>
          </Reveal>
          <div className="certificate-grid">
            {certificates.slice(0, 8).map((c) => (
              <a
                key={c.id}
                href={publicUrl(c.pdf_path) || c.pdf_path}
                target="_blank"
                rel="noreferrer"
                className="certificate"
              >
                <div>PDF</div>
                <span>{c.issuer || "Certificate"}</span>
                <h3>{c.title}</h3>
                <b>View certificate ↗</b>
              </a>
            ))}
          </div>
        </section>
        <section id="contact" className="contact shell">
          <Reveal>
            <div className="contact-card">
              <div className="contact-orb" />
              <img
                loading="lazy"
                src={`${import.meta.env.BASE_URL}assets/profile/profile_friendly_yellow.webp`}
                alt="MD Salman"
              />
              <span>08 / LET'S TALK</span>
              <h2>
                Let’s build something
                <br />
                <em>people remember.</em>
              </h2>
              <p>
                Have an internship, a thoughtful web project, or an idea worth
                exploring? I’d love to hear about it.
              </p>
              <div className="contact-actions">
                <SpecularButton href={`mailto:${contact.email}`}>
                  Start a conversation
                </SpecularButton>
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                >
                  <FaGithub />
                </a>
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <footer className="shell">
        <a className="brand" href="#home">
          salman<span>.</span>
        </a>
        <p>© 2026 MD Salman · Designed and built with intention.</p>
        <span>{isSupabaseConfigured ? "CMS connected" : "CMS-ready"}</span>
      </footer>
    </>
  );
}
export default Portfolio;

