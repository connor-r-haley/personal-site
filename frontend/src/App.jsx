import { useState, useEffect } from "react";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8001";

const NAV = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

function Loader() {
  return (
    <div className="loader">
      <div className="loader-mark" aria-hidden="true">
        <span>C</span>
        <span>H</span>
      </div>
      <div className="loader-text">Loading</div>
    </div>
  );
}

function TopNav({ activeSection, onNavigate, name }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (e, id) => {
    setMobileOpen(false);
    onNavigate(e, id);
  };

  const initials = name
    ? name
        .split(/\s+/)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
    : "CH";

  return (
    <header className={`topnav ${scrolled ? "scrolled" : ""}`}>
      <div className="topnav-inner">
        <a href="#about" className="brand" onClick={(e) => handleClick(e, "about")}>
          <span className="brand-mark" aria-hidden="true">{initials}</span>
          <span className="brand-name">{name || "Connor Haley"}</span>
        </a>

        <nav className={`nav-links ${mobileOpen ? "open" : ""}`} aria-label="Primary">
          {NAV.map(({ id, label }, idx) => (
            <a
              key={id}
              href={`#${id}`}
              className={`nav-link ${activeSection === id ? "active" : ""}`}
              onClick={(e) => handleClick(e, id)}
            >
              <span className="nav-link-num">0{idx + 1}</span>
              <span className="nav-link-label">{label}</span>
            </a>
          ))}
        </nav>

        <div className="topnav-right">
          <a className="nav-cta" href="/connor_resume.pdf" target="_blank" rel="noopener noreferrer">
            <span>Resume</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17 17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </a>
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

function Hero({ resume }) {
  const { contact } = resume;
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
        <a href="#projects" className="btn btn-primary">
          View Projects
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
        <a href="#contact" className="btn btn-ghost">Get in touch</a>
      </div>

      <div className="hero-contacts">
        <a href={`mailto:${contact.email}`} className="contact-pill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          Email
        </a>
        <a href={`tel:${contact.phone}`} className="contact-pill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          {contact.phone}
        </a>
        <a href={contact.github} target="_blank" rel="noopener noreferrer" className="contact-pill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          GitHub
        </a>
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-pill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          LinkedIn
        </a>
      </div>
    </section>
  );
}

function SectionHeading({ index, eyebrow, title }) {
  return (
    <div className="section-heading">
      <span className="section-index">{index}</span>
      <span className="section-eyebrow">{eyebrow}</span>
      <h2 className="section-title">{title}</h2>
      <span className="section-rule" aria-hidden="true" />
    </div>
  );
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

function ProjectsTabs({ projects }) {
  const [active, setActive] = useState(0);

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

  const project = projects[Math.min(active, projects.length - 1)];

  return (
    <div className="projects-shell">
      <div className="projects-tabs" role="tablist" aria-label="Projects">
        {projects.map((p, i) => {
          const isActive = i === active;
          return (
            <button
              key={p.name}
              role="tab"
              aria-selected={isActive}
              aria-controls={`project-panel-${i}`}
              id={`project-tab-${i}`}
              className={`projects-tab ${isActive ? "active" : ""}`}
              onClick={() => setActive(i)}
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
        id={`project-panel-${active}`}
        aria-labelledby={`project-tab-${active}`}
        key={project.name}
      >
        <header className="project-panel-head">
          <div>
            <div className="project-panel-eyebrow">{`Project ${String(active + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`}</div>
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

export default function App() {
  const [resume, setResume] = useState(null);
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    fetch(`${API}/api/resume`)
      .then((r) => r.json())
      .then(setResume)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!resume) return;
    const sections = NAV.map(({ id }) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [resume]);

  const handleNavigate = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setActiveSection(id);
  };

  if (!resume) return <Loader />;

  return (
    <div className="site">
      <TopNav activeSection={activeSection} onNavigate={handleNavigate} name={resume.name} />

      <main className="main">
        <Hero resume={resume} />

        <section id="experience" className="section">
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

        <section id="projects" className="section">
          <SectionHeading index="03" eyebrow="Selected work" title="Projects" />
          <ProjectsTabs projects={resume.projects} />
        </section>

        <section id="skills" className="section">
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

        <section id="contact" className="section">
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
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <span>&copy; {new Date().getFullYear()} {resume.name}</span>
          <span className="footer-meta">
            <span className="footer-dot" /> Designed &amp; built from scratch
          </span>
        </div>
      </footer>
    </div>
  );
}
