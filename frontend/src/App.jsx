import { useState, useEffect } from "react";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8001";

function Loader() {
  return (
    <div className="loader">
      <span className="dot" style={{ animationDelay: "0s" }}>.</span>
      <span className="dot" style={{ animationDelay: "0.2s" }}>.</span>
      <span className="dot" style={{ animationDelay: "0.4s" }}>.</span>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>
      <textarea
        placeholder="Message"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        required
      />
      <button type="submit" disabled={sending}>
        {sending ? "Sending..." : "Send Message"}
      </button>
      {sent && <p className="form-success">Message sent — thank you!</p>}
    </form>
  );
}

function ExperienceCard({ item }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-role">{item.role}</span>
        <span className="card-dates">{item.dates}</span>
      </div>
      <div className="card-company">{item.company}</div>
      <ul>
        {item.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-role">{project.name}</span>
        <span className="card-dates">{project.dates}</span>
      </div>
      {project.tech && <div className="card-tech">{project.tech}</div>}
      <ul>
        {project.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
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

  const { contact } = resume;

  return (
    <div className="site">
      {/* Header */}
      <header className="header">
        <h1>{resume.name}</h1>
        <div className="subtitle">{resume.title}</div>
        <p className="summary">{resume.summary}</p>
        <div className="contact-links">
          <a href={`mailto:${contact.email}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            Email
          </a>
          <a href={`tel:${contact.phone}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            {contact.phone}
          </a>
          <a href={contact.github} target="_blank" rel="noopener noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </a>
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            LinkedIn
          </a>
        </div>
      </header>

      {/* Experience */}
      <section className="section">
        <h2 className="section-title">Experience</h2>
        {resume.experience.map((item, i) => (
          <ExperienceCard key={i} item={item} />
        ))}
      </section>

      {/* Additional Experience */}
      {resume.additional_experience?.length > 0 && (
        <section className="section">
          <h2 className="section-title">Additional Experience</h2>
          {resume.additional_experience.map((item, i) => (
            <ExperienceCard key={i} item={item} />
          ))}
        </section>
      )}

      {/* Projects */}
      <section className="section">
        <h2 className="section-title">Projects</h2>
        {resume.projects.map((project, i) => (
          <ProjectCard key={i} project={project} />
        ))}
      </section>

      {/* Education */}
      <section className="section">
        <h2 className="section-title">Education</h2>
        {resume.education.map((edu, i) => (
          <div className="edu-card" key={i}>
            <div className="degree">{edu.degree}</div>
            <div className="school">
              {edu.school} — {edu.location} · {edu.year}
            </div>
            {edu.details && <div className="edu-details">{edu.details}</div>}
          </div>
        ))}
      </section>

      {/* Skills */}
      <section className="section">
        <h2 className="section-title">Technical Skills</h2>
        <div className="skills-grid">
          {Object.entries(resume.skills).map(([category, skillStr]) => (
            <div className="skill-group" key={category}>
              <div className="skill-group-title">{category}</div>
              <div className="skill-tags">
                {skillStr.split(", ").map((skill) => (
                  <span className="skill-tag" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coursework */}
      {resume.coursework?.length > 0 && (
        <section className="section">
          <h2 className="section-title">Relevant Coursework</h2>
          <div className="coursework-list">
            {resume.coursework.map((course) => (
              <span className="coursework-item" key={course}>
                {course}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="section">
        <h2 className="section-title">Get in Touch</h2>
        <ContactForm />
      </section>

      <footer className="footer">
        &copy; {new Date().getFullYear()} {resume.name}
      </footer>
    </div>
  );
}
