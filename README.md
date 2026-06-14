# 🚀 CandidateToHR — AI-Powered Applicant Tracking System

A full-stack **AI-Powered ATS** built with the **MERN stack** and **NVIDIA NIM APIs** for intelligent resume analysis, candidate ranking, and hiring pipeline management.

---

## ⚡ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React (Vite) + React Router + Framer Motion + Recharts |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (Mongoose) |
| **AI Engine** | NVIDIA NIM (`nvidia/llama-3.1-nemotron-ultra-253b-v1`) |
| **File Uploads** | Multer (memory storage) |
| **PDF Parsing** | pdf-parse |
| **Auth** | JWT + bcryptjs |
| **Emails** | Nodemailer |

---

## 🤖 AI Features (NVIDIA NIM Powered)

1. **Resume Analysis** — Score resumes across 5 dimensions (skills, experience, education, communication, overall)
2. **Job Description Generator** — Generate professional JDs from a job title and keywords
3. **Interview Question Generator** — 10 targeted questions per candidate (technical, behavioral, situational)
4. **Skills Gap Analysis** — Identify critical gaps with learning resources and time estimates
5. **Bias Detection** — Scan job descriptions for biased language with inclusive alternatives
6. **ATS Score Optimizer** — Tell candidates exactly how to improve their score
7. **Candidate Ranking** — AI-powered ranking insights for all applicants

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- NVIDIA NIM API Key → [Get it here](https://integrate.api.nvidia.com)

### 1. Clone & Setup

```bash
git clone <repo>
cd "AI-Powered Applicant Tracking"
```

### 2. Configure Server

```bash
cd server
```

Edit `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/ats_db
JWT_SECRET=your_super_secret_jwt_key
NVIDIA_API_KEY=your_nvidia_nim_api_key_here   # ← Add your key here!
CLIENT_URL=http://localhost:5173
```

### 3. Install & Run

**Terminal 1 — Backend:**
```bash
cd server && npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client && npm run dev
```

Open: **http://localhost:5173**

---

## 📁 Project Structure

```
AI-Powered Applicant Tracking/
├── server/
│   ├── config/          # DB connection
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth, upload, error handling
│   ├── models/          # Mongoose schemas (User, Job, Application)
│   ├── routes/          # Express routers
│   ├── services/        # NVIDIA NIM AI, PDF parser, Email
│   └── index.js         # Entry point
│
└── client/
    └── src/
        ├── context/     # AuthContext
        ├── pages/       # All page components
        ├── components/  # Navbar
        ├── services/    # API service layer
        └── index.css    # Design system
```

---

## 🔌 API Endpoints

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register recruiter |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Jobs
| Method | Route | Description |
|---|---|---|
| GET | `/api/jobs` | List all jobs |
| POST | `/api/jobs` | Create job |
| PUT | `/api/jobs/:id` | Update job |
| DELETE | `/api/jobs/:id` | Delete job |
| POST | `/api/jobs/generate-jd` | AI: Generate JD |
| GET | `/api/jobs/:id/bias-check` | AI: Check bias |

### Applications
| Method | Route | Description |
|---|---|---|
| POST | `/api/applications` | Submit resume (PDF) |
| POST | `/api/applications/bulk` | Bulk upload |
| GET | `/api/applications?jobId=` | List applications |
| GET | `/api/applications/:id` | Get with AI analysis |
| PATCH | `/api/applications/:id/status` | Update pipeline stage |
| GET | `/api/applications/:id/interview-questions` | AI: Interview Qs |
| GET | `/api/applications/:id/skills-gap` | AI: Skills gap |
| GET | `/api/applications/:id/optimizer` | AI: ATS optimizer |
| GET | `/api/applications/rank?jobId=` | AI: Rank candidates |

### Analytics
| Method | Route | Description |
|---|---|---|
| GET | `/api/analytics/overview` | Pipeline summary |
| GET | `/api/analytics/funnel` | Hiring funnel |
| GET | `/api/analytics/scores` | Score distribution |

---

## 🎨 Design System

- **Dark mode** by default with CSS custom properties
- **Glass morphism** cards with backdrop blur
- **Gradient accents** (blue → purple)
- **Framer Motion** page transitions and micro-animations
- **Recharts** for analytics visualizations
- **Google Fonts**: Inter + DM Sans

---

## 📝 Environment Variables

See `server/.env` for all required variables.

**Required:**
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — Secret key for JWT signing
- `NVIDIA_API_KEY` — Your NVIDIA NIM API key

**Optional:**
- `EMAIL_USER`, `EMAIL_PASS` — For Nodemailer email notifications
- `CLIENT_URL` — Frontend URL for CORS (default: http://localhost:5173)
