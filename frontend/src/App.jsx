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
  { to: "/business",    label: "Business",   num: "05" },
  { to: "/contact",     label: "Contact",    num: "06" },
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
      setError("Could not send message - try again.");
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
        {sent && <p className="form-success">Message sent - talk soon.</p>}
        {error && <p className="form-error">{error}</p>}
      </div>
    </form>
  );
}

function ContactSection({ resume }) {
  return (
    <section id="contact" className="section section-page">
      <SectionHeading index="06" eyebrow="Say hello" title="Get in Touch" />
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

function Swivel({ items, activeIndex, onSelect, label = "items", noun = "item", compact = false }) {
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
    <div className={`swivel${compact ? " swivel-compact" : ""}`} role="tablist" aria-label={label}>
      {total > 1 && (
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
      )}

      <div className="swivel-track" key={activeIndex}>
        {!compact && total > 1 && slot(prevIdx, "prev")}
        {slot(activeIndex, "active")}
        {!compact && total > 1 && slot(nextIdx, "next")}
      </div>

      {total > 1 && (
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
      )}
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
              <p>More projects landing soon - still building.</p>
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
    name: "Theatrical Engineer",
    subProjects: [
      {
        name: "Gator Tufaan 2025-2026",
        largeImages: true,
        largePics: true,
        about:
          "For the 2025-2026 season, season 3 of Gator Tufaan at the University of Florida, I decided to come back and lead set and mix for the team. Below is the Bollywood-American fusion mix I was able to create for the team, which led us to compete and place 4th out of 12 teams at Districts in North Carolina, winning 'Best Theme' due to the mix and set I had led. We had the opportunity to advance to Nationals in Las Vegas within the NDDL, and funds were about the only thing stopping us from going all the way. It was a fantastic season filled with growth, camaraderie, and excellence!",
        videos: [
          {
            title: "Queen City Dhamaka | March 26th, 2026 | Charlotte, NC",
            youtubeId: "NfhmtWJbDBc",
          },
        ],
        mix: {
          embedSrc:
            "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2271587765&color=%23000000&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
          artist: "DR SWAMP",
          artistUrl: "https://soundcloud.com/user-847995847",
          trackTitle: "Gator Tufaan NDDL NC [2025 - 2026 Mix]",
          trackUrl:
            "https://soundcloud.com/user-847995847/gator-tufaan-nddl-nc",
        },
        pics: [
          {
            src: "/creative/tufaan-2025-2026/best-theme-celebration.png",
            caption:
              "Albeit blurry, our team celebrating our Best Theme award!",
            alt: "Tufaan 2025-2026 team selfie celebrating with the Best Theme certificate",
          },
        ],
        slides: [
          {
            label: "Figure 1",
            caption: "Tufaan 2025-2026 Tech Deck",
            embedUrl:
              "https://docs.google.com/presentation/d/e/2PACX-1vS8tCyz9TkhmI6MoUVzF_-_1pG3sP0mdxIHjcNHkOWep0-5dERrtY9XZSRpDQrqAkN26halEDihQ4Iq/pubembed?start=false&loop=false&delayms=3000",
          },
        ],
        images: [
          {
            src: "/creative/tufaan-2025-2026/uv-light-up-bushes.png",
            label: "Figure 2",
            caption: "UV set with light-up bushes",
            alt: "Tufaan 2025-2026 stage with glowing UV bushes",
          },
          {
            src: "/creative/tufaan-2025-2026/uv-painted-walls.png",
            label: "Figure 3",
            caption: "UV set with painted walls",
            alt: "Tufaan 2025-2026 stage with painted UV-reactive walls",
          },
          {
            src: "/creative/tufaan-2025-2026/electronics-test-run.png",
            label: "Figure 4",
            caption:
              "First electronics test run - remote-control UV lights + bush light rig",
            alt: "Outdoor test of UV-painted backdrops and light-up bushes powered by a remote-controlled rig",
          },
        ],
        bullets: [],
      },
      {
        name: "Gator Tufaan 2023-2024",
        largePics: true,
        about:
          "For Season 1 of Gator Tufaan, it was a fun uphill battle. After creating Gator Udaya, an all-male team two years prior, I felt ready to help create this co-ed team. By my side were three dancers: Neha Bangalore, Anamika Naidu, and Niraj Patel - each instrumental to the team's creation. I led set and mix, and I danced as well. We were fortunate to travel to LA, California to compete at NDDL Nationals. Our captain, Anamika Naidu, was awarded best female dancer in the league!",
        videos: [
          {
            title: "Performance",
            youtubeId: "RyXO6VKTUww",
          },
        ],
        mix: {
          embedSrc:
            "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A1780434849&color=%23000000&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
          artist: "DR SWAMP",
          artistUrl: "https://soundcloud.com/user-847995847",
          trackTitle: "GATOR TUFAAN 2023-2024 MIX",
          trackUrl:
            "https://soundcloud.com/user-847995847/gator-tufaan-2023-2024-mix",
        },
        pics: [
          {
            src: "/creative/tufaan-2023-2024/pic-1.png",
            alt: "Tufaan 2023-2024 performance still with 'That's me!' annotation pointing to Connor on stage",
          },
          {
            src: "/creative/tufaan-2023-2024/pic-2.png",
            alt: "Tufaan 2023-2024 performance still with 'That's also me!' annotation noting Connor holding the ship prop",
          },
        ],
        images: [
          {
            src: "/creative/tufaan-2023-2024/01-process.png",
            label: "Step 1",
            caption: "It's all part of the process...",
            alt: "Cart of PVC pipes and supplies for the build",
          },
          {
            src: "/creative/tufaan-2023-2024/02-layout-shell.png",
            label: "Step 2",
            caption: "Layout Shell",
            alt: "PVC frame laid out on the parking-garage floor",
          },
          {
            src: "/creative/tufaan-2023-2024/03-spray-paint-tarp.png",
            label: "Step 3",
            caption: "Spray Paint Tarp and Fasten",
            alt: "First pass of black and blue spray paint on the tarp",
          },
          {
            src: "/creative/tufaan-2023-2024/04-spray-paint-portal.png",
            label: "Step 4",
            caption: "Spray Paint Portal",
            alt: "Green portal swirl spray painted onto the tarp",
          },
          {
            src: "/creative/tufaan-2023-2024/05-pose-with-art.png",
            label: "Step 5",
            caption: "Pose with art",
            alt: "Connor posing next to the freshly painted portal tarp",
          },
          {
            src: "/creative/tufaan-2023-2024/06-fasten.png",
            label: "Step 6",
            caption: "Fasten",
            alt: "Painted portal tarp hung on the PVC frame as a backdrop",
          },
        ],
        setNote:
          "I would not spray paint on tarp again because, although cheap, it flaked everywhere. If I were to do this again, I'd use a muslin sheet.",
        bullets: [],
      },
      {
        name: "Gator Udaya 2021-2022",
        largePics: true,
        about:
          "I was reached out to mix for a new dance team in the wake of COVID-19. It ended up becoming a new hobby. We performed at the 2021 AASA Showcase, Diwali, and Holi performances. Those videos are lost to history, but below is an end of year music video we made! In addition, a few captains and I also went to see the DDN 2021 LEGENDS National competition in Chicago, IL, and gained great insight and ignited passion for the art!",
        videos: [
          {
            title: "Music Video",
            youtubeId: "ek-_m6YjyPk",
            caption:
              "*Ignore my sweaty pits, that shirt disserviced me...",
          },
        ],
        pics: [
          {
            src: "/creative/udaya-2021-2022/01-aasa-2021.png",
            label: "Figure 1",
            caption: "AASA 2021 fits and crew",
            alt: "Gator Udaya crew in white shirts, black ties, bowler hats, and masks at the 2021 AASA Showcase",
          },
          {
            src: "/creative/udaya-2021-2022/02-diwali-mehul.png",
            label: "Figure 2",
            caption: "Dancing Diwali with the head Captain, Mehul Suresh",
            alt: "Connor and Mehul Suresh in matching yellow shirts on stage at the Diwali performance",
          },
          {
            src: "/creative/udaya-2021-2022/03-diwali-team.png",
            label: "Figure 3",
            caption: "Diwali team pic",
            alt: "Gator Udaya team group selfie in yellow Diwali outfits",
          },
        ],
      },
    ],
  },
  {
    name: "Unity Game Dev",
    subProjects: [
      {
        name: "The Other Mother",
        downloads: [
          {
            host: "itch.io",
            label: "Play / Download",
            url: "https://sonnyeclipsed.itch.io/theothermother",
          },
        ],
        bullets: [],
      },
    ],
  },
  {
    name: "Sociology Research",
    subProjects: [
      {
        name: "Bridging the Human Development Index Gap",
        aboutLabel: "Description",
        aboutItalic: true,
        hideAboutHeading: true,
        about:
          "Compares four post-crisis health systems - Rwanda's Community-Based Health Insurance, Bangladesh's BRAC NGO, Ethiopia's Health Extension Program, and Lebanon's pluralistic public-private model - to extract transferable strategies for closing Sub-Saharan Africa's HDI gap, and proposes a comparative framework for matching each model to local terrain, post-conflict status, and income.",
        paper: {
          src: "/creative/sociology-research/hdi-gap-2025.pdf",
          class: "Social Inequality",
          year: "2025",
        },
      },
    ],
  },
  {
    name: "Music",
    bullets: [
      "Coming soon - what I'm listening to, playing, and producing in Logic Pro.",
    ],
  },
  {
    name: "Writing",
    bullets: [
      "Coming soon - short essays, project journaling, and the occasional rant.",
    ],
  },
  {
    name: "Reading",
    bullets: [
      "Coming soon - current reads and shelf highlights, fiction and non-fiction.",
    ],
  },
];

function VideoBlock({ video }) {
  return (
    <div className="video-block">
      <div className="video-block-title">{video.title}</div>
      <div className="video-frame">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0`}
          title={video.title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}

function ImageBlock({ image }) {
  return (
    <figure className="image-block">
      <div className="image-frame">
        <img src={image.src} alt={image.alt || image.caption || ""} loading="lazy" />
      </div>
      {(image.label || image.caption) && (
        <figcaption className="image-caption">
          {image.label && <span className="image-caption-label">{image.label}:</span>}
          {image.label && image.caption && " "}
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
}

function SlidesBlock({ slides }) {
  const captionText = slides.caption || slides.title;
  return (
    <figure className="slides-block">
      <div className="video-frame video-frame-slides">
        <iframe
          src={slides.embedUrl}
          title={captionText || "Slides"}
          loading="lazy"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </div>
      {(slides.label || captionText) && (
        <figcaption className="image-caption">
          {slides.label && (
            <span className="image-caption-label">{slides.label}:</span>
          )}
          {slides.label && captionText && " "}
          {captionText}
        </figcaption>
      )}
    </figure>
  );
}

function CreativeSubWheel({ items }) {
  const { activeIndex, direction, select, onKeyDown } = useSwivel(items.length);
  const sub = items[activeIndex];

  return (
    <div className="sub-card" onKeyDown={onKeyDown}>
      <Swivel
        items={items}
        activeIndex={activeIndex}
        onSelect={select}
        label="Sub-projects"
        noun="sub-project"
        compact
      />

      <div
        className={`sub-card-body sub-card-${direction >= 0 ? "in-right" : "in-left"}`}
        key={activeIndex}
      >
        {sub.paper && (
          <section className="sub-segment">
            <div className="paper-frame">
              <iframe
                src={`${sub.paper.src}#view=FitH`}
                title={sub.name || "Paper"}
                loading="lazy"
              />
            </div>
            <p className="paper-actions">
              <a href={sub.paper.src} download className="paper-link">
                Download PDF ↓
              </a>
            </p>
          </section>
        )}

        {sub.about && (
          <section className="sub-segment">
            {!sub.hideAboutHeading && (
              <h3 className="segment-title">{sub.aboutLabel || "About"}</h3>
            )}
            {(sub.paper?.class || sub.paper?.year) && (
              <div className="paper-meta">
                {sub.paper.class && (
                  <p className="paper-meta-line">
                    <strong>Class:</strong> {sub.paper.class}
                  </p>
                )}
                {sub.paper.year && (
                  <p className="paper-meta-line">
                    <strong>Year:</strong> {sub.paper.year}
                  </p>
                )}
              </div>
            )}
            <p
              className={`segment-body${sub.aboutItalic ? " segment-body-italic" : ""}`}
            >
              {sub.about}
            </p>
          </section>
        )}

        {sub.videos?.length > 0 && (
          <section className="sub-segment">
            <h3 className="segment-title">{sub.videos[0].title}</h3>
            <div className="video-frame">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${sub.videos[0].youtubeId}?rel=0`}
                title={sub.videos[0].title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            {sub.videos[0].caption && (
              <p className="video-caption">{sub.videos[0].caption}</p>
            )}
            {sub.videos.slice(1).map((v, i) => (
              <VideoBlock key={i} video={v} />
            ))}
          </section>
        )}

        {sub.mix && (
          <section className="sub-segment">
            <h3 className="segment-title">Mix</h3>
            <div className="mix-frame">
              <iframe
                src={sub.mix.embedSrc}
                title={sub.mix.trackTitle || "SoundCloud mix"}
                loading="lazy"
                allow="autoplay; encrypted-media"
                scrolling="no"
              />
            </div>
            {(sub.mix.artist || sub.mix.trackTitle) && (
              <p className="mix-credit">
                {sub.mix.artist && (
                  <a
                    href={sub.mix.artistUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {sub.mix.artist}
                  </a>
                )}
                {sub.mix.artist && sub.mix.trackTitle && " · "}
                {sub.mix.trackTitle && (
                  <a
                    href={sub.mix.trackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {sub.mix.trackTitle}
                  </a>
                )}
              </p>
            )}
          </section>
        )}

        {sub.pics?.length > 0 && (
          <section className="sub-segment">
            <h3 className="segment-title">Pics</h3>
            <div
              className={`image-stack${sub.largePics ? " image-stack-large" : ""}`}
            >
              {sub.pics.map((img, i) => (
                <ImageBlock key={i} image={img} />
              ))}
            </div>
          </section>
        )}

        {(sub.slides?.length > 0 || sub.images?.length > 0) && (
          <section className="sub-segment">
            <h3 className="segment-title">Set</h3>
            {sub.slides?.length > 0 && (
              <div className="video-stack">
                {sub.slides.map((s, i) => (
                  <SlidesBlock key={i} slides={s} />
                ))}
              </div>
            )}
            {sub.images?.length > 0 && (
              <div
                className={`image-stack${sub.largeImages ? " image-stack-large" : ""}`}
              >
                {sub.images.map((img, i) => (
                  <ImageBlock key={i} image={img} />
                ))}
              </div>
            )}
            {sub.setNote && <p className="set-note">{sub.setNote}</p>}
          </section>
        )}

        {sub.downloads?.length > 0 && (
          <section className="sub-segment">
            <h3 className="segment-title">Downloads</h3>
            <ul className="downloads-list">
              {sub.downloads.map((d, i) => (
                <li key={i}>
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-link"
                  >
                    {d.host && (
                      <span className="download-host">{d.host}</span>
                    )}
                    <span className="download-label">{d.label || d.url}</span>
                    <span className="download-arrow" aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {sub.bullets?.length > 0 && (
          <ul className="project-panel-bullets">
            {sub.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function CreativeCard({ entry }) {
  return (
    <article className="projects-shell">
      <div className="project-panel">
        {entry.subProjects?.length ? (
          <CreativeSubWheel items={entry.subProjects} />
        ) : (
          <ul className="project-panel-bullets">
            {entry.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
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
   BUSINESS PAGE
   ============================================================ */

function BusinessPage() {
  return (
    <PageShell>
      <section className="section section-page">
        <SectionHeading index="05" eyebrow="Ventures" title="Business" />
        <p className="business-placeholder">
          Coming soon - business ventures, side projects, and entrepreneurial
          experiments.
        </p>
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
        <p className="notfound-text">That route doesn't exist - but plenty of others do.</p>
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
          <Route path="/business" element={<BusinessPage />} />
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
