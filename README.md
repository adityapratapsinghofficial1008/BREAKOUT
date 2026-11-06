# BREAKOUT 🚀
### The Anti-Tutorial Hell Engine

**BREAKOUT** is an AI-powered platform that transforms passive YouTube tutorial-watching into an **interactive, checkpoint-based retention system**.

Paste any YouTube lecture or tutorial. BREAKOUT extracts the transcript, runs it through an LLM to identify key concepts, distributes quiz checkpoints across the video timeline, and **auto-pauses playback** at every checkpoint — forcing you to demonstrate understanding before you can continue.

> **Stop watching. Start understanding.**

---

## How It Works

```text
Paste YouTube URL
      ↓
Transcript Extraction
      ↓
AI: Topic & Concept Identification
      ↓
Checkpoint Placement Across Timeline
      ↓
Video Plays → Auto-Pauses at Checkpoint
      ↓
AI-Generated Questions (Text + Voice)
      ↓
You Answer → AI Evaluates
      ↓
Unlocked → Continue Watching
```

---

## Features

- **YouTube-Based Workspaces** — any lecture, course, or tutorial video becomes a session
- **AI Transcript Analysis** — LLM identifies topics and meaningful concept boundaries
- **Automatic Video Locking** — playback hard-pauses until you answer
- **Dual-Mode Quiz Engine** — text answers and Web Speech API voice answers
- **User Authentication** — register, email verification, JWT-based login
- **Personal Dashboard** — tracks sessions, capstone scores, watch time, and performance charts
- **Feynman Checkpoints** — voice-based explanation prompts to verify deep understanding
- **Capstone Scoring** — per-session retention score tracked across your history

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, GSAP |
| Backend | Node.js, Express |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Email | Nodemailer (SMTP / Gmail) |
| AI | Mistral API, Groq API |
| Data | JSON flat-file DB (db.json) |
| Deploy | Vercel (Client) + Render (Server) |

---

## Project Structure

```text
BREAKOUT/
├── Client/                   # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/    # Header, Sidebar, MetricCards, Charts, WatchedVideos
│   │   │   ├── AuthModal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── UrlForm.jsx
│   │   │   ├── FeaturesGrid.jsx
│   │   │   ├── WorkflowTimeline.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── CreatorCard.jsx
│   │   │   └── PipelineModal.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── WorkspacePage.jsx
│   │   │   └── VerifyEmailPage.jsx
│   │   ├── lib/
│   │   │   └── auth.js        # Auth client (register, login, JWT helpers)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── vercel.json            # API proxy rewrite rules for Vercel
│   └── package.json
│
├── Server/                   # Express backend
│   ├── index.js              # All routes: auth + AI + dashboard + progress
│   ├── ai.js                 # Mistral / Groq LLM calls
│   ├── db.js                 # JSON flat-file database helpers
│   ├── mailer.js             # Nodemailer SMTP email sender
│   ├── db.json               # Persistent data store
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## Local Development

### 1. Clone & install

```bash
# Frontend
cd Client
npm install

# Backend
cd ../Server
npm install
```

### 2. Configure environment variables

**`Server/.env`**
```env
PORT=8000
MISTRAL_API_KEY=your_mistral_api_key
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=any_long_random_string_here

# Gmail SMTP (see Gmail App Password setup below)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_16_char_app_password
SMTP_FROM="BREAKOUT" <your_gmail@gmail.com>

# Local dev — where the frontend runs
CLIENT_URL=http://localhost:5173
```

**`Client/.env`**
```env
VITE_API_URL=/api
```

### 3. Run

```bash
# Terminal 1 — Backend (port 8000)
cd Server
npm run dev

# Terminal 2 — Frontend (port 5173)
cd Client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

> **Email in dev:** If SMTP isn't configured, verification links are printed directly to the Server terminal — just click the link from there.

---

## Deployment Guide

> Deploy **Server → Render**, **Client → Vercel**. In that order.

---

### PART 1 — Brevo SMTP Setup (for email verification)

**Why Brevo instead of Gmail SMTP?**
Render (and most cloud platforms) can unpredictably block outbound SMTP. Brevo's relay server (`smtp-relay.brevo.com:587`) is explicitly whitelisted by Render and works reliably. Free tier gives you **300 emails/day** and sends to **any email address** — no domain ownership required.

