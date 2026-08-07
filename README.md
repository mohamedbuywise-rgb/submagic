# ✨ SubMagic

**Auto Subtitles & AI Backgrounds** — One upload, infinite possibilities.

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/yourname/submagic.git
cd submagic

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local
# Edit .env.local with your keys

# 4. Run development server
npm run dev
# Open http://localhost:3000
```

## 🐳 Docker (Full Stack)

```bash
# Run everything (Next.js + Redis + Worker)
docker-compose up
```

## 📁 Project Structure

```
submagic/
├── app/
│   ├── page.tsx              # Landing Page
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard (upload + files)
│   ├── api/
│   │   ├── transcribe/
│   │   │   └── route.ts      # Video transcription API
│   │   └── remove-bg/
│   │       └── route.ts      # Background removal API
│   ├── layout.tsx
│   └── globals.css
├── worker/
│   ├── worker.py             # Background worker (faster-whisper + rembg)
│   └── requirements.txt
├── docker-compose.yml
├── package.json
└── README.md
```

## 🛠️ Tech Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| Frontend | Next.js 14 + Tailwind CSS | Free |
| Backend | Next.js API Routes | Free |
| Database | Supabase (PostgreSQL) | Free tier |
| File Storage | Cloudflare R2 | Free (10GB) |
| Email | Resend | Free (3K/month) |
| Queue | Redis (BullMQ) | Free (local) |
| AI (Transcription) | faster-whisper | Free (local CPU) |
| AI (Remove BG) | rembg | Free (local CPU) |
| Hosting | Vercel | Free |

## 💰 Pricing Plans

| Plan | Video | Images | Price |
|------|-------|--------|-------|
| Free | 10 min/mo | 5/mo | $0 |
| Basic | 60 min/mo | 50/mo | $5 |
| Pro | 300 min/mo | 200/mo | $15 |
| Business | Unlimited | Unlimited | $49 |

## 🎯 Roadmap

- [x] Landing Page (organic design)
- [x] Dashboard UI
- [x] API scaffolding
- [ ] File upload (UploadThing)
- [ ] Worker integration (faster-whisper)
- [ ] Worker integration (rembg)
- [ ] Auth (Supabase)
- [ ] Payments (Stripe)
- [ ] Email notifications (Resend)

## 📄 License

MIT — built with ✨ by the SubMagic team.
