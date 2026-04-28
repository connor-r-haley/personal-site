import { useState, useEffect, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8001";

export const PROJECT_SUBTABS = [
  { slug: "drone-home",          label: "Drone Home" },
  { slug: "startos",             label: "StaRTOS" },
  { slug: "obdii-light-product", label: "OBDII Light Product" },
  { slug: "embedded-labs",       label: "Embedded Labs" },
];

const NAV = [
  { to: "/",            label: "About",      num: "01", end: true },
  { to: "/experience",  label: "Experience", num: "02" },
  {
    to: "/projects",
    label: "Projects",
    num: "03",
    children: PROJECT_SUBTABS.map((s, i) => ({
      to: `/projects/${s.slug}`,
      label: s.label,
      num: `03.${i + 1}`,
    })),
  },
  { to: "/skills",      label: "Skills",     num: "04" },
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
      <img className="loader-logo" src="/logo.png" alt="Connor Haley" />
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
  const { to, label, num, end, children } = item;

  const isActive = end
    ? location.pathname === "/"
    : location.pathname === to || location.pathname.startsWith(to + "/");

  const [submenuOpen, setSubmenuOpen] = useState(false);
  const closeTimer = useRef(null);

  const openSubmenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setSubmenuOpen(true);
  };

  const closeSubmenuSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setSubmenuOpen(false), 500);
  };

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  if (!children?.length) {
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

  return (
    <div
      className={`nav-link-group ${submenuOpen ? "open" : ""} ${isActive ? "active" : ""}`}
      onMouseEnter={openSubmenu}
      onMouseLeave={closeSubmenuSoon}
      onFocus={openSubmenu}
      onBlur={closeSubmenuSoon}
    >
      <Link
        to={to}
        className={`nav-link has-submenu ${isActive ? "active" : ""}`}
        aria-current={isActive ? "page" : undefined}
        aria-haspopup="menu"
        aria-expanded={submenuOpen}
        onClick={() => {
          setSubmenuOpen(false);
          onNavigate?.();
        }}
      >
        <span className="nav-link-num">{num}</span>
        <span className="nav-link-label">{label}</span>
        <span className="nav-link-caret" aria-hidden="true">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </span>
      </Link>
      <div className="nav-submenu" role="menu">
        {children.map((child) => {
          const childActive = location.pathname === child.to;
          return (
            <Link
              key={child.to}
              to={child.to}
              role="menuitem"
              className={`nav-submenu-item ${childActive ? "active" : ""}`}
              aria-current={childActive ? "page" : undefined}
              onClick={() => {
                setSubmenuOpen(false);
                onNavigate?.();
              }}
            >
              <span className="nav-submenu-num">{child.num}</span>
              <span className="nav-submenu-label">{child.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
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
          <img className="brand-logo" src="/logo.png" alt="" aria-hidden="true" />
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
      <div className="hero-status">
        <span className="hero-status-dot" />
        Available for full-time roles · 2026
      </div>

      <h1 className="hero-name">
        <span className="hero-name-line">{resume.name.split(" ").slice(0, -1).join(" ")}</span>
        <span className="hero-name-line accent">{resume.name.split(" ").slice(-1).join(" ")}</span>
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
      </section>
    </PageShell>
  );
}

/* ============================================================
   PROJECTS PAGE
   ============================================================ */

function ProjectsTabs({ projects, activeIndex, onSelect }) {
  if (!projects?.length) {
    return (
      <div className="empty-projects">
        <div className="empty-projects-inner">
          <span className="empty-spark" aria-hidden="true" />
          <p>More projects landing soon — still building.</p>
        </div>
      </div>
    );
  }

  const safeIndex = Math.min(Math.max(activeIndex, 0), projects.length - 1);
  const project = projects[safeIndex];

  return (
    <div className="projects-shell">
      <div className="projects-tabs" role="tablist" aria-label="Projects">
        {projects.map((p, i) => {
          const isActive = i === safeIndex;
          return (
            <button
              key={p.slug || p.name}
              role="tab"
              aria-selected={isActive}
              aria-controls={`project-panel-${i}`}
              id={`project-tab-${i}`}
              className={`projects-tab ${isActive ? "active" : ""}`}
              onClick={() => onSelect(i)}
            >
              <span className="projects-tab-num">P/{String(i + 1).padStart(2, "0")}</span>
              <span className="projects-tab-name">{p.name}</span>
              <span className="projects-tab-underline" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      <article
        className="project-panel"
        role="tabpanel"
        id={`project-panel-${safeIndex}`}
        aria-labelledby={`project-tab-${safeIndex}`}
        key={project.slug || project.name}
      >
        <header className="project-panel-head">
          <div>
            <div className="project-panel-eyebrow">
              {`Project ${String(safeIndex + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`}
            </div>
            <h3 className="project-panel-title">{project.name}</h3>
          </div>
          <span className="project-panel-dates">{project.dates}</span>
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
      </article>
    </div>
  );
}

function buildOrderedProjects(rawProjects = []) {
  const bySlug = new Map(rawProjects.filter((p) => p.slug).map((p) => [p.slug, p]));
  return PROJECT_SUBTABS.map(({ slug, label }) => {
    const existing = bySlug.get(slug);
    if (existing) return existing;
    return {
      slug,
      name: label,
      dates: "TBD",
      tech: null,
      bullets: ["Coming soon — write-up in progress."],
    };
  });
}

function ProjectsPage({ resume }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const ordered = buildOrderedProjects(resume.projects);

  const activeIndex = (() => {
    if (!slug) return 0;
    const idx = ordered.findIndex((p) => p.slug === slug);
    return idx >= 0 ? idx : 0;
  })();

  const handleSelect = (idx) => {
    const target = ordered[idx];
    if (target?.slug) navigate(`/projects/${target.slug}`);
  };

  return (
    <PageShell>
      <section className="section section-page">
        <SectionHeading index="03" eyebrow="Selected work" title="Projects" />
        <p className="section-lede">
          A rotating set of things I've built — embedded, full-stack, and the
          spaces between. Switch tabs to dig into each one.
        </p>
        <ProjectsTabs
          projects={ordered}
          activeIndex={activeIndex}
          onSelect={handleSelect}
        />
      </section>
    </PageShell>
  );
}

/* ============================================================
   SKILLS PAGE
   ============================================================ */

function SkillsPage({ resume }) {
  return (
    <PageShell>
      <section className="section section-page">
        <SectionHeading index="04" eyebrow="Toolkit" title="Skills" />
        <div className="skills-grid">
          {Object.entries(resume.skills).map(([category, skillStr]) => (
            <div className="skill-group" key={category}>
              <div className="skill-group-title">{category}</div>
              <div className="skill-tags">
                {skillStr.split(/,\s*/).map((skill) => (
                  <span className="skill-tag" key={skill}>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="education-block">
          <div className="subsection-heading">Education</div>
          {resume.education.map((edu, i) => (
            <div className="edu-card" key={i}>
              <div className="edu-card-main">
                <div className="degree">{edu.degree}</div>
                <div className="school">
                  {edu.school}
                  {edu.location && <span> · {edu.location}</span>}
                </div>
                {edu.details && <div className="edu-details">{edu.details}</div>}
              </div>
              <span className="edu-year">{edu.year}</span>
            </div>
          ))}
        </div>

        {resume.coursework?.length > 0 && (
          <div className="coursework-block">
            <div className="subsection-heading">Relevant Coursework</div>
            <div className="coursework-list">
              {resume.coursework.map((course) => (
                <span className="coursework-item" key={course}>{course}</span>
              ))}
            </div>
          </div>
        )}
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
          <Route path="/projects/:slug" element={<ProjectsPage resume={resume} />} />
          <Route path="/skills" element={<SkillsPage resume={resume} />} />
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
