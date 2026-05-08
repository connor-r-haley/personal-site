import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8001";

const NAV = [
  { to: "/",            label: "About",      num: "01", end: true },
  { to: "/experience",  label: "Experience", num: "02" },
  { to: "/projects",    label: "Projects",   num: "03" },
  { to: "/creative",    label: "Creative",   num: "04" },
  { to: "/contact",     label: "Contact",    num: "05" },
];

/* ============================================================
   LOADER
   ============================================================ */

function Loader() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const toFetching = setTimeout(() => setStage(1), 5000);
    const toLongWait = setTimeout(() => setStage(2), 10000);
    return () => {
      clearTimeout(toFetching);
      clearTimeout(toLongWait);
    };
  }, []);

  const messages = [
    "Loading",
    "Fetching",
    "Just a little longer, this is a free site hosting service ;)",
  ];

  return (
    <div className="loader">
      <img className="loader-logo" src="/logo_gold.png" alt="Connor Haley" />
      <div
        key={stage}
        className={`loader-text${stage === 2 ? " loader-text-long" : ""}`}
      >
        {messages[stage]}
      </div>
    </div>
  );
}

/* ============================================================
   ROUTING UTILITIES
   ============================================================ */

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}

/* ============================================================
   TOP NAVIGATION
   ============================================================ */

function NavItem({ item, location, onNavigate }) {
  const { to, label, num, end } = item;

  const isActive = end
    ? location.pathname === "/"
    : location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <Link
      to={to}
      className={`nav-link ${isActive ? "active" : ""}`}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
    >
      <span className="nav-link-num">{num}</span>
      <span className="nav-link-label">{label}</span>
    </Link>
  );
}

