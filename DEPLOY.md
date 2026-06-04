# VolunteerHub — Deployment Guide
## Stack: React (Vercel) + FastAPI (Render) + PostgreSQL (Supabase) — all FREE

---

## Prerequisites

Install these tools first:
```bash
# Node.js 18+ (https://nodejs.org)
node --version

# Python 3.11+ (https://python.org)
python3 --version

# Git
git --version

# Vercel CLI
npm install -g vercel

# (Optional) GitHub CLI for easier repo setup
# brew install gh   OR   https://cli.github.com
```

---

## Step 1 — Set Up a GitHub Repository

```bash
# From the volunteerhub/ folder
git init
git add .
git commit -m "Initial VolunteerHub commit"

# Create repo on GitHub (use gh CLI or do it manually at github.com)
gh repo create volunteerhub --public --push --source=.
# OR manually: create repo at github.com, then:
# git remote add origin https://github.com/YOUR_USERNAME/volunteerhub.git
# git push -u origin main
```

---

## Step 2 — Set Up Supabase (Free PostgreSQL)

1. Go to **https://supabase.com** → Sign up free
2. Click **New Project** → fill in name, password, region (choose Asia South — Mumbai)
3. Wait ~2 minutes for the database to spin up
4. Go to **Project Settings → Database → Connection string → URI**
5. Copy the URI — it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```
6. Save this — you'll need it for Render.

---

## Step 3 — Deploy Backend to Render (Free)

1. Go to **https://render.com** → Sign up with GitHub
2. Click **New → Web Service**
3. Connect your GitHub repo → select the `volunteerhub` repo
4. Configure:
   - **Name:** `volunteerhub-api`
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type:** `Free`
5. Add **Environment Variables** (click "Advanced"):

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Your Supabase URI from Step 2 |
   | `SECRET_KEY` | Any long random string (e.g. run `python3 -c "import secrets; print(secrets.token_hex(32))"`) |
   | `FRONTEND_URL` | `https://volunteerhub.vercel.app` (update after Step 4) |
   | `ENVIRONMENT` | `production` |

6. Click **Create Web Service** → wait ~3 minutes
7. Your API will be live at: `https://volunteerhub-api.onrender.com`
8. Test it: open `https://volunteerhub-api.onrender.com/docs` — you should see the Swagger UI

> ⚠️ **Free tier note:** Render free services sleep after 15 min of inactivity and wake on the next request (~30s delay). Upgrade to Starter ($7/mo) to avoid this.

---

## Step 4 — Deploy Frontend to Vercel (Free)

```bash
cd volunteerhub/frontend

# Create .env.production with your Render API URL
echo "VITE_API_URL=https://volunteerhub-api.onrender.com/api/v1" > .env.production

# Deploy to Vercel
vercel

# Follow the prompts:
# ? Set up and deploy? → Y
# ? Which scope? → your account
# ? Link to existing project? → N
# ? Project name? → volunteerhub
# ? In which directory is your code? → ./  (press Enter)
# ? Want to override settings? → N

# After first deploy, set env var in Vercel dashboard too:
vercel env add VITE_API_URL production
# Enter: https://volunteerhub-api.onrender.com/api/v1

# Deploy to production
vercel --prod
```

Your frontend is now live at: `https://volunteerhub.vercel.app`

---

## Step 5 — Update CORS on Render

Go back to Render → your `volunteerhub-api` service → Environment:
- Update `FRONTEND_URL` to your actual Vercel URL (e.g. `https://volunteerhub.vercel.app`)
- Click **Save** → Render will auto-redeploy

---

## Step 6 — Create Your First Admin User

After both services are live:

```bash
# Option A: Use the Swagger UI
# Open: https://volunteerhub-api.onrender.com/docs
# POST /api/v1/auth/register with:
# { "email": "admin@yourdomain.com", "full_name": "Admin", "password": "yourpassword", "role": "admin" }

# Option B: Use curl
curl -X POST https://volunteerhub-api.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yourdomain.com","full_name":"Admin User","password":"YourSecurePassword123","role":"admin"}'
```

---

## Local Development (run everything on your machine)

### Backend
```bash
cd volunteerhub/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env — you can leave DATABASE_URL as sqlite:///./volunteerhub.db for local dev

# Run the server
uvicorn app.main:app --reload --port 8000

# API docs available at:
# http://localhost:8000/docs
```

