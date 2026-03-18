# Building & Deploying a Personal Resume Site (React + Vite + FastAPI)

Same stack as Moralocracy — React/Vite frontend, FastAPI/Uvicorn backend — but stripped down for a portfolio/resume site, deployed free with a public URL.

---

## 1. Create the Project

```bash
mkdir ~/resume-site
cd ~/resume-site
```

### Backend

```bash
mkdir backend
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
```

Create `backend/requirements.txt`:

```
fastapi==0.116.1
uvicorn==0.35.0
pydantic==2.11.7
python-dotenv==1.1.1
```

```bash
pip install -r requirements.txt
```

Create `backend/main.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # lock this down to your Vercel URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/resume")
def get_resume():
    return {
        "name": "Connor Haley",
        "title": "Software Engineer",
        "summary": "Builder of Moralocracy and other things.",
        "experience": [
            {
                "role": "Software Engineer",
                "company": "Acme Corp",
                "dates": "2024 – Present",
                "bullets": [
                    "Built full-stack apps with React, FastAPI, and PostgreSQL",
                    "Designed real-time systems using WebSockets",
                ]
            }
        ],
        "education": [
            {
                "degree": "B.S. Computer Science",
                "school": "University of Somewhere",
                "year": "2024"
            }
        ],
        "skills": ["Python", "JavaScript", "React", "FastAPI", "SQL", "Git"],
        "projects": [
            {
                "name": "Moralocracy",
                "description": "Turn-based global intelligence simulator with live world map",
                "url": "https://github.com/you/royalm"
            }
        ],
        "contact": {
            "email": "connor@example.com",
            "github": "https://github.com/you",
            "linkedin": "https://linkedin.com/in/you"
        }
    }

@app.post("/api/contact")
def contact(message: dict):
    # In production, wire this to an email service (SendGrid free tier, Resend, etc.)
    print(f"Contact form: {message}")
    return {"status": "received"}
```

Run locally:

```bash
python -m uvicorn main:app --reload --port 8001
```

### Frontend

```bash
cd ~/resume-site
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install react-router-dom
```

Replace `frontend/src/App.jsx` with something like:

```jsx
import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8001";

export default function App() {
  const [resume, setResume] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/resume`).then(r => r.json()).then(setResume);
  }, []);

  if (!resume) return <p style={{ textAlign: "center", marginTop: "4rem" }}>Loading…</p>;

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem", fontFamily: "system-ui" }}>
      <header>
        <h1>{resume.name}</h1>
        <p>{resume.title}</p>
        <p>{resume.summary}</p>
      </header>

      <section>
        <h2>Experience</h2>
        {resume.experience.map((e, i) => (
          <div key={i} style={{ marginBottom: "1rem" }}>
            <strong>{e.role}</strong> — {e.company} <em>({e.dates})</em>
            <ul>{e.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>
          </div>
        ))}
      </section>

      <section>
        <h2>Education</h2>
        {resume.education.map((e, i) => (
          <p key={i}><strong>{e.degree}</strong> — {e.school}, {e.year}</p>
        ))}
      </section>

      <section>
        <h2>Skills</h2>
        <p>{resume.skills.join(" · ")}</p>
      </section>

      <section>
        <h2>Projects</h2>
        {resume.projects.map((p, i) => (
          <p key={i}><a href={p.url}>{p.name}</a> — {p.description}</p>
        ))}
      </section>

      <footer style={{ marginTop: "2rem", borderTop: "1px solid #ccc", paddingTop: "1rem" }}>
        <a href={`mailto:${resume.contact.email}`}>Email</a>{" · "}
        <a href={resume.contact.github}>GitHub</a>{" · "}
        <a href={resume.contact.linkedin}>LinkedIn</a>
      </footer>
    </main>
  );
}
```

Run locally:

```bash
npm run dev
```

Open `http://localhost:5173` — same workflow as Moralocracy.

---

## 2. Push to GitHub

Create a new repo on GitHub (e.g. `resume-site`), then:

```bash
cd ~/resume-site
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/<your-username>/resume-site.git
git branch -M main
git push -u origin main
```

---

## 3. Deploy for Free

The goal: frontend on **Vercel** (free), backend on **Render** (free). Both give you a public URL at no cost.

### 3A. Backend → Render (free tier)

1. Go to [render.com](https://render.com) and sign up (GitHub login works).
2. Click **New → Web Service**.
3. Connect your `resume-site` repo.
4. Configure:
   - **Name:** `resume-api` (your URL will be `resume-api.onrender.com`)
   - **Root Directory:** `backend`
   - **Runtime:** Python
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type:** Free
5. Click **Create Web Service**. It deploys in ~2 minutes.

Your backend is now live at:

```
https://resume-api.onrender.com
```

> **Note:** Render's free tier spins down after 15 minutes of inactivity. First request after sleep takes ~30 seconds to wake up. This is fine for a resume site — recruiters won't notice after the first load.

### 3B. Frontend → Vercel (free tier)

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub.
2. Click **Add New → Project**, import your `resume-site` repo.
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variable:** Add `VITE_API_URL` = `https://resume-api.onrender.com`
4. Click **Deploy**.

Your site is now live at:

```
https://resume-site.vercel.app
```

Vercel **does not** spin down — it's instant, always on, globally edge-cached.

---

## 4. Get a Custom Domain (Optional, Still Free)

### Free subdomain (already done)

You automatically get:
- `resume-site.vercel.app` (frontend)
- `resume-api.onrender.com` (backend)

### Custom domain (cheap, not free)

If you want `connorhaley.com` or similar:
1. Buy a domain (~$10/year from Namecheap, Cloudflare, or Porkbun).
2. In Vercel → Project Settings → Domains → add your domain.
3. Point your domain's DNS to Vercel (they give you the records). SSL is automatic.

### Actually-free custom domain

- **GitHub Pages subdomain** — won't work here since we need a backend, but mentioning for completeness.
- **Afraid.org FreeDNS** — free subdomains like `yourname.mooo.com`. Point it at your Vercel IP. Ugly but free.
- **is-a.dev** — apply for a free `yourname.is-a.dev` subdomain via their GitHub repo. Looks professional and is genuinely free. Works great with Vercel.

---

## 5. Keep It Running Free — What to Know

| Service | Free Tier Limits | Stays Running? |
|---------|-----------------|----------------|
| **Vercel** | 100 GB bandwidth/month, unlimited deploys | Yes, always on |
| **Render** | 750 hours/month (enough for 1 service 24/7), spins down after 15 min idle | Wakes on request |

**This setup costs $0/month** as long as you stay within the free tiers, which a resume site will never exceed.

### Auto-deploy on push

Both Vercel and Render auto-deploy when you push to `main`. Edit your resume JSON in `main.py`, push, and the site updates in ~2 minutes.

---

## 6. Going Further

- **Styling:** Drop in Tailwind CSS (`npm install -D tailwindcss @tailwindcss/vite`) or a component library like shadcn/ui for a polished look.
- **Dark mode:** Add a theme toggle (you already have theme code in Moralocracy you could reuse).
- **PDF download:** Add a `/api/resume/pdf` endpoint using `weasyprint` or `reportlab` to generate a downloadable resume.
- **Contact form:** Wire the `/api/contact` endpoint to [Resend](https://resend.com) (free tier: 3,000 emails/month) so the form actually sends you an email.
- **Analytics:** Add [Plausible](https://plausible.io) or [Umami](https://umami.is) (both have free self-hosted options) to see who's visiting.
- **Blog:** Add a `/blog` route. Store posts as markdown files, render with `react-markdown`.

---

## Quick Reference

```bash
# Local development (same as Moralocracy)
cd backend && python -m uvicorn main:app --reload --port 8001
cd frontend && npm run dev

# Deploy
git add . && git commit -m "update resume" && git push
# Vercel + Render auto-deploy from main
```

That's it. Same stack, same dev commands, free hosting, public URL.
