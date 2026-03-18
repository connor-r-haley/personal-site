# Connor Haley — Resume Site

Personal resume website built with React + Vite (frontend) and FastAPI + Uvicorn (backend).

## Local Development

### Backend

```bash
cd backend
python3.13 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8001
```

API runs at `http://localhost:8001`. Resume data is served from `GET /api/resume`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Site runs at `http://localhost:5173`.

## Deploy

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/<your-username>/resume-site.git
git branch -M main
git push -u origin main
```

### 2. Backend → Render (free)

1. Sign up at [render.com](https://render.com) (GitHub login works).
2. **New → Web Service** → connect your repo.
3. Configure:
   - **Root Directory:** `backend`
   - **Runtime:** Python
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type:** Free
4. Deploy. Your API will be live at `https://<service-name>.onrender.com`.

> Free tier spins down after 15 min idle. First request after sleep takes ~30s.

### 3. Frontend → Vercel (free)

1. Sign up at [vercel.com](https://vercel.com) with GitHub.
2. **Add New → Project** → import your repo.
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variable:** `VITE_API_URL` = `https://<service-name>.onrender.com`
4. Deploy. Site will be live at `https://<project>.vercel.app`.

### 4. Custom Domain (optional)

Buy a domain (~$10/yr from Namecheap, Cloudflare, or Porkbun), add it in Vercel project settings, and point your DNS records where Vercel tells you. SSL is automatic.

Free alternatives: [is-a.dev](https://github.com/is-a-dev/register) gives you `yourname.is-a.dev` for free.

## Updating Your Resume

Edit the return value in `backend/main.py`, commit, and push. Both Vercel and Render auto-deploy from `main`.

```bash
git add . && git commit -m "update resume" && git push
```