1. Sign up free at [app.brevo.com](https://app.brevo.com)
2. Go to **Account (top-right) → SMTP & API → SMTP tab**
3. You'll see your **Login** (your email) and a **Master Password** — copy both
4. That's it. Paste them into Render's environment variables as `BREVO_USER` and `BREVO_PASS`

---

### PART 2 — Deploy the Backend to Render

1. **Push your project to GitHub** (make sure `Server/db.json` is committed and `Server/.env` is in `.gitignore`)

2. Go to [render.com](https://render.com) → **New → Web Service**

3. Connect your GitHub repo

4. Configure the service:

   | Field | Value |
   |---|---|
   | **Name** | `breakout-server` |
   | **Root Directory** | `Server` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `node index.js` |
   | **Instance Type** | Free |

5. Click **Advanced → Add Environment Variables** and add all of these:

   | Key | Value |
   |---|---|
   | `MISTRAL_API_KEY` | your Mistral key |
   | `GROQ_API_KEY` | your Groq key |
   | `JWT_SECRET` | any long random string (e.g. `breakout_prod_jwt_2026_xyz`) |
   | `BREVO_USER` | your Brevo login email (from SMTP tab) |
   | `BREVO_PASS` | your Brevo SMTP master password (from SMTP tab) |
   | `SMTP_FROM` | `"BREAKOUT" <your_brevo_login_email@gmail.com>` |
   | `CLIENT_URL` | *(leave blank for now — fill after Vercel deploy)* |

6. Click **Create Web Service** — wait for it to deploy

7. Copy the live URL — it looks like `https://breakout-server-xxxx.onrender.com`

---

### PART 3 — Update `CLIENT_URL` on Render

After deploying the frontend (Part 4), come back to Render:

- **Environment → Edit** → set `CLIENT_URL` to your Vercel URL, e.g. `https://breakout.vercel.app`
- Click **Save Changes** → Render auto-redeploys

This makes verification email links point to your live frontend URL.

---

### PART 4 — Deploy the Frontend to Vercel

1. Update **`Client/vercel.json`** — replace the placeholder with your actual Render URL:

   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://breakout-server-xxxx.onrender.com/api/:path*"
       },
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

2. Go to [vercel.com](https://vercel.com) → **Add New → Project**

3. Import your GitHub repo

4. Configure:

   | Field | Value |
   |---|---|
   | **Framework Preset** | `Vite` |
   | **Root Directory** | `Client` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |

5. Under **Environment Variables**, add:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `/api` |

6. Click **Deploy** — wait for it to finish

7. Copy your Vercel URL (e.g. `https://breakout.vercel.app`)

8. Go back to Render and set `CLIENT_URL` to this URL (Part 3 above)

---

### PART 5 — Verify Everything Works

- [ ] Open your Vercel URL
- [ ] Register a new account with a real email
- [ ] Check your inbox for the verification email (check Spam too)
- [ ] Click the verification link — it should redirect to your Vercel `/verify-email` page
- [ ] Log in and open the Dashboard
- [ ] Paste a YouTube URL and generate a workspace

---

## Common Deployment Issues

| Problem | Fix |
|---|---|
| API calls return 502 / fail | Render free tier spins down after 15 min of inactivity — first request takes ~30s to wake up. Normal. |
| Verification email not arriving | Double-check `BREVO_PASS` is the SMTP Master Password from the Brevo dashboard (not your Brevo account login password). Check Spam folder. |
| Verification link goes to localhost | `CLIENT_URL` env var on Render is not set or is still pointing to localhost. Update it to your Vercel URL. |
| Login works but dashboard is empty | Server is cold-starting. Refresh after ~30 seconds. |
| CORS error in browser console | Make sure `app.use(cors())` is in `Server/index.js` (it is). The Vercel rewrite proxies all `/api/*` calls so the browser never makes cross-origin requests directly. |
| Build fails on Vercel | Ensure Root Directory is set to `Client`, not the repo root. |

---

## Environment Variables — Full Reference

### Server (`Server/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Port to listen on. Render sets this automatically. |
| `MISTRAL_API_KEY` | Yes | Mistral AI API key for transcript analysis |
| `GROQ_API_KEY` | Yes | Groq API key for fast LLM inference |
| `JWT_SECRET` | Yes | Secret string for signing JWTs. Use a long random string in production. |
| `BREVO_USER` | Yes* | Your Brevo login email (Account → SMTP & API → SMTP tab) |
| `BREVO_PASS` | Yes* | Your Brevo SMTP master password |
| `SMTP_FROM` | Yes* | Sender display name + email |
| `CLIENT_URL` | Yes | Your Vercel frontend URL — used to build verification email links |

*Required for real email delivery. If omitted, verification links print to server logs only.

### Client (`Client/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Set to `/api`. Vercel rewrites proxy this to the Render backend. |

---

<p align="center">

### BREAKOUT — The Anti-Tutorial Hell Engine
### Built by Adityapratap Singh

</p>