### Frontend
```bash
cd volunteerhub/frontend

# Install dependencies
npm install

# Create env file
echo "VITE_API_URL=http://localhost:8000/api/v1" > .env.local

# Start dev server
npm run dev

# App runs at: http://localhost:5173
```

---

## Project File Structure

```
volunteerhub/
├── backend/
│   ├── app/
│   │   ├── main.py              ← FastAPI app entry point
│   │   ├── database.py          ← SQLAlchemy DB setup
│   │   ├── core/
│   │   │   ├── config.py        ← Settings from env vars
│   │   │   └── security.py      ← JWT + password hashing
│   │   ├── models/
│   │   │   └── user.py          ← User DB model (4 roles)
│   │   ├── schemas/
│   │   │   └── auth.py          ← Pydantic request/response schemas
│   │   └── routers/
│   │       ├── auth.py          ← /register, /login, /me, /refresh
│   │       ├── admin.py         ← Admin-only user management APIs
│   │       └── deps.py          ← JWT auth dependency + role guards
│   ├── requirements.txt
│   ├── render.yaml              ← Render deployment config
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── main.jsx             ← React entry point
    │   ├── App.jsx              ← Routes + role-based navigation
    │   ├── index.css            ← Tailwind + custom components
    │   ├── context/
    │   │   └── AuthContext.jsx  ← Auth state, login/logout/register
    │   ├── services/
    │   │   └── api.js           ← Axios client + JWT interceptors
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx   ← Route guard (role-aware)
    │   │   ├── DashboardShell.jsx   ← Sidebar layout for all dashboards
    │   │   └── Navbar.jsx           ← Top navigation
    │   └── pages/
    │       ├── auth/
    │       │   ├── Login.jsx        ← Sign in page
    │       │   └── Register.jsx     ← 2-step sign up with role picker
    │       ├── dashboard/
    │       │   ├── AdminDashboard.jsx    ← Stats + full user management
    │       │   ├── HostDashboard.jsx     ← Listings + applications
    │       │   ├── VolunteerDashboard.jsx ← Browse + apply + badges
    │       │   └── AgencyDashboard.jsx   ← Packages + coupons
    │       └── Profile.jsx          ← Edit profile + change password
    ├── vercel.json              ← Vercel SPA routing fix
    ├── package.json
    └── .env.example
```

---

## API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/register` | Public | Create account |
| POST | `/api/v1/auth/login` | Public | Get JWT tokens |
| POST | `/api/v1/auth/refresh` | Public | Refresh access token |
| GET | `/api/v1/auth/me` | Any user | Get own profile |
| PATCH | `/api/v1/auth/me` | Any user | Update own profile |
| POST | `/api/v1/auth/change-password` | Any user | Change password |
| GET | `/api/v1/admin/stats` | Admin only | Platform stats |
| GET | `/api/v1/admin/users` | Admin only | List all users |
| PATCH | `/api/v1/admin/users/{id}/approve` | Admin only | Approve host/agency |
| PATCH | `/api/v1/admin/users/{id}/suspend` | Admin only | Suspend user |
| DELETE | `/api/v1/admin/users/{id}` | Admin only | Delete user |

---

## User Role Flow

```
Register as Volunteer  →  immediately active  →  can log in
Register as Host       →  status: pending     →  needs admin approval
Register as Agency     →  status: pending     →  needs admin approval
Register as Admin      →  immediately active  →  full access (first admin only)
```

**After creating your first Admin via the API:**
- Log in at `/login` with admin credentials
- Go to `/dashboard/admin` → User Management
- Approve any pending hosts or agencies

---

## Troubleshooting

**CORS error in browser?**
→ Make sure `FRONTEND_URL` in Render matches your exact Vercel URL

**"Module not found" on Render?**
→ Check that Root Directory is set to `backend` in Render settings

**Render service sleeping?**
→ First request after sleep takes ~30s. Add a `/health` ping cron job or upgrade to Starter.

**Vercel 404 on page refresh?**
→ `vercel.json` with rewrites should fix this. If not, re-deploy.

**SQLite in production?**
→ Never use SQLite on Render — the filesystem is ephemeral. Always set `DATABASE_URL` to your Supabase PostgreSQL URI.