function TopNav({ name }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className={`topnav ${scrolled ? "scrolled" : ""}`}>
      <div className="topnav-inner">
        <Link to="/" className="brand" aria-label="Home">
          <img className="brand-logo" src="/logo_gold.png" alt="" aria-hidden="true" />
          <span className="brand-name">{name || "Connor Haley"}</span>
        </Link>

        <nav className={`nav-links ${mobileOpen ? "open" : ""}`} aria-label="Primary">
          {NAV.map((item) => (
            <NavItem
              key={item.to}
              item={item}
              location={location}
              onNavigate={() => setMobileOpen(false)}
            />
          ))}
        </nav>

        <div className="topnav-right">
          <button
            className={`nav-toggle ${mobileOpen ? "open" : ""}`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}

/* ============================================================
   SHARED PIECES
   ============================================================ */

function SectionHeading({ index, eyebrow, title }) {
  return (
    <div className="section-heading">
      <span className="section-index">{index}</span>
      <span className="section-eyebrow">{eyebrow}</span>
      <h2 className="section-title">{title}</h2>
    </div>
  );
}

function PageShell({ children }) {
  return <div className="page">{children}</div>;
}

function ExperienceCard({ item }) {
  return (
    <article className="card">
      <div className="card-side" aria-hidden="true" />
      <div className="card-body">
        <div className="card-header">
          <div>
            <div className="card-role">{item.role}</div>
            <div className="card-company">
              {item.company}
              {item.location && <span className="card-loc"> · {item.location}</span>}
            </div>
          </div>
          <span className="card-dates">{item.dates}</span>
        </div>
        <ul className="card-bullets">
          {item.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/* ============================================================
   HOME
   ============================================================ */

function Hero({ resume }) {
  return (
    <section id="about" className="hero">
      <h1 className="hero-name">
        <img
          className="hero-name-logo"
          src="/logo_color.png"
          alt={resume.name}
        />
      </h1>

      <div className="hero-title">
        <span className="hero-title-bracket">[</span>
        {resume.title}
        <span className="hero-title-bracket">]</span>
      </div>

      <p className="hero-summary">{resume.summary}</p>

      <div className="hero-actions">
        <Link to="/projects" className="btn btn-primary">
          View Projects
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
        <a
          className="btn btn-outline"
          href="/connor_resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Resume
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17 17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </a>
        <Link to="/contact" className="btn btn-ghost">Get in touch</Link>
      </div>
    </section>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch {
      setError("Could not send message — try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label className="field">
          <span className="field-label">Name</span>
          <input
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>
        <label className="field">
          <span className="field-label">Email</span>
          <input
            type="email"
            placeholder="you@domain.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>
      </div>
      <label className="field">
        <span className="field-label">Message</span>
        <textarea
          placeholder="What's on your mind?"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
      </label>
      <div className="form-foot">
        <button type="submit" className="btn btn-primary" disabled={sending}>
          {sending ? "Sending…" : "Send Message"}
          {!sending && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m22 2-7 20-4-9-9-4 20-7Z" />
            </svg>
          )}
        </button>
        {sent && <p className="form-success">Message sent — talk soon.</p>}
        {error && <p className="form-error">{error}</p>}
      </div>
    </form>
  );
}

function ContactSection({ resume }) {
  return (
    <section id="contact" className="section section-page">
      <SectionHeading index="05" eyebrow="Say hello" title="Get in Touch" />
      <div className="contact-shell">
        <div className="contact-info">
          <p className="contact-info-lead">
            Open to embedded, real-time, and full-stack roles. Happiest at the
            seam between hardware and software.
          </p>
          <div className="contact-info-list">
            <a href={`mailto:${resume.contact.email}`} className="contact-info-row">
              <span className="contact-info-label">Email</span>
              <span className="contact-info-value">{resume.contact.email}</span>
            </a>
            <a href={`tel:${resume.contact.phone}`} className="contact-info-row">
              <span className="contact-info-label">Phone</span>
              <span className="contact-info-value">{resume.contact.phone}</span>
            </a>
            <a href={resume.contact.github} target="_blank" rel="noopener noreferrer" className="contact-info-row">
              <span className="contact-info-label">GitHub</span>
              <span className="contact-info-value">@connor-r-haley</span>
            </a>
            <a href={resume.contact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-info-row">
              <span className="contact-info-label">LinkedIn</span>
              <span className="contact-info-value">/in/connorrhaley</span>
            </a>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}

function HomePage({ resume }) {
  return (
    <PageShell>
      <Hero resume={resume} />
    </PageShell>
  );
}

function ContactPage({ resume }) {
  return (
    <PageShell>
      <ContactSection resume={resume} />
    </PageShell>
  );
}

/* ============================================================
   EXPERIENCE PAGE
   ============================================================ */

function ExperiencePage({ resume }) {
  return (
    <PageShell>
      <section className="section section-page">
        <SectionHeading index="02" eyebrow="Career" title="Experience" />
        <div className="cards-stack">
          {resume.experience.map((item, i) => (
            <ExperienceCard key={i} item={item} />
          ))}
        </div>

        {resume.additional_experience?.length > 0 && (
          <>
            <div className="subsection-heading">Beyond Engineering</div>
            <div className="cards-stack">
              {resume.additional_experience.map((item, i) => (
                <ExperienceCard key={i} item={item} />
              ))}
            </div>
          </>
        )}

        {resume.jobs?.length > 0 && (
          <>
            <div className="subsection-heading">Jobs</div>
            <div className="cards-stack">
              {resume.jobs.map((item, i) => (
                <ExperienceCard key={i} item={item} />
              ))}
            </div>
          </>
        )}
      </section>
    </PageShell>
  );
}

/* ============================================================
   PROJECTS PAGE
   ============================================================ */

function ProjectCard({ project }) {
  return (
    <article className="projects-shell">
      <div className="project-panel">
        <header className="project-panel-head">
          <h3 className="project-panel-title">{project.name}</h3>
          {project.dates && <span className="project-panel-dates">{project.dates}</span>}
        </header>

        {project.tech && (
          <div className="project-panel-tech">
            {project.tech.split(/,\s*/).map((t) => (
              <span className="tech-chip" key={t}>{t}</span>
            ))}
          </div>
        )}

        <ul className="project-panel-bullets">
          {project.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>

        {project.url && (
          <a className="project-panel-link" href={project.url} target="_blank" rel="noopener noreferrer">
            Visit project
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17 17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </a>
        )}
      </div>
    </article>
  );
}

function Swivel({ items, activeIndex, onSelect, label = "items", noun = "item" }) {
  const total = items.length;
  const wrap = (i) => ((i % total) + total) % total;
  const prevIdx = wrap(activeIndex - 1);
  const nextIdx = wrap(activeIndex + 1);
  const goPrev = () => onSelect(prevIdx, -1);
  const goNext = () => onSelect(nextIdx, 1);

  const slot = (idx, kind) => {
    const it = items[idx];
    return (
      <button
        key={`${kind}-${idx}`}
        type="button"
        className={`swivel-item swivel-${kind}`}
        onClick={kind === "active" ? undefined : () => onSelect(idx, kind === "next" ? 1 : -1)}
        aria-current={kind === "active" ? "true" : undefined}
        aria-label={kind === "active" ? `Current ${noun}: ${it.name}` : `Show ${it.name}`}
        tabIndex={kind === "active" ? -1 : 0}
      >
        <span className="swivel-name">{it.name}</span>
      </button>
    );
  };

  return (
    <div className="swivel" role="tablist" aria-label={label}>
      <button
        type="button"
        className="swivel-arrow"
        onClick={goPrev}
        aria-label={`Previous ${noun}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <div className="swivel-track" key={activeIndex}>
        {total > 1 && slot(prevIdx, "prev")}
        {slot(activeIndex, "active")}
        {total > 1 && slot(nextIdx, "next")}
      </div>

      <button
        type="button"
        className="swivel-arrow"
        onClick={goNext}
        aria-label={`Next ${noun}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}

function useSwivel(total) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (total > 0 && activeIndex >= total) setActiveIndex(0);
  }, [activeIndex, total]);

  const select = (idx, dir = 0) => {
    if (idx === activeIndex) return;
    setDirection(dir);
    setActiveIndex(idx);
  };

  const onKeyDown = (e) => {
    if (!total) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      select((activeIndex - 1 + total) % total, -1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      select((activeIndex + 1) % total, 1);
    }
  };

  return { activeIndex, direction, select, onKeyDown };
}

function ProjectsPage({ resume }) {
  const projects = resume.projects ?? [];
  const { activeIndex, direction, select, onKeyDown } = useSwivel(projects.length);

  return (
    <PageShell>
      <section className="section section-page section-tight">
        {projects.length === 0 ? (
          <div className="empty-projects">
            <div className="empty-projects-inner">
              <span className="empty-spark" aria-hidden="true" />
              <p>More projects landing soon — still building.</p>
            </div>
          </div>
        ) : (
          <div className="swivel-deck" onKeyDown={onKeyDown}>
            <Swivel
              items={projects}
              activeIndex={activeIndex}
              onSelect={select}
              label="Projects"
              noun="project"
            />

            <div
              className={`swivel-card-wrap swivel-card-${direction >= 0 ? "in-right" : "in-left"}`}
              key={activeIndex}
            >
              <ProjectCard project={projects[activeIndex]} />
            </div>
          </div>
        )}
      </section>
    </PageShell>
  );
}

/* ============================================================
   CREATIVE PAGE
   ============================================================ */

const CREATIVE_ENTRIES = [
  {
    name: "Sociology Research",
    bullets: [
      "Coming soon — write-ups from sociology coursework and ongoing research interests.",
    ],
  },
  {
    name: "Music",
    bullets: [
      "Coming soon — what I'm listening to, playing, and producing in Logic Pro.",
    ],
  },
  {
    name: "Writing",
    bullets: [
      "Coming soon — short essays, project journaling, and the occasional rant.",
    ],
  },
  {
    name: "Reading",
    bullets: [
      "Coming soon — current reads and shelf highlights, fiction and non-fiction.",
    ],
  },
];

function CreativeCard({ entry }) {
  return (
    <article className="projects-shell">
      <div className="project-panel">
        <header className="project-panel-head">
          <h3 className="project-panel-title">{entry.name}</h3>
        </header>
        <ul className="project-panel-bullets">
          {entry.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function CreativePage() {
  const entries = CREATIVE_ENTRIES;
  const { activeIndex, direction, select, onKeyDown } = useSwivel(entries.length);

  return (
    <PageShell>
      <section className="section section-page section-tight">
        <div className="swivel-deck" onKeyDown={onKeyDown}>
          <Swivel
            items={entries}
            activeIndex={activeIndex}
            onSelect={select}
            label="Creative areas"
            noun="area"
          />

          <div
            className={`swivel-card-wrap swivel-card-${direction >= 0 ? "in-right" : "in-left"}`}
            key={activeIndex}
          >
            <CreativeCard entry={entries[activeIndex]} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}

/* ============================================================
   404
   ============================================================ */

function NotFoundPage() {
  return (
    <PageShell>
      <section className="section section-page section-notfound">
        <div className="notfound-num">404</div>
        <h2 className="notfound-title">Page not found</h2>
        <p className="notfound-text">That route doesn't exist — but plenty of others do.</p>
        <Link to="/" className="btn btn-primary">Back to home</Link>
      </section>
    </PageShell>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */

function Footer({ name }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>&copy; {new Date().getFullYear()} {name}</span>
      </div>
    </footer>
  );
}

/* ============================================================
   APP ROOT
   ============================================================ */

function AppShell({ resume }) {
  return (
    <div className="site">
      <ScrollManager />
      <TopNav name={resume.name} />
      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage resume={resume} />} />
          <Route path="/experience" element={<ExperiencePage resume={resume} />} />
          <Route path="/projects" element={<ProjectsPage resume={resume} />} />
          <Route path="/creative" element={<CreativePage />} />
          <Route path="/contact" element={<ContactPage resume={resume} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer name={resume.name} />
    </div>
  );
}

export default function App() {
  const [resume, setResume] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/resume`)
      .then((r) => r.json())
      .then(setResume)
      .catch(console.error);
  }, []);

  if (!resume) return <Loader />;

  return (
    <BrowserRouter>
      <AppShell resume={resume} />
    </BrowserRouter>
  );
}
